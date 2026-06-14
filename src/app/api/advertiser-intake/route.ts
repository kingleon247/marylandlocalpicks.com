import { NextResponse } from "next/server";

import {
  FIELD_MAX_LENGTHS,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  isAllowedFile,
  saveSubmission,
  truncateField,
  type IntakeFieldKey,
} from "@/lib/intake-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUIRED_FIELDS: IntakeFieldKey[] = [
  "contactName",
  "businessName",
  "email",
  "phone",
];

const TEXT_FIELDS: IntakeFieldKey[] = [
  "contactName",
  "businessName",
  "email",
  "phone",
  "preferredContactMethod",
  "bestTimeToContact",
  "businessCategory",
  "website",
  "facebookUrl",
  "instagramUrl",
  "businessPhone",
  "businessEmail",
  "businessAddress",
  "serviceArea",
  "hours",
  "interestedPlacement",
  "interestedCommitment",
  "targetAreaZip",
  "categoryExclusivityInterest",
  "offerHeadline",
  "offerDetails",
  "offerExpirationDate",
  "redemptionInstructions",
  "offerDisclaimer",
  "tagline",
  "businessDescription",
  "servicesProducts",
  "whyLocalsChooseYou",
  "testimonialsReviews",
  "preferredCallToAction",
  "notes",
];

const FILE_FIELDS = [
  "logo",
  "heroImage",
  "galleryPhotos",
  "existingArtwork",
  "otherFiles",
] as const;

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const honeypot = getString(formData, "companyWebsite");
    if (honeypot.trim()) {
      return NextResponse.json({ ok: true, submissionId: "rejected" });
    }

    const errors: Record<string, string> = {};
    const fields: Record<string, string> = {};

    for (const key of TEXT_FIELDS) {
      const raw = getString(formData, key);
      const value = truncateField(key, raw);
      fields[key] = value;

      if (raw.length > FIELD_MAX_LENGTHS[key]) {
        errors[key] = `Must be ${FIELD_MAX_LENGTHS[key]} characters or fewer.`;
      }
    }

    for (const key of REQUIRED_FIELDS) {
      if (!fields[key]) {
        errors[key] = "This field is required.";
      }
    }

    if (fields.email && !isValidEmail(fields.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (fields.businessEmail && !isValidEmail(fields.businessEmail)) {
      errors.businessEmail = "Enter a valid email address.";
    }

    const rightsConfirmed = formData.get("rightsConfirmed") === "on";
    const proofConfirmed = formData.get("proofConfirmed") === "on";

    if (!rightsConfirmed) {
      errors.rightsConfirmed =
        "Confirm you have the right to submit these assets.";
    }

    if (!proofConfirmed) {
      errors.proofConfirmed =
        "Confirm you understand proof review before print.";
    }

    const files: Array<{ field: string; file: File }> = [];
    let totalBytes = 0;

    for (const field of FILE_FIELDS) {
      const entries = formData.getAll(field);

      for (const entry of entries) {
        if (!(entry instanceof File) || entry.size === 0) {
          continue;
        }

        if (entry.size > MAX_FILE_BYTES) {
          errors[field] = `Each file must be ${MAX_FILE_BYTES / (1024 * 1024)}MB or less.`;
          continue;
        }

        if (!isAllowedFile(entry)) {
          errors[field] =
            "File type not allowed. Use JPG, PNG, WEBP, SVG, PDF, DOC, or DOCX.";
          continue;
        }

        totalBytes += entry.size;
        files.push({ field, file: entry });
      }
    }

    if (totalBytes > MAX_TOTAL_BYTES) {
      errors.files = `Total upload size must be ${MAX_TOTAL_BYTES / (1024 * 1024)}MB or less.`;
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, errors },
        { status: 400 },
      );
    }

    const submission = await saveSubmission(fields, files);

    return NextResponse.json({
      ok: true,
      submissionId: submission.submissionId,
    });
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Unable to save submission. Try again." } },
      { status: 500 },
    );
  }
}
