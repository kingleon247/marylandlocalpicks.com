import Image from "next/image";
import Link from "next/link";

import {
  categories,
  getOfferForBusiness,
  type Business,
} from "@/data/mock-data";

const accentColors: Record<Business["accent"], string> = {
  clay: "var(--clay)",
  gold: "var(--gold)",
  sage: "var(--sage)",
  blue: "var(--blue)",
  plum: "var(--plum)",
  rose: "var(--rose)",
};

function formatFallbackName(name: string) {
  const words = name.split(" ");
  if (words.length <= 2) {
    return name;
  }

  const midpoint = Math.ceil(words.length / 2);
  return (
    <>
      {words.slice(0, midpoint).join(" ")}
      <br />
      {words.slice(midpoint).join(" ")}
    </>
  );
}

export function BusinessCard({ business }: { business: Business }) {
  const category = categories.find((item) => item.id === business.categoryId);
  const offer = getOfferForBusiness(business.slug);
  const accent = accentColors[business.accent];

  return (
    <article className="business-card">
      <div
        className="business-card-accent"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <div className="business-card-media">
        {business.photoUrl ? (
          <Image
            alt={`${business.name} storefront`}
            className="business-card-photo"
            height={450}
            src={business.photoUrl}
            width={600}
          />
        ) : (
          <div className="business-card-fallback">
            <span aria-hidden="true" className="business-card-fallback-rule" />
            <p className="business-card-fallback-name">
              {formatFallbackName(business.name)}
            </p>
            <span aria-hidden="true" className="business-card-fallback-rule" />
            <span className="business-card-fallback-note">
              Photography for print edition
            </span>
          </div>
        )}
        <span
          className={`business-card-badge${
            business.photoUrl ? "" : " business-card-badge-light"
          }`}
        >
          Local Pick
        </span>
      </div>
      <div className="business-card-body">
        <p className="card-kicker">{category?.name ?? "Local business"}</p>
        <h3>{business.name}</h3>
        <p>{business.shortDescription}</p>
        {offer ? (
          <div className="business-card-offer">
            <p className="business-card-offer-label">Current offer</p>
            <p className="business-card-offer-title">{offer.title}</p>
            <p className="business-card-offer-detail">{offer.details}</p>
          </div>
        ) : null}
        <Link className="text-link" href={`/catonsville/${business.slug}`}>
          View local pick <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
