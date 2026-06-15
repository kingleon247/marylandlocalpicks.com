import type { Metadata } from "next";
import Link from "next/link";

import {
  AdvertiserContact,
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_NUMERIC,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";
import { SectionHeading } from "@/components/section-heading";
import {
  CORE_OFFER_STATEMENT,
  MAILING_REACH_NOTE,
  paymentPolicy,
  placementPackages,
} from "@/data/advertiser-packages";
import { getPackageCtaAction } from "@/data/payment-links";

export const metadata: Metadata = {
  title: "Reserve a Spot",
  description:
    "Reserve your spot on a premium 9x12 postcard mailed to 10,000 local households. Half Spot $350, Standard Spot $600, Double Spot $1,100.",
};

function PackageCard({
  pkg,
}: {
  pkg: (typeof placementPackages)[number];
}) {
  const action = getPackageCtaAction(pkg.key);
  const cardClass = [
    "reserve-package-card",
    pkg.recommended ? "reserve-package-card-recommended" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const ctaButton = action.external ? (
    <a
      className="button button-primary button-wide"
      href={action.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {action.label}
    </a>
  ) : (
    <Link className="button button-primary button-wide" href={action.href}>
      {pkg.cta}
    </Link>
  );

  const inner = (
    <>
      <h3>{pkg.name}</h3>
      <p className="reserve-package-tagline">{pkg.tagline}</p>
      <p className="reserve-package-price">{pkg.price}</p>
      <ul className="reserve-package-features">
        {pkg.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {ctaButton}
    </>
  );

  if (pkg.recommended) {
    return (
      <article className={cardClass}>
        <div className="reserve-package-badge">Most popular</div>
        <div className="reserve-package-card-inner">{inner}</div>
      </article>
    );
  }

  return <article className={cardClass}>{inner}</article>;
}

export default function ReservePage() {
  return (
    <>
      <section className="advertise-hero">
        <div className="shell advertise-hero-grid">
          <div>
            <p className="eyebrow">Premium local advertising</p>
            <h1>Claim your spot on the next 10,000-home mailing</h1>
          </div>
          <div className="advertise-hero-aside">
            <p>
              Spots are limited. Every placement is on a premium 9x12 postcard
              mailed to 10,000 local households. Only one business per category
              is accepted whenever possible.
            </p>
            <div className="advertise-hero-actions">
              <a
                className="button button-hero-call"
                href={`tel:${ADVERTISER_PHONE_LINK}`}
              >
                Call or text {ADVERTISER_PHONE_VANITY}
              </a>
              <p className="advertise-hero-phone-numeric">
                {ADVERTISER_PHONE_NUMERIC}
              </p>
              <Link className="button button-light" href="/advertiser-intake">
                Start advertiser intake
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Placement packages"
            title="Choose the visibility level that fits your business."
            intro="After confirming fit and category availability, Maryland Local Picks sends a proof and payment link."
          />
          <div className="reserve-distribution-strip">
            <span className="eyebrow">Premium shared postcard</span>
            <span className="reserve-distribution-dot" aria-hidden="true">
              ·
            </span>
            <span>Premium 9x12 postcard</span>
            <span className="reserve-distribution-dot" aria-hidden="true">
              ·
            </span>
            <span>Mailed to 10,000 local households</span>
            <span className="reserve-distribution-dot" aria-hidden="true">
              ·
            </span>
            <span>Ad layout and design help included with every spot</span>
          </div>
          <p className="advertise-placement-note">{MAILING_REACH_NOTE}</p>
          <div className="reserve-package-grid">
            {placementPackages.map((pkg) => (
              <PackageCard key={pkg.key} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="section reserve-policy-section">
        <div className="shell reserve-policy-panel">
          <div>
            <p className="eyebrow">Payment policy</p>
            <h2>How reservation and payment work.</h2>
          </div>
          <ul className="check-list">
            {paymentPolicy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="reserve-policy-note">{CORE_OFFER_STATEMENT}</p>
        </div>
      </section>

      <section className="section inquiry-section">
        <div className="shell inquiry-grid">
          <div>
            <p className="eyebrow">Next step</p>
            <h2>Talk with us or start intake.</h2>
            <p>
              Call or text to ask about category availability and timing. When
              you are ready, complete advertiser intake with your business
              details and assets.
            </p>
            <AdvertiserContact />
            <div className="reserve-next-links">
              <Link className="text-link" href="/advertiser-intake">
                Start advertiser intake <span aria-hidden="true">→</span>
              </Link>
              <Link className="text-link" href="/advertise">
                Back to advertise overview <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="reserve-contact-card">
            <p className="eyebrow">Direct line</p>
            <p>
              Call or text <strong>{ADVERTISER_PHONE_VANITY}</strong>
            </p>
            <p className="contact-number-numeric">{ADVERTISER_PHONE_NUMERIC}</p>
            <p>
              Payment links are sent after placement and category availability
              are confirmed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
