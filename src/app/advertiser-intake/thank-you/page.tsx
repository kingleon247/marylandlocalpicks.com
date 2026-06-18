import type { Metadata } from "next";
import Link from "next/link";

import {
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_NUMERIC,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";
import { placementPackages } from "@/data/advertiser-packages";
import { getPaymentLink } from "@/data/payment-links";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your advertiser intake submission was received.",
};

type ThankYouPageProps = {
  searchParams: Promise<{ ref?: string; placement?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { ref, placement } = await searchParams;

  const paymentLink = placement ? getPaymentLink(placement) : null;
  const pkg = placement
    ? placementPackages.find((p) => p.key === placement)
    : null;

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

        {paymentLink ? (
          <div className="thank-you-payment">
            <p className="eyebrow">Reserve your spot now</p>
            <h2>Pay to lock in your spot.</h2>
            {pkg ? (
              <p className="thank-you-payment-package">
                {pkg.name} — {pkg.price}
              </p>
            ) : null}
            <p>
              Payment reserves your requested advertising spot for the upcoming
              Maryland Local Picks postcard, subject to category availability and
              placement approval. If your business or category cannot be approved
              for this edition, your payment will be refunded. Your spot is not
              considered locked until payment is received.
            </p>
            <a
              className="button button-primary"
              href={paymentLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Pay{pkg ? ` ${pkg.price}` : ""} — {pkg?.name ?? "your spot"}
            </a>
            <p className="thank-you-payment-note">
              Not ready to pay yet? We will follow up within two business days.
              Questions? Call or text{" "}
              <a href={`tel:${ADVERTISER_PHONE_LINK}`}>{ADVERTISER_PHONE_VANITY}</a>{" "}
              ({ADVERTISER_PHONE_NUMERIC}).
            </p>
          </div>
        ) : (
          <p>
            Questions before then? Call or text{" "}
            <a href={`tel:${ADVERTISER_PHONE_LINK}`}>{ADVERTISER_PHONE_VANITY}</a>{" "}
            ({ADVERTISER_PHONE_NUMERIC}).
          </p>
        )}

        <div className="button-row">
          <Link className="button button-secondary" href="/advertise">
            Back to advertise
          </Link>
          <Link className="button button-light" href="/catonsville">
            View Catonsville edition
          </Link>
        </div>
      </div>
    </section>
  );
}
