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

export const metadata: Metadata = {
  title: "Advertiser Intake",
  description:
    "Submit business details and ad assets for a Catonsville Local Picks placement.",
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
              preparing your placement details.
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
              <p className="eyebrow">Reserve · Catonsville</p>
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
                  We check fit and category availability, then send proof and a
                  payment link — typically within two business days.
                </p>
              </div>
            </aside>
            <div className="intake-panel">
              <p className="eyebrow">Advertiser onboarding</p>
              <h2>Tell us about your business and offer.</h2>
              <p className="intake-note">
                Submit contact details, business information, offer copy,
                landing page content, and any logos or photos you want us to
                use.
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
