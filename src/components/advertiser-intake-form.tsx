"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { FIELD_MAX_LENGTHS } from "@/lib/intake-validation";

const PLACEMENT_OPTIONS = [
  "halfSpot",
  "standardSpot",
  "doubleSpot",
  "notSure",
] as const;

const PLACEMENT_LABELS: Record<(typeof PLACEMENT_OPTIONS)[number], string> = {
  halfSpot: "Half Spot — $350",
  standardSpot: "Standard Spot — $600",
  doubleSpot: "Double Spot — $1,100",
  notSure: "Not sure yet",
};

const CTA_OPTIONS = [
  "call",
  "text",
  "email",
  "directions",
  "website",
  "bookAppointment",
  "requestEstimate",
] as const;

function formatOptionLabel(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export function AdvertiserIntakeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interest = searchParams.get("interest") ?? "";

  const defaultPlacement = PLACEMENT_OPTIONS.includes(
    interest as (typeof PLACEMENT_OPTIONS)[number],
  )
    ? interest
    : "";

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/advertiser-intake", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        ok: boolean;
        submissionId?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? { form: "Unable to submit. Try again." });
        return;
      }

      if (result.submissionId && result.submissionId !== "rejected") {
        router.push(
          `/advertiser-intake/thank-you?ref=${encodeURIComponent(result.submissionId)}`,
        );
        return;
      }

      router.push("/advertiser-intake/thank-you");
    } catch {
      setErrors({ form: "Unable to submit. Try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="intake-form" onSubmit={handleSubmit}>
      <div className="intake-honeypot" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          autoComplete="off"
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          type="text"
        />
      </div>

      {errors.form ? (
        <div className="form-error" role="alert">
          {errors.form}
        </div>
      ) : null}

      <fieldset className="intake-fieldset">
        <legend>Contact</legend>
        <div className="field-row">
          <label>
            Contact name *
            <input
              name="contactName"
              type="text"
              autoComplete="name"
              required
              maxLength={FIELD_MAX_LENGTHS.contactName}
            />
            {errors.contactName ? (
              <span className="field-error">{errors.contactName}</span>
            ) : null}
          </label>
          <label>
            Business name *
            <input
              name="businessName"
              type="text"
              required
              maxLength={FIELD_MAX_LENGTHS.businessName}
            />
            {errors.businessName ? (
              <span className="field-error">{errors.businessName}</span>
            ) : null}
          </label>
        </div>
        <div className="field-row">
          <label>
            Email *
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={FIELD_MAX_LENGTHS.email}
            />
            {errors.email ? (
              <span className="field-error">{errors.email}</span>
            ) : null}
          </label>
          <label>
            Phone *
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={FIELD_MAX_LENGTHS.phone}
            />
            {errors.phone ? (
              <span className="field-error">{errors.phone}</span>
            ) : null}
          </label>
        </div>
        <div className="field-row">
          <label>
            Preferred contact method
            <select
              name="preferredContactMethod"
              defaultValue=""
            >
              <option value="">Select one</option>
              <option value="call">Call</option>
              <option value="text">Text</option>
              <option value="email">Email</option>
            </select>
          </label>
          <label>
            Best time to contact
            <input
              name="bestTimeToContact"
              type="text"
              placeholder="Weekday mornings, etc."
              maxLength={FIELD_MAX_LENGTHS.bestTimeToContact}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="intake-fieldset">
        <legend>Business profile</legend>
        <div className="field-row">
          <label>
            Business category
            <input
              name="businessCategory"
              type="text"
              maxLength={FIELD_MAX_LENGTHS.businessCategory}
            />
          </label>
          <label>
            Website
            <input
              name="website"
              type="url"
              placeholder="https://"
              maxLength={FIELD_MAX_LENGTHS.website}
            />
          </label>
        </div>
        <div className="field-row">
          <label>
            Facebook URL
            <input
              name="facebookUrl"
              type="url"
              placeholder="https://"
              maxLength={FIELD_MAX_LENGTHS.facebookUrl}
            />
          </label>
          <label>
            Instagram URL
            <input
              name="instagramUrl"
              type="url"
              placeholder="https://"
              maxLength={FIELD_MAX_LENGTHS.instagramUrl}
            />
          </label>
        </div>
        <div className="field-row">
          <label>
            Business phone to display
            <input
              name="businessPhone"
              type="tel"
              maxLength={FIELD_MAX_LENGTHS.businessPhone}
            />
          </label>
          <label>
            Business email to display
            <input
              name="businessEmail"
              type="email"
              maxLength={FIELD_MAX_LENGTHS.businessEmail}
            />
            {errors.businessEmail ? (
              <span className="field-error">{errors.businessEmail}</span>
            ) : null}
          </label>
        </div>
        <label>
          Business address
          <input
            name="businessAddress"
            type="text"
            maxLength={FIELD_MAX_LENGTHS.businessAddress}
          />
        </label>
        <div className="field-row">
          <label>
            Service area
            <input
              name="serviceArea"
              type="text"
              maxLength={FIELD_MAX_LENGTHS.serviceArea}
            />
          </label>
          <label>
            Hours
            <input
              name="hours"
              type="text"
              placeholder="Mon-Fri 9-5, etc."
              maxLength={FIELD_MAX_LENGTHS.hours}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="intake-fieldset">
        <legend>Placement interest</legend>
        <div className="field-row">
          <label>
            Interested placement
            <select
              name="interestedPlacement"
              defaultValue={defaultPlacement}
            >
              <option value="">Select one</option>
              {PLACEMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {PLACEMENT_LABELS[option]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="field-row">
          <label>
            Target area / ZIP
            <input
              name="targetAreaZip"
              type="text"
              maxLength={FIELD_MAX_LENGTHS.targetAreaZip}
            />
          </label>
          <label>
            Category exclusivity interest
            <select name="categoryExclusivityInterest" defaultValue="">
              <option value="">Select one</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="maybe">Maybe</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="intake-fieldset">
        <legend>Offer / coupon</legend>
        <label>
          Offer headline
          <input
            name="offerHeadline"
            type="text"
            maxLength={FIELD_MAX_LENGTHS.offerHeadline}
          />
        </label>
        <label>
          Offer details
          <textarea
            name="offerDetails"
            rows={4}
            maxLength={FIELD_MAX_LENGTHS.offerDetails}
          />
        </label>
        <div className="field-row">
          <label>
            Expiration date
            <input
              name="offerExpirationDate"
              type="text"
              placeholder="MM/DD/YYYY or ongoing"
              maxLength={FIELD_MAX_LENGTHS.offerExpirationDate}
            />
          </label>
          <label>
            Redemption instructions
            <input
              name="redemptionInstructions"
              type="text"
              maxLength={FIELD_MAX_LENGTHS.redemptionInstructions}
            />
          </label>
        </div>
        <label>
          Disclaimer / fine print
          <textarea
            name="offerDisclaimer"
            rows={3}
            maxLength={FIELD_MAX_LENGTHS.offerDisclaimer}
          />
        </label>
      </fieldset>

      <fieldset className="intake-fieldset">
        <legend>Landing page content</legend>
        <label>
          Short tagline
          <input name="tagline" type="text" maxLength={FIELD_MAX_LENGTHS.tagline} />
        </label>
        <label>
          Short business description
          <textarea
            name="businessDescription"
            rows={4}
            maxLength={FIELD_MAX_LENGTHS.businessDescription}
          />
        </label>
        <label>
          Services / products to feature
          <textarea
            name="servicesProducts"
            rows={3}
            maxLength={FIELD_MAX_LENGTHS.servicesProducts}
          />
        </label>
        <label>
          Why locals choose you
          <textarea
            name="whyLocalsChooseYou"
            rows={3}
            maxLength={FIELD_MAX_LENGTHS.whyLocalsChooseYou}
          />
        </label>
        <label>
          Testimonials / reviews to include
          <textarea
            name="testimonialsReviews"
            rows={3}
            maxLength={FIELD_MAX_LENGTHS.testimonialsReviews}
          />
        </label>
        <label>
          Preferred call-to-action
          <select name="preferredCallToAction" defaultValue="">
            <option value="">Select one</option>
            {CTA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {formatOptionLabel(option)}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="intake-fieldset">
        <legend>Assets</legend>
        <p className="intake-file-note">
          Accepted: JPG, PNG, WEBP, SVG, PDF, DOC, DOCX. Max 10MB per file,
          50MB total. Uploaded files are reviewed before use.
        </p>
        <label className="intake-file-field">
          Logo
          <input name="logo" type="file" accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.doc,.docx" />
          {errors.logo ? <span className="field-error">{errors.logo}</span> : null}
        </label>
        <label className="intake-file-field">
          Hero image
          <input
            name="heroImage"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.doc,.docx"
          />
          {errors.heroImage ? (
            <span className="field-error">{errors.heroImage}</span>
          ) : null}
        </label>
        <label className="intake-file-field">
          Gallery / photos
          <input
            name="galleryPhotos"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.doc,.docx"
          />
          {errors.galleryPhotos ? (
            <span className="field-error">{errors.galleryPhotos}</span>
          ) : null}
        </label>
        <label className="intake-file-field">
          Existing ad / artwork
          <input
            name="existingArtwork"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.doc,.docx"
          />
          {errors.existingArtwork ? (
            <span className="field-error">{errors.existingArtwork}</span>
          ) : null}
        </label>
        <label className="intake-file-field">
          Other files
          <input
            name="otherFiles"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.doc,.docx"
          />
          {errors.otherFiles ? (
            <span className="field-error">{errors.otherFiles}</span>
          ) : null}
        </label>
        {errors.files ? (
          <span className="field-error">{errors.files}</span>
        ) : null}
      </fieldset>

      <fieldset className="intake-fieldset">
        <legend>Approval</legend>
        <label className="intake-checkbox">
          <input name="rightsConfirmed" type="checkbox" required />
          <span>
            I confirm I have the right to submit these logos, photos, and
            assets.
          </span>
        </label>
        {errors.rightsConfirmed ? (
          <span className="field-error">{errors.rightsConfirmed}</span>
        ) : null}
        <label className="intake-checkbox">
          <input name="proofConfirmed" type="checkbox" required />
          <span>
            I understand Maryland Local Picks may edit copy and design for fit
            and will send a proof before print.
          </span>
        </label>
        {errors.proofConfirmed ? (
          <span className="field-error">{errors.proofConfirmed}</span>
        ) : null}
        <label>
          Optional notes
          <textarea name="notes" rows={4} maxLength={FIELD_MAX_LENGTHS.notes} />
        </label>
      </fieldset>

      <button
        className="button button-primary button-wide"
        disabled={pending}
        type="submit"
      >
        {pending ? "Submitting..." : "Submit intake"}
      </button>
    </form>
  );
}

export function AdvertiserIntakeFormFallback() {
  return (
    <div className="intake-form intake-form-loading" aria-busy="true">
      Loading intake form...
    </div>
  );
}
