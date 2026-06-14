import Link from "next/link";

import {
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_NUMERIC,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand brand-footer" href="/">
            <span className="brand-mark">MLP</span>
            <span className="brand-name">
              Maryland
              <strong>Local Picks</strong>
            </span>
          </Link>
          <p className="footer-note">
            Local businesses, offers, and places worth knowing — printed,
            mailed, and made to be kept.
          </p>
        </div>
        <div className="footer-links">
          <p className="footer-label">Explore</p>
          <Link href="/catonsville">Catonsville edition</Link>
          <Link href="/advertise">Advertise with us</Link>
          <Link href="/reserve">Reserve a spot</Link>
          <Link href="/catonsville#newsletter">Newsletter</Link>
        </div>
        <div className="footer-meta">
          <p className="footer-label">Catonsville edition</p>
          <p>
            Call or text
            <br />
            <a className="footer-phone" href={`tel:${ADVERTISER_PHONE_LINK}`}>
              {ADVERTISER_PHONE_VANITY}
            </a>
          </p>
          <p className="contact-number-numeric">{ADVERTISER_PHONE_NUMERIC}</p>
          <p>&copy; {new Date().getFullYear()} Maryland Local Picks</p>
        </div>
      </div>
    </footer>
  );
}
