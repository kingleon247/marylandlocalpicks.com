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
import {
  bestForList,
  CORE_OFFER_STATEMENT,
  MAILING_REACH_NOTE,
  notForList,
  placementPackages,
} from "@/data/advertiser-packages";

export const metadata: Metadata = {
  title: "Advertise",
  description:
    "Put your business on a premium 9x12 postcard mailed to 10,000 local households. Category-exclusive spots from $350. Reserve your spot or call 443-94-PICKS.",
};

const whatYouGet = [
  {
    title: "Premium mailbox presence",
    text: "A premium 9x12 postcard gives your business physical visibility in 10,000 local homes — not just another post buried in a feed.",
  },
  {
    title: "Category exclusivity",
    text: "Only one business per category is accepted whenever possible, so you are not sharing the card with a direct competitor.",
  },
  {
    title: "Targeted local household reach",
    text: "Your ad is placed in front of 10,000 nearby households in the community you want to reach.",
  },
  {
    title: "Design help included",
    text: "You do not need to design the ad yourself. Send us your logo, photos, offer, and contact info — we help turn it into a clean postcard ad.",
  },
  {
    title: "QR code when useful",
    text: "A trackable QR code can be included with your ad when useful, so you can send people to your website, offer page, menu, booking page, or contact form.",
  },
];

const howItWorks = [
  {
    title: "Pick your spot size",
    text: "Choose Half Spot, Standard Spot, or Double Spot based on how much room your message needs.",
  },
  {
    title: "Send your business details",
    text: "Share your business info, logo, offer, and any photos you want included.",
  },
  {
    title: "Approve your ad",
    text: "We prepare your placement and send a proof for your review before anything goes to print.",
  },
  {
    title: "We handle layout and mailing",
    text: "Pick your spot size, send your business details, approve your ad, and we handle the layout and mailing process.",
  },
];

const sellingPoints = [
  {
    title: "Strong fit for home-service and local-service businesses",
    text: "Great for home-service and local-service businesses like roofing, landscaping, plumbing, HVAC, cleaning, junk removal, remodeling, real estate, window cleaning, pest control, painting, and similar local businesses.",
  },
  {
    title: "Strong local offers",
    text: "The stronger and simpler your offer, the better your ad is likely to perform. We help shape your message so homeowners can understand it quickly.",
  },
  {
    title: "Direct mail as another local channel",
    text: "Direct mail does not replace your website, social media, Google profile, or referrals. It gives your business another local touchpoint.",
  },
  {
    title: "Limited inventory",
    text: "Space is limited because each card only has a set number of ad spots. Once your category is taken, we will not add a direct competitor in the same category whenever possible.",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <section className="advertise-sales-hero">
        <div className="shell advertise-sales-hero-grid">
          <div className="advertise-hero-copy">
            <p className="eyebrow">For local businesses</p>
            <h1>Advertise Your Business to 10,000 Local Households</h1>
            <p className="advertise-hero-lede">
              Maryland Local Picks features local businesses on a premium shared
              9x12 postcard mailed directly to 10,000 households.
            </p>
            <p className="advertise-hero-detail">
              Premium 9x12 postcard · 10,000 local households · category-exclusive
              whenever possible
            </p>
          </div>

          <figure className="advertise-hero-media">
            <Image
              alt="A premium Maryland Local Picks 9x12 postcard showing local business offers and QR codes."
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
                Reserve your spot
              </Link>
              <a
                className="button button-secondary"
                href={`tel:${ADVERTISER_PHONE_LINK}`}
              >
                Check category availability
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
            title="Premium local visibility in 10,000 mailboxes."
            intro={CORE_OFFER_STATEMENT}
          />
          <p className="advertise-placement-note" style={{ marginBottom: "2rem" }}>
            Get seen where local homeowners still pay attention: their mailbox.
          </p>
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
            title="A simple buying process."
            intro="A straightforward path from reserving your spot to landing in local mailboxes."
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
            title="Three spot sizes for local visibility."
            intro="Pick the size that fits your business. Every spot is mailed to 10,000 local households."
          />
          <p className="advertise-placement-note">{MAILING_REACH_NOTE}</p>
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
                  href={`/advertiser-intake?interest=${pkg.key}`}
                >
                  {pkg.cta}
                </Link>
              </article>
            ))}
          </div>
          <p className="advertise-placement-note">
            See full placement details and payment policy on the{" "}
            <Link href="/reserve">reserve page</Link>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Why it works"
            title="Built for local businesses that serve homeowners."
            intro="While competitors fight for attention online, your business can also show up directly in the mailbox."
          />
          <div className="advertise-get-grid">
            {sellingPoints.map((item, index) => (
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

      <section className="section">
        <div className="shell">
          <div className="inquiry-grid">
            <div>
              <SectionHeading
                eyebrow="Who this is best for"
                title="Maryland Local Picks is best for local businesses that:"
              />
              <ul className="check-list">
                {bestForList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading
                eyebrow="Who this is not for"
                title="This may not be the right fit if:"
              />
              <ul className="check-list">
                {notForList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Important to know"
            title="Exposure, not guaranteed leads."
          />
          <p>
            Maryland Local Picks sells local exposure and visibility. We do not
            promise a specific number of calls, leads, sales, or redemptions.
            Results depend on your business type, offer, timing, follow-up, and
            how easy you make it for people to respond.
          </p>
          <p style={{ marginTop: "1rem" }}>
            QR codes can help track scans, but some customers may still call,
            text, or visit directly after seeing your ad.
          </p>
        </div>
      </section>

      <section className="section advertise-final-section">
        <div className="shell advertise-final-cta">
          <div>
            <p className="eyebrow">Limited placements</p>
            <h2>Reserve your category before another business takes it.</h2>
            <p>{CORE_OFFER_STATEMENT}</p>
          </div>
          <div className="advertise-final-cta-actions">
            <Link className="button button-primary" href="/reserve">
              Claim your spot on the next 10,000-home mailing
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
            <h2>Send your business info and we will confirm availability for your category.</h2>
            <p>
              Share your business and offer, and we will follow up about category
              availability and timing for the next mailing.
            </p>
            <AdvertiserContact />
          </div>
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
