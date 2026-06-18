// Set these to your Stripe payment link URLs when ready.
// Half Spot = $350, Standard Spot = $600, Double Spot = $1,100.
// Payment links are shown on the thank-you page after intake submit — never linked directly from public package cards.
export const paymentLinks: Record<PaymentLinkKey, string | null> = {
  halfSpot: null,
  standardSpot: null,
  doubleSpot: null,
};

export type PaymentLinkKey = "halfSpot" | "standardSpot" | "doubleSpot";

export function getPaymentLink(key: string): string | null {
  if (key in paymentLinks) {
    return paymentLinks[key as PaymentLinkKey];
  }
  return null;
}

// Package cards always route to intake — Stripe links are shown post-submit only.
export function getPackageCtaAction(interestKey: PaymentLinkKey): {
  href: string;
  label: string;
  external: boolean;
} {
  return {
    href: `/advertiser-intake?interest=${interestKey}`,
    label: "Reserve this spot",
    external: false,
  };
}
