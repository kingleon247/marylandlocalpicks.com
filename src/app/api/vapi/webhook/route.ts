import { timingSafeEqual } from "node:crypto";

import {
  cleanString,
  normalizeDesiredPackage,
  upsertVapiCall,
  type VapiCallPatch,
} from "@/lib/vapi-intake-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Single public webhook for the Vapi inbound advertiser phone assistant.
 *
 * Vapi posts every server message — status-update, transcript,
 * conversation-update, function/tool calls, assistant-request, and
 * end-of-call-report — to one Server URL. This handler authenticates the
 * request, normalizes whatever is present, persists it locally (see
 * src/lib/vapi-intake-storage.ts), and returns 200 quickly. It must never
 * crash on an unknown or partial event.
 *
 * Docs: _docs/vapi-voice-setup.md
 */

const LEAD_TOOL_NAME = "createAdvertiserLead";
const LEAD_SPOKEN_CONFIRMATION =
  "Got it. I saved your information and someone from Maryland Local Picks can follow up.";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function asObject(value: unknown): JsonObject {
  return isObject(value) ? value : {};
}

/** Constant-time string comparison that tolerates differing lengths. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

type SecretCheck = { ok: true } | { ok: false; reason: string };

/**
 * Authenticate the request against VAPI_WEBHOOK_SECRET using either
 * `Authorization: Bearer <secret>` or `x-vapi-secret: <secret>`.
 *
 * - Secret set + match  -> ok
 * - Secret set + no/wrong credential -> not ok (caller returns 401)
 * - Secret unset (local dev) -> ok, with a warning logged by the caller
 */
function verifyVapiSecret(request: Request): SecretCheck {
  const expected = process.env.VAPI_WEBHOOK_SECRET?.trim();

  if (!expected) {
    return { ok: true };
  }

  const headerSecret = request.headers.get("x-vapi-secret")?.trim();
  if (headerSecret && safeEqual(headerSecret, expected)) {
    return { ok: true };
  }

  const authHeader = request.headers.get("authorization")?.trim() ?? "";
  const bearerMatch = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (bearerMatch && safeEqual(bearerMatch[1].trim(), expected)) {
    return { ok: true };
  }

  return { ok: false, reason: "missing or invalid Vapi secret" };
}

function getCallId(view: JsonObject): string | null {
  const call = asObject(view.call);
  return (
    cleanString(call.id) ??
    cleanString(view.callId) ??
    cleanString(call.callId) ??
    cleanString(view.id)
  );
}

/**
 * Identity fields (numbers/names). Vapi may place these under `call.customer`
 * / `call.phoneNumber`, or directly at the message/top level — check both.
 */
function identityPatch(view: JsonObject): VapiCallPatch {
  const call = asObject(view.call);
  const callCustomer = asObject(call.customer);
  const viewCustomer = asObject(view.customer);
  const callPhone = asObject(call.phoneNumber);
  const viewPhone = asObject(view.phoneNumber);

  return {
    phoneNumber:
      cleanString(callPhone.number) ??
      cleanString(viewPhone.number) ??
      cleanString(call.phoneNumber) ??
      cleanString(process.env.VAPI_PHONE_NUMBER),
    callerNumber:
      cleanString(callCustomer.number) ??
      cleanString(viewCustomer.number) ??
      cleanString(call.customerNumber),
    callerName:
      cleanString(callCustomer.name) ?? cleanString(viewCustomer.name),
  };
}

/** Render a transcript string from a Vapi conversation `messages` array. */
function renderConversation(messages: unknown): string | null {
  if (!Array.isArray(messages)) {
    return null;
  }
  const lines: string[] = [];
  for (const entry of messages) {
    const turn = asObject(entry);
    const role = cleanString(turn.role);
    const content = cleanString(turn.message) ?? cleanString(turn.content);
    if (role === "system") {
      continue;
    }
    if (content) {
      lines.push(role ? `${role}: ${content}` : content);
    }
  }
  return lines.length ? lines.join("\n") : null;
}

/** Map the createAdvertiserLead tool arguments to normalized lead fields. */
function leadArgsToPatch(args: JsonObject): VapiCallPatch {
  return {
    businessName: cleanString(args.businessName),
    contactName: cleanString(args.contactName),
    // The caller-provided callback number is the most useful contact number.
    callerNumber: cleanString(args.phone),
    email: cleanString(args.email),
    website: cleanString(args.website),
    category: cleanString(args.category),
    desiredPackage: normalizeDesiredPackage(args.desiredPackage),
    market: cleanString(args.market),
    budgetOrQuestions: cleanString(args.notes),
    status: "lead-captured",
  };
}

/** Parse tool/function call arguments, which may arrive as a JSON string. */
function parseArguments(value: unknown): JsonObject {
  if (isObject(value)) {
    return value;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return isObject(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

type ToolCall = { id: string | null; name: string; args: JsonObject };

/**
 * Read one tool/function entry. The name may live at `function.name`, `name`,
 * `toolName`, or `function.toolName`; arguments at `function.arguments`,
 * `function.parameters`, `arguments`, or `parameters`, as an object or a JSON
 * string. Returns null if no usable name is found.
 */
function readToolEntry(entry: unknown, fallbackId: string | null): ToolCall | null {
  const tool = asObject(entry);
  const fn = asObject(tool.function);
  const name =
    cleanString(fn.name) ??
    cleanString(tool.name) ??
    cleanString(tool.toolName) ??
    cleanString(fn.toolName);
  if (!name) {
    return null;
  }
  return {
    id: cleanString(tool.id) ?? cleanString(tool.toolCallId) ?? fallbackId,
    name,
    args: parseArguments(
      fn.arguments ?? fn.parameters ?? tool.arguments ?? tool.parameters,
    ),
  };
}

/**
 * Collect tool/function call invocations across Vapi's historical and current
 * shapes: legacy `functionCall` object, a singular `toolCall` object, and
 * `toolCalls` / `toolCallList` arrays.
 */
function collectToolCalls(view: JsonObject): ToolCall[] {
  const calls: ToolCall[] = [];
  const fallbackId =
    cleanString(view.id) ?? cleanString(view.toolCallId) ?? null;

  // Legacy single function-call object.
  const legacy = asObject(view.functionCall);
  const legacyName = cleanString(legacy.name) ?? cleanString(legacy.toolName);
  if (legacyName) {
    calls.push({
      id: fallbackId,
      name: legacyName,
      args: parseArguments(legacy.parameters ?? legacy.arguments),
    });
  }

  // Singular toolCall object.
  const single = readToolEntry(view.toolCall, fallbackId);
  if (single) {
    calls.push(single);
  }

  // Arrays.
  for (const list of [view.toolCalls, view.toolCallList]) {
    if (!Array.isArray(list)) {
      continue;
    }
    for (const entry of list) {
      const parsed = readToolEntry(entry, fallbackId);
      if (parsed) {
        calls.push(parsed);
      }
    }
  }

  return calls;
}

/**
 * Handle one or more tool calls. Persists a lead for each createAdvertiserLead
 * invocation and returns a response Vapi can speak from. Includes both the
 * tool-call `results` array (current API) and top-level result/message fields
 * (legacy function-call), so either Vapi version gets a usable reply.
 */
async function handleToolCalls(
  view: JsonObject,
  callId: string | null,
  rawBody: unknown,
): Promise<Response> {
  const calls = collectToolCalls(view);
  const results: Array<{ toolCallId: string | null; result: string }> = [];
  let handledLead = false;

  for (const call of calls) {
    if (call.name === LEAD_TOOL_NAME) {
      await upsertVapiCall({
        callId,
        patch: { ...identityPatch(view), ...leadArgsToPatch(call.args) },
      });
      handledLead = true;
      results.push({ toolCallId: call.id, result: LEAD_SPOKEN_CONFIRMATION });
    } else {
      results.push({
        toolCallId: call.id,
        result: "Acknowledged.",
      });
    }
  }

  // Always store the raw tool-call payload for debugging.
  await upsertVapiCall({ callId, rawPayload: rawBody });

  if (handledLead) {
    return Response.json({
      results,
      result: "Lead saved",
      message: LEAD_SPOKEN_CONFIRMATION,
    });
  }

  return Response.json({ results });
}

async function handleStatusUpdate(
  view: JsonObject,
  callId: string | null,
  rawBody: unknown,
): Promise<void> {
  await upsertVapiCall({
    callId,
    patch: {
      ...identityPatch(view),
      status: cleanString(view.status) ?? cleanString(view.endedReason),
    },
    rawPayload: rawBody,
  });
}

async function handleTranscript(
  view: JsonObject,
  callId: string | null,
  rawBody: unknown,
): Promise<void> {
  // Only persist finalized transcript snippets to avoid churn on partials.
  const transcriptType = cleanString(view.transcriptType);
  if (transcriptType && transcriptType !== "final") {
    await upsertVapiCall({ callId, rawPayload: rawBody });
    return;
  }

  const role = cleanString(view.role);
  const snippet = cleanString(view.transcript);
  const existing = (
    await upsertVapiCall({ callId, rawPayload: rawBody })
  ).transcript;

  if (!snippet) {
    return;
  }

  const line = role ? `${role}: ${snippet}` : snippet;
  const transcript = existing ? `${existing}\n${line}` : line;

  await upsertVapiCall({
    callId,
    patch: { ...identityPatch(view), transcript },
  });
}

async function handleConversationUpdate(
  view: JsonObject,
  callId: string | null,
  rawBody: unknown,
): Promise<void> {
  const conversation = asObject(view.conversation);
  const rendered =
    renderConversation(view.messages) ??
    renderConversation(conversation.messages) ??
    cleanString(view.conversation);

  await upsertVapiCall({
    callId,
    patch: { ...identityPatch(view), transcript: rendered },
    rawPayload: rawBody,
  });
}

async function handleEndOfCallReport(
  view: JsonObject,
  callId: string | null,
  rawBody: unknown,
): Promise<void> {
  const call = asObject(view.call);
  const artifact = asObject(view.artifact);
  const recording = asObject(view.recording);
  const artifactRecording = asObject(artifact.recording);
  const analysis = asObject(view.analysis);
  const structured = asObject(analysis.structuredData);

  const recordingUrl =
    cleanString(view.recordingUrl) ??
    cleanString(recording.url) ??
    cleanString(recording.stereoUrl) ??
    cleanString(recording.combinedUrl) ??
    cleanString(artifact.recordingUrl) ??
    cleanString(artifactRecording.url) ??
    cleanString(artifactRecording.combinedUrl) ??
    cleanString(view.stereoRecordingUrl) ??
    cleanString(artifact.stereoRecordingUrl);

  const transcript =
    cleanString(view.transcript) ??
    cleanString(artifact.transcript) ??
    renderConversation(view.messages) ??
    renderConversation(artifact.messages);

  // End-of-call analysis may carry extracted lead fields. Merge any present.
  const extracted: VapiCallPatch = {
    businessName: cleanString(structured.businessName),
    contactName: cleanString(structured.contactName),
    email: cleanString(structured.email),
    website: cleanString(structured.website),
    category: cleanString(structured.category),
    desiredPackage: normalizeDesiredPackage(structured.desiredPackage),
    market: cleanString(structured.market),
    budgetOrQuestions:
      cleanString(structured.notes) ?? cleanString(structured.budgetOrQuestions),
  };

  await upsertVapiCall({
    callId,
    patch: {
      ...identityPatch(view),
      ...extracted,
      callSummary:
        cleanString(view.summary) ??
        cleanString(analysis.summary) ??
        cleanString(artifact.summary),
      transcript,
      recordingUrl,
      status: cleanString(view.endedReason) ?? "ended",
      startedAt: cleanString(view.startedAt) ?? cleanString(call.startedAt),
      endedAt: cleanString(view.endedAt) ?? cleanString(call.endedAt),
    },
    rawPayload: rawBody,
  });
}

export async function POST(request: Request): Promise<Response> {
  const check = verifyVapiSecret(request);
  if (!check.ok) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.VAPI_WEBHOOK_SECRET?.trim()) {
    console.warn(
      "[vapi] VAPI_WEBHOOK_SECRET is not set — accepting webhook without authentication (local dev only).",
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Build a flattened lookup view that tolerates the data living under
  // `message`, under `event`, or at the top level. Message-level keys win, with
  // top-level keys as fallback. The original `body` is stored verbatim.
  const root = asObject(body);
  const inner = asObject(root.message ?? root.event);
  const view: JsonObject = { ...root, ...inner };
  const type =
    cleanString(view.type) ?? cleanString(view.event) ?? "unknown";
  const callId = getCallId(view);

  try {
    switch (type) {
      case "tool-calls":
      case "tool-call":
      case "function-call":
        return await handleToolCalls(view, callId, body);

      case "status-update":
        await handleStatusUpdate(view, callId, body);
        break;

      case "transcript":
        await handleTranscript(view, callId, body);
        break;

      case "conversation-update":
        await handleConversationUpdate(view, callId, body);
        break;

      case "end-of-call-report":
        await handleEndOfCallReport(view, callId, body);
        break;

      case "assistant-request": {
        // Acknowledge; optionally hand Vapi the configured assistant id.
        const assistantId = process.env.VAPI_ASSISTANT_ID?.trim();
        await upsertVapiCall({ callId, rawPayload: body });
        return assistantId
          ? Response.json({ assistantId })
          : Response.json({ received: true });
      }

      default:
        // Defensive fallback: if the type is missing/unrecognized but a tool
        // call is present in the payload, still handle it.
        if (collectToolCalls(view).length > 0) {
          return await handleToolCalls(view, callId, body);
        }
        // Otherwise record the raw event but never fail.
        await upsertVapiCall({ callId, rawPayload: body });
        break;
    }
  } catch (error) {
    // Storage or processing failure must not crash the webhook; Vapi would
    // otherwise retry aggressively. Log and acknowledge.
    console.error("[vapi] webhook handling error:", error);
  }

  return Response.json({ received: true });
}
