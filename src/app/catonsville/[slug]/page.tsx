import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import {
  businesses,
  categories,
  getBusinessBySlug,
  getOfferForBusiness,
} from "@/data/mock-data";

type BusinessPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return businesses.map((business) => ({ slug: business.slug }));
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  if (!business) {
    return { title: "Business not found" };
  }

  return {
    title: `${business.name} | Catonsville`,
    description: business.shortDescription,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const category = categories.find(
    (item) => item.id === business.categoryId,
  );
  const offer = getOfferForBusiness(business.slug);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    business.address,
  )}`;

  return (
    <>
      <section className="business-hero">
        <div className="shell">
          <Link className="back-link" href="/catonsville">
            <span aria-hidden="true">&lt;-</span> Back to Catonsville Local Picks
          </Link>
          <div className="business-hero-grid">
            <div className="business-hero-copy">
              <p className="eyebrow">
                {category?.name ?? "Catonsville local business"}
              </p>
              <h1>{business.name}</h1>
              <p className="business-tagline">{business.tagline}</p>
              <p className="business-address">{business.address}</p>
              <div className="business-action-grid">
                <a
                  className="button button-primary action-primary"
                  href={`tel:${business.phone}`}
                >
                  Call {business.phoneDisplay}
                </a>
                <a className="button button-secondary" href={`mailto:${business.email}`}>
                  Email
                </a>
                <a
                  className="button button-secondary"
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions
                </a>
                <a
                  className="button button-secondary"
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              </div>
            </div>
            <div className={`business-hero-art art-${business.accent}`}>
              <div className="business-logo-placeholder">
                <span>{business.initials}</span>
                <p>{business.name}</p>
              </div>
              <p className="image-note">Featured in Catonsville Local Picks</p>
            </div>
          </div>
        </div>
      </section>

      <section className="business-content">
        <div className="shell business-content-grid">
          <div className="business-main">
            <section className="business-section">
              <p className="eyebrow">Current offer</p>
              {offer ? (
                <div className="business-offer">
                  <div>
                    <span>{offer.label}</span>
                    <h2>{offer.title}</h2>
                    <p>{offer.details}</p>
                  </div>
                  <div className="offer-badge">
                    {offer.code ? (
                      <>
                        <span>Mention</span>
                        <strong>{offer.code}</strong>
                      </>
                    ) : (
                      <>
                        <span>Mention</span>
                        <strong>Local Picks</strong>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="business-offer">
                  <div>
                    <span>Local Picks visitor</span>
                    <h2>Ask about the current local offer.</h2>
                    <p>
                      Ask about seasonal specials, new-customer offers, and
                      timely promotions when you visit or call.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="business-section">
              <p className="eyebrow">What they do</p>
              <h2>Services and specialties</h2>
              <div className="service-grid">
                {business.services.map((service, index) => (
                  <div key={service}>
                    <span>0{index + 1}</span>
                    <p>{service}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="business-section about-grid">
              <div>
                <p className="eyebrow">About</p>
                <h2>A local business worth knowing.</h2>
              </div>
              <p>{business.about}</p>
            </section>

            <section className="business-section">
              <p className="eyebrow">From the neighborhood</p>
              <div className="testimonial-card">
                <blockquote>
                  &ldquo;{business.testimonials[0].quote}&rdquo;
                </blockquote>
                <p>
                  <strong>{business.testimonials[0].name}</strong>
                  <span>{business.testimonials[0].context}</span>
                </p>
              </div>
            </section>

            <section className="business-section">
              <div className="gallery-heading">
                <div>
                  <p className="eyebrow">A closer look</p>
                  <h2>Gallery</h2>
                </div>
                <p>
                  Storefront, service, and team photos from this local pick.
                </p>
              </div>
              <div className="gallery-grid">
                {business.galleryLabels.map((label, index) => (
                  <div
                    className={`gallery-placeholder gallery-${index + 1} art-${business.accent}`}
                    key={label}
                  >
                    <span>0{index + 1}</span>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="business-sidebar">
            <div className="hours-card">
              <p className="eyebrow">Hours</p>
              <div className="hours-list">
                {business.hours.map((hours) => (
                  <p key={hours.day}>
                    <span>{hours.day}</span>
                    <strong>{hours.time}</strong>
                  </p>
                ))}
              </div>
              <a className="text-link" href={`tel:${business.phone}`}>
                Call to confirm <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
            <div className="sidebar-pick-note">
              <span>Maryland Local Picks</span>
              <p>Featured in Catonsville Local Picks.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section business-newsletter">
        <div className="shell newsletter-panel newsletter-panel-business">
          <div>
            <p className="eyebrow">Keep discovering</p>
            <h2>Get the next Catonsville pick.</h2>
            <p>
              An occasional local recommendation, offer, and reason to visit.
            </p>
          </div>
          <NewsletterForm compact />
        </div>
      </section>
    </>
  );
}
