import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Maryland Local Picks home">
          <BrandLogo className="brand-logo brand-logo-wordmark" priority />
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/catonsville">Catonsville</Link>
          <Link href="/advertise">Advertise</Link>
          <Link href="/reserve">Reserve</Link>
          <Link className="nav-cta" href="/catonsville#newsletter">
            Get the picks
          </Link>
        </nav>
      </div>
    </header>
  );
}
