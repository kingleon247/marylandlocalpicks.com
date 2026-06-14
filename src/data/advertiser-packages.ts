export type PlacementPackageKey =
  | "halfSpot"
  | "singleSpot"
  | "doubleSpot"
  | "quadSponsor";

export type PlacementPackage = {
  key: PlacementPackageKey;
  name: string;
  bestFor: string[];
  includes: string[];
  price: string;
  cta: string;
};

export const placementPackages: PlacementPackage[] = [
  {
    key: "halfSpot",
    name: "Half Spot",
    bestFor: [
      "restaurants",
      "coffee shops",
      "salons",
      "boutiques",
      "small local offers",
      "first-time advertisers",
    ],
    includes: [
      "smaller print placement",
      "digital business landing page",
      "city page listing",
      "offer/coupon placement",
      "QR destination",
      "basic contact-action tracking later",
    ],
    price: "Launch price: TBD",
    cta: "Ask about half spot",
  },
  {
    key: "singleSpot",
    name: "Single Spot",
    bestFor: [
      "standard local advertisers",
      "home services",
      "professional services",
      "health/wellness",
      "auto",
      "real estate/homeowner services",
    ],
    includes: [
      "standard print placement",
      "digital business landing page",
      "QR destination",
      "offer/coupon placement",
      "city page listing",
      "renewal option",
    ],
    price: "Launch price: TBD",
    cta: "Ask about single spot",
  },
  {
    key: "doubleSpot",
    name: "Double Spot",
    bestFor: [
      "businesses that want stronger visibility",
      "high-ticket services",
      "businesses with several services or a strong visual offer",
    ],
    includes: [
      "larger print placement",
      "expanded design presence",
      "digital landing page",
      "offer/coupon placement",
      "priority consideration",
    ],
    price: "Launch price: TBD",
    cta: "Ask about double spot",
  },
  {
    key: "quadSponsor",
    name: "Quad Sponsor",
    bestFor: [
      "major sponsors",
      "high-value categories",
      "businesses trying to dominate locally",
      "annual or recurring advertisers",
    ],
    includes: [
      "premium print placement",
      "dominant design presence",
      "digital landing page",
      "priority position",
      "possible Pick of the Week credit",
      "possible social promotion credit",
    ],
    price: "Call for availability",
    cta: "Ask about sponsor spot",
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
