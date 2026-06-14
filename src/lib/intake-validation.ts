export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "svg",
  "pdf",
  "doc",
  "docx",
]);

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const FIELD_MAX_LENGTHS = {
  contactName: 120,
  businessName: 160,
  email: 254,
  phone: 40,
  preferredContactMethod: 20,
  bestTimeToContact: 120,
  businessCategory: 120,
  website: 500,
  facebookUrl: 500,
  instagramUrl: 500,
  businessPhone: 40,
  businessEmail: 254,
  businessAddress: 300,
  serviceArea: 300,
  hours: 500,
  interestedPlacement: 40,
  interestedCommitment: 40,
  targetAreaZip: 120,
  categoryExclusivityInterest: 20,
  offerHeadline: 200,
  offerDetails: 2000,
  offerExpirationDate: 40,
  redemptionInstructions: 1000,
  offerDisclaimer: 2000,
  tagline: 200,
  businessDescription: 2000,
  servicesProducts: 2000,
  whyLocalsChooseYou: 2000,
  testimonialsReviews: 2000,
  preferredCallToAction: 40,
  notes: 3000,
} as const;

export type IntakeFieldKey = keyof typeof FIELD_MAX_LENGTHS;

export type UploadedFileMeta = {
  field: string;
  originalName: string;
  storedName: string;
  size: number;
  mimeType: string;
};

export type IntakeSubmission = {
  submissionId: string;
  createdAt: string;
  fields: Record<string, string>;
  files: UploadedFileMeta[];
};
