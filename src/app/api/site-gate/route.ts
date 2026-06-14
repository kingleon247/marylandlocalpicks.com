import { NextResponse } from "next/server";

import {
  isSiteGateEnabled,
  isValidPasscode,
  reviewAccessCookieOptions,
  REVIEW_ACCESS_COOKIE,
} from "@/lib/site-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRedirectUrl(request: Request, path: string): URL {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  if (!isSiteGateEnabled()) {
    return NextResponse.redirect(getRedirectUrl(request, "/"));
  }

  const formData = await request.formData();
  const passcode = formData.get("passcode");
  const submitted = typeof passcode === "string" ? passcode : "";

  if (!isValidPasscode(submitted)) {
    return NextResponse.redirect(getRedirectUrl(request, "/?preview_error=1"));
  }

  const response = NextResponse.redirect(getRedirectUrl(request, "/"));
  response.cookies.set(REVIEW_ACCESS_COOKIE, "1", reviewAccessCookieOptions());

  return response;
}
