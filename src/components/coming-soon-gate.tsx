"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  ADVERTISER_PHONE_LINK,
  ADVERTISER_PHONE_VANITY,
} from "@/components/advertiser-contact";

function ComingSoonGateForm() {
  const searchParams = useSearchParams();
  const showError = searchParams.get("preview_error") === "1";

  return (
    <div className="site-gate">
      <div className="site-gate-panel">
        <p className="eyebrow">Maryland Local Picks</p>
        <h1>Maryland Local Picks is getting ready.</h1>
        <p className="site-gate-lede">
          A curated local guide for Catonsville businesses, offers, and places
          worth keeping.
        </p>
        <p className="site-gate-secondary">
          Private preview access is available for invited reviewers.
        </p>

        <form action="/api/site-gate" className="site-gate-form" method="POST">
          <label htmlFor="preview-passcode">
            Preview passcode
            <input
              autoComplete="off"
              id="preview-passcode"
              name="passcode"
              placeholder="Enter passcode"
              required
              spellCheck={false}
              type="password"
            />
          </label>
          {showError ? (
            <p className="site-gate-error" role="alert">
              That passcode did not match. Try again or contact us for access.
            </p>
          ) : null}
          <button className="button button-primary button-wide" type="submit">
            Enter preview
          </button>
        </form>

        <p className="site-gate-contact">
          Questions? Call or text{" "}
          <a href={`tel:${ADVERTISER_PHONE_LINK}`}>{ADVERTISER_PHONE_VANITY}</a>
        </p>
      </div>
    </div>
  );
}

export function ComingSoonGate() {
  return (
    <Suspense fallback={<div className="site-gate site-gate-loading" />}>
      <ComingSoonGateForm />
    </Suspense>
  );
}
