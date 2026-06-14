import Link from "next/link";

import type { Business } from "@/data/mock-data";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <article className="business-card">
      <div className={`business-art art-${business.accent}`}>
        <span>{business.initials}</span>
        <p>Local pick</p>
      </div>
      <div className="business-card-body">
        <p className="card-kicker">
          {business.featured ? "Featured business" : "Worth knowing"}
        </p>
        <h3>{business.name}</h3>
        <p>{business.shortDescription}</p>
        <Link className="text-link" href={`/catonsville/${business.slug}`}>
          View local pick <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </article>
  );
}
