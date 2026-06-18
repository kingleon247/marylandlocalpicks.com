import { NextRequest, NextResponse } from "next/server";

import {
  REVIEW_ACCESS_COOKIE,
  getRedirectUrl,
  isSiteGateEnabled,
  isValidPasscode,
  reviewAccessCookieOptions,
} from "@/lib/site-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submittedPasscode = String(formData.get("passcode") ?? "");

  if (!isSiteGateEnabled()) {
    return NextResponse.redirect(getRedirectUrl(request, "/"));
  }

  if (!submittedPasscode || !isValidPasscode(submittedPasscode)) {
    return NextResponse.redirect(getRedirectUrl(request, "/?preview_error=1"));
  }

  const response = NextResponse.redirect(getRedirectUrl(request, "/"));

  response.cookies.set(
    REVIEW_ACCESS_COOKIE,
    "1",
    reviewAccessCookieOptions()
  );

  return response;
}
