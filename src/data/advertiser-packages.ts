export type PlacementPackageKey = "halfSpot" | "standardSpot" | "doubleSpot";

export type PlacementPackage = {
  key: PlacementPackageKey;
  name: string;
  tagline: string;
  bestFor: string[];
  includes: string[];
  price: string;
  cta: string;
  recommended?: boolean;
};

export const MAILING_REACH_NOTE =
  "Every card is mailed to 10,000 local households. Spots are limited, and only one business per category is accepted whenever possible.";

export const CORE_OFFER_STATEMENT =
  "You get category-exclusive visibility in 10,000 local mailboxes, on a premium oversized 9x12 postcard, without designing, printing, or mailing anything yourself.";

export const bestForList = [
  "Serve homeowners in the mailing area",
  "Have a clear service or offer",
  "Want more local visibility",
  "Can respond quickly to calls, texts, QR scans, or website visits",
  "Understand that marketing is about exposure and repeated visibility, not guaranteed instant results",
];

export const notForList = [
  "Your business does not serve the mailing area",
  "You do not have a clear offer or call to action",
  "You need guaranteed leads or guaranteed sales",
  "You are not ready to answer calls, texts, or inquiries from local homeowners",
];

export const placementPackages: PlacementPackage[] = [
  {
    key: "halfSpot",
    name: "Half Spot",
    tagline:
      "A compact placement for a simple offer, coupon, logo, or short message.",
    bestFor: [
      "simple local offers",
      "coupons and seasonal promotions",
      "businesses with a clear, short message",
      "entry-level local visibility",
    ],
    includes: [
      "Half-spot placement on a premium 9x12 postcard",
      "Mailed to 10,000 local households",
      "Ad layout and basic design help included",
      "Category-exclusive placement whenever possible",
      "QR code included when useful",
    ],
    price: "$350",
    cta: "Reserve your spot",
  },
  {
    key: "standardSpot",
    name: "Standard Spot",
    tagline:
      "Recommended for most local businesses. Enough room for a strong offer, services, contact info, logo, and QR code.",
    bestFor: [
      "home-service businesses",
      "local-service businesses",
      "businesses with a clear offer and contact info",
      "most advertisers who want strong local visibility",
    ],
    includes: [
      "Standard-spot placement on a premium 9x12 postcard",
      "Mailed to 10,000 local households",
      "Ad layout and basic design help included",
      "Category-exclusive placement whenever possible",
      "QR code included when useful",
    ],
    price: "$600",
    cta: "Reserve your spot",
    recommended: true,
  },
  {
    key: "doubleSpot",
    name: "Double Spot",
    tagline:
      "A larger placement for businesses that want stronger visibility, more room for photos, multiple services, before/after examples, or a more premium presentation.",
    bestFor: [
      "businesses that want stronger visibility",
      "multiple services or visual offers",
      "before/after examples",
      "premium local presentation",
    ],
    includes: [
      "Double-spot placement on a premium 9x12 postcard",
      "Mailed to 10,000 local households",
      "Ad layout and basic design help included",
      "Category-exclusive placement whenever possible",
      "QR code included when useful",
    ],
    price: "$1,100",
    cta: "Reserve your spot",
  },
];

export const paymentPolicy = [
  "No payment, no reserved print spot.",
  "Print placements are paid upfront.",
  "Payment links are sent after placement and category availability are confirmed.",
  "There is no charge before you have seen and approved your placement.",
  "Maryland Local Picks sells local exposure and visibility — not guaranteed leads, calls, or sales.",
];
