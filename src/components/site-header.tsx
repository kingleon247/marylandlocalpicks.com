import Link from "next/link";

import { BrandLogo, BrandMark } from "@/components/brand-logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand brand-header" href="/" aria-label="Maryland Local Picks home">
          <BrandMark className="brand-mark" priority />
          <BrandLogo className="brand-logo brand-logo-wordmark" priority />
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/catonsville">Catonsville</Link>
          <Link href="/advertise">Advertise</Link>
          <Link className="nav-cta" href="/catonsville#newsletter">
            Get the picks
          </Link>
        </nav>
      </div>
    </header>
  );
}
