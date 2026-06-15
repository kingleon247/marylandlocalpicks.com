import { NextRequest, NextResponse } from "next/server";

import {
  REVIEW_ACCESS_COOKIE,
  isSiteGateEnabled,
  isValidPasscode,
  reviewAccessCookieOptions,
} from "@/lib/site-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function productionRedirect(path: string): URL {
  const siteUrl = process.env.SITE_URL || "https://marylandlocalpicks.com";
  return new URL(path, siteUrl);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submittedPasscode = String(formData.get("passcode") ?? "");

  if (!isSiteGateEnabled()) {
    return NextResponse.redirect(productionRedirect("/"));
  }

  if (!submittedPasscode || !isValidPasscode(submittedPasscode)) {
    return NextResponse.redirect(productionRedirect("/?preview_error=1"));
  }

  const response = NextResponse.redirect(productionRedirect("/"));

  response.cookies.set(
    REVIEW_ACCESS_COOKIE,
    "1",
    reviewAccessCookieOptions()
  );

  return response;
}
