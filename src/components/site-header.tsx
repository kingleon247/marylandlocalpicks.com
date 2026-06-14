import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Maryland Local Picks home">
          <span className="brand-mark">MLP</span>
          <span className="brand-name">
            Maryland
            <strong>Local Picks</strong>
          </span>
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
