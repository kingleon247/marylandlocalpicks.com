import type { Metadata } from "next";
import Link from "next/link";

import {
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_NUMERIC,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your advertiser intake submission was received.",
};

type ThankYouPageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { ref } = await searchParams;

  return (
    <section className="section thank-you-section">
      <div className="shell thank-you-panel">
        <p className="eyebrow">Submission received</p>
        <h1>Thank you for submitting your details.</h1>
        <p>
          Maryland Local Picks will review your submission and follow up about
          placement, proof, and next steps.
        </p>
        {ref ? (
          <p className="thank-you-reference">
            Reference: <strong>{ref}</strong>
          </p>
        ) : null}
        <p>
          Questions before then? Call or text{" "}
          <a href={`tel:${ADVERTISER_PHONE_LINK}`}>{ADVERTISER_PHONE_VANITY}</a>{" "}
          ({ADVERTISER_PHONE_NUMERIC}).
        </p>
        <div className="button-row">
          <Link className="button button-primary" href="/advertise">
            Back to advertise
          </Link>
          <Link className="button button-secondary" href="/catonsville">
            View Catonsville edition
          </Link>
        </div>
      </div>
    </section>
  );
}
