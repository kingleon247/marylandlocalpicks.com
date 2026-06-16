import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import {
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_NUMERIC,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";
import { hasReviewAccess, isSiteGateEnabled } from "@/lib/site-gate";

export async function SiteFooter() {
  const showPreviewExit = isSiteGateEnabled() && (await hasReviewAccess());

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link
            className="brand brand-header"
            href="/"
            aria-label="Maryland Local Picks home"
          >
            <span className="brand-mark" aria-hidden="true">
              MLP
            </span>
            <BrandLogo
              className="brand-logo brand-logo-wordmark"
              variant="wordmark-footer"
            />
          </Link>
          <p className="footer-note">
            Local businesses, offers, and places worth knowing — printed,
            mailed, and made to be kept.
          </p>
          {showPreviewExit ? (
            <p className="footer-preview-exit">
              <Link href="/preview-exit">Exit preview</Link>
            </p>
          ) : null}
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
