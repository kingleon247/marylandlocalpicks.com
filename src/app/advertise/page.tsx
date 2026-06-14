import type { Metadata } from "next";
import Link from "next/link";

import {
  AdvertiserContact,
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_NUMERIC,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Advertise",
  description:
    "Reach Catonsville customers through a curated print card, digital business page, local offer, and QR-connected campaign.",
};

const inclusions = [
  {
    number: "01",
    title: "Printed card placement",
    text: "Put your business into a useful neighborhood piece designed to stay visible after the mail is opened.",
  },
  {
    number: "02",
    title: "Digital landing page",
    text: "Give every placement a focused page with direct call, email, directions, website, and offer actions.",
  },
  {
    number: "03",
    title: "QR-connected traffic",
    text: "Move readers from the card to your page without asking them to search, type, or remember a URL.",
  },
  {
    number: "04",
    title: "Local offer placement",
    text: "Lead with a clear, useful reason for a nearby customer to choose your business now.",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <section className="advertise-hero">
        <div className="shell advertise-hero-grid">
          <div>
            <p className="eyebrow">Advertising that feels local</p>
            <h1>Be part of the guide people want to keep.</h1>
          </div>
          <div className="advertise-hero-aside">
            <p>
              Maryland Local Picks pairs a curated printed card with a
              conversion-focused digital page for each participating business.
            </p>
            <div className="advertise-hero-actions">
              <a
                className="button button-hero-call"
                href={`tel:${ADVERTISER_PHONE_LINK}`}
              >
                Call {ADVERTISER_PHONE_VANITY}
              </a>
              <p className="advertise-hero-phone-numeric">
                {ADVERTISER_PHONE_NUMERIC}
              </p>
              <a className="button button-light" href="#inquiry">
                Send an inquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="What is included"
            title="One local campaign, connected from print to action."
            intro="The first edition keeps the product simple: a strong physical placement, a useful online destination, and a message customers can understand quickly."
          />
          <div className="inclusion-grid">
            {inclusions.map((item) => (
              <article className="inclusion-card" key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section advertiser-detail-section">
        <div className="shell advertiser-detail-grid">
          <div className="detail-intro">
            <p className="eyebrow">Designed to grow</p>
            <h2>Start useful. Add measurement as the platform matures.</h2>
          </div>
          <div className="detail-list">
            <article>
              <span>Now</span>
              <h3>Calls, directions, email, and website clicks</h3>
              <p>
                Every business page puts the most important customer actions
                above the fold.
              </p>
            </article>
            <article>
              <span>Next</span>
              <h3>Pick of the Week and social promotion</h3>
              <p>
                Future promotional upgrades will create extra moments of
                attention beyond the initial print drop.
              </p>
            </article>
            <article>
              <span>Later</span>
              <h3>Call tracking, QR reporting, and dashboards</h3>
              <p>
                Planned reporting will help recurring advertisers understand
                activity across print and digital touchpoints.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section package-section">
        <div className="shell package-grid">
          <div className="package-card">
            <p className="eyebrow">Launch placement</p>
            <h2>Catonsville launch placement</h2>
            <ul className="check-list">
              <li>Placement on the printed Catonsville card</li>
              <li>Dedicated business conversion page</li>
              <li>Featured offer or customer incentive</li>
              <li>QR path from print to digital</li>
              <li>Eligibility for a future weekly feature</li>
            </ul>
            <p className="package-note">
              Final pricing, print quantity, placement sizes, and drop dates
              will be set for each campaign.
            </p>
          </div>
          <div className="package-side">
            <span className="package-index">21228</span>
            <h3>Made for the radius that matters.</h3>
            <p>
              Local businesses do not need broad impressions. They need the
              right nearby people to notice, remember, and act.
            </p>
            <Link className="text-link text-link-light" href="/catonsville">
              See the Catonsville edition <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section inquiry-section" id="inquiry">
        <div className="shell inquiry-grid">
          <div>
            <p className="eyebrow">Advertiser inquiry</p>
            <h2>Tell us what you would like Catonsville to know.</h2>
            <p>
              Share a few details and we will follow up about your business,
              timing, and offer. Prefer to talk now? Call or text directly.
            </p>
            <AdvertiserContact />
          </div>
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
