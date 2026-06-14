export type PlacementPackageKey =
  | "halfSpot"
  | "singleSpot"
  | "doubleSpot"
  | "quadSponsor";

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

export const placementPackages: PlacementPackage[] = [
  {
    key: "halfSpot",
    name: "Half Spot",
    tagline: "Best for a first local placement.",
    bestFor: [
      "restaurants",
      "coffee shops",
      "salons",
      "boutiques",
      "small local offers",
      "first-time advertisers",
    ],
    includes: [
      "Half-card placement",
      "One category listing",
      "Digital landing page",
      "One local offer",
    ],
    price: "Pricing pending",
    cta: "Reserve a spot",
  },
  {
    key: "singleSpot",
    name: "Single Spot",
    tagline: "Best for steady neighborhood visibility.",
    bestFor: [
      "standard local advertisers",
      "home services",
      "professional services",
      "health/wellness",
      "auto",
      "real estate/homeowner services",
    ],
    includes: [
      "Full single-spot placement",
      "Priority category listing",
      "Landing page + featured offer",
      "QR-connected traffic",
    ],
    price: "Pricing pending",
    cta: "Reserve a spot",
    recommended: true,
  },
  {
    key: "doubleSpot",
    name: "Double Spot",
    tagline: "Best for a standout, can't-miss presence.",
    bestFor: [
      "businesses that want stronger visibility",
      "high-ticket services",
      "businesses with several services or a strong visual offer",
    ],
    includes: [
      "Double-size feature placement",
      "Top-of-category priority",
      "Enhanced landing page",
      "Pick of the Week eligibility",
    ],
    price: "Pricing pending",
    cta: "Reserve a spot",
  },
  {
    key: "quadSponsor",
    name: "Quad Sponsor",
    tagline: "Best for owning the edition.",
    bestFor: [
      "major sponsors",
      "high-value categories",
      "businesses trying to dominate locally",
      "annual or recurring advertisers",
    ],
    includes: [
      "Premium cover-adjacent quad",
      "Category exclusivity",
      "Featured in digital + social",
      "First right of renewal",
    ],
    price: "Call for availability",
    cta: "Reserve a spot",
  },
];

export type PrepayOption = {
  key: string;
  name: string;
  description: string;
};

export const prepayOptions: PrepayOption[] = [
  {
    key: "oneMailing",
    name: "One mailing",
    description: "Reserve a single Catonsville edition placement.",
  },
  {
    key: "threeMailingPackage",
    name: "3-mailing package",
    description: "Plan ahead across three planned mailings.",
  },
  {
    key: "sixMailingPackage",
    name: "6-mailing package",
    description: "Stay visible across half a year of editions.",
  },
  {
    key: "annualPackage",
    name: "Annual 8-mailing package",
    description: "Commit to roughly eight mailings per year.",
  },
];

export const prepayBonuses = [
  "locked rate",
  "priority placement",
  "Pick of the Week credit",
  "offer updates",
  "category priority",
  "first right of refusal",
];

export type AddOn = {
  name: string;
  description: string;
  future?: boolean;
};

export const addOns: AddOn[] = [
  {
    name: "Digital-only listing",
    description: "Online presence without a print placement.",
  },
  {
    name: "Pick of the Week",
    description: "Extra spotlight in the city edition and digital guide.",
  },
  {
    name: "Social promotion",
    description: "Additional reach through Maryland Local Picks channels.",
  },
  {
    name: "Call tracking",
    description: "Dedicated tracking numbers and call reporting.",
    future: true,
  },
  {
    name: "Website, reputation, and AI services",
    description: "Optional marketing and answering services.",
    future: true,
  },
];

export const paymentPolicy = [
  "No payment, no reserved print spot.",
  "Print placements are paid upfront.",
  "Payment links are sent after placement and category availability are confirmed.",
  "Prepaid packages may be available after confirming fit and inventory.",
  "Final pricing and availability depend on edition inventory.",
  "Digital-only options may be monthly later.",
];

export const mailingCadenceCopy =
  "Maryland Local Picks is planned around roughly one mailing every six weeks, or about eight mailings per year.";
