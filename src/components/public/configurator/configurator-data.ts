// ─── Configurator types ───────────────────────────────────────────────────────

export type AduTypeId = "detached" | "garage-conversion" | "attached" | "jadu";
export type SqFtId = "under-400" | "400-550" | "550-750" | "750-1000" | "over-1000";
export type BedsId = "studio" | "1bed" | "2bed" | "3bed";
export type BathsId = "1" | "1h" | "2";
export type CeilingId = "8ft" | "9ft" | "10ft" | "vaulted";
export type KitchenId = "standard" | "upgraded" | "chef";
export type BathroomStyleId = "standard" | "spa" | "luxury";
export type ExteriorId = "stucco" | "modern" | "craftsman" | "farmhouse";
export type RoofId = "flat" | "gable" | "hip" | "shed";
export type WindowId = "standard" | "black-frame" | "floor-to-ceiling";
export type UseId = "rental" | "family" | "office" | "guest" | "personal";
export type BudgetId = "economy" | "standard" | "premium" | "luxury";
export type CityId = "los-angeles" | "santa-monica" | "culver-city" | "pasadena" | "glendale" | "other";

export interface ConfigChoice {
  id: string;
  label: string;
  sub?: string;
  badge?: string;
  accentColor?: string;
  preview?: string; // CSS gradient or color swatch
}

export interface ConfigStep {
  key: string;
  title: string;
  subtitle: string;
  type: "cards" | "cards-visual" | "chips";
  choices: ConfigChoice[];
  optional?: boolean;
}

export const STEPS: ConfigStep[] = [
  {
    key: "aduType",
    title: "What type of ADU?",
    subtitle: "Your lot and goals will narrow this down — choose the type that interests you most.",
    type: "cards",
    choices: [
      { id: "detached", label: "Detached ADU", sub: "New standalone structure in your backyard — most flexible and private", badge: "Most Popular" },
      { id: "garage-conversion", label: "Garage Conversion", sub: "Transform your existing garage — fastest path, lowest cost", badge: "Best Value" },
      { id: "attached", label: "Attached ADU", sub: "Addition to your home — shares a wall with the primary residence" },
      { id: "jadu", label: "Junior ADU (JADU)", sub: "Created inside your existing home — up to 500 sq ft, no new structure" },
    ],
  },
  {
    key: "sqFt",
    title: "How large?",
    subtitle: "Size drives the biggest portion of your budget. Most LA ADUs fall in the 400–750 sq ft range.",
    type: "cards",
    choices: [
      { id: "under-400", label: "Under 400 sq ft", sub: "Compact studio — highest ROI per dollar" },
      { id: "400-550", label: "400–550 sq ft", sub: "Studio or 1-bed — most common for rental income", badge: "Most Common" },
      { id: "550-750", label: "550–750 sq ft", sub: "Spacious 1-bed or efficient 2-bed" },
      { id: "750-1000", label: "750–1,000 sq ft", sub: "Full 2-bed with generous living area" },
      { id: "over-1000", label: "1,000+ sq ft", sub: "Premium 2–3 bed — custom design recommended" },
    ],
  },
  {
    key: "beds",
    title: "Bedroom count",
    subtitle: "More bedrooms expand your renter pool and increase monthly income — at a modest cost premium.",
    type: "cards",
    choices: [
      { id: "studio", label: "Studio", sub: "Open-plan living and sleeping — maximum affordability" },
      { id: "1bed", label: "1 Bedroom", sub: "Dedicated bedroom — highest rental demand in LA", badge: "Most Requested" },
      { id: "2bed", label: "2 Bedrooms", sub: "Two separate bedrooms — maximum income potential" },
      { id: "3bed", label: "3 Bedrooms", sub: "Larger family unit — custom scope required" },
    ],
  },
  {
    key: "baths",
    title: "Bathroom count",
    subtitle: "Most ADUs under 800 sq ft are designed with 1 full bath. Two baths suit 2-bed units.",
    type: "cards",
    choices: [
      { id: "1", label: "1 Full Bath", sub: "Standard for studios and 1-bedrooms" },
      { id: "1h", label: "1.5 Baths", sub: "Full bath + powder room — popular in 2-bed units" },
      { id: "2", label: "2 Full Baths", sub: "Best for 2–3 bed units targeting higher rents" },
    ],
  },
  {
    key: "ceiling",
    title: "Ceiling height",
    subtitle: "Ceiling height dramatically affects how spacious a smaller ADU feels — and affects resale value.",
    type: "cards",
    choices: [
      { id: "8ft", label: "8 ft Standard", sub: "Code minimum — most economical" },
      { id: "9ft", label: "9 ft", sub: "Noticeably more open — our most common spec", badge: "Recommended" },
      { id: "10ft", label: "10 ft", sub: "Premium feel — pairs well with large windows" },
      { id: "vaulted", label: "Vaulted / Cathedral", sub: "Dramatic open volume — garage conversions specialty" },
    ],
  },
  {
    key: "kitchen",
    title: "Kitchen style",
    subtitle: "Kitchen quality is the #1 factor tenants cite when choosing a rental. It also drives appraisal value.",
    type: "cards-visual",
    choices: [
      {
        id: "standard",
        label: "Standard",
        sub: "Shaker cabinetry · Laminate counters · Stainless appliances",
        preview: "linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%)",
      },
      {
        id: "upgraded",
        label: "Upgraded",
        sub: "Shaker cabinetry · Quartz counters · Upgraded fixtures",
        preview: "linear-gradient(135deg, #f5f0e8 0%, #e8dfc8 100%)",
        badge: "Most Popular",
      },
      {
        id: "chef",
        label: "Chef Kitchen",
        sub: "Full-height cabinets · Waterfall quartz · Premium appliances",
        preview: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
      },
    ],
  },
  {
    key: "bathroomStyle",
    title: "Bathroom finish",
    subtitle: "Bathroom quality is the second most important finish category for tenant satisfaction and rental rates.",
    type: "cards-visual",
    choices: [
      {
        id: "standard",
        label: "Standard",
        sub: "Tile surround · Standard vanity · Fiberglass tub/shower",
        preview: "linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%)",
      },
      {
        id: "spa",
        label: "Spa Finish",
        sub: "Large-format tile · Floating vanity · Walk-in shower",
        preview: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
        badge: "Recommended",
      },
      {
        id: "luxury",
        label: "Luxury",
        sub: "Designer tile · Heated floors · Rain head · Custom glass",
        preview: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
      },
    ],
  },
  {
    key: "exterior",
    title: "Exterior style",
    subtitle: "The exterior defines how the ADU relates to your main house and the neighborhood.",
    type: "cards-visual",
    choices: [
      {
        id: "stucco",
        label: "Traditional Stucco",
        sub: "Classic LA finish — matches most existing homes",
        preview: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      },
      {
        id: "modern",
        label: "Modern / Minimal",
        sub: "Flat planes · Fiber cement panels · Steel accents",
        preview: "linear-gradient(135deg, #1c1917 0%, #44403c 100%)",
        badge: "Trending",
      },
      {
        id: "craftsman",
        label: "Craftsman",
        sub: "Board & batten · Exposed beams · Natural wood accents",
        preview: "linear-gradient(135deg, #78350f 0%, #92400e 100%)",
      },
      {
        id: "farmhouse",
        label: "Modern Farmhouse",
        sub: "White lap siding · Black windows · Metal roof accents",
        preview: "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)",
      },
    ],
  },
  {
    key: "roof",
    title: "Roof style",
    subtitle: "Roof form affects both aesthetics and construction cost. Flat roofs offer useful outdoor space on 2-story builds.",
    type: "cards",
    choices: [
      { id: "flat", label: "Flat / Low Slope", sub: "Modern look · Rooftop deck option · Most economical" },
      { id: "gable", label: "Gable", sub: "Classic peaked roof — matches most LA residential" },
      { id: "hip", label: "Hip Roof", sub: "Four-sided pitch — more wind resistant, premium look" },
      { id: "shed", label: "Shed / Mono-Pitch", sub: "Single slope — architectural, modern feel" },
    ],
  },
  {
    key: "windows",
    title: "Window & door style",
    subtitle: "Windows are the eyes of the ADU — they set the architectural tone and affect natural light.",
    type: "cards",
    choices: [
      { id: "standard", label: "Standard White Vinyl", sub: "Dual-pane · Energy efficient · Most economical" },
      { id: "black-frame", label: "Black Frame", sub: "Steel-look vinyl · Modern aesthetic · Our most requested", badge: "Most Popular" },
      { id: "floor-to-ceiling", label: "Floor-to-Ceiling", sub: "Maximum light · Premium feel · Adds significant value" },
    ],
  },
  {
    key: "use",
    title: "Primary use",
    subtitle: "How you plan to use the ADU shapes the design priorities — rental tenants have different needs than family.",
    type: "cards",
    choices: [
      { id: "rental", label: "Rental Income", sub: "Long-term or short-term tenant — maximize monthly yield" },
      { id: "family", label: "Family / In-Law", sub: "Parents, adult children, or in-laws — privacy and comfort" },
      { id: "office", label: "Home Office / Studio", sub: "Dedicated workspace separate from the main house" },
      { id: "guest", label: "Guest Suite", sub: "Premium guest accommodations when needed" },
      { id: "personal", label: "Personal / Flexible", sub: "Multiple uses over time — maximize resale value" },
    ],
  },
  {
    key: "budget",
    title: "Budget range",
    subtitle: "All-inclusive of design, permitting, and full construction. Be realistic — we'll tell you what's achievable.",
    type: "cards",
    choices: [
      { id: "economy", label: "Economy", sub: "~$95K–$150K · Garage conversion or compact studio", badge: "Garage Conv." },
      { id: "standard", label: "Standard", sub: "~$150K–$220K · Studio or 1-bedroom ADU", badge: "Most Common" },
      { id: "premium", label: "Premium", sub: "~$220K–$320K · Spacious 1-bed or 2-bed with upgrades" },
      { id: "luxury", label: "Luxury", sub: "$320K+ · 2–3 bed, premium finishes, custom design" },
    ],
  },
  {
    key: "city",
    title: "Your city",
    subtitle: "ADU rules vary significantly by jurisdiction. This determines permit timelines and what's buildable.",
    type: "chips",
    choices: [
      { id: "los-angeles", label: "City of LA" },
      { id: "santa-monica", label: "Santa Monica" },
      { id: "culver-city", label: "Culver City" },
      { id: "pasadena", label: "Pasadena" },
      { id: "glendale", label: "Glendale" },
      { id: "other", label: "Other LA County" },
    ],
  },
];

// ─── Floor plan presets ───────────────────────────────────────────────────────

export interface FloorPlanPreset {
  id: string;
  name: string;
  sqFt: number;
  beds: string;
  baths: string;
  description: string;
  tags: string[]; // matches sqFt + beds IDs
  svgKey: string; // key for SVG floor plan illustration
  startingFrom: string;
  modelSlug: string;
}

export const FLOOR_PLANS: FloorPlanPreset[] = [
  {
    id: "studio-400",
    name: "Studio 400",
    sqFt: 400,
    beds: "Studio",
    baths: "1",
    description: "Efficient open-plan studio with full kitchen and private entry.",
    tags: ["under-400", "400-550", "studio"],
    svgKey: "studio-400",
    startingFrom: "$150,000",
    modelSlug: "/adu-models/studio-400",
  },
  {
    id: "1bed-500",
    name: "1 Bed 500",
    sqFt: 500,
    beds: "1 Bed",
    baths: "1",
    description: "Private 1-bedroom with dedicated bedroom, full kitchen, in-unit laundry.",
    tags: ["400-550", "1bed"],
    svgKey: "1bed-500",
    startingFrom: "$165,000",
    modelSlug: "/adu-models/1-bed-500",
  },
  {
    id: "1bed-650",
    name: "1 Bed 650",
    sqFt: 650,
    beds: "1 Bed",
    baths: "1",
    description: "Spacious 1-bedroom — room for a proper living area, island kitchen, bedroom with walk-in closet.",
    tags: ["550-750", "1bed"],
    svgKey: "1bed-650",
    startingFrom: "$195,000",
    modelSlug: "/adu-models/1-bed-650",
  },
  {
    id: "2bed-750",
    name: "2 Bed 750",
    sqFt: 750,
    beds: "2 Bed",
    baths: "1",
    description: "Two private bedrooms, open living area, full kitchen — maximum income potential.",
    tags: ["550-750", "750-1000", "2bed"],
    svgKey: "2bed-750",
    startingFrom: "$230,000",
    modelSlug: "/adu-models/2-bed-750",
  },
  {
    id: "garage-450",
    name: "Garage Conversion 450",
    sqFt: 450,
    beds: "1 Bed",
    baths: "1",
    description: "Convert your existing 2-car garage — complete 1-bedroom unit, fastest timeline.",
    tags: ["under-400", "400-550", "1bed", "studio"],
    svgKey: "garage-450",
    startingFrom: "$95,000",
    modelSlug: "/adu-models/garage-conversion-450",
  },
];

// ─── Result engine ────────────────────────────────────────────────────────────

export interface ConfigState {
  aduType: AduTypeId | null;
  sqFt: SqFtId | null;
  beds: BedsId | null;
  baths: BathsId | null;
  ceiling: CeilingId | null;
  kitchen: KitchenId | null;
  bathroomStyle: BathroomStyleId | null;
  exterior: ExteriorId | null;
  roof: RoofId | null;
  windows: WindowId | null;
  use: UseId | null;
  budget: BudgetId | null;
  city: CityId | null;
}

export const INITIAL_CONFIG: ConfigState = {
  aduType: null, sqFt: null, beds: null, baths: null, ceiling: null,
  kitchen: null, bathroomStyle: null, exterior: null, roof: null,
  windows: null, use: null, budget: null, city: null,
};

export function getMatchingFloorPlans(config: ConfigState): FloorPlanPreset[] {
  const tagPool: string[] = [];
  if (config.sqFt) tagPool.push(config.sqFt);
  if (config.beds) tagPool.push(config.beds);
  if (config.aduType === "garage-conversion") tagPool.push("studio", "1bed");

  if (tagPool.length === 0) return FLOOR_PLANS.slice(0, 3);

  // Score by tag overlap
  const scored = FLOOR_PLANS.map((fp) => ({
    fp,
    score: fp.tags.filter((t) => tagPool.includes(t)).length,
  }));

  const matches = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  if (matches.length === 0) return FLOOR_PLANS.slice(0, 3);
  return matches.slice(0, 3).map((m) => m.fp);
}

export interface ConfigResult {
  headline: string;
  subline: string;
  estimatedRange: string;
  rangeNote: string;
  timeline: string;
  recommendedModel: string;
  recommendedModelHref: string;
  finishTier: string;
  cityInsight?: string;
  topHighlights: string[];
}

const CITY_INSIGHTS: Partial<Record<CityId, string>> = {
  "santa-monica": "Santa Monica has strong ADU permitting support and rents 20–30% above the LA average.",
  "culver-city": "Culver City is one of the fastest ADU jurisdictions in LA County — streamlined approvals.",
  "pasadena": "Pasadena has clear ADU guidelines with strong demand from Caltech/JPL commuters.",
  "glendale": "Glendale offers predictable ADU permitting timelines and strong family rental demand.",
  "los-angeles": "Los Angeles has the most permissive ADU rules in California — most lots qualify.",
  "other": "We operate across all of LA County. Your specific city's rules are assessed during the property evaluation.",
};

export function computeResult(config: ConfigState): ConfigResult {
  const isGarage = config.aduType === "garage-conversion";
  const isJadu = config.aduType === "jadu";
  const is2Bed = config.beds === "2bed" || config.beds === "3bed";
  const isLarge = config.sqFt === "750-1000" || config.sqFt === "over-1000";
  const isPremium = config.budget === "premium" || config.budget === "luxury";
  const isKitchenChef = config.kitchen === "chef";
  const isSpaBath = config.bathroomStyle === "spa" || config.bathroomStyle === "luxury";
  const finishTier =
    (config.kitchen === "chef" || config.bathroomStyle === "luxury") ? "Luxury"
    : (config.kitchen === "upgraded" || config.bathroomStyle === "spa") ? "Premium"
    : "Standard";

  // Headline
  let headline: string;
  if (isGarage) headline = "Garage Conversion ADU";
  else if (isJadu) headline = "Junior ADU (JADU)";
  else if (is2Bed || isLarge) headline = `${config.beds === "3bed" ? "3-Bedroom" : "2-Bedroom"} Detached ADU`;
  else if (config.beds === "1bed") headline = "1-Bedroom Detached ADU";
  else headline = "Studio Detached ADU";

  // Subline
  const useLabels: Partial<Record<UseId, string>> = {
    rental: "optimized for rental income",
    family: "designed for family living",
    office: "configured as a private workspace",
    guest: "finished as a premium guest retreat",
    personal: "built for long-term flexibility",
  };
  const useSub = config.use ? useLabels[config.use] ?? "" : "";
  const sizeSub = config.sqFt
    ? { "under-400": "under 400 sq ft", "400-550": "400–550 sq ft", "550-750": "550–750 sq ft", "750-1000": "750–1,000 sq ft", "over-1000": "1,000+ sq ft" }[config.sqFt] ?? ""
    : "";
  const subline = [sizeSub, finishTier !== "Standard" ? `${finishTier} finish package` : null, useSub].filter(Boolean).join(" · ");

  // Budget
  let estimatedRange: string;
  let rangeNote: string;
  if (isGarage) {
    estimatedRange = isPremium ? "$120,000–$200,000" : "$95,000–$160,000";
    rangeNote = "Garage conversions use your existing structure — the most cost-effective ADU path.";
  } else if (isJadu) {
    estimatedRange = "$60,000–$130,000";
    rangeNote = "JADUs are created within your existing home — lowest construction cost of any ADU type.";
  } else if (is2Bed || isLarge) {
    estimatedRange = isPremium ? "$300,000–$450,000+" : "$230,000–$350,000";
    rangeNote = "Two-bedroom ADUs require more square footage and systems — offset by meaningfully higher rental income.";
  } else if (config.beds === "1bed" && (config.sqFt === "550-750")) {
    estimatedRange = isPremium ? "$230,000–$310,000" : "$195,000–$270,000";
    rangeNote = "Spacious 1-bedroom ADUs command premium rents and attract longer-term quality tenants.";
  } else if (config.beds === "1bed") {
    estimatedRange = isPremium ? "$195,000–$260,000" : "$165,000–$230,000";
    rangeNote = "The 1-bedroom ADU delivers the best balance of cost and rental income for most LA lots.";
  } else {
    estimatedRange = isPremium ? "$180,000–$240,000" : "$150,000–$200,000";
    rangeNote = "Studio ADUs have the lowest starting price and strongest return on investment per dollar.";
  }

  // Timeline
  const timeline = isGarage || isJadu ? "6–9 months design to move-in" : "9–14 months design to move-in";

  // Recommended model
  let recommendedModel: string;
  let recommendedModelHref: string;
  if (isGarage) {
    recommendedModel = "Garage Conversion 450";
    recommendedModelHref = "/adu-models/garage-conversion-450";
  } else if (is2Bed || isLarge) {
    recommendedModel = "2 Bed 750";
    recommendedModelHref = "/adu-models/2-bed-750";
  } else if (config.beds === "1bed" && config.sqFt === "550-750") {
    recommendedModel = "1 Bed 650";
    recommendedModelHref = "/adu-models/1-bed-650";
  } else if (config.beds === "1bed") {
    recommendedModel = "1 Bed 500";
    recommendedModelHref = "/adu-models/1-bed-500";
  } else {
    recommendedModel = "Studio 400";
    recommendedModelHref = "/adu-models/studio-400";
  }

  // Highlights
  const highlights: string[] = [];
  if (config.ceiling === "9ft" || config.ceiling === "10ft" || config.ceiling === "vaulted")
    highlights.push(`${config.ceiling === "vaulted" ? "Vaulted" : config.ceiling === "10ft" ? "10 ft" : "9 ft"} ceilings — spacious feel`);
  if (isKitchenChef) highlights.push("Chef kitchen with waterfall quartz and premium appliances");
  else if (config.kitchen === "upgraded") highlights.push("Upgraded kitchen with quartz counters and quality fixtures");
  if (isSpaBath) highlights.push(`${config.bathroomStyle === "luxury" ? "Luxury" : "Spa"} bathroom finish package`);
  if (config.windows === "black-frame") highlights.push("Black-frame windows — modern architectural statement");
  else if (config.windows === "floor-to-ceiling") highlights.push("Floor-to-ceiling windows — maximum natural light");
  if (config.exterior === "modern") highlights.push("Modern fiber cement exterior with steel accents");
  else if (config.exterior === "craftsman") highlights.push("Craftsman exterior with natural wood detailing");
  if (config.use === "rental") highlights.push("Rental-optimized layout — strong LA market demand");
  if (config.use === "family") highlights.push("Private entry — full independence from the main house");
  if (highlights.length < 3) {
    highlights.push("All-inclusive price: design, permits, and full construction");
    highlights.push("Single point of contact — our team manages everything");
  }

  return {
    headline,
    subline,
    estimatedRange,
    rangeNote,
    timeline,
    recommendedModel,
    recommendedModelHref,
    finishTier,
    cityInsight: config.city ? CITY_INSIGHTS[config.city] : undefined,
    topHighlights: highlights.slice(0, 5),
  };
}

// ─── Summary labels ───────────────────────────────────────────────────────────

export const SUMMARY_LABELS: Partial<Record<keyof ConfigState, (val: string) => string>> = {
  aduType: (v) => ({ detached: "Detached ADU", "garage-conversion": "Garage Conversion", attached: "Attached ADU", jadu: "Junior ADU" }[v] ?? v),
  sqFt: (v) => ({ "under-400": "< 400 sq ft", "400-550": "400–550 sq ft", "550-750": "550–750 sq ft", "750-1000": "750–1,000 sq ft", "over-1000": "1,000+ sq ft" }[v] ?? v),
  beds: (v) => ({ studio: "Studio", "1bed": "1 Bedroom", "2bed": "2 Bedrooms", "3bed": "3 Bedrooms" }[v] ?? v),
  baths: (v) => ({ "1": "1 Bath", "1h": "1.5 Baths", "2": "2 Baths" }[v] ?? v),
  ceiling: (v) => ({ "8ft": "8 ft ceiling", "9ft": "9 ft ceiling", "10ft": "10 ft ceiling", vaulted: "Vaulted ceiling" }[v] ?? v),
  kitchen: (v) => ({ standard: "Standard kitchen", upgraded: "Upgraded kitchen", chef: "Chef kitchen" }[v] ?? v),
  bathroomStyle: (v) => ({ standard: "Standard bath", spa: "Spa finish bath", luxury: "Luxury bath" }[v] ?? v),
  exterior: (v) => ({ stucco: "Stucco exterior", modern: "Modern exterior", craftsman: "Craftsman exterior", farmhouse: "Farmhouse exterior" }[v] ?? v),
  roof: (v) => ({ flat: "Flat roof", gable: "Gable roof", hip: "Hip roof", shed: "Shed roof" }[v] ?? v),
  windows: (v) => ({ standard: "Standard windows", "black-frame": "Black-frame windows", "floor-to-ceiling": "Floor-to-ceiling windows" }[v] ?? v),
  use: (v) => ({ rental: "Rental income", family: "Family / In-law", office: "Home office", guest: "Guest suite", personal: "Personal use" }[v] ?? v),
  budget: (v) => ({ economy: "Economy budget", standard: "Standard budget", premium: "Premium budget", luxury: "Luxury budget" }[v] ?? v),
  city: (v) => ({ "los-angeles": "City of LA", "santa-monica": "Santa Monica", "culver-city": "Culver City", pasadena: "Pasadena", glendale: "Glendale", other: "Other LA County" }[v] ?? v),
};
