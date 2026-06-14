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
  addOns,
  mailingCadenceCopy,
  paymentPolicy,
  placementPackages,
  prepayBonuses,
  prepayOptions,
} from "@/data/advertiser-packages";
import { getPackageCtaAction, getPaymentAction } from "@/data/payment-links";

export const metadata: Metadata = {
  title: "Reserve a Spot",
  description:
    "Reserve a Catonsville Local Picks print and digital placement. Review packages, prepay options, and next steps.",
};

export default function ReservePage() {
  return (
    <>
      <section className="advertise-hero">
        <div className="shell advertise-hero-grid">
          <div>
            <p className="eyebrow">Catonsville edition</p>
            <h1>Reserve a Catonsville Local Picks placement</h1>
          </div>
          <div className="advertise-hero-aside">
            <p>
              Spots are limited. Payment reserves placement once availability is
              confirmed. Every print placement includes a digital landing page.
              The first edition is Catonsville, with mailings planned
              approximately every six weeks.
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
            intro="Payment links are sent after placement and category availability are confirmed. Online payment is not active on this site yet."
          />
          <div className="reserve-package-grid">
            {placementPackages.map((pkg) => {
              const action = getPackageCtaAction(pkg.key);

              return (
                <article className="reserve-package-card" key={pkg.key}>
                  <p className="eyebrow">{pkg.price}</p>
                  <h3>{pkg.name}</h3>
                  <div className="reserve-package-block">
                    <p className="reserve-package-label">Best for</p>
                    <ul className="check-list">
                      {pkg.bestFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="reserve-package-block">
                    <p className="reserve-package-label">Includes</p>
                    <ul className="check-list">
                      {pkg.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {action.external ? (
                    <a
                      className="button button-primary button-wide"
                      href={action.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {action.label}
                    </a>
                  ) : (
                    <Link
                      className="button button-primary button-wide"
                      href={action.href}
                    >
                      {pkg.cta}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section reserve-prepay-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Prepay and recurring"
            title="Plan across multiple mailings."
            intro={mailingCadenceCopy}
          />
          <div className="reserve-prepay-grid">
            {prepayOptions.map((option) => {
              const action =
                option.key === "oneMailing"
                  ? {
                      href: "/advertiser-intake",
                      label: "Request payment link",
                      external: false,
                    }
                  : getPaymentAction(
                      option.key as
                        | "threeMailingPackage"
                        | "sixMailingPackage"
                        | "annualPackage",
                    );

              return (
                <article className="reserve-prepay-card" key={option.key}>
                  <h3>{option.name}</h3>
                  <p>{option.description}</p>
                  {action.external ? (
                    <a
                      className="text-link"
                      href={action.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {action.label} <span aria-hidden="true">-&gt;</span>
                    </a>
                  ) : (
                    <Link className="text-link" href={action.href}>
                      {action.label} <span aria-hidden="true">-&gt;</span>
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
          <div className="reserve-bonus-panel">
            <p className="eyebrow">Possible package bonuses</p>
            <ul className="check-list">
              {prepayBonuses.map((bonus) => (
                <li key={bonus}>{bonus}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Add-ons"
            title="Optional upgrades beyond the core placement."
            intro="Some services are planned for later phases and are not active yet."
          />
          <div className="reserve-addon-grid">
            {addOns.map((addon) => (
              <article className="reserve-addon-card" key={addon.name}>
                <h3>
                  {addon.name}
                  {addon.future ? (
                    <span className="reserve-future-tag">Future</span>
                  ) : null}
                </h3>
                <p>{addon.description}</p>
              </article>
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
          <p className="reserve-policy-note">
            Online payment is not active on this site yet. After confirming fit
            and inventory, Maryland Local Picks will send a payment link.
          </p>
        </div>
      </section>

      <section className="section inquiry-section">
        <div className="shell inquiry-grid">
          <div>
            <p className="eyebrow">Next step</p>
            <h2>Talk with us or start intake.</h2>
            <p>
              Call or text to ask about availability, pricing, and timing. When
              you are ready, complete advertiser intake with your business
              details and assets.
            </p>
            <AdvertiserContact />
            <div className="reserve-next-links">
              <Link className="text-link" href="/advertiser-intake">
                Start advertiser intake <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link className="text-link" href="/advertise">
                Back to advertise overview <span aria-hidden="true">-&gt;</span>
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
