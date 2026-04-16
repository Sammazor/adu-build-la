/**
 * ADU model catalog data for ADU Build LA.
 *
 * Serves as the data layer for the /adu-models pages.
 * Structure maps 1:1 to a future `AduModel` Prisma model.
 * To migrate: replace getAllModels() / getModelBySlug() with Prisma queries —
 * no page template changes needed.
 */

export type ModelType = "detached" | "garage-conversion";

export interface AduModelSpec {
  sqFt: number;
  beds: number | "Studio";
  baths: number;
  floors: number;
  ceilingHeight: string;
}

export interface AduModelFeatureGroup {
  category: string;
  items: string[];
}

export interface AduModelFAQ {
  q: string;
  a: string;
}

export interface AduModelData {
  // ── Identity ────────────────────────────────────────────────────────────
  slug: string;
  name: string;
  tagline: string;
  fullPath: string;
  modelType: ModelType;
  badge?: string; // e.g. "Most Popular", "Best Value"

  // ── SEO ─────────────────────────────────────────────────────────────────
  seoTitle: string;
  seoDescription: string;

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroHeading: string;
  heroSubheading: string;

  // ── Specs ────────────────────────────────────────────────────────────────
  specs: AduModelSpec;

  // ── Ideal use cases ──────────────────────────────────────────────────────
  idealForHeading: string;
  idealForBody: string;
  idealForItems: string[];

  // ── Features / inclusions ────────────────────────────────────────────────
  featureGroups: AduModelFeatureGroup[];

  // ── Pricing ──────────────────────────────────────────────────────────────
  startingFrom: string;  // display string e.g. "$150,000"
  startingFromNote: string;

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faqs: AduModelFAQ[];

  // ── Tags (for future filtering) ──────────────────────────────────────────
  tags: string[];
}

// ─── Model data ───────────────────────────────────────────────────────────────

const ADU_MODELS: AduModelData[] = [
  // ── Studio 400 ───────────────────────────────────────────────────────────
  {
    slug: "studio-400",
    name: "Studio 400",
    tagline: "A compact, high-efficiency studio designed to maximize rental yield on any LA lot.",
    fullPath: "/adu-models/studio-400",
    modelType: "detached",

    seoTitle: "Studio 400 ADU Model | ADU Build LA",
    seoDescription:
      "The Studio 400 is a 400 sq ft detached ADU designed for maximum rental income in Los Angeles. Starting from $150,000. Full design, permitting, and construction included.",

    heroHeading: "Studio 400",
    heroSubheading:
      "400 sq ft of thoughtfully planned living space. The Studio 400 is engineered for rental income — a private, self-contained unit that commands strong LA rents starting from $1,800/month.",

    specs: {
      sqFt: 400,
      beds: "Studio",
      baths: 1,
      floors: 1,
      ceilingHeight: "9 ft",
    },

    idealForHeading: "Who Is the Studio 400 Designed For?",
    idealForBody:
      "The Studio 400 is the most popular entry point for Los Angeles homeowners focused on maximizing rental yield per dollar invested. Its compact footprint fits on lots where a larger unit wouldn't clear setbacks — making it buildable on a wider range of properties across LA County.",
    idealForItems: [
      "Homeowners prioritizing rental income return on investment",
      "Lots with limited rear yard depth or tight side setbacks",
      "Properties that need a fast, lower-cost ADU path",
      "Short-term or mid-term furnished rental use cases",
      "Single occupant — student, young professional, or remote worker",
    ],

    featureGroups: [
      {
        category: "Floor Plan",
        items: [
          "Open-concept living and sleeping area",
          "Full-size kitchen with island or peninsula counter",
          "Full bathroom with shower and vanity",
          "Dedicated entry — private and separate from main house",
          "9-foot ceilings to maximize the sense of space",
          "Covered entry porch or small covered patio (optional)",
        ],
      },
      {
        category: "Construction Inclusions",
        items: [
          "Engineered slab foundation or raised floor system",
          "Exterior framing, sheathing, and weather barrier",
          "Stucco or fiber cement exterior (to match primary residence)",
          "Composition shingle or flat TPO roof system",
          "Dual-pane vinyl windows throughout",
          "Exterior door with deadbolt — separate from main house",
        ],
      },
      {
        category: "Interior Finishes",
        items: [
          "LVP flooring throughout (waterproof, durable)",
          "Shaker-style kitchen cabinetry with soft-close hardware",
          "Quartz or solid-surface kitchen countertops",
          "Tile shower surround and tile bathroom floor",
          "LED recessed lighting throughout",
          "Interior paint — two colors standard (walls + trim)",
        ],
      },
      {
        category: "Systems",
        items: [
          "Mini-split HVAC (heating and cooling)",
          "200A sub-panel with dedicated electrical service",
          "Tankless water heater",
          "In-unit washer/dryer hookups (stackable)",
          "Separate gas or electric utility metering available",
          "CAT6 and coax rough-in for internet and cable",
        ],
      },
    ],

    startingFrom: "$150,000",
    startingFromNote:
      "All-inclusive of architectural design, engineering, permit fees, and full construction. Final price depends on site conditions and selected finish tier.",

    faqs: [
      {
        q: "Can the Studio 400 be built on my lot?",
        a: "Most single-family lots in Los Angeles and the surrounding cities can accommodate the Studio 400. Its 400 sq ft footprint clears standard 4 ft rear and side setbacks on the majority of LA-area lots. We confirm buildability as part of the free property assessment.",
      },
      {
        q: "How much can I rent the Studio 400 for in Los Angeles?",
        a: "In most LA neighborhoods, a well-finished Studio 400 ADU achieves $1,800–$2,600/month on a long-term lease. In premium areas like Santa Monica, Culver City, or Silverlake, rents of $2,400–$3,000+ are common. Annual rental income of $22,000–$36,000 is a realistic target.",
      },
      {
        q: "How long does it take to build a Studio 400?",
        a: "Permitting typically takes 8–16 weeks depending on jurisdiction. Construction takes approximately 14–18 weeks after permit issuance. Total timeline from design start to move-in is typically 9–12 months.",
      },
      {
        q: "Can I customize the Studio 400 layout or finishes?",
        a: "Yes. Every ADU Build LA project is custom — the Studio 400 is a starting point, not a prefab kit. We can adjust the layout, finish selections, exterior materials, and optional features to suit your property and preferences.",
      },
    ],

    tags: ["studio", "detached", "rental", "small-lot"],
  },

  // ── 1 Bed 500 ────────────────────────────────────────────────────────────
  {
    slug: "1-bed-500",
    name: "1 Bed 500",
    tagline: "A complete one-bedroom ADU in 500 sq ft — private, efficient, and built for strong LA rental demand.",
    fullPath: "/adu-models/1-bed-500",
    modelType: "detached",

    seoTitle: "1 Bed 500 ADU Model | ADU Build LA",
    seoDescription:
      "The 1 Bed 500 is a 500 sq ft one-bedroom detached ADU built for Los Angeles rental income. Starting from $165,000. Full design, permits, and construction.",

    heroHeading: "1 Bed 500",
    heroSubheading:
      "A private one-bedroom unit in 500 sq ft — the most common ADU footprint in LA. Dedicated bedroom, full kitchen, in-unit laundry, and a separate entrance. Starting from $165,000.",

    specs: {
      sqFt: 500,
      beds: 1,
      baths: 1,
      floors: 1,
      ceilingHeight: "9 ft",
    },

    idealForHeading: "Who Is the 1 Bed 500 Designed For?",
    idealForBody:
      "The 1 Bed 500 hits the sweet spot for Los Angeles rental income. A dedicated bedroom commands meaningfully higher rents than a studio at a modest cost premium — and appeals to the widest renter pool: couples, young professionals, graduate students, and remote workers who need a private sleeping space.",
    idealForItems: [
      "Homeowners seeking the best balance of cost and rental income",
      "Long-term tenants who want a dedicated bedroom",
      "Properties with standard rear yard space",
      "Family members who need their own private living space",
      "Investors focused on the most in-demand ADU rental type in LA",
    ],

    featureGroups: [
      {
        category: "Floor Plan",
        items: [
          "Private bedroom — fully enclosed, separate from living area",
          "Open-plan living and dining area",
          "Full kitchen with dedicated counter workspace",
          "Full bathroom with tub/shower combo or walk-in shower",
          "Private entry with covered porch",
          "Linen closet and bedroom closet with sliding doors",
        ],
      },
      {
        category: "Construction Inclusions",
        items: [
          "Engineered slab or raised foundation per site conditions",
          "Wood-framed walls with R-15 insulation",
          "Stucco, fiber cement, or lap siding exterior",
          "Composition or flat membrane roof system",
          "Dual-pane vinyl windows and sliding glass door to patio",
          "Dedicated exterior address and lighting",
        ],
      },
      {
        category: "Interior Finishes",
        items: [
          "LVP flooring in main areas, tile in bath",
          "Shaker kitchen cabinetry with quartz counters",
          "Tile backsplash in kitchen",
          "Tiled shower or tub surround",
          "Recessed LED lighting throughout",
          "Interior paint — two-tone standard",
        ],
      },
      {
        category: "Systems",
        items: [
          "Multi-zone mini-split HVAC",
          "200A dedicated sub-panel",
          "Tankless on-demand water heater",
          "In-unit washer/dryer hookups (stackable or side-by-side)",
          "Separate metering available on request",
          "Pre-wired for internet, cable, and smart home",
        ],
      },
    ],

    startingFrom: "$165,000",
    startingFromNote:
      "All-inclusive of design, engineering, permits, and full construction. Final price varies by site conditions, finish tier, and any custom additions.",

    faqs: [
      {
        q: "What rents does a 1-bedroom ADU achieve in Los Angeles?",
        a: "In most Los Angeles neighborhoods, a well-finished 1-bedroom ADU rents for $2,200–$3,200/month on a long-term lease. In premium markets like Santa Monica, Culver City, or West Hollywood, $3,000–$4,000/month is achievable. Annual gross income of $26,000–$48,000 is realistic.",
      },
      {
        q: "What is the difference between the 1 Bed 500 and the 1 Bed 650?",
        a: "Both are one-bedroom, one-bath units, but the 650 adds approximately 150 sq ft to the living area and kitchen — creating a more spacious feel that appeals to longer-term tenants and commands higher rents. The 500 is the better value play for pure yield; the 650 suits homeowners who want the unit to feel genuinely generous.",
      },
      {
        q: "Can I add a small outdoor patio to the 1 Bed 500?",
        a: "Yes. A covered patio or deck is a popular addition that improves tenant quality and rental income. We incorporate patios into the design and pricing during the initial scoping phase.",
      },
      {
        q: "How does the 1 Bed 500 compare to a JADU?",
        a: "A JADU (Junior ADU) must be created within your existing home's footprint and is limited to 500 sq ft. The 1 Bed 500 is a fully detached structure with its own foundation, systems, and exterior — offering complete independence from the main house. JADUs cost less but share walls and potentially utilities with the primary residence.",
      },
    ],

    tags: ["1-bedroom", "detached", "rental", "family"],
  },

  // ── 1 Bed 650 ────────────────────────────────────────────────────────────
  {
    slug: "1-bed-650",
    name: "1 Bed 650",
    tagline: "A spacious one-bedroom ADU with room to breathe — designed to attract quality long-term tenants.",
    fullPath: "/adu-models/1-bed-650",
    modelType: "detached",
    badge: "Most Popular",

    seoTitle: "1 Bed 650 ADU Model — Most Popular | ADU Build LA",
    seoDescription:
      "The 1 Bed 650 is ADU Build LA's most popular model — a spacious 650 sq ft one-bedroom ADU for Los Angeles. Starting from $195,000. Design, permits, and construction included.",

    heroHeading: "1 Bed 650",
    heroSubheading:
      "Our most-requested model. A genuinely spacious one-bedroom ADU at 650 sq ft — with enough room for a proper living area, full kitchen, and a bedroom that doesn't feel like an afterthought. Starting from $195,000.",

    specs: {
      sqFt: 650,
      beds: 1,
      baths: 1,
      floors: 1,
      ceilingHeight: "9–10 ft",
    },

    idealForHeading: "Who Is the 1 Bed 650 Designed For?",
    idealForBody:
      "The 1 Bed 650 is our most popular model because it gives renters genuine living space — not just a functional box. At 650 sq ft, there's room for a real kitchen, a proper dining area, a comfortable living room, and a bedroom that feels private. That quality of space attracts longer-term tenants, commands higher rents, and generates lower turnover costs over time.",
    idealForItems: [
      "Homeowners who want the highest-quality tenant profile",
      "Properties where lot size allows a slightly larger footprint",
      "Long-term rental strategies with minimized turnover",
      "Family members who will occupy the unit longer-term",
      "Homeowners who may eventually use the ADU themselves",
    ],

    featureGroups: [
      {
        category: "Floor Plan",
        items: [
          "Spacious open-plan living and dining — room for full sofa + dining table",
          "Dedicated kitchen with island or full peninsula",
          "Private bedroom with walk-in or large reach-in closet",
          "Full bathroom — walk-in shower standard, soaking tub optional",
          "Dedicated private entry with covered porch",
          "Optional den or home office nook off the living area",
        ],
      },
      {
        category: "Construction Inclusions",
        items: [
          "Engineered foundation system per site soils report",
          "2×6 exterior walls with R-21 insulation",
          "Premium fiber cement or stucco exterior finish",
          "Architectural composition or low-slope membrane roof",
          "Oversized dual-pane windows — enhanced natural light",
          "Sliding or French door to rear patio",
        ],
      },
      {
        category: "Interior Finishes",
        items: [
          "Wide-plank LVP flooring throughout",
          "Shaker or flat-panel kitchen cabinetry to ceiling",
          "Waterfall quartz countertops in kitchen",
          "Full-height tile shower in bathroom",
          "Floating vanity with undermount sink",
          "Coved LED ceilings or designer pendant lighting",
        ],
      },
      {
        category: "Systems",
        items: [
          "Two-zone mini-split HVAC (living + bedroom)",
          "200A sub-panel — capacity for EV charger rough-in",
          "Tankless water heater with recirculation pump",
          "Full-size in-unit washer/dryer hookups",
          "Separate utility metering standard at this size",
          "Smart home pre-wire: thermostat, locks, doorbell camera",
        ],
      },
    ],

    startingFrom: "$195,000",
    startingFromNote:
      "All-inclusive of design, engineering, permits, and full construction. Final price depends on site conditions, finish tier, and optional upgrades.",

    faqs: [
      {
        q: "Why is the 1 Bed 650 the most popular ADU model?",
        a: "It's the model where rental income, construction cost, and tenant quality intersect most favorably. At 650 sq ft, renters get genuine living space — which means longer leases, lower turnover, and higher-quality tenants. The incremental cost over a 500 sq ft unit is modest relative to the rental income improvement.",
      },
      {
        q: "What rental income can a 1 Bed 650 generate in LA?",
        a: "In most Los Angeles markets, a well-finished 1 Bed 650 achieves $2,600–$3,600/month on a long-term lease. In higher-demand areas, $3,500–$4,500+/month is common. Annual gross rental income of $31,000–$54,000 is realistic for most LA neighborhoods.",
      },
      {
        q: "Can the 1 Bed 650 be two stories?",
        a: "Yes. For properties where a two-story footprint better suits the lot — for example, preserving backyard space — we can design the 1 Bed 650 as a two-story structure, spreading the square footage vertically. Height and setback rules vary by jurisdiction and we assess this during the property evaluation.",
      },
      {
        q: "What's included in the 'Most Popular' designation?",
        a: "It's simply the model our clients select most often after the free property assessment. The combination of livability, rental income potential, and construction value makes it the most common recommendation from our design team for standard LA lots.",
      },
    ],

    tags: ["1-bedroom", "detached", "rental", "most-popular", "spacious"],
  },

  // ── 2 Bed 750 ────────────────────────────────────────────────────────────
  {
    slug: "2-bed-750",
    name: "2 Bed 750",
    tagline: "Two private bedrooms, maximum rental income, and genuine multigenerational living space.",
    fullPath: "/adu-models/2-bed-750",
    modelType: "detached",

    seoTitle: "2 Bed 750 ADU Model | ADU Build LA",
    seoDescription:
      "The 2 Bed 750 is a 750 sq ft two-bedroom detached ADU for Los Angeles — designed for multigenerational living or maximum rental income. Starting from $230,000.",

    heroHeading: "2 Bed 750",
    heroSubheading:
      "Two private bedrooms in 750 sq ft. The 2 Bed 750 is the top choice for multigenerational families and investors seeking maximum rental income from a single ADU. Starting from $230,000.",

    specs: {
      sqFt: 750,
      beds: 2,
      baths: 1,
      floors: 1,
      ceilingHeight: "9 ft",
    },

    idealForHeading: "Who Is the 2 Bed 750 Designed For?",
    idealForBody:
      "The 2 Bed 750 serves two distinct homeowner goals: families who want a complete independent living space for parents, adult children, or in-laws; and investors who want to maximize monthly rental income from a single ADU. Two bedrooms unlock a meaningfully larger renter pool — couples with a child, professional roommates, or a family needing a home office — and commands rents $600–$1,000/month higher than comparable one-bedroom units.",
    idealForItems: [
      "Multigenerational families — parents, in-laws, or adult children",
      "Investors seeking maximum monthly rental income per lot",
      "Properties with larger rear yard footprints",
      "Roommate rentals — two separate bedrooms on one lease",
      "Families needing a home office as the second bedroom",
    ],

    featureGroups: [
      {
        category: "Floor Plan",
        items: [
          "Two private bedrooms — both fully enclosed with closets",
          "Open living and dining room — separate from bedroom wing",
          "Full kitchen with dedicated pantry space",
          "Full bathroom with tub/shower combo",
          "Hallway separation between bedrooms and living areas",
          "Private entry porch and dedicated outdoor space",
        ],
      },
      {
        category: "Construction Inclusions",
        items: [
          "Engineered foundation — slab or raised per site conditions",
          "2×6 exterior wall framing with R-21 insulation",
          "Stucco or fiber cement exterior to match primary residence",
          "Class A roofing system (composition or low-slope membrane)",
          "Dual-pane windows — larger units in living and dining areas",
          "Dedicated exterior entry with lighting and address numbers",
        ],
      },
      {
        category: "Interior Finishes",
        items: [
          "LVP flooring in living areas, carpet or LVP in bedrooms",
          "Full kitchen with shaker cabinetry and quartz counters",
          "Tile shower/tub surround and tile bathroom floor",
          "Recessed LED lighting throughout",
          "Closet systems in both bedrooms",
          "Interior paint — standard two-color package",
        ],
      },
      {
        category: "Systems",
        items: [
          "Multi-zone mini-split HVAC — coverage for all rooms",
          "200A sub-panel with EV charger rough-in",
          "Tankless water heater",
          "Full-size in-unit washer/dryer hookups",
          "Separate utility metering standard",
          "Pre-wired for internet, security camera, and smart home",
        ],
      },
    ],

    startingFrom: "$230,000",
    startingFromNote:
      "All-inclusive of design, engineering, permits, and full construction. Final price depends on site conditions, finish tier, and any custom requests.",

    faqs: [
      {
        q: "What rental income does a 2-bedroom ADU achieve in Los Angeles?",
        a: "Two-bedroom ADUs in Los Angeles typically rent for $2,800–$4,200/month on a long-term lease. In higher-demand markets — Santa Monica, Culver City, West Hollywood — $4,000–$5,500/month is achievable. Annual gross income of $34,000–$66,000 makes the 2 Bed 750 the highest income-producing model we offer.",
      },
      {
        q: "Can the 2 Bed 750 be built as a two-story?",
        a: "Yes. For lots where preserving backyard space is important, the 2 Bed 750 can be designed as a two-story structure — 375 sq ft per floor — minimizing the footprint while maintaining all the living space. Two-story configurations are subject to height limits and setback rules that vary by city, which we assess during the property evaluation.",
      },
      {
        q: "Is the 2 Bed 750 good for multigenerational use?",
        a: "It's one of our most popular choices for multigenerational households. Two bedrooms allow a couple or two family members to live comfortably with separation between sleeping and living areas. A dedicated entry — completely separate from the main house — ensures privacy for both households.",
      },
      {
        q: "What's the difference between the 2 Bed 750 and a full ADU with 2 baths?",
        a: "The 2 Bed 750 includes one full bath. For a two-bathroom configuration, we typically recommend scaling to 850–1,000 sq ft to keep the proportions livable. We can scope a custom two-bed, two-bath plan during your property assessment if that better fits your goals.",
      },
    ],

    tags: ["2-bedroom", "detached", "multigenerational", "rental", "max-income"],
  },

  // ── Garage Conversion 450 ─────────────────────────────────────────────────
  {
    slug: "garage-conversion-450",
    name: "Garage Conversion 450",
    tagline: "Convert your existing garage into a fully permitted, income-generating ADU — the fastest, most affordable path.",
    fullPath: "/adu-models/garage-conversion-450",
    modelType: "garage-conversion",
    badge: "Best Value",

    seoTitle: "Garage Conversion 450 ADU Model | ADU Build LA",
    seoDescription:
      "Convert your garage into a 450 sq ft legal ADU. Fastest timeline, lowest cost, fully permitted. Starting from $95,000. Design, permits, and construction included.",

    heroHeading: "Garage Conversion 450",
    heroSubheading:
      "Your existing garage is your fastest, most affordable path to a legal ADU. The Garage Conversion 450 transforms a standard two-car garage into a complete 450 sq ft living unit — fully permitted, fully finished, and ready to rent. Starting from $95,000.",

    specs: {
      sqFt: 450,
      beds: 1,
      baths: 1,
      floors: 1,
      ceilingHeight: "9–10 ft (vaulted ceiling option)",
    },

    idealForHeading: "Who Is the Garage Conversion 450 Designed For?",
    idealForBody:
      "If you have a detached garage, you already have the foundation and structure of your ADU. A garage conversion leverages that existing footprint to dramatically reduce both cost and construction time compared to a new detached build. It's the most common first ADU for Los Angeles homeowners — and often the most financially efficient.",
    idealForItems: [
      "Homeowners with an existing detached garage (standard 2-car size)",
      "Anyone who wants the fastest possible ADU timeline",
      "Investors looking for the most affordable ADU return on investment",
      "Properties where a new rear structure isn't feasible",
      "First-time ADU owners testing the rental income model",
    ],

    featureGroups: [
      {
        category: "Conversion Scope",
        items: [
          "Structural assessment and reinforcement of existing garage framing",
          "New or upgraded foundation where required by site conditions",
          "Garage door opening converted to window wall or sliding door",
          "R-21 insulation in walls, R-38 in ceiling (new framing as needed)",
          "All new interior framing for bedroom, bathroom, and kitchen",
          "New exterior finish to match or complement primary residence",
        ],
      },
      {
        category: "Interior Build-Out",
        items: [
          "One private bedroom — fully enclosed with closet",
          "Full bathroom — shower, vanity, and toilet",
          "Full kitchen with cabinetry, counters, and appliances",
          "Open living area from converted garage bay",
          "Vaulted ceiling option where existing roof pitch allows",
          "Private entry — separate from main house",
        ],
      },
      {
        category: "Interior Finishes",
        items: [
          "LVP flooring throughout (covers concrete slab)",
          "Shaker kitchen cabinetry with quartz or laminate counters",
          "Tile shower surround and tile bathroom floor",
          "Recessed LED lighting throughout",
          "Interior paint — standard two-color package",
          "Closet systems and interior doors throughout",
        ],
      },
      {
        category: "Systems",
        items: [
          "Single-zone mini-split HVAC (heating and cooling)",
          "New sub-panel from main house — sized for full living use",
          "Tankless water heater (new installation)",
          "In-unit washer/dryer hookups",
          "New plumbing rough-in for kitchen and bathroom",
          "Internet, cable, and electrical outlets to modern code",
        ],
      },
    ],

    startingFrom: "$95,000",
    startingFromNote:
      "Starting price reflects a standard 2-car detached garage in good structural condition. All-inclusive of design, engineering, permits, and full construction. Properties requiring significant structural repair or upgrades may increase the starting price.",

    faqs: [
      {
        q: "Does my garage qualify for conversion?",
        a: "Most standard detached garages in Los Angeles (roughly 20×20 ft or larger) qualify for ADU conversion. Key factors are the existing structure's condition, the garage's setback from property lines, and whether utilities can be reasonably extended. We assess all of this during the free property evaluation — at no cost to you.",
      },
      {
        q: "How is a garage conversion ADU different from building a new ADU?",
        a: "A garage conversion uses your existing structure — foundation, framing, and roof — as the starting point. This eliminates the most expensive phase of new construction (site prep, foundation, framing) and can reduce total project cost by 30–45% compared to a new detached build. Construction timelines are also shorter: typically 10–14 weeks post-permit versus 16–20 weeks for new construction.",
      },
      {
        q: "Will I lose my garage parking if I convert?",
        a: "Yes — converting the garage means losing it as a parking space. California state law eliminated the requirement to replace that parking, so no new parking spot is required. Most Los Angeles homeowners find the rental income from the ADU far outweighs the convenience of the garage. You can still build a carport or covered parking elsewhere on the property if desired.",
      },
      {
        q: "How long does a garage conversion take from start to finish?",
        a: "From the start of design to move-in, most garage conversions take 6–9 months total. Design and permitting typically take 8–14 weeks (often faster than new construction in many cities). Construction after permit issuance takes approximately 10–14 weeks. It is the fastest ADU path we offer.",
      },
      {
        q: "What rental income can I expect from a garage conversion ADU?",
        a: "A well-finished 450 sq ft one-bedroom garage conversion ADU rents for $1,800–$2,800/month in most Los Angeles neighborhoods. In higher-demand markets, $2,500–$3,200/month is achievable. At a starting construction cost of $95,000, annual gross rental income of $22,000–$34,000 creates a very strong investment return.",
      },
    ],

    tags: ["garage-conversion", "1-bedroom", "rental", "best-value", "affordable"],
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getAllModels(): AduModelData[] {
  return ADU_MODELS;
}

export function getModelBySlug(slug: string): AduModelData | undefined {
  return ADU_MODELS.find((m) => m.slug === slug);
}

export function getAllModelSlugs(): { slug: string }[] {
  return ADU_MODELS.map((m) => ({ slug: m.slug }));
}

/**
 * Returns models relevant to a given service slug.
 * Used for cross-linking from service detail pages to ADU model pages.
 *
 * CMS-migration note: replace with a Prisma many-to-many relation query:
 *   prisma.aduModel.findMany({ where: { services: { some: { slug: serviceSlug } } } })
 */
const SERVICE_TO_MODEL_SLUGS: Record<string, string[]> = {
  "garage-conversion": ["garage-conversion-450"],
  "adu-construction": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750"],
  "adu-design": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750", "garage-conversion-450"],
  "permitting": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750", "garage-conversion-450"],
  "project-management": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750", "garage-conversion-450"],
};

export function getModelsForService(serviceSlug: string, limit = 3): AduModelData[] {
  const slugs = SERVICE_TO_MODEL_SLUGS[serviceSlug];
  if (!slugs) return ADU_MODELS.slice(0, limit);
  return ADU_MODELS.filter((m) => slugs.includes(m.slug)).slice(0, limit);
}
