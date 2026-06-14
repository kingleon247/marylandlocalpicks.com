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
        <div className="shell inquiry-grid">
          <div>
            <p className="eyebrow">What to expect</p>
            <h2>We review every submission before print.</h2>
            <p>
              Submit contact details, business information, offer copy, landing
              page content, and any logos or photos you want us to use. Maryland
              Local Picks will follow up after review.
            </p>
            <p className="intake-note">
              Submissions are saved securely on the server. Email alerts are not
              sent yet — the operator must check the storage folder manually
              until email or CRM integration is added.
            </p>
            <Link className="text-link" href="/reserve">
              Back to reserve a spot <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
          <Suspense fallback={<AdvertiserIntakeFormFallback />}>
            <AdvertiserIntakeForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
