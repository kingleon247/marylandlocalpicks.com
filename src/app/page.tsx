import Image from "next/image";
import Link from "next/link";

import { ADVERTISER_PHONE_LINK, ADVERTISER_PHONE_VANITY } from "@/components/advertiser-contact";
import { BusinessCard } from "@/components/business-card";
import { SectionHeading } from "@/components/section-heading";
import {
  categories,
  cities,
  countBusinessesInCategory,
  getCategoryById,
  getFeaturedBusiness,
  getNewestBusinesses,
} from "@/data/mock-data";

// Placeholder businesses for the hero product mockup only — not real brands,
// and intentionally separate from the live directory data.
const heroOfferTiles = [
  { name: "Rowan & Rye Café", category: "Eat", offer: "Free drink", tone: "red" },
  { name: "Maple Street Diner", category: "Eat", offer: "Scan for menu", tone: "green" },
  { name: "Stone Mill Pizza", category: "Eat", offer: "Weekend special", tone: "gold" },
  { name: "Hillcrest Goods", category: "Shop", offer: "New customer offer", tone: "green" },
  { name: "Bluebird Books", category: "Shop", offer: "10% off", tone: "red" },
  { name: "Tin Roof Florals", category: "Shop", offer: "Book local", tone: "gold" },
  { name: "Patapsco Cycle Co.", category: "Explore", offer: "10% off", tone: "red" },
  { name: "Overlook Yoga", category: "Explore", offer: "Weekend special", tone: "green" },
] as const;

// Decorative QR glyphs for the hero mockup (not scannable).
function HeroQrMini() {
  return (
    <svg className="picks-tile-qr" viewBox="0 0 11 11" aria-hidden="true">
      <g fill="currentColor">
        <path d="M0 0h4v4H0z" />
        <path d="M7 0h4v4H7z" />
        <path d="M0 7h4v4H0z" />
      </g>
      <g fill="#fff">
        <path d="M1 1h2v2H1z" />
        <path d="M8 1h2v2H8z" />
        <path d="M1 8h2v2H1z" />
      </g>
      <path
        fill="currentColor"
        d="M6 6h1v1H6zM8 6h1v1H8zM10 6h1v1h-1zM6 8h1v1H6zM6 10h1v1H6zM8 8h2v2H8zM10 10h1v1h-1z"
      />
    </svg>
  );
}

function HeroQr() {
  return (
    <svg
      className="picks-foot-qr"
      viewBox="0 0 21 21"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <g fill="currentColor">
        <path d="M0 0h7v7H0z" />
        <path d="M14 0h7v7h-7z" />
        <path d="M0 14h7v7H0z" />
      </g>
      <g fill="#fff">
        <path d="M1 1h5v5H1z" />
        <path d="M15 1h5v5h-5z" />
        <path d="M1 15h5v5H1z" />
      </g>
      <g fill="currentColor">
        <path d="M2 2h3v3H2z" />
        <path d="M16 2h3v3h-3z" />
        <path d="M2 16h3v3H2z" />
        <path d="M8 0h1v1H8zM10 0h1v1h-1zM12 0h1v1h-1zM9 2h1v1H9zM11 3h1v1h-1zM8 4h1v1H8zM13 1h1v1h-1zM0 8h1v1H0zM2 9h1v1H2zM4 8h1v1H4zM0 10h1v1H0zM3 11h1v1H3zM1 13h1v1H1zM8 6h1v1H8zM10 6h1v1h-1zM12 6h1v1h-1zM6 8h1v1H6zM6 10h1v1H6zM6 12h1v1H6zM8 8h1v1H8zM10 9h1v1h-1zM12 8h1v1h-1zM9 11h1v1H9zM11 12h1v1h-1zM13 10h1v1h-1zM8 10h1v1H8zM8 12h1v1H8zM14 9h1v1h-1zM16 11h1v1h-1zM18 9h1v1h-1zM15 13h1v1h-1zM17 15h1v1h-1zM19 12h1v1h-1zM8 14h1v1H8zM10 16h1v1h-1zM12 18h1v1h-1zM9 17h1v1H9zM11 19h1v1h-1zM13 15h1v1h-1zM14 17h1v1h-1zM16 19h1v1h-1zM18 16h1v1h-1z" />
      </g>
    </svg>
  );
}

export default function Home() {
  const liveCity = cities.find((city) => city.status === "live");
  const futureCities = cities.filter((city) => city.status === "coming-soon");
  const featured = getFeaturedBusiness();
  const featuredCategory = getCategoryById(featured.categoryId);
  const newestPicks = getNewestBusinesses(3);

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
              Maryland Local Picks helps residents discover nearby restaurants,
              shops, services, and local offers — in print and online.
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/catonsville">
                Explore Catonsville
              </Link>
              <Link className="button button-secondary" href="/advertise">
                Advertise locally
              </Link>
            </div>
            <div className="hero-browse" aria-label="Browse by category">
              <span className="hero-browse-label">Browse</span>
              {categories.map((category) => (
                <Link
                  className="hero-chip"
                  href={`/catonsville#${category.id}`}
                  key={category.id}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div
            className="hero-stage"
            role="img"
            aria-label="A Maryland Local Picks Catonsville card showing a grid of local business offers and QR codes, beside a phone preview of the digital guide."
          >
            <span className="hero-stage-glow" aria-hidden="true" />

            <article className="picks-card">
              <header className="picks-card-head">
                <div className="picks-card-headrow">
                  <p className="picks-card-brand">Maryland Local Picks</p>
                  <span className="picks-card-zip">21228</span>
                </div>
                <p className="picks-card-edition">Catonsville Edition</p>
                <ul className="picks-card-cats">
                  <li>Eat</li>
                  <li>Shop</li>
                  <li>Explore</li>
                </ul>
              </header>

              <p className="picks-card-title">Local offers close to home</p>

              <div className="picks-card-grid">
                {heroOfferTiles.map((tile) => (
                  <div className="picks-tile" key={tile.name}>
                    <div className="picks-tile-top">
                      <span className="picks-tile-cat">{tile.category}</span>
                      <HeroQrMini />
                    </div>
                    <p className="picks-tile-name">{tile.name}</p>
                    <span className={`picks-tile-offer offer-pill-${tile.tone}`}>
                      {tile.offer}
                    </span>
                  </div>
                ))}
              </div>

              <footer className="picks-card-foot">
                <HeroQr />
                <div>
                  <p className="picks-card-foot-title">
                    Scan any pick for the full guide
                  </p>
                  <p className="picks-card-foot-sub">
                    Catonsville, MD · Eat · Shop · Explore
                  </p>
                </div>
              </footer>
            </article>

            <div className="picks-phone" aria-hidden="true">
              <span className="picks-phone-notch" />
              <div className="picks-phone-screen">
                <div className="picks-phone-head">
                  <span className="picks-phone-eyebrow">Catonsville</span>
                  <p className="picks-phone-title">Local Picks</p>
                  <p className="picks-phone-tabs">Eat · Shop · Explore</p>
                </div>
                <p className="picks-phone-label">Featured offers</p>
                <ul className="picks-phone-list">
                  <li>
                    <span className="picks-phone-thumb thumb-red" />
                    <div>
                      <p>Rowan &amp; Rye Café</p>
                      <span>Free drink</span>
                    </div>
                  </li>
                  <li>
                    <span className="picks-phone-thumb thumb-gold" />
                    <div>
                      <p>Stone Mill Pizza</p>
                      <span>Weekend special</span>
                    </div>
                  </li>
                  <li>
                    <span className="picks-phone-thumb thumb-green" />
                    <div>
                      <p>Bluebird Books</p>
                      <span>10% off</span>
                    </div>
                  </li>
                </ul>
                <span className="picks-phone-cta">View guide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section browse-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Browse by category"
            title="Find local, by what you need today."
            intro="Three simple ways into the guide — coffee and dinner, trusted help at home, or somewhere new to spend an afternoon."
          />
          <div className="browse-grid">
            {categories.map((category) => {
              const count = countBusinessesInCategory(category.id);
              return (
                <Link
                  className="browse-card"
                  href={`/catonsville#${category.id}`}
                  key={category.id}
                >
                  <div className="browse-card-media">
                    {category.imageUrl ? (
                      <Image
                        alt={`${category.name} in Catonsville`}
                        className="browse-card-photo"
                        height={520}
                        src={category.imageUrl}
                        width={720}
                      />
                    ) : (
                      <div className="browse-card-fallback" aria-hidden="true" />
                    )}
                    <span className="browse-card-count">
                      {count} {count === 1 ? "pick" : "picks"}
                    </span>
                  </div>
                  <div className="browse-card-body">
                    <h3>{category.name}</h3>
                    <p>{category.eyebrow}</p>
                    <span className="browse-card-link">
                      Browse {category.name} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Featured local pick"
            title="One place worth knowing this week."
            intro="A standout from the Catonsville edition — the kind of spot we would send a neighbor to without a second thought."
          />
          <Link className="featured-pick" href={`/catonsville/${featured.slug}`}>
            <div className="featured-pick-media">
              {featured.photoUrl ? (
                <Image
                  alt={`${featured.name}`}
                  className="featured-pick-photo"
                  height={760}
                  priority
                  sizes="(max-width: 1020px) 100vw, 55vw"
                  src={featured.photoUrl}
                  width={1040}
                />
              ) : (
                <div className={`featured-pick-fallback art-${featured.accent}`} />
              )}
            </div>
            <div className="featured-pick-body">
              <p className="card-kicker">
                {featuredCategory?.name ?? "Local pick"} · Catonsville
              </p>
              <h3>{featured.name}</h3>
              <p className="featured-pick-tagline">{featured.tagline}</p>
              <p className="featured-pick-desc">{featured.shortDescription}</p>
              <span className="text-link">
                View local pick <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section newest-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Newest local picks"
            title="Fresh additions to the guide."
            intro="The latest independent businesses to join the Catonsville edition."
          />
          <div className="business-grid">
            {newestPicks.map((business) => (
              <BusinessCard business={business} key={business.slug} />
            ))}
          </div>
          <div className="newest-actions">
            <Link className="button button-primary" href="/catonsville">
              See all local picks →
            </Link>
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
                  →
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
                <span className="coming-soon">Coming soon</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-advertiser">
        <div className="shell advertiser-banner">
          <div>
            <p className="eyebrow">For local businesses</p>
            <h2>Reserve your spot in the Catonsville edition.</h2>
            <p>
              A neighborhood print placement, a focused digital landing page, and
              a clear offer — mailed to the doors that matter.
            </p>
          </div>
          <div className="advertiser-banner-actions">
            <Link className="button button-light" href="/reserve">
              Reserve a spot →
            </Link>
            <Link className="button button-secondary" href="/advertise">
              See advertiser options
            </Link>
            <a className="button button-secondary" href={`tel:${ADVERTISER_PHONE_LINK}`}>
              Call or text {ADVERTISER_PHONE_VANITY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
