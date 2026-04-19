export interface SitePageDefaults {
  heroHeading?: string;
  heroSubheading?: string;
  heroCtaPrimaryLabel?: string;
  heroCtaPrimaryUrl?: string;
  heroCtaSecondaryLabel?: string;
  heroCtaSecondaryUrl?: string;
  heroImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const SITE_PAGE_DEFAULTS: Record<string, SitePageDefaults> = {
  homepage: {
    heroHeading: "Los Angeles ADU Design, Permitting & Construction",
    heroSubheading:
      "We're an ADU-only contractor — every project we take is an accessory dwelling unit. Full-service design, permitting, and construction under one contract, starting from $150,000.",
    heroCtaPrimaryLabel: "Get a Free Property Assessment",
    heroCtaPrimaryUrl: "/estimate",
    heroCtaSecondaryLabel: "See Completed Projects",
    heroCtaSecondaryUrl: "/projects",
    seoTitle: "ADU Design & Build Specialists in Los Angeles",
    seoDescription:
      "Los Angeles ADU contractors. Full-service ADU design, permitting, and construction starting from $150,000. Licensed, insured, 200+ ADUs built across LA County. Free property assessment.",
  },
  "services-index": {
    heroHeading: "ADU Services in Los Angeles",
    heroSubheading:
      "We handle every aspect of your ADU project — design, permitting, and construction — under one roof. Starting from $150,000.",
    heroCtaPrimaryLabel: "Get a Free Estimate",
    heroCtaPrimaryUrl: "/estimate",
    seoTitle: "ADU Services in Los Angeles",
    seoDescription:
      "Full-service ADU design, permitting, and construction in Los Angeles. Explore our services and get a free estimate. ADUs starting from $150,000.",
  },
  "locations-index": {
    heroHeading: "ADU Services Across Los Angeles County",
    heroSubheading:
      "We serve homeowners throughout Los Angeles County. Find your city for local permitting guidance, pricing expectations, and a free property assessment.",
    heroCtaPrimaryLabel: "Get a Free Estimate",
    heroCtaPrimaryUrl: "/estimate",
    seoTitle: "ADU Services Across Los Angeles County",
    seoDescription:
      "ADU Build LA serves homeowners throughout Los Angeles County. Find your city for local permitting guidance, pricing expectations, and a free property assessment.",
  },
  contact: {
    seoTitle: "Contact ADU Build LA",
    seoDescription:
      "Contact ADU Build LA for ADU design, permitting, and construction services in Los Angeles. Get a free consultation within 1 business day.",
  },
  estimate: {
    seoTitle: "Request a Free ADU Estimate",
    seoDescription:
      "Request a free ADU cost estimate for your Los Angeles property. We'll assess your site and provide a detailed all-inclusive quote within 1 business day.",
  },
  "build-your-adu": {
    seoTitle: "Build Your ADU — Free ADU Planner & Cost Estimator",
    seoDescription:
      "Answer 9 quick questions and get a personalized ADU plan for your Los Angeles property — recommended ADU type, size range, budget estimate, and next steps. Free, no obligation.",
  },
  projects: {
    heroHeading: "Real ADU Projects Across Los Angeles",
    heroSubheading:
      "Every project here was designed, permitted, and built by our team. Browse completed garage conversions, detached ADUs, and Junior ADUs.",
    heroCtaPrimaryLabel: "Start Your Project",
    heroCtaPrimaryUrl: "/estimate",
    seoTitle: "ADU Projects — Portfolio of Completed ADUs",
    seoDescription:
      "Browse our completed ADU projects across Los Angeles. Garage conversions, detached ADUs, Junior ADUs — real results from real properties.",
  },
  "adu-models": {
    heroHeading: "ADU Models for Los Angeles Homeowners",
    heroSubheading:
      "Browse our pre-designed ADU floor plans — optimized for LA lot sizes, zoning rules, and rental income. Studio through 2-bedroom, starting from $95,000.",
    heroCtaPrimaryLabel: "Get a Free Estimate",
    heroCtaPrimaryUrl: "/estimate",
    seoTitle: "ADU Models — Floor Plans & Pricing",
    seoDescription:
      "Pre-designed ADU floor plans optimized for Los Angeles. Studio through 2-bedroom, starting from $95,000. Fully customizable. Get a free estimate.",
  },
};
