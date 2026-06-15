export const paymentLinks = {
  halfSpot: null,
  standardSpot: null,
  doubleSpot: null,
} as const;

export type PaymentLinkKey = keyof typeof paymentLinks;

export function getPaymentAction(key: PaymentLinkKey): {
  href: string;
  label: string;
  external: boolean;
} {
  const link = paymentLinks[key];

  if (link) {
    return {
      href: link,
      label: "Pay now",
      external: true,
    };
  }

  return {
    href: `/advertiser-intake?interest=${key}`,
    label: "Request payment link",
    external: false,
  };
}

export function getPackageCtaAction(interestKey: PaymentLinkKey): {
  href: string;
  label: string;
  external: boolean;
} {
  const link = paymentLinks[interestKey];

  if (link) {
    return {
      href: link,
      label: "Pay now",
      external: true,
    };
  }

  return {
    href: `/advertiser-intake?interest=${interestKey}`,
    label: "Start advertiser intake",
    external: false,
  };
}
