import { cookies } from "next/headers";

export const REVIEW_ACCESS_COOKIE = "mlp_review_access";
export const REVIEW_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function isSiteGateEnabled(): boolean {
  return process.env.SITE_GATE_ENABLED === "true";
}

export function getSiteGatePasscode(): string | undefined {
  return process.env.SITE_GATE_PASSCODE;
}

export async function hasReviewAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(REVIEW_ACCESS_COOKIE)?.value === "1";
}

export async function shouldShowSiteGate(): Promise<boolean> {
  if (!isSiteGateEnabled()) {
    return false;
  }

  return !(await hasReviewAccess());
}

export function reviewAccessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: REVIEW_ACCESS_MAX_AGE_SECONDS,
    path: "/",
  };
}

export function isValidPasscode(submitted: string): boolean {
  const expected = getSiteGatePasscode();

  if (!expected) {
    return false;
  }

  return submitted === expected;
}
