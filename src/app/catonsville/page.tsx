import type { Metadata } from "next";
import Link from "next/link";

import { BusinessCard } from "@/components/business-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { SectionHeading } from "@/components/section-heading";
import {
  businesses,
  categories,
  getBusinessBySlug,
  offers,
  picksOfTheWeek,
} from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Catonsville Local Picks",
  description:
    "A printed card and digital guide featuring selected Catonsville businesses, offers, and places worth knowing.",
};

export default function CatonsvillePage() {
  const weeklyPick = picksOfTheWeek.find(
    (pick) => pick.citySlug === "catonsville",
  );
  const weeklyBusiness = weeklyPick
    ? getBusinessBySlug(weeklyPick.businessSlug)
    : undefined;

  return (
    <>
      <section className="city-hero">
        <div className="shell city-hero-grid">
          <div className="city-hero-copy">
            <p className="edition-label">
              <span>Edition 01</span>
              <span>Catonsville, Maryland</span>
            </p>
            <h1>Catonsville Local Picks</h1>
            <p className="hero-lede">
              A printed card and digital guide featuring selected local
              businesses, offers, and places worth knowing.
            </p>
            <div className="button-row">
              <a className="button button-primary" href="#directory">
                Browse local picks
              </a>
              <a className="button button-secondary" href="#offers">
                See current offers
              </a>
            </div>
          </div>
          <div className="city-card-preview">
            <div className="preview-card">
              <div className="preview-card-heading">
                <p>Keep this card.</p>
                <span>Scan for the full guide</span>
              </div>
              <div className="preview-list">
                <span>01 Coffee + breakfast</span>
                <span>02 Dinner + drinks</span>
                <span>03 Home + local services</span>
                <span>04 Shops + outdoor life</span>
              </div>
              <div className="qr-placeholder" aria-label="QR code for the printed guide">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <p>
              One useful card. A whole town of good ideas.
            </p>
          </div>
        </div>
        <div className="shell city-hero-stats">
          <div>
            <strong>{businesses.length}</strong>
            <span>local picks</span>
          </div>
          <div>
            <strong>{categories.length}</strong>
            <span>local categories</span>
          </div>
          <div>
            <strong>01</strong>
            <span>first city edition</span>
          </div>
        </div>
      </section>

      <section className="section" id="directory">
        <div className="shell">
          <SectionHeading
            eyebrow="The directory"
            title="Start with a good local answer."
            intro="Featured local businesses and offers from the first Catonsville edition."
          />
          <div className="category-stack">
            {categories.map((category) => {
              const categoryBusinesses = businesses.filter(
                (business) => business.categoryId === category.id,
              );

              return (
                <section className="category-section" key={category.id}>
                  <div className="category-heading">
                    <h3>{category.name}</h3>
                    <p>{category.eyebrow}</p>
                  </div>
                  <div className="business-grid">
                    {categoryBusinesses.map((business) => (
                      <BusinessCard business={business} key={business.slug} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section offers-section" id="offers">
        <div className="shell">
          <SectionHeading
            eyebrow="Featured offers"
            title="A timely reason to stop in."
            intro="Useful, straightforward offers presented as part of the guide, never as a wall of fine print."
          />
          <div className="offer-grid">
            {offers.map((offer, index) => {
              const business = getBusinessBySlug(offer.businessSlug);

              if (!business) {
                return null;
              }

              return (
                <article className="offer-card" key={offer.businessSlug}>
                  <div className="offer-number">0{index + 1}</div>
                  <p className="card-kicker">{offer.label}</p>
                  <h3>{offer.title}</h3>
                  <p>{offer.details}</p>
                  {offer.code ? (
                    <p className="offer-code">
                      Mention <strong>{offer.code}</strong>
                    </p>
                  ) : (
                    <p className="offer-code">Mention Local Picks</p>
                  )}
                  <Link
                    className="text-link"
                    href={`/catonsville/${business.slug}`}
                  >
                    Visit {business.name} <span aria-hidden="true">-&gt;</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {weeklyPick && weeklyBusiness ? (
        <section className="section weekly-section">
          <div className="shell weekly-grid">
            <div className={`weekly-art art-${weeklyBusiness.accent}`}>
              <div className="weekly-stamp">
                <span>Pick</span>
                <strong>01</strong>
              </div>
              <p>{weeklyBusiness.name}</p>
            </div>
            <div className="weekly-copy">
              <p className="eyebrow">{weeklyPick.kicker}</p>
              <h2>{weeklyPick.headline}</h2>
              <p>{weeklyPick.story}</p>
              <Link
                className="button button-primary"
                href={`/catonsville/${weeklyBusiness.slug}`}
              >
                Meet this week&apos;s pick
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section newsletter-section" id="newsletter">
        <div className="shell newsletter-panel">
          <div>
            <p className="eyebrow">The local list</p>
            <h2>Fresh picks, without the inbox clutter.</h2>
            <p>
              Get the occasional Catonsville recommendation, featured offer,
              and Pick of the Week.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <section className="section business-cta-section">
        <div className="shell business-cta">
          <div>
            <p className="eyebrow">Own a local business?</p>
            <h2>Put your business in the next local conversation.</h2>
          </div>
          <p>
            Print placement, a focused digital page, QR traffic, and an offer
            customers can act on.
          </p>
          <div className="button-row">
            <Link className="button button-light" href="/reserve">
              Reserve a spot
            </Link>
            <Link className="button button-secondary" href="/advertise">
              Advertise with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
