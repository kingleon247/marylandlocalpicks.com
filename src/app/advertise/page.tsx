import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  AdvertiserContact,
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_NUMERIC,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { placementPackages } from "@/data/advertiser-packages";

export const metadata: Metadata = {
  title: "Advertise",
  description:
    "Put your Catonsville business on a printed local card with a digital business page, QR scans, and a simple local offer. Reserve a placement or call 443-94-PICKS.",
};

const whatYouGet = [
  {
    title: "Printed card placement",
    text: "Your business printed on the Catonsville card mailed to local doors and kept on the counter.",
  },
  {
    title: "Digital business page",
    text: "A focused page with call, directions, website, hours, and your current offer.",
  },
  {
    title: "QR code connection",
    text: "Every placement links print to digital with a scan — no searching or typing a URL.",
  },
  {
    title: "Local category placement",
    text: "Listed where nearby residents look: Eat, Shop, or Explore.",
  },
  {
    title: "Simple offer support",
    text: "Lead with a clear coupon or local offer customers can act on right away.",
  },
];

const howItWorks = [
  {
    title: "Reserve your spot",
    text: "Claim a placement for the upcoming Catonsville edition before spots fill.",
  },
  {
    title: "Send your details",
    text: "Share your business info, logo, offer, and a few images.",
  },
  {
    title: "We build it",
    text: "We prepare your printed card placement and your digital business page.",
  },
  {
    title: "Residents scan",
    text: "The card lands in mailboxes and scans straight through to your page.",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <section className="advertise-sales-hero">
        <div className="shell advertise-sales-hero-grid">
          <div className="advertise-hero-copy">
            <p className="eyebrow">For local businesses</p>
            <h1>Put your business on a local card residents actually keep.</h1>
            <p className="advertise-hero-lede">
              Maryland Local Picks combines a printed Catonsville mailer with a
              digital business page, QR scans, and a simple way for residents to
              discover your offer.
            </p>
            <p className="advertise-hero-detail">
              Catonsville Edition · limited placements · print + digital included
            </p>
          </div>

          <figure className="advertise-hero-media">
            <Image
              alt="The printed Maryland Local Picks Catonsville Edition card on a counter, showing local business offers and QR codes, with the digital guide open on a phone beside it."
              className="advertise-hero-photo"
              height={1073}
              priority
              sizes="(max-width: 1020px) 100vw, 600px"
              src="/eddm-card.png"
              width={1466}
            />
          </figure>

          <div className="advertise-hero-cta">
            <div className="advertise-hero-cta-buttons">
              <Link className="button button-primary" href="/reserve">
                Reserve a spot
              </Link>
              <a
                className="button button-secondary"
                href={`tel:${ADVERTISER_PHONE_LINK}`}
              >
                Call {ADVERTISER_PHONE_VANITY}
              </a>
            </div>
            <p className="advertise-hero-phone-numeric">
              Call or text ·{" "}
              <a href={`tel:${ADVERTISER_PHONE_LINK}`}>
                {ADVERTISER_PHONE_NUMERIC}
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section advertise-get-section">
        <div className="shell">
          <SectionHeading
            eyebrow="What you get"
            title="Everything a local placement needs to work."
            intro="One simple package connects a printed card to a digital page customers can act on."
          />
          <div className="advertise-get-grid">
            {whatYouGet.map((item, index) => (
              <article className="advertise-get-card" key={item.title}>
                <span className="advertise-get-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section advertise-how-section">
        <div className="shell">
          <SectionHeading
            eyebrow="How it works"
            title="From reserved spot to scanned card."
            intro="A straightforward path from signing up to landing in local mailboxes."
          />
          <ol className="advertise-steps">
            {howItWorks.map((step, index) => (
              <li className="advertise-step" key={step.title}>
                <span className="advertise-step-num">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section advertise-placements-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Choose your placement"
            title="Placement options for the Catonsville edition."
            intro="Pick the size and visibility that fits your business. Final pricing is set per campaign and edition inventory."
          />
          <div className="advertise-placement-grid">
            {placementPackages.map((pkg) => (
              <article
                className={`advertise-placement-card${
                  pkg.recommended ? " advertise-placement-card-recommended" : ""
                }`}
                key={pkg.key}
              >
                {pkg.recommended ? (
                  <span className="advertise-placement-badge">Most popular</span>
                ) : null}
                <h3>{pkg.name}</h3>
                <p className="advertise-placement-tagline">{pkg.tagline}</p>
                <p className="advertise-placement-price">{pkg.price}</p>
                <ul className="advertise-placement-includes">
                  {pkg.includes.map((inc) => (
                    <li key={inc}>{inc}</li>
                  ))}
                </ul>
                <Link
                  className="button button-primary button-wide"
                  href="/reserve"
                >
                  {pkg.cta}
                </Link>
              </article>
            ))}
          </div>
          <p className="advertise-placement-note">
            See full placement details, prepay packages, and payment policy on
            the <Link href="/reserve">reserve page</Link>.
          </p>
        </div>
      </section>

      <section className="section advertise-final-section">
        <div className="shell advertise-final-cta">
          <div>
            <p className="eyebrow">Limited placements</p>
            <h2>Reserve your spot in the Catonsville edition.</h2>
            <p>
              Print placement, a digital business page, QR traffic, and an offer
              customers can act on — built for the radius that matters.
            </p>
          </div>
          <div className="advertise-final-cta-actions">
            <Link className="button button-primary" href="/reserve">
              Reserve a spot
            </Link>
            <a
              className="button button-secondary"
              href={`tel:${ADVERTISER_PHONE_LINK}`}
            >
              Call {ADVERTISER_PHONE_VANITY}
            </a>
            <p className="advertise-hero-phone-numeric">
              Call or text ·{" "}
              <a href={`tel:${ADVERTISER_PHONE_LINK}`}>
                {ADVERTISER_PHONE_NUMERIC}
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section inquiry-section" id="inquiry">
        <div className="shell inquiry-grid">
          <div>
            <p className="eyebrow">Advertiser inquiry</p>
            <h2>Prefer to start with a few details?</h2>
            <p>
              Share your business and offer, and we will follow up about
              Catonsville placement availability and timing.
            </p>
            <AdvertiserContact />
          </div>
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
