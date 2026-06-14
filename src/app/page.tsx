import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { cities } from "@/data/mock-data";

export default function Home() {
  const liveCity = cities.find((city) => city.status === "live");
  const futureCities = cities.filter((city) => city.status === "coming-soon");

  return (
    <>
      <section className="home-hero">
        <div className="shell home-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">The good stuff, closer to home</p>
            <h1>
              Find your next
              <span>local favorite.</span>
            </h1>
            <p className="hero-lede">
              Maryland Local Picks is a printed card and digital guide to
              independent businesses, useful offers, and places worth knowing.
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/catonsville">
                Explore Catonsville
              </Link>
              <Link className="button button-secondary" href="/advertise">
                Advertise locally
              </Link>
            </div>
          </div>

          <div className="hero-card-scene" aria-label="Illustration of a local picks card">
            <div className="sun-shape" />
            <div className="guide-card guide-card-back">
              <span>Maryland edition</span>
              <strong>Places worth knowing.</strong>
            </div>
            <div className="guide-card guide-card-front">
              <div className="guide-card-top">
                <span>Edition 01</span>
                <span>21228</span>
              </div>
              <div>
                <p>Maryland Local Picks</p>
                <h2>Catonsville</h2>
              </div>
              <div className="guide-card-bottom">
                <span>Eat</span>
                <span>Shop</span>
                <span>Explore</span>
              </div>
            </div>
            <p className="scene-caption">Print meets local discovery</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="A better local guide"
            title="Curated, useful, and made to be kept."
            intro="No endless listings. No coupon-book clutter. Just a considered mix of local businesses and timely reasons to visit them."
          />
          <div className="feature-grid">
            <article className="feature-card feature-card-numbered">
              <span>01</span>
              <h3>A card for the counter</h3>
              <p>
                A well-designed printed piece that earns a place on the fridge,
                desk, or community board.
              </p>
            </article>
            <article className="feature-card feature-card-numbered">
              <span>02</span>
              <h3>A guide for the phone</h3>
              <p>
                QR-connected business pages make calling, visiting, and
                claiming an offer simple.
              </p>
            </article>
            <article className="feature-card feature-card-numbered">
              <span>03</span>
              <h3>A signal for what is good</h3>
              <p>
                Each city edition feels selected and local, with room for
                stories, recommendations, and weekly picks.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-ink">
        <div className="shell">
          <SectionHeading
            eyebrow="City editions"
            title="Built neighborhood by neighborhood."
            intro="We are starting close to home, learning what works, and building a format that can travel thoughtfully across Maryland."
            inverse
          />
          <div className="city-grid">
            {liveCity ? (
              <Link className="city-card city-card-live" href={`/${liveCity.slug}`}>
                <div>
                  <span className="status-pill">Now live</span>
                  <p>
                    {liveCity.name}, {liveCity.state}
                  </p>
                </div>
                <h3>{liveCity.description}</h3>
                <span className="city-arrow" aria-hidden="true">
                  -&gt;
                </span>
              </Link>
            ) : null}
            {futureCities.map((city) => (
              <article className="city-card city-card-soon" key={city.slug}>
                <div>
                  <span className="status-pill">On the map</span>
                  <p>
                    {city.name}, {city.state}
                  </p>
                </div>
                <h3>{city.description}</h3>
                <span className="coming-soon">Future edition</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-advertiser">
        <div className="shell advertiser-banner">
          <div>
            <p className="eyebrow">For local businesses</p>
            <h2>Show up where local decisions happen.</h2>
          </div>
          <p>
            Pair a tangible neighborhood print placement with a focused digital
            landing page and a clear offer.
          </p>
          <Link className="button button-light" href="/advertise">
            See advertiser options
          </Link>
        </div>
      </section>
    </>
  );
}
