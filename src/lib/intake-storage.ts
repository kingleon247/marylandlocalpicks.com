import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  FIELD_MAX_LENGTHS,
  type IntakeFieldKey,
  type IntakeSubmission,
  type UploadedFileMeta,
} from "@/lib/intake-validation";

export {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  FIELD_MAX_LENGTHS,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
} from "@/lib/intake-validation";

export type { IntakeFieldKey, IntakeSubmission, UploadedFileMeta };

const STORAGE_ROOT = path.join(process.cwd(), "storage", "advertiser-intakes");

export function generateSubmissionId(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${timestamp}-${randomUUID().slice(0, 8)}`;
}

export function sanitizeFilename(originalName: string): string {
  const base = path.basename(originalName).trim();
  const ext = path.extname(base).slice(1).toLowerCase();
  const nameWithoutExt = path.basename(base, path.extname(base));
  const safeBase = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const safeExt = ext.replace(/[^a-z0-9]+/g, "");
  const stem = safeBase || "file";

  return safeExt ? `${stem}.${safeExt}` : stem;
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).slice(1).toLowerCase();
}

export function isAllowedFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return false;
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return false;
  }

  return true;
}

export function truncateField(key: IntakeFieldKey, value: string): string {
  return value.trim().slice(0, FIELD_MAX_LENGTHS[key]);
}

export async function saveSubmission(
  fields: Record<string, string>,
  files: Array<{ field: string; file: File }>,
): Promise<IntakeSubmission> {
  const submissionId = generateSubmissionId();
  const submissionDir = path.join(STORAGE_ROOT, submissionId);
  const assetsDir = path.join(submissionDir, "assets");

  await mkdir(assetsDir, { recursive: true });

  const fileMetadata: UploadedFileMeta[] = [];

  for (const { field, file } of files) {
    const safeOriginal = sanitizeFilename(file.name);
    const storedName = `${field}-${randomUUID().slice(0, 8)}-${safeOriginal}`;
    const storedPath = path.join(assetsDir, storedName);

    if (!storedPath.startsWith(assetsDir)) {
      throw new Error("Invalid file path.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(storedPath, buffer);

    fileMetadata.push({
      field,
      originalName: file.name,
      storedName,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
    });
  }

  const submission: IntakeSubmission = {
    submissionId,
    createdAt: new Date().toISOString(),
    fields,
    files: fileMetadata,
  };

  const jsonPath = path.join(submissionDir, "submission.json");
  await writeFile(jsonPath, JSON.stringify(submission, null, 2), "utf8");

  return submission;
}
