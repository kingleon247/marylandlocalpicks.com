import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Local, serverful storage for inbound Vapi voice calls and the advertiser
 * leads captured from them. Mirrors the approach used by the web intake flow
 * (src/lib/intake-storage.ts): plain JSON files on disk under storage/, which
 * is gitignored. This is intentionally not a database or CRM — it is a durable
 * local record the operator can read until a later phase adds real persistence.
 *
 * Layout:
 *   storage/vapi-calls/{safe-call-id-or-timestamp}/call.json
 */

export type DesiredPackage = "halfSpot" | "standardSpot" | "doubleSpot";

/**
 * Normalized record for a single inbound Vapi call. Fields are nullable because
 * Vapi delivers data incrementally across several webhook events; the record is
 * upserted as new events arrive. `rawPayloads` keeps every raw webhook message
 * for debugging and for recovering anything not captured in the normalized shape.
 */
export type VapiCallRecord = {
  id: string;
  source: "vapi";
  callId: string | null;
  /** The MLP advertiser number that was dialed (E.164), if known. */
  phoneNumber: string | null;
  /** The caller's number (E.164), if known. */
  callerNumber: string | null;
  callerName: string | null;
  businessName: string | null;
  contactName: string | null;
  email: string | null;
  website: string | null;
  category: string | null;
  desiredPackage: DesiredPackage | null;
  /** Market/edition, e.g. "Catonsville", or null. */
  market: string | null;
  budgetOrQuestions: string | null;
  callSummary: string | null;
  transcript: string | null;
  recordingUrl: string | null;
  status: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
  rawPayloads: unknown[];
};

/** The subset of normalized fields an update may contribute. */
export type VapiCallPatch = Partial<
  Omit<
    VapiCallRecord,
    "id" | "source" | "createdAt" | "updatedAt" | "rawPayloads"
  >
>;

const STORAGE_ROOT = path.join(process.cwd(), "storage", "vapi-calls");

/**
 * Maximum number of raw webhook payloads retained per call. Vapi can send many
 * events for one call (partial transcripts, status updates, etc.); keeping only
 * the most recent N prevents call.json from growing without bound.
 */
const MAX_RAW_PAYLOADS = 25;

const VALID_PACKAGES: ReadonlySet<DesiredPackage> = new Set([
  "halfSpot",
  "standardSpot",
  "doubleSpot",
]);

/**
 * Make a value safe to use as a single filesystem path segment. Strips path
 * separators and anything outside a conservative allow-list so a hostile or
 * malformed callId cannot escape the storage root.
 */
export function safeSegment(value: string): string {
  const base = path.basename(value).trim();
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
  return cleaned || "call";
}

/** Build a filesystem-safe directory name for a call. */
export function callDirName(callId: string | null | undefined): string {
  if (callId && callId.trim()) {
    return safeSegment(callId);
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${timestamp}-${randomUUID().slice(0, 8)}`;
}

/** Coerce an arbitrary value into the DesiredPackage union, else null. */
export function normalizeDesiredPackage(
  value: unknown,
): DesiredPackage | null {
  if (typeof value !== "string") {
    return null;
  }
  const raw = value.trim();
  if (VALID_PACKAGES.has(raw as DesiredPackage)) {
    return raw as DesiredPackage;
  }
  const lowered = raw.toLowerCase();
  if (/(^|[^a-z])half/.test(lowered)) return "halfSpot";
  if (/double/.test(lowered)) return "doubleSpot";
  if (/standard|regular|recommended|default/.test(lowered)) return "standardSpot";
  return null;
}

/** Trim a string field, returning null for empty/non-string input. */
export function cleanString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function emptyRecord(callId: string | null, dirName: string): VapiCallRecord {
  const now = new Date().toISOString();
  return {
    id: dirName,
    source: "vapi",
    callId,
    phoneNumber: null,
    callerNumber: null,
    callerName: null,
    businessName: null,
    contactName: null,
    email: null,
    website: null,
    category: null,
    desiredPackage: null,
    market: null,
    budgetOrQuestions: null,
    callSummary: null,
    transcript: null,
    recordingUrl: null,
    status: null,
    startedAt: null,
    endedAt: null,
    createdAt: now,
    updatedAt: now,
    rawPayloads: [],
  };
}

function recordPath(dirName: string): string {
  return path.join(STORAGE_ROOT, dirName, "call.json");
}

/** Load an existing call record by directory name, or null if none exists. */
async function loadRecord(dirName: string): Promise<VapiCallRecord | null> {
  try {
    const contents = await readFile(recordPath(dirName), "utf8");
    return JSON.parse(contents) as VapiCallRecord;
  } catch {
    return null;
  }
}

/**
 * Merge a patch into the existing record. Only defined, non-null patch values
 * overwrite existing data, so a later event that lacks a field never erases a
 * value captured by an earlier event.
 */
function mergePatch(record: VapiCallRecord, patch: VapiCallPatch): void {
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null) {
      continue;
    }
    // Indexed assignment onto the known record shape.
    (record as Record<string, unknown>)[key] = value;
  }
}

/**
 * Create or update the stored record for a call. Appends `rawPayload` to the
 * record's history (when provided), merges any normalized fields, and writes
 * the result to disk. Returns the persisted record.
 */
export async function upsertVapiCall(args: {
  callId: string | null;
  patch?: VapiCallPatch;
  rawPayload?: unknown;
}): Promise<VapiCallRecord> {
  const { callId, patch, rawPayload } = args;
  const dirName = callDirName(callId);
  const dir = path.join(STORAGE_ROOT, dirName);

  await mkdir(dir, { recursive: true });

  const record = (await loadRecord(dirName)) ?? emptyRecord(callId, dirName);

  if (callId && !record.callId) {
    record.callId = callId;
  }

  if (patch) {
    mergePatch(record, patch);
  }

  if (rawPayload !== undefined) {
    record.rawPayloads.push(rawPayload);
    // Cap history to the most recent payloads so the file cannot grow forever.
    if (record.rawPayloads.length > MAX_RAW_PAYLOADS) {
      record.rawPayloads = record.rawPayloads.slice(-MAX_RAW_PAYLOADS);
    }
  }

  record.updatedAt = new Date().toISOString();

  await writeFile(
    recordPath(dirName),
    JSON.stringify(record, null, 2),
    "utf8",
  );

  return record;
}
