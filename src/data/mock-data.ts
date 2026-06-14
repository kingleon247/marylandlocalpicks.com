export type City = {
  name: string;
  slug: string;
  state: string;
  status: "live" | "coming-soon";
  description: string;
};

export type Category = {
  id: string;
  name: string;
  eyebrow: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  context: string;
};

export type Business = {
  name: string;
  slug: string;
  categoryId: string;
  initials: string;
  accent: "clay" | "gold" | "sage" | "blue" | "plum" | "rose";
  shortDescription: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  website: string;
  address: string;
  featured: boolean;
  services: string[];
  about: string;
  testimonials: Testimonial[];
  galleryLabels: string[];
  hours: { day: string; time: string }[];
};

export type Offer = {
  businessSlug: string;
  label: string;
  title: string;
  details: string;
  code?: string;
};

export type PickOfTheWeek = {
  citySlug: string;
  businessSlug: string;
  kicker: string;
  headline: string;
  story: string;
};

export const cities: City[] = [
  {
    name: "Catonsville",
    slug: "catonsville",
    state: "MD",
    status: "live",
    description:
      "Our first printed card and digital guide, centered on the shops, services, and gathering places along Frederick Road and beyond.",
  },
  {
    name: "Ellicott City",
    slug: "ellicott-city",
    state: "MD",
    status: "coming-soon",
    description: "A future edition for historic Main Street and nearby neighborhoods.",
  },
  {
    name: "Arbutus",
    slug: "arbutus",
    state: "MD",
    status: "coming-soon",
    description: "A future edition celebrating local standbys and new favorites.",
  },
];

export const categories: Category[] = [
  {
    id: "eat-drink",
    name: "Eat & Drink",
    eyebrow: "Coffee, dinner, and something good to take home",
  },
  {
    id: "home-services",
    name: "Home & Services",
    eyebrow: "Trusted help from people who know the neighborhood",
  },
  {
    id: "shop-explore",
    name: "Shop & Explore",
    eyebrow: "Independent finds and reasons to get out",
  },
];

export const businesses: Business[] = [
  {
    name: "Frederick Road Coffee",
    slug: "frederick-road-coffee",
    categoryId: "eat-drink",
    initials: "FR",
    accent: "clay",
    shortDescription:
      "Small-batch coffee, flaky pastries, and a sunny corner made for lingering.",
    tagline: "Your neighborhood cup, roasted with care.",
    phone: "+14105550118",
    phoneDisplay: "(410) 555-0118",
    email: "hello@frederickroadcoffee.example",
    website: "https://example.com",
    address: "814 Frederick Road, Catonsville, MD 21228",
    featured: true,
    services: [
      "Espresso and pour-over coffee",
      "Fresh pastries and breakfast",
      "Whole-bean coffee",
      "Small event catering",
    ],
    about:
      "Frederick Road Coffee is a fictional neighborhood cafe created for this preview. The concept is simple: thoughtful coffee, warm service, and a room that feels easy to return to.",
    testimonials: [
      {
        quote:
          "The kind of place where the barista remembers your order and your Tuesday starts a little better.",
        name: "Maya R.",
        context: "Catonsville neighbor",
      },
    ],
    galleryLabels: ["Morning light", "The pastry case", "Fresh pour-over"],
    hours: [
      { day: "Mon-Fri", time: "6:30am-5pm" },
      { day: "Saturday", time: "7am-5pm" },
      { day: "Sunday", time: "7am-3pm" },
    ],
  },
  {
    name: "Patapsco Provisions",
    slug: "patapsco-provisions",
    categoryId: "eat-drink",
    initials: "PP",
    accent: "gold",
    shortDescription:
      "A well-stocked market for picnic lunches, local pantry staples, and weeknight saves.",
    tagline: "Good provisions for everyday Maryland life.",
    phone: "+14105550142",
    phoneDisplay: "(410) 555-0142",
    email: "market@patapscoprovisions.example",
    website: "https://example.com",
    address: "728 Frederick Road, Catonsville, MD 21228",
    featured: false,
    services: [
      "Prepared foods",
      "Maryland-made pantry goods",
      "Cheese and charcuterie",
      "Picnic baskets",
    ],
    about:
      "Patapsco Provisions is a fictional specialty market built around local makers, practical meals, and the pleasure of a properly packed picnic.",
    testimonials: [
      {
        quote: "My first stop before a trail day and my backup plan for dinner.",
        name: "Jon D.",
        context: "Weekly customer",
      },
    ],
    galleryLabels: ["Local pantry", "Picnic counter", "Made in Maryland"],
    hours: [
      { day: "Tue-Sat", time: "9am-7pm" },
      { day: "Sunday", time: "10am-4pm" },
      { day: "Monday", time: "Closed" },
    ],
  },
  {
    name: "Main Street Hearth",
    slug: "main-street-hearth",
    categoryId: "eat-drink",
    initials: "MH",
    accent: "plum",
    shortDescription:
      "Seasonal plates, a thoughtful bar, and the sort of dining room that turns dinner into an occasion.",
    tagline: "Seasonal Maryland cooking, served with warmth.",
    phone: "+14105550164",
    phoneDisplay: "(410) 555-0164",
    email: "table@mainstreethearth.example",
    website: "https://example.com",
    address: "936 Frederick Road, Catonsville, MD 21228",
    featured: true,
    services: [
      "Dinner service",
      "Weekend brunch",
      "Private dining",
      "Seasonal cocktails",
    ],
    about:
      "Main Street Hearth is a fictional restaurant inspired by the generous, locally rooted dining rooms that make a town feel like home.",
    testimonials: [
      {
        quote:
          "Polished without feeling precious. We brought friends and stayed through dessert.",
        name: "Alicia T.",
        context: "Local diner",
      },
    ],
    galleryLabels: ["The dining room", "Seasonal supper", "Weekend brunch"],
    hours: [
      { day: "Tue-Thu", time: "5pm-9pm" },
      { day: "Fri-Sat", time: "5pm-10pm" },
      { day: "Sun-Mon", time: "Closed" },
    ],
  },
  {
    name: "Bloomsbury Home Co.",
    slug: "bloomsbury-home-co",
    categoryId: "home-services",
    initials: "BH",
    accent: "sage",
    shortDescription:
      "Practical interior styling, color consultations, and rooms that still feel like you.",
    tagline: "A more considered home, one room at a time.",
    phone: "+14105550187",
    phoneDisplay: "(410) 555-0187",
    email: "studio@bloomsburyhome.example",
    website: "https://example.com",
    address: "Catonsville, MD 21228",
    featured: true,
    services: [
      "In-home consultations",
      "Paint and color plans",
      "Room refresh packages",
      "Local sourcing",
    ],
    about:
      "Bloomsbury Home Co. is a fictional small design studio focused on useful rooms, durable choices, and homes that reflect the people living in them.",
    testimonials: [
      {
        quote:
          "We finally have a living room that works for real life and still looks pulled together.",
        name: "Kevin and Sam",
        context: "Catonsville homeowners",
      },
    ],
    galleryLabels: ["Room refresh", "Color story", "Local details"],
    hours: [
      { day: "Mon-Fri", time: "9am-5pm" },
      { day: "Saturday", time: "By appointment" },
      { day: "Sunday", time: "Closed" },
    ],
  },
  {
    name: "Catonsville Cycle & Trail",
    slug: "catonsville-cycle-trail",
    categoryId: "shop-explore",
    initials: "CT",
    accent: "blue",
    shortDescription:
      "Friendly bike service, useful gear, and local trail advice without the hard sell.",
    tagline: "More good miles, from Main Street to the trail.",
    phone: "+14105550209",
    phoneDisplay: "(410) 555-0209",
    email: "ride@catonsvillecycle.example",
    website: "https://example.com",
    address: "650 Frederick Road, Catonsville, MD 21228",
    featured: true,
    services: [
      "Bike tune-ups and repair",
      "Commuter and trail bikes",
      "Helmets and essentials",
      "Local route guidance",
    ],
    about:
      "Catonsville Cycle & Trail is a fictional independent bike shop for first rides, daily commuters, and experienced trail regulars alike.",
    testimonials: [
      {
        quote:
          "Clear advice, quick service, and no pressure to buy more bike than I needed.",
        name: "Chris W.",
        context: "Weekend rider",
      },
    ],
    galleryLabels: ["Repair bench", "Trail ready", "Community rides"],
    hours: [
      { day: "Tue-Fri", time: "10am-6pm" },
      { day: "Saturday", time: "9am-5pm" },
      { day: "Sun-Mon", time: "Closed" },
    ],
  },
  {
    name: "Beltway Bookshop",
    slug: "beltway-bookshop",
    categoryId: "shop-explore",
    initials: "BB",
    accent: "rose",
    shortDescription:
      "New releases, overlooked favorites, and a very good reason to browse another shelf.",
    tagline: "Good books, good company, no rush.",
    phone: "+14105550231",
    phoneDisplay: "(410) 555-0231",
    email: "books@beltwaybookshop.example",
    website: "https://example.com",
    address: "1012 Frederick Road, Catonsville, MD 21228",
    featured: false,
    services: [
      "New and used books",
      "Special orders",
      "Author events",
      "Book clubs",
    ],
    about:
      "Beltway Bookshop is a fictional independent bookstore with a lively front table, deep backlist shelves, and recommendations worth trusting.",
    testimonials: [
      {
        quote:
          "I walked in for one book and left with three excellent recommendations.",
        name: "Nina P.",
        context: "Regular browser",
      },
    ],
    galleryLabels: ["Staff picks", "Reading corner", "Author night"],
    hours: [
      { day: "Mon-Sat", time: "10am-7pm" },
      { day: "Sunday", time: "11am-5pm" },
    ],
  },
];

export const offers: Offer[] = [
  {
    businessSlug: "frederick-road-coffee",
    label: "Morning pick",
    title: "Pastry on us",
    details: "Enjoy a complimentary pastry with any two specialty drinks.",
    code: "LOCALMORNING",
  },
  {
    businessSlug: "bloomsbury-home-co",
    label: "Home refresh",
    title: "$40 off a color consultation",
    details: "A focused, in-home session to make the next paint decision easier.",
    code: "LOCALCOLOR",
  },
  {
    businessSlug: "catonsville-cycle-trail",
    label: "Trail ready",
    title: "Free safety check",
    details: "A quick brake, tire, and drivetrain check before your next ride.",
  },
];

export const picksOfTheWeek: PickOfTheWeek[] = [
  {
    citySlug: "catonsville",
    businessSlug: "main-street-hearth",
    kicker: "This week's table",
    headline: "A neighborhood dinner worth slowing down for.",
    story:
      "Main Street Hearth brings the best kind of polish to Frederick Road: thoughtful plates, easy hospitality, and a dining room that still feels local.",
  },
];

export function getBusinessBySlug(slug: string) {
  return businesses.find((business) => business.slug === slug);
}

export function getOfferForBusiness(slug: string) {
  return offers.find((offer) => offer.businessSlug === slug);
}
