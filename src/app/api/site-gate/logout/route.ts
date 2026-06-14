import { NextResponse } from "next/server";

import {
  REVIEW_ACCESS_COOKIE,
  reviewAccessCookieOptions,
} from "@/lib/site-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function productionRedirect(path: string): URL {
  const siteUrl = process.env.SITE_URL || "https://marylandlocalpicks.com";
  return new URL(path, siteUrl);
}

export async function POST() {
  const response = NextResponse.redirect(productionRedirect("/"));

  response.cookies.set(REVIEW_ACCESS_COOKIE, "", {
    ...reviewAccessCookieOptions(),
    maxAge: 0,
  });

  return response;
}
