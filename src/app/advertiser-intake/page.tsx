import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  AdvertiserIntakeForm,
  AdvertiserIntakeFormFallback,
} from "@/components/advertiser-intake-form";
import {
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";
import { MAILING_REACH_NOTE } from "@/data/advertiser-packages";

export const metadata: Metadata = {
  title: "Advertiser Intake",
  description:
    "Submit business details and ad assets for a premium 9x12 postcard placement mailed to 10,000 local households.",
};

const intakeSections = [
  "Contact",
  "Business profile",
  "Placement interest",
  "Offer / coupon",
  "Landing page content",
  "Assets",
  "Approval",
];

export default function AdvertiserIntakePage() {
  return (
    <>
      <section className="advertise-hero">
        <div className="shell advertise-hero-grid">
          <div>
            <p className="eyebrow">Advertiser intake</p>
            <h1>Share your placement details.</h1>
          </div>
          <div className="advertise-hero-aside">
            <p>
              Use this form after speaking with Maryland Local Picks or when
              preparing your details for a premium 9x12 postcard placement
              mailed to 10,000 local households.
            </p>
            <div className="advertise-hero-actions">
              <a
                className="button button-hero-call"
                href={`tel:${ADVERTISER_PHONE_LINK}`}
              >
                Call or text {ADVERTISER_PHONE_VANITY}
              </a>
              <Link className="button button-light" href="/reserve">
                Review packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section inquiry-section">
        <div className="shell">
          <div className="intake-layout">
            <aside className="intake-sidebar">
              <p className="eyebrow">Reserve your spot</p>
              <ol className="intake-step-list">
                {intakeSections.map((section, index) => (
                  <li key={section}>
                    <span className="intake-step-number">{index + 1}</span>
                    <span>{section}</span>
                  </li>
                ))}
              </ol>
              <div className="intake-sidebar-note">
                <blockquote>
                  A real person reviews every submission.
                </blockquote>
                <p>
                  After submitting, you can pay immediately to lock in your
                  spot. We check fit, category availability, and send a proof —
                  typically within two business days.
                </p>
                <p style={{ marginTop: "1rem" }}>{MAILING_REACH_NOTE}</p>
              </div>
            </aside>
            <div className="intake-panel">
              <p className="eyebrow">Advertiser onboarding</p>
              <h2>Tell us about your business and offer.</h2>
              <p className="intake-note">
                Submit contact details, business information, offer copy,
                landing page content, and any logos or photos you want us to
                use. Ad layout and basic design help are included with your
                spot.
              </p>
              <Suspense fallback={<AdvertiserIntakeFormFallback />}>
                <AdvertiserIntakeForm />
              </Suspense>
              <p className="intake-note intake-back-link">
                <Link className="text-link" href="/reserve">
                  Back to reserve a spot <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
