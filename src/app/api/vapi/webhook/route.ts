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

function getCallId(message: JsonObject): string | null {
  const call = asObject(message.call);
  return (
    cleanString(call.id) ??
    cleanString(message.callId) ??
    cleanString(message.id)
  );
}

/** Identity fields (numbers/names) present on most message types via call. */
function identityPatch(message: JsonObject): VapiCallPatch {
  const call = asObject(message.call);
  const customer = asObject(call.customer);
  const phoneNumber = asObject(call.phoneNumber);
  const messagePhone = asObject(message.phoneNumber);

  return {
    phoneNumber:
      cleanString(phoneNumber.number) ??
      cleanString(messagePhone.number) ??
      cleanString(process.env.VAPI_PHONE_NUMBER),
    callerNumber: cleanString(customer.number),
    callerName: cleanString(customer.name),
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

/**
 * Collect tool/function call invocations across Vapi's historical and current
 * shapes: legacy `functionCall`, and `toolCalls` / `toolCallList` arrays.
 */
function collectToolCalls(
  message: JsonObject,
): Array<{ id: string | null; name: string | null; args: JsonObject }> {
  const calls: Array<{
    id: string | null;
    name: string | null;
    args: JsonObject;
  }> = [];

  const legacy = asObject(message.functionCall);
  if (cleanString(legacy.name)) {
    calls.push({
      id: cleanString(message.id),
      name: cleanString(legacy.name),
      args: parseArguments(legacy.parameters ?? legacy.arguments),
    });
  }

  const lists = [message.toolCalls, message.toolCallList];
  for (const list of lists) {
    if (!Array.isArray(list)) {
      continue;
    }
    for (const entry of list) {
      const tool = asObject(entry);
      const fn = asObject(tool.function);
      const name = cleanString(fn.name) ?? cleanString(tool.name);
      if (!name) {
        continue;
      }
      calls.push({
        id: cleanString(tool.id),
        name,
        args: parseArguments(fn.arguments ?? tool.arguments ?? tool.parameters),
      });
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
  message: JsonObject,
  callId: string | null,
): Promise<Response> {
  const calls = collectToolCalls(message);
  const results: Array<{ toolCallId: string | null; result: string }> = [];
  let handledLead = false;

  for (const call of calls) {
    if (call.name === LEAD_TOOL_NAME) {
      await upsertVapiCall({
        callId,
        patch: { ...identityPatch(message), ...leadArgsToPatch(call.args) },
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
  await upsertVapiCall({ callId, rawPayload: message });

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
  message: JsonObject,
  callId: string | null,
): Promise<void> {
  await upsertVapiCall({
    callId,
    patch: {
      ...identityPatch(message),
      status:
        cleanString(message.status) ?? cleanString(message.endedReason),
    },
    rawPayload: message,
  });
}

async function handleTranscript(
  message: JsonObject,
  callId: string | null,
): Promise<void> {
  // Only persist finalized transcript snippets to avoid churn on partials.
  const transcriptType = cleanString(message.transcriptType);
  if (transcriptType && transcriptType !== "final") {
    await upsertVapiCall({ callId, rawPayload: message });
    return;
  }

  const role = cleanString(message.role);
  const snippet = cleanString(message.transcript);
  const existing = (
    await upsertVapiCall({ callId, rawPayload: message })
  ).transcript;

  if (!snippet) {
    return;
  }

  const line = role ? `${role}: ${snippet}` : snippet;
  const transcript = existing ? `${existing}\n${line}` : line;

  await upsertVapiCall({
    callId,
    patch: { ...identityPatch(message), transcript },
  });
}

async function handleConversationUpdate(
  message: JsonObject,
  callId: string | null,
): Promise<void> {
  const conversation = asObject(message.conversation);
  const rendered =
    renderConversation(message.messages) ??
    renderConversation(conversation.messages) ??
    cleanString(message.conversation);

  await upsertVapiCall({
    callId,
    patch: { ...identityPatch(message), transcript: rendered },
    rawPayload: message,
  });
}

async function handleEndOfCallReport(
  message: JsonObject,
  callId: string | null,
): Promise<void> {
  const artifact = asObject(message.artifact);
  const recording = asObject(message.recording);
  const analysis = asObject(message.analysis);
  const structured = asObject(analysis.structuredData);

  const recordingUrl =
    cleanString(message.recordingUrl) ??
    cleanString(recording.url) ??
    cleanString(artifact.recordingUrl) ??
    cleanString(message.stereoRecordingUrl) ??
    cleanString(artifact.stereoRecordingUrl);

  const transcript =
    cleanString(message.transcript) ??
    cleanString(artifact.transcript) ??
    renderConversation(message.messages) ??
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
      ...identityPatch(message),
      ...extracted,
      callSummary: cleanString(message.summary) ?? cleanString(analysis.summary),
      transcript,
      recordingUrl,
      status: cleanString(message.endedReason) ?? "ended",
      startedAt: cleanString(message.startedAt),
      endedAt: cleanString(message.endedAt),
    },
    rawPayload: message,
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

  const message = asObject(asObject(body).message ?? body);
  const type = cleanString(message.type) ?? "unknown";
  const callId = getCallId(message);

  try {
    switch (type) {
      case "tool-calls":
      case "function-call":
        return await handleToolCalls(message, callId);

      case "status-update":
        await handleStatusUpdate(message, callId);
        break;

      case "transcript":
        await handleTranscript(message, callId);
        break;

      case "conversation-update":
        await handleConversationUpdate(message, callId);
        break;

      case "end-of-call-report":
        await handleEndOfCallReport(message, callId);
        break;

      case "assistant-request": {
        // Acknowledge; optionally hand Vapi the configured assistant id.
        const assistantId = process.env.VAPI_ASSISTANT_ID?.trim();
        await upsertVapiCall({ callId, rawPayload: message });
        return assistantId
          ? Response.json({ assistantId })
          : Response.json({ received: true });
      }

      default:
        // Unknown/unhandled event — record it but never fail.
        await upsertVapiCall({ callId, rawPayload: message });
        break;
    }
  } catch (error) {
    // Storage or processing failure must not crash the webhook; Vapi would
    // otherwise retry aggressively. Log and acknowledge.
    console.error("[vapi] webhook handling error:", error);
  }

  return Response.json({ received: true });
}
