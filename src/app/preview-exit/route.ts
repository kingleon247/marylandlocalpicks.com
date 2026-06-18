import { NextRequest, NextResponse } from "next/server";

import {
  REVIEW_ACCESS_COOKIE,
  getRedirectUrl,
  reviewAccessCookieOptions,
} from "@/lib/site-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(getRedirectUrl(request, "/"));

  response.cookies.set(REVIEW_ACCESS_COOKIE, "", {
    ...reviewAccessCookieOptions(),
    maxAge: 0,
  });

  return response;
}
