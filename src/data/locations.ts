/**
 * Location data for ADU Build LA city/area landing pages.
 *
 * This file acts as the data layer for Phase 2C.
 * Structure is intentionally CMS-friendly — each field maps 1:1 to what a
 * future CMS schema (e.g. a Prisma `LocationPage` model) would store.
 * To migrate: replace `getAllLocations()` and `getLocationBySlug()` with
 * Prisma queries and the page templates will work without other changes.
 */

export interface LocationStat {
  value: string;
  label: string;
}

export interface LocationPermitNote {
  title: string;
  body: string;
}

export interface LocationPricingRange {
  type: string;
  range: string;
  note: string;
}

export interface LocationFAQ {
  q: string;
  a: string;
}

export interface LocationData {
  // ── Identity ────────────────────────────────────────────────────────────
  slug: string;
  name: string;
  county: string;
  fullPath: string;

  // ── SEO ─────────────────────────────────────────────────────────────────
  seoTitle: string;
  seoDescription: string;

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroTagline: string;
  heroHeading: string;
  heroSubheading: string;

  // ── City intro ───────────────────────────────────────────────────────────
  introHeading: string;
  introParagraphs: string[];

  // ── City-specific stats strip ────────────────────────────────────────────
  stats: LocationStat[];

  // ── Benefits of building ADU here ────────────────────────────────────────
  benefits: string[];

  // ── Permit & zoning notes ────────────────────────────────────────────────
  permitHeading: string;
  permitNotes: LocationPermitNote[];

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricingIntro: string;
  pricingRanges: LocationPricingRange[];

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faqs: LocationFAQ[];

  // ── Nearby areas (for internal linking and SEO) ──────────────────────────
  nearbyAreas: string[];
}

// ─── Location data ───────────────────────────────────────────────────────────

const LOCATIONS: LocationData[] = [
  // ── Los Angeles ──────────────────────────────────────────────────────────
  {
    slug: "los-angeles",
    name: "Los Angeles",
    county: "Los Angeles County",
    fullPath: "/locations/los-angeles",

    seoTitle: "ADU Builders in Los Angeles | ADU Build LA",
    seoDescription:
      "Los Angeles ADU specialists. Custom ADU design, permitting, and construction in the City of LA. Starting from $150,000. Free property assessment.",

    heroTagline: "Serving the City of Los Angeles",
    heroHeading: "ADU Design & Build Specialists in Los Angeles",
    heroSubheading:
      "We've built 200+ ADUs across Los Angeles — navigating LADBS, LA-specific zoning codes, and the city's permitting system so you don't have to.",

    introHeading: "Why Los Angeles Is One of the Best Cities in California to Build an ADU",
    introParagraphs: [
      "Los Angeles has undergone a dramatic ADU reform since 2019. The city eliminated many of the restrictions that previously made ADUs impractical — including owner-occupancy requirements, minimum lot sizes, and excessive setback rules. Today, most single-family lots in the City of LA are eligible to add at least one ADU, and many can accommodate both an ADU and a Junior ADU on the same property.",
      "With some of the highest rental demand in the country and median rents of $2,200–$3,500/month for a studio or one-bedroom, an ADU in Los Angeles can generate $26,000–$42,000+ in annual rental income. That's a compelling return on a $150,000–$280,000 investment — and one that compounds as property values rise.",
    ],

    stats: [
      { value: "$2,400/mo", label: "Avg Studio ADU Rent" },
      { value: "8–16 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Highest rental demand in California — ADUs rent quickly in most LA neighborhoods",
      "No owner-occupancy requirement — rent both your home and your ADU",
      "LADBS Expedited ADU Plan Check Program significantly reduces permit wait times",
      "No minimum lot size requirement for ADUs under California state law",
      "Most lots can build both one ADU and one Junior ADU simultaneously",
      "ADUs are largely exempt from school and utility impact fees in the City of LA",
    ],

    permitHeading: "ADU Permitting in the City of Los Angeles",
    permitNotes: [
      {
        title: "LADBS Expedited ADU Plan Check",
        body: "The Los Angeles Department of Building and Safety runs a dedicated ADU plan check program that significantly reduces review times compared to standard projects. Most plans with complete, accurate submissions receive approval within 8–16 weeks.",
      },
      {
        title: "Setbacks & Lot Coverage",
        body: "The City of LA requires 4 ft rear and side setbacks for most ADU types. Detached ADUs can be up to 1,200 sq ft or 50% of the primary dwelling — whichever is smaller. Corner lots often have more flexible setback configurations.",
      },
      {
        title: "Junior ADUs (JADU) Within Existing Structures",
        body: "JADUs up to 500 sq ft can be carved from an existing home's footprint — including attached garages. They have simplified permitting, lower fees, and typically move through plan check faster than a full ADU.",
      },
      {
        title: "Two Units Per Lot",
        body: "Under current California law, most single-family lots in Los Angeles can build both one ADU and one JADU — effectively adding two independent rental units to one property without rezoning.",
      },
    ],

    pricingIntro:
      "ADU costs in the City of Los Angeles reflect LA-area labor and material markets. Every price below is all-inclusive: design, engineering, permitting fees, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Within existing structure" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$120,000 – $220,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$150,000 – $280,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "How long does ADU permitting take in the City of Los Angeles?",
        a: "With LADBS's expedited ADU program, most projects are permitted in 8–16 weeks from a complete plan submission. Projects that require correction rounds or utility upgrades may take 16–24 weeks. Our team manages every submission and responds to plan check corrections promptly to keep your timeline on track.",
      },
      {
        q: "Can I build an ADU on any lot in Los Angeles?",
        a: "Most single-family (R1) lots in the City of LA are eligible for at least one ADU. Eligibility depends on lot size, zoning classification, existing structures, and setbacks. We provide free property assessments to confirm eligibility and outline all your options before any money changes hands.",
      },
      {
        q: "Do I need to live on the property to build an ADU in LA?",
        a: "No. California law eliminated owner-occupancy requirements for ADUs in 2020. You can rent both your primary home and your ADU, occupy one and rent the other, or use the ADU for family members — the choice is yours.",
      },
      {
        q: "How much rental income can I earn from an ADU in Los Angeles?",
        a: "In most Los Angeles neighborhoods, a well-designed studio ADU rents for $1,800–$2,800/month and a one-bedroom ADU achieves $2,400–$3,500/month. Annual gross rental income of $25,000–$42,000 is realistic for a new, quality ADU in most LA neighborhoods.",
      },
      {
        q: "What's the difference between an ADU and a JADU in LA?",
        a: "A Junior ADU (JADU) is a unit created within your existing home's footprint — typically from a bedroom or attached garage — up to 500 sq ft. A full ADU can be detached, attached, or a garage conversion and can be up to 1,200 sq ft. JADUs have simpler permits and lower costs; full ADUs offer more size and rental income potential.",
      },
    ],

    nearbyAreas: ["West Hollywood", "Culver City", "Inglewood", "Burbank", "Torrance", "Long Beach"],
  },

  // ── Santa Monica ─────────────────────────────────────────────────────────
  {
    slug: "santa-monica",
    name: "Santa Monica",
    county: "Los Angeles County",
    fullPath: "/locations/santa-monica",

    seoTitle: "ADU Builders in Santa Monica CA | ADU Build LA",
    seoDescription:
      "Premium ADU design, permitting, and construction in Santa Monica. Specialists in the Santa Monica permit process, including Coastal Zone properties. Free assessment.",

    heroTagline: "Serving Santa Monica",
    heroHeading: "Premium ADU Design & Build in Santa Monica",
    heroSubheading:
      "Santa Monica homeowners are generating $3,000–$4,500/month in rental income with custom ADUs. We handle every step — design, permits, and construction — in one of LA's most demanding permit environments.",

    introHeading: "Why Santa Monica Homeowners Are Building ADUs",
    introParagraphs: [
      "Santa Monica sits at the center of one of Southern California's most desirable rental markets. Beach access, top-rated dining, major tech and media employers, and easy freeway and transit access drive consistent demand from high-income renters — making ADU rental income here particularly strong.",
      "Studio and one-bedroom ADUs in Santa Monica typically rent for $2,800–$4,200/month. For a homeowner investing $180,000–$280,000 in a detached ADU, that represents a 12–18% gross annual yield — among the strongest ADU returns available anywhere in Greater Los Angeles.",
    ],

    stats: [
      { value: "$3,200/mo", label: "Avg Studio ADU Rent" },
      { value: "10–18 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Among the highest ADU rental rates in all of Greater Los Angeles",
      "Strong year-round demand from tech, healthcare, and entertainment professionals",
      "Proximity to LAX and the Westside job corridor drives premium rents",
      "High underlying property values amplify the asset-value impact of an ADU",
      "Excellent walk score and Big Blue Bus / Expo Line access attract car-free tenants",
      "California ADU law and Santa Monica code allow ADUs on most single-family lots",
    ],

    permitHeading: "ADU Permitting in Santa Monica",
    permitNotes: [
      {
        title: "City of Santa Monica Planning & Community Development",
        body: "ADUs in Santa Monica are permitted through the city's Planning and Community Development department. Santa Monica has adopted California's ADU law and allows ADUs on most single-family and eligible multifamily lots throughout the city.",
      },
      {
        title: "Coastal Zone & Coastal Development Permits",
        body: "Properties in Santa Monica's Coastal Zone may require a Coastal Development Permit (CDP) in addition to standard building permits. Our team navigates Coastal Commission requirements regularly and assesses your property's overlay status as part of the free site evaluation.",
      },
      {
        title: "Historic District Design Guidelines",
        body: "Some Santa Monica neighborhoods have historic preservation overlays with exterior design guidelines. We work within these requirements — using compatible materials and massing — to create ADUs that enhance rather than conflict with neighborhood character.",
      },
      {
        title: "Permit Timeline",
        body: "Standard ADU permitting in Santa Monica takes 10–18 weeks from a complete submission. Coastal Zone projects requiring CDP review add time. We prepare thorough, accurate submissions to minimize correction rounds.",
      },
    ],

    pricingIntro:
      "Santa Monica ADU construction reflects premium coastal LA pricing. Higher rental rates mean shorter investment payback periods. All-inclusive of design, permitting fees, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$70,000 – $110,000", note: "Within existing structure" },
      { type: "Garage Conversion ADU", range: "$90,000 – $165,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$140,000 – $240,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$175,000 – $320,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Can I build an ADU in Santa Monica's Coastal Zone?",
        a: "Yes, ADUs can be built in the Coastal Zone, but projects may require a Coastal Development Permit (CDP) in addition to standard building permits. Our team handles CDP applications regularly. We assess whether your property requires one as part of the free property evaluation — at no cost to you.",
      },
      {
        q: "How long does ADU permitting take in Santa Monica?",
        a: "Standard ADU permitting in Santa Monica takes 10–18 weeks from plan submission. Coastal Zone projects involving a CDP review may require additional time depending on California Coastal Commission workload. We manage all submissions and correction responses on your behalf.",
      },
      {
        q: "What rental income can I expect from a Santa Monica ADU?",
        a: "Studio ADUs in Santa Monica typically achieve $2,800–$3,500/month. Well-designed one-bedroom ADUs often rent for $3,500–$4,500/month. Annual gross rental income of $34,000–$54,000 is achievable with a quality ADU in most Santa Monica neighborhoods.",
      },
      {
        q: "Do HOAs in Santa Monica restrict ADUs?",
        a: "California law (AB 3182) limits HOA authority to prohibit ADUs where they're otherwise legally permitted. HOAs may have aesthetic guidelines but cannot outright prevent you from building. We can review your HOA documents during the property assessment to clarify any applicable rules.",
      },
    ],

    nearbyAreas: ["Venice", "Mar Vista", "Brentwood", "Pacific Palisades", "Marina del Rey"],
  },

  // ── Pasadena ─────────────────────────────────────────────────────────────
  {
    slug: "pasadena",
    name: "Pasadena",
    county: "Los Angeles County",
    fullPath: "/locations/pasadena",

    seoTitle: "ADU Builders in Pasadena CA | ADU Build LA",
    seoDescription:
      "Expert ADU design, permitting, and construction in Pasadena. We navigate Pasadena's permit process and historic overlay districts. Free property assessment.",

    heroTagline: "Serving Pasadena",
    heroHeading: "ADU Design & Build Specialists in Pasadena",
    heroSubheading:
      "Pasadena's large Craftsman lots, abundant detached garages, and strong rental market make it one of the best ADU investment cities in the San Gabriel Valley. We handle the full process.",

    introHeading: "ADU Opportunities for Pasadena Homeowners",
    introParagraphs: [
      "Pasadena offers some of the best ADU conditions in the San Gabriel Valley. Large lots, abundant detached garages, and a strong rental market anchored by Caltech, JPL, Huntington Hospital, and a growing professional population create ideal conditions for ADU investment.",
      "Many Pasadena homes — particularly Craftsman bungalows and post-war ranches on 7,000–15,000 sq ft lots — have significant untapped ADU potential. Whether you're converting a detached garage or building a new rear structure, the Pasadena market supports quality rents and strong long-term asset appreciation.",
    ],

    stats: [
      { value: "$2,200/mo", label: "Avg Studio ADU Rent" },
      { value: "10–20 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Large lot sizes in many neighborhoods create excellent ADU footprint opportunities",
      "Strong rental demand from Caltech, JPL, Huntington Hospital, and local employers",
      "Abundant detached garages — prime candidates for fast, cost-effective ADU conversion",
      "Competitive construction costs compared to coastal LA markets",
      "Growing mid-term furnished rental market serving Caltech visiting researchers",
      "Excellent freeway access (210, 110, 134) increases appeal to LA-wide renters",
    ],

    permitHeading: "ADU Permitting in Pasadena",
    permitNotes: [
      {
        title: "City of Pasadena Planning & Development Department",
        body: "ADUs in Pasadena are permitted through the City of Pasadena Planning and Development Department. Pasadena has aligned its municipal code with California's ADU laws and allows ADUs on most residential lots throughout the city.",
      },
      {
        title: "Historic Overlay & Design Review Districts",
        body: "Pasadena has numerous historic and character-rich neighborhoods — including Bungalow Heaven, the Prospect Park area, and Old Pasadena-adjacent streets. Structures in these areas may require Design Commission review to ensure compatibility with existing neighborhood character. We've successfully permitted ADUs in all of Pasadena's major historic areas.",
      },
      {
        title: "Garage Conversions",
        body: "Pasadena's large lot sizes frequently include detached garages that are prime candidates for conversion. Garage conversions generally avoid the design scrutiny applied to new structures and move through permitting faster, often at significantly lower cost.",
      },
      {
        title: "Permit Timeline",
        body: "Standard ADU permitting in Pasadena takes 10–20 weeks from submission. Projects in historic overlay areas requiring Design Commission review may add 4–6 weeks. We prepare thorough submissions and track every deadline to minimize delays.",
      },
    ],

    pricingIntro:
      "Pasadena ADU costs are competitive with the broader LA region. Garage conversions and JADUs offer the most cost-effective entry points for homeowners. All-inclusive of design, engineering, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$80,000 – $145,000", note: "Detached or attached garage" },
      { type: "Attached ADU", range: "$120,000 – $210,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$150,000 – $270,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Can I build an ADU in Pasadena's historic districts?",
        a: "Yes, ADUs can be built in Pasadena's historic areas — including Bungalow Heaven and other designated neighborhoods — but new structures are subject to Design Commission review for compatibility with neighborhood character. Garage conversions are typically less restricted and move faster. Our team has navigated Pasadena's historic review process many times.",
      },
      {
        q: "Is a garage conversion a good ADU option in Pasadena?",
        a: "Absolutely. Pasadena has more detached garages per capita than almost any other LA-area city — and most are prime ADU candidates. Garage conversions leverage the existing structure, often complete construction in 10–14 weeks post-permit, and cost significantly less than a new build. It's the most popular ADU path for Pasadena homeowners.",
      },
      {
        q: "How long does ADU permitting take in Pasadena?",
        a: "Standard ADU permitting in Pasadena takes 10–20 weeks. Projects in historic overlay areas requiring Design Commission approval may add 4–6 weeks to that timeline. Garage conversions tend to move the fastest. We manage all communications with Pasadena's building department throughout the process.",
      },
      {
        q: "What rental income can I expect from a Pasadena ADU?",
        a: "Studio ADUs in Pasadena typically achieve $1,800–$2,500/month. One-bedroom units often rent for $2,200–$3,000/month. Annual gross rental income of $22,000–$36,000 is realistic with a well-designed Pasadena ADU. Properties near Caltech often command a premium from academic and research renters.",
      },
    ],

    nearbyAreas: ["Arcadia", "Sierra Madre", "Monrovia", "San Marino", "Alhambra", "Temple City"],
  },

  // ── Glendale ─────────────────────────────────────────────────────────────
  {
    slug: "glendale",
    name: "Glendale",
    county: "Los Angeles County",
    fullPath: "/locations/glendale",

    seoTitle: "ADU Builders in Glendale CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in Glendale, CA. Specialists in Glendale's permit process, hillside properties, and fire zone requirements. Free assessment.",

    heroTagline: "Serving Glendale",
    heroHeading: "ADU Design & Build Specialists in Glendale",
    heroSubheading:
      "Glendale homeowners are building ADUs for multigenerational living, rental income, and long-term property investment. We handle design, permits, and construction — including hillside and fire zone projects.",

    introHeading: "Why Glendale Is a Strong ADU Investment Market",
    introParagraphs: [
      "Glendale is one of the most ADU-active cities in the San Fernando Valley. A combination of large single-family lots, a strong multigenerational housing culture, and rising property values has made ADUs both popular and financially rewarding for homeowners throughout the city.",
      "Glendale's demographics and location create dual ADU demand: multigenerational families seeking units for parents or adult children, and working professionals commuting to Burbank's entertainment district and downtown LA. Both market segments create consistent, reliable demand for quality ADU space.",
    ],

    stats: [
      { value: "$2,000/mo", label: "Avg Studio ADU Rent" },
      { value: "10–18 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Strong multigenerational housing demand driven by Glendale's diverse community",
      "Close proximity to Burbank's entertainment industry and the LA Metro system",
      "Large flat lots in central Glendale neighborhoods are ideal for detached ADUs",
      "Hillside lots often command premium rents due to exceptional views",
      "Competitive construction costs versus coastal LA markets",
      "Growing mid-term rental demand from Burbank studio professionals and contractors",
    ],

    permitHeading: "ADU Permitting in Glendale",
    permitNotes: [
      {
        title: "City of Glendale Development Services Department",
        body: "ADUs in Glendale are permitted through the City of Glendale's Development Services Department. Glendale has fully aligned its municipal code with California's ADU laws and allows ADUs on most residential lots throughout the city.",
      },
      {
        title: "Hillside Property Requirements",
        body: "Glendale has a significant number of hillside lots with slope-related constraints. Hillside ADU projects may require additional geotechnical investigation and slope stability analysis. Our team regularly works on Glendale hillside properties and understands the city's specific submittal requirements.",
      },
      {
        title: "Very High Fire Hazard Severity Zones (VHFHSZ)",
        body: "Foothill and hillside areas of Glendale are designated VHFHSZ under CAL FIRE maps, requiring ember-resistant vents, Class A roofing, and ignition-resistant exterior materials under California Building Code Chapter 7A. We design and build to these standards and incorporate them into our scoping and fixed-price contracts.",
      },
      {
        title: "Permit Timeline",
        body: "Standard ADU permitting in Glendale takes 10–18 weeks. Hillside projects requiring geotechnical review, or properties in fire zones requiring additional state compliance review, may add time. We manage all Glendale Building Department communications throughout.",
      },
    ],

    pricingIntro:
      "Glendale ADU costs are competitive with the broader LA region. Hillside and fire zone projects carry modest cost premiums for site preparation and fire-resistant materials. All-inclusive of design, engineering, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$120,000 – $215,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$150,000 – $280,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Can I build an ADU on a hillside lot in Glendale?",
        a: "Yes, hillside ADUs are buildable throughout Glendale, but they require additional geotechnical investigation and slope stability analysis prior to permitting. Foundation and grading work on hillside lots also adds to construction costs. We assess hillside feasibility and provide a comprehensive scope as part of your free property evaluation.",
      },
      {
        q: "Does my Glendale property require fire-resistant construction?",
        a: "If your property sits in a Very High Fire Hazard Severity Zone — common in Glendale's foothill areas — California's Title 24 and local codes require fire-resistant construction measures, including ember-resistant vents, Class A roofing, and ignition-resistant cladding. We scope and price these requirements upfront so there are no surprise costs mid-project.",
      },
      {
        q: "How long does ADU permitting take in Glendale?",
        a: "Standard ADU permitting in Glendale takes 10–18 weeks from a complete plan submission. Hillside projects requiring geotechnical review, or properties in fire zones, may take longer. Our team manages all city communications and tracks every deadline to keep your project on schedule.",
      },
      {
        q: "What's the best ADU type for a Glendale property?",
        a: "It depends on your specific lot. Glendale has many properties with detached garages — making garage conversion a fast, cost-effective first choice. For larger flat lots in central Glendale, a new detached ADU maximizes rental income. For hillside properties, we design for the site's specific constraints while maximizing livable space and views. We recommend the right option after a free site visit.",
      },
    ],

    nearbyAreas: ["Burbank", "La Crescenta", "Montrose", "Atwater Village", "Eagle Rock", "Sunland"],
  },

  // ── Culver City ──────────────────────────────────────────────────────────
  {
    slug: "culver-city",
    name: "Culver City",
    county: "Los Angeles County",
    fullPath: "/locations/culver-city",

    seoTitle: "ADU Builders in Culver City CA | ADU Build LA",
    seoDescription:
      "Premium ADU design, permitting, and construction in Culver City. One of LA's strongest ADU rental markets. Free property assessment — no obligation.",

    heroTagline: "Serving Culver City",
    heroHeading: "Premium ADU Design & Build in Culver City",
    heroSubheading:
      "Culver City is one of LA's fastest-growing tech and entertainment hubs — with ADU rental income to match. We build premium ADUs that command top-of-market rents in this high-demand neighborhood.",

    introHeading: "Why Culver City Is One of LA's Best ADU Investment Markets",
    introParagraphs: [
      "Culver City has transformed over the last decade. Once primarily a film industry neighborhood, the city now hosts major tech and streaming offices — Amazon MGM Studios, Apple TV+, HBO Max, and Sony Pictures among them. This concentration of high-income employers has driven exceptional residential rental demand in the surrounding neighborhoods.",
      "For homeowners, the result is ADU rental income that outperforms much of the LA market. Studio and one-bedroom ADUs in Culver City routinely achieve $2,500–$4,000/month — making a well-built ADU one of the most compelling investments available to local homeowners.",
    ],

    stats: [
      { value: "$2,900/mo", label: "Avg Studio ADU Rent" },
      { value: "8–16 wks", label: "Typical Permit Timeline" },
      { value: "~$75K/yr", label: "Est. Gross Income (1BR)" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Exceptional rental demand from Amazon, Apple TV+, HBO Max, and Sony employees",
      "Among the highest ADU rental rates in all of Greater Los Angeles",
      "LA Metro E Line access drives demand from car-free renters",
      "Rapid property value appreciation increases long-term ADU return on investment",
      "Strong short-term and mid-term furnished rental market",
      "Smaller city government provides a more responsive permitting process than LADBS",
    ],

    permitHeading: "ADU Permitting in Culver City",
    permitNotes: [
      {
        title: "Culver City Community Development Department",
        body: "ADUs in Culver City are permitted through the Community Development Department. Culver City has adopted California's ADU legislation in full and allows ADUs on most single-family residential lots throughout the city.",
      },
      {
        title: "Transit-Oriented Development Context",
        body: "Culver City's proximity to the E Line Metro station has shaped some of its residential zoning standards. Properties in transit-adjacent zones may have development options that go beyond standard ADU rules — our team can assess any additional opportunities your lot may qualify for.",
      },
      {
        title: "Residential Design Compatibility",
        body: "Culver City encourages ADUs to be compatible with the design character of the primary residence in terms of materials and massing. This isn't a significant barrier — it primarily means selecting exterior finishes that complement your existing home, which we handle as part of the design process.",
      },
      {
        title: "Permit Timeline",
        body: "ADU permitting in Culver City typically takes 8–16 weeks for standard projects. Culver City's smaller department size often means faster communication and correction turnaround compared to larger jurisdictions. We manage all plan submissions and city communications.",
      },
    ],

    pricingIntro:
      "Culver City ADU pricing reflects the premium construction quality the market demands — and the higher rental rates mean shorter investment payback periods. All-inclusive of design, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$65,000 – $110,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$85,000 – $160,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$130,000 – $230,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$160,000 – $290,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "What rental income can I expect from an ADU in Culver City?",
        a: "Culver City's tech and entertainment market drives some of the strongest ADU rents in LA. Studio ADUs typically achieve $2,500–$3,200/month. One-bedroom ADUs routinely rent for $3,200–$4,200/month. Annual gross rental income of $38,000–$50,000 is achievable for a well-designed one-bedroom ADU in most Culver City neighborhoods.",
      },
      {
        q: "How long does ADU permitting take in Culver City?",
        a: "Standard ADU projects in Culver City are typically permitted in 8–16 weeks — often faster than comparable projects in the City of LA thanks to Culver City's smaller department and more direct communication. We manage all permitting submissions and city correspondence throughout.",
      },
      {
        q: "Is Culver City a good market for short-term or furnished ADU rentals?",
        a: "Culver City has strong short-term rental demand from entertainment industry visitors and tech contractors. However, short-term rentals are subject to Culver City's home-sharing ordinance and require city registration. We recommend consulting a local attorney on short-term rental compliance. Long-term and mid-term rentals remain exceptionally strong without regulatory complexity.",
      },
      {
        q: "What ADU type delivers the best ROI in Culver City?",
        a: "Given Culver City's premium rents, a detached ADU with a private entrance and dedicated outdoor space typically commands the highest rent and delivers the best long-term ROI. Garage conversions are strong performers when the existing structure allows quality finishes. We advise on the best option after a free site visit and assessment.",
      },
    ],

    nearbyAreas: ["Palms", "Mar Vista", "Venice", "El Segundo", "Inglewood", "West Los Angeles"],
  },

  // ── Burbank ──────────────────────────────────────────────────────────────
  {
    slug: "burbank",
    name: "Burbank",
    county: "Los Angeles County",
    fullPath: "/locations/burbank",

    seoTitle: "ADU Builders in Burbank CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in Burbank. Specialists in Burbank's permit process — garage conversions, detached ADUs, and JADUs. Free property assessment.",

    heroTagline: "Serving Burbank",
    heroHeading: "ADU Design & Build Specialists in Burbank",
    heroSubheading:
      "Burbank's entertainment industry workforce and large single-family lots create ideal conditions for ADU investment. We design, permit, and build ADUs throughout Burbank — start to finish.",

    introHeading: "Why Burbank Homeowners Are Building ADUs",
    introParagraphs: [
      "Burbank sits at the center of the entertainment industry's production corridor — home to Warner Bros., Disney, Nickelodeon, and a cluster of post-production studios that collectively employ tens of thousands of professionals. That concentration of steady, well-paid employment creates consistent housing demand that makes Burbank one of the more reliable ADU rental markets in the San Fernando Valley.",
      "Burbank's residential neighborhoods — particularly the flatter streets south of Magnolia and west of the 5 — offer excellent ADU conditions: generous lot sizes, abundant detached garages, and modest existing structures that leave room for rear additions. Many Burbank homeowners find garage conversion is the fastest and most cost-effective path to rental income.",
    ],

    stats: [
      { value: "$2,100/mo", label: "Avg Studio ADU Rent" },
      { value: "10–18 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Steady rental demand from Warner Bros., Disney, and Burbank's entertainment studios",
      "Many neighborhoods feature large lots with detached garages — ideal for low-cost conversion",
      "No owner-occupancy requirement — rent both units independently under California law",
      "Proximity to Glendale, Pasadena, and the 5/134/101 freeway corridor broadens tenant pool",
      "ADU income can meaningfully offset high Burbank property tax and mortgage costs",
      "Burbank's airport access attracts short-term and mid-term production industry renters",
    ],

    permitHeading: "ADU Permitting in Burbank",
    permitNotes: [
      {
        title: "City of Burbank Building Division",
        body: "ADUs in Burbank are permitted through the City of Burbank Building Division. Burbank has adopted California's ADU statutes and allows ADUs on most single-family residential lots within city limits.",
      },
      {
        title: "Garage Conversions",
        body: "Burbank's residential neighborhoods are filled with detached garages — many from the 1940s–1960s — that make excellent ADU candidates. Garage conversions in Burbank generally move through permitting faster than new construction because existing foundations and framing reduce review complexity. Replacement parking is not required under California state law for garage conversions.",
      },
      {
        title: "Fire Zone Overlay Areas",
        body: "Portions of Burbank that adjoin the Verdugo Hills and Stough Canyon open space are in or near Fire Hazard Severity Zones. For properties in these areas, California Building Code Chapter 7A fire-resistive construction requirements apply. We assess your property's fire zone status as part of the free site evaluation.",
      },
      {
        title: "Permit Timeline",
        body: "Standard ADU permitting in Burbank typically takes 10–18 weeks from plan submission. Our team prepares complete, accurate submissions to minimize correction rounds. We manage all Burbank Building Division correspondence on your behalf.",
      },
    ],

    pricingIntro:
      "Burbank ADU pricing is competitive with the broader LA market. Garage conversions represent the most accessible entry point for most homeowners. All-inclusive pricing covers design, engineering, permitting fees, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$120,000 – $215,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$150,000 – $275,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Is a garage conversion a good option in Burbank?",
        a: "Yes — Burbank has a high density of detached garages from mid-century construction, and most are strong ADU candidates. Garage conversions move through Burbank's permitting process faster than new construction, cost less, and still produce quality rental income. We assess your garage's structural condition and utility connections as part of the free site review.",
      },
      {
        q: "How long does ADU permitting take in Burbank?",
        a: "Standard ADU projects in Burbank are typically permitted within 10–18 weeks of a complete plan submission. We manage all city communications and correction responses on your behalf. Fire zone properties may require additional review time.",
      },
      {
        q: "What rental income can I expect from a Burbank ADU?",
        a: "Studio ADUs in Burbank typically rent for $1,800–$2,400/month. One-bedroom units often achieve $2,200–$3,000/month. Annual gross rental income of $22,000–$36,000 is realistic for a quality Burbank ADU. Properties near the studios sometimes attract mid-term furnished renters at premium rates.",
      },
      {
        q: "Can I build a new detached ADU in Burbank if I don't have a garage?",
        a: "Yes. If your lot has sufficient rear yard area and meets Burbank's setback requirements, you can build a new detached ADU without converting an existing structure. We design within your specific lot's constraints — setbacks, existing coverage, and utility connections — and provide a full feasibility review before any commitment.",
      },
    ],

    nearbyAreas: ["Glendale", "Toluca Lake", "Studio City", "North Hollywood", "Sunland", "La Crescenta"],
  },

  // ── West Hollywood ────────────────────────────────────────────────────────
  {
    slug: "west-hollywood",
    name: "West Hollywood",
    county: "Los Angeles County",
    fullPath: "/locations/west-hollywood",

    seoTitle: "ADU Builders in West Hollywood CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in West Hollywood. Premium ADUs for one of LA's most competitive rental markets. Free property assessment.",

    heroTagline: "Serving West Hollywood",
    heroHeading: "Premium ADU Design & Build in West Hollywood",
    heroSubheading:
      "West Hollywood's rental market is among the most competitive in all of Los Angeles. A well-designed ADU here generates strong income and long-term asset value — we handle every step.",

    introHeading: "ADU Investment in West Hollywood",
    introParagraphs: [
      "West Hollywood is a dense, walkable city with among the highest per-square-foot rental rates in all of Greater Los Angeles. Its location — between Beverly Hills, Hollywood, and the Sunset Strip — and its walkable retail and dining scene drive demand from entertainment professionals, healthcare workers, and design industry tenants willing to pay a premium for a well-located home.",
      "For homeowners on single-family lots in WeHo's residential neighborhoods — Norma Triangle, Spaulding Square, and the hillside streets above Sunset — an ADU is often the most impactful financial move available. The combination of premium rents and high underlying property values creates exceptional long-term return on ADU investment.",
    ],

    stats: [
      { value: "$3,000/mo", label: "Avg Studio ADU Rent" },
      { value: "10–16 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Among the highest rental rates per square foot in all of Los Angeles County",
      "Walkable access to the Sunset Strip, Santa Monica Blvd, and major West Hollywood employers",
      "Strong demand from entertainment, fashion, design, and healthcare professionals",
      "Small city government — more responsive permitting process than LADBS",
      "High underlying property values amplify long-term appreciation of ADU investment",
      "Proximity to Beverly Hills, Hollywood, and the Westside extends the tenant search pool",
    ],

    permitHeading: "ADU Permitting in West Hollywood",
    permitNotes: [
      {
        title: "City of West Hollywood Community Development Department",
        body: "West Hollywood is an independent city with its own permitting authority — separate from the City of Los Angeles. ADUs are permitted through WeHo's Community Development Department. The city has adopted California's ADU laws in full.",
      },
      {
        title: "Hillside & Slope Conditions",
        body: "Many of West Hollywood's residential properties sit on sloped terrain north of Sunset. Hillside projects require geotechnical evaluation and may need slope stability analysis before plan review begins. We conduct a full site feasibility review — including slope assessment — before any design work starts.",
      },
      {
        title: "Design Compatibility Standards",
        body: "West Hollywood's Community Development Department pays attention to design quality and neighborhood compatibility. Our team designs ADUs that reflect the design language of the primary residence — appropriate massing, compatible materials, and thoughtful placement — which helps ensure smooth plan review.",
      },
      {
        title: "Permit Timeline",
        body: "ADU permitting in West Hollywood typically runs 10–16 weeks from complete submission. West Hollywood's smaller department often allows more direct communication with plan check reviewers, which can reduce correction round timelines.",
      },
    ],

    pricingIntro:
      "West Hollywood ADU construction reflects one of LA's most desirable markets — premium rents shorten payback timelines significantly. All-inclusive pricing covers design, engineering, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$65,000 – $110,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$90,000 – $165,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$135,000 – $235,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$165,000 – $300,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Can I build an ADU in West Hollywood if my lot is on a slope?",
        a: "Yes, hillside ADUs are buildable in West Hollywood, but sloped properties require geotechnical assessment before plan submission. Foundation work on hillside lots adds to construction costs. We assess slope feasibility and include any required geotechnical scope in your initial estimate — no surprise costs later.",
      },
      {
        q: "What rental income can I expect from a West Hollywood ADU?",
        a: "West Hollywood commands some of the highest rental rates in LA. Studio ADUs typically achieve $2,500–$3,500/month. One-bedroom ADUs in WeHo's residential neighborhoods often rent for $3,200–$4,500/month. Annual gross rental income of $38,000–$54,000 is realistic for a well-designed one-bedroom unit.",
      },
      {
        q: "How does permitting in West Hollywood compare to the City of LA?",
        a: "West Hollywood is an independent city with its own planning and building department — separate from LADBS. The department is smaller and often allows more direct communication with plan reviewers. Standard ADU projects typically permit within 10–16 weeks. Many homeowners find WeHo's process more communicative than LADBS.",
      },
      {
        q: "Is West Hollywood a good market for furnished mid-term ADU rentals?",
        a: "Yes — West Hollywood has strong demand for furnished mid-term rentals (30–90 days) from entertainment industry professionals and corporate visitors. Mid-term furnished rates typically exceed standard long-term rents by 20–40%. These arrangements are generally subject to fewer local regulations than short-term (under 30 day) rentals.",
      },
    ],

    nearbyAreas: ["Hollywood", "Beverly Hills", "Silver Lake", "Los Feliz", "Melrose", "Fairfax"],
  },

  // ── Long Beach ────────────────────────────────────────────────────────────
  {
    slug: "long-beach",
    name: "Long Beach",
    county: "Los Angeles County",
    fullPath: "/locations/long-beach",

    seoTitle: "ADU Builders in Long Beach CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in Long Beach. Specialists in Long Beach's ADU permit process — garage conversions, detached units, and JADUs. Free assessment.",

    heroTagline: "Serving Long Beach",
    heroHeading: "ADU Design & Build Specialists in Long Beach",
    heroSubheading:
      "Long Beach offers some of the most ADU-friendly conditions in Southern California — large lots, affordable construction relative to the coast, and strong rental demand near the port and healthcare corridor.",

    introHeading: "Why Long Beach Is a Strong Market for ADU Investment",
    introParagraphs: [
      "Long Beach is one of LA County's largest cities, and its housing market is remarkably diverse — ranging from walkable Belmont Shore bungalows to sprawling North Long Beach ranches on 7,000+ square foot lots. That variety means ADU options are wide: garage conversions, detached backyard cottages, and interior JADUs are all viable depending on the property.",
      "The Long Beach rental market is driven by the Port of Long Beach and Los Angeles — the nation's busiest port complex — along with Long Beach Memorial Medical Center, California State University Long Beach, and a growing aerospace and logistics employer base. These institutional anchors create steady demand for well-priced, quality ADU space.",
    ],

    stats: [
      { value: "$1,900/mo", label: "Avg Studio ADU Rent" },
      { value: "10–18 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Large lots throughout North and Central Long Beach create room for detached ADUs",
      "Steady rental demand from the port, CSULB, and Long Beach Medical Center",
      "More affordable construction costs than coastal LA markets — better margin profile",
      "Growing arts and restaurant district draws young professionals seeking rental housing",
      "No owner-occupancy requirement under California state ADU law",
      "Long Beach's independent permit department offers a direct alternative to LADBS",
    ],

    permitHeading: "ADU Permitting in Long Beach",
    permitNotes: [
      {
        title: "City of Long Beach Development Services",
        body: "Long Beach operates its own building and planning department — the City of Long Beach Development Services. The city has adopted California's ADU laws in full and permits ADUs on most single-family residential lots throughout its boundaries.",
      },
      {
        title: "Coastal Zone Properties",
        body: "Properties near the coast — including parts of Belmont Shore, Bluff Park, and Naples — may sit within the Coastal Zone and require a Coastal Development Permit (CDP) in addition to standard building permits. We assess coastal overlay status during the free site evaluation.",
      },
      {
        title: "Older Housing Stock Considerations",
        body: "Long Beach has significant post-war housing stock from the 1940s–1960s. Older homes may have outdated electrical panels, aging plumbing, or unconventional framing that adds scope to a garage conversion or addition. We conduct thorough condition assessments before finalizing pricing.",
      },
      {
        title: "Permit Timeline",
        body: "Standard ADU permitting in Long Beach runs 10–18 weeks. Coastal Zone projects requiring CDP review may take longer. Long Beach's department is generally communicative and responsive to correction inquiries.",
      },
    ],

    pricingIntro:
      "Long Beach ADU costs reflect competitive South Bay construction pricing. The city's scale and housing diversity mean the right ADU type varies significantly by neighborhood. All-inclusive pricing covers design, engineering, permitting, and construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$58,000 – $95,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$78,000 – $145,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$115,000 – $205,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$145,000 – $265,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "What ADU type works best in Long Beach?",
        a: "It depends on the neighborhood and lot. North Long Beach and Central Long Beach often have large lots where a new detached ADU makes sense. Older neighborhoods with detached garages are strong garage conversion candidates. Belmont Shore bungalows may be better suited to JADUs carved from interior space. We assess every property individually and recommend the best path after a free site review.",
      },
      {
        q: "Does Long Beach have its own permitting department or does it use LADBS?",
        a: "Long Beach has its own independent planning and building department — the City of Long Beach Development Services. It does not use LADBS. Long Beach-specific rules and timelines apply, and our team has active experience navigating both.",
      },
      {
        q: "What rental income can I expect from a Long Beach ADU?",
        a: "Studio ADUs in Long Beach typically rent for $1,600–$2,200/month. One-bedroom ADUs achieve $2,000–$2,800/month in most neighborhoods. Belmont Shore and Bluff Park command a coastal premium. Annual gross rental income of $20,000–$34,000 is realistic for most Long Beach ADUs.",
      },
      {
        q: "Are Long Beach properties near the coast harder to permit?",
        a: "Coastal-adjacent properties in Long Beach may require a Coastal Development Permit (CDP) in addition to standard building permits. This adds process time and review steps but is manageable with proper preparation. We identify your property's coastal overlay status during the initial assessment and factor any CDP requirements into your project timeline.",
      },
    ],

    nearbyAreas: ["Lakewood", "Compton", "Carson", "Torrance", "Signal Hill", "Bellflower"],
  },

  // ── Torrance ──────────────────────────────────────────────────────────────
  {
    slug: "torrance",
    name: "Torrance",
    county: "Los Angeles County",
    fullPath: "/locations/torrance",

    seoTitle: "ADU Builders in Torrance CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in Torrance. Specialists in Torrance's permit process for garage conversions, detached ADUs, and JADUs. Free assessment.",

    heroTagline: "Serving Torrance",
    heroHeading: "ADU Design & Build Specialists in Torrance",
    heroSubheading:
      "Torrance homeowners are building ADUs to house extended family, generate rental income, and strengthen long-term property value. We handle design, permitting, and construction in Torrance — all under one roof.",

    introHeading: "Why Torrance Is an Underappreciated ADU Market",
    introParagraphs: [
      "Torrance is one of the South Bay's most stable and livable cities. Its aerospace and engineering employer base — including Toyota North America's former headquarters, Raytheon, and Northrop Grumman — draws a professional resident population that values quality housing. That workforce creates consistent rental demand across all price points.",
      "Torrance's residential layout is ADU-friendly in ways that often surprise homeowners. Many post-war neighborhoods feature wide lots, detached garages, and single-story homes that leave meaningful rear yard area for new construction. The city has adopted California's ADU laws in full, and most Torrance lots are legally eligible for at least one ADU.",
    ],

    stats: [
      { value: "$2,000/mo", label: "Avg Studio ADU Rent" },
      { value: "10–18 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Post-war ranch neighborhoods offer wide lots with strong ADU buildability",
      "Stable employment base from aerospace, engineering, and South Bay healthcare employers",
      "Strong multigenerational housing demand from Torrance's diverse residential community",
      "South Bay coastal access and beach proximity support premium ADU rental rates",
      "Competitive construction costs versus the beach cities to the west",
      "Excellent freeway access (405, 110, 91) broadens the tenant pool to all of South Bay",
    ],

    permitHeading: "ADU Permitting in Torrance",
    permitNotes: [
      {
        title: "City of Torrance Community Development Department",
        body: "Torrance permits ADUs through its Community Development Department. The city has fully adopted California's ADU statutes and allows ADUs on most single-family residential lots within city limits.",
      },
      {
        title: "Post-War Housing Conditions",
        body: "Torrance's mid-century housing stock sometimes requires electrical upgrades or panel replacement as part of an ADU project — particularly for garage conversions that need to meet current code for habitable space. We assess structural and mechanical condition during the initial site review.",
      },
      {
        title: "Lot Coverage Limits",
        body: "Torrance applies standard residential lot coverage limits. Most single-family lots accommodate a rear ADU without exceeding coverage thresholds, but we verify this during the property assessment. ADUs under 800 sq ft are generally permitted regardless of lot coverage under California state law.",
      },
      {
        title: "Permit Timeline",
        body: "ADU permitting in Torrance typically takes 10–18 weeks from complete plan submission. Torrance's building department is generally straightforward for standard ADU project types.",
      },
    ],

    pricingIntro:
      "Torrance ADU costs sit in the mid-range of the LA market — lower than the beach cities, higher than the eastern San Gabriel Valley. All-inclusive pricing covers design, engineering, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$58,000 – $98,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$78,000 – $148,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$115,000 – $210,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$148,000 – $268,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "What's the most popular ADU type in Torrance?",
        a: "Garage conversions are consistently the most popular ADU path in Torrance, given the area's large number of detached post-war garages. For lots with more rear yard space — particularly in East Torrance and the Del Amo area — new detached ADUs are also common. We recommend the best option after reviewing your specific property.",
      },
      {
        q: "Can I build an ADU for a family member and still rent it later?",
        a: "Yes. ADUs in Torrance are not restricted to family use — you can build for a parent or adult child, occupy the space yourself, or rent it on the open market at any time. California law does not require owner-occupancy or limit who you rent to.",
      },
      {
        q: "How long does ADU permitting take in Torrance?",
        a: "Standard ADU projects in Torrance are typically permitted within 10–18 weeks of complete plan submission. Our team manages all city correspondence and correction responses. We've navigated Torrance's process many times and prepare our submissions to minimize back-and-forth.",
      },
      {
        q: "Will my electrical panel need to be upgraded for a Torrance ADU?",
        a: "It depends on your existing panel capacity. Garage conversions in particular often require panel upgrades since they're adding habitable square footage with new circuits for HVAC, kitchen, and lighting. We assess electrical capacity during the free site evaluation and include any required upgrades in the all-inclusive fixed price.",
      },
    ],

    nearbyAreas: ["Redondo Beach", "Hawthorne", "Gardena", "Carson", "Long Beach", "El Segundo"],
  },

  // ── El Segundo ────────────────────────────────────────────────────────────
  {
    slug: "el-segundo",
    name: "El Segundo",
    county: "Los Angeles County",
    fullPath: "/locations/el-segundo",

    seoTitle: "ADU Builders in El Segundo CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in El Segundo. Premium ADUs in one of the South Bay's strongest rental markets. Free property assessment.",

    heroTagline: "Serving El Segundo",
    heroHeading: "ADU Design & Build Specialists in El Segundo",
    heroSubheading:
      "El Segundo is a small city with an outsized employment base and exceptional ADU rental demand. We build premium ADUs for homeowners looking to capitalize on one of the South Bay's most competitive markets.",

    introHeading: "El Segundo: A Compact City with Exceptional ADU Demand",
    introParagraphs: [
      "El Segundo's tiny geographic footprint — barely 5 square miles — sits adjacent to LAX and is home to an extraordinarily dense cluster of aerospace, defense, and technology companies. Raytheon, Boeing, Northrop Grumman, Mattel, and a growing number of tech startups employ tens of thousands of workers within or near the city. That employment density creates housing demand that the city's limited residential stock cannot satisfy alone.",
      "For El Segundo homeowners, this creates a uniquely favorable ADU dynamic: high tenant demand, limited rental supply, and a tenant profile that includes well-compensated aerospace and tech professionals willing to pay for quality. Studio and one-bedroom ADUs in El Segundo consistently command rents that exceed comparable units in many beach cities.",
    ],

    stats: [
      { value: "$2,400/mo", label: "Avg Studio ADU Rent" },
      { value: "10–16 wks", label: "Typical Permit Timeline" },
      { value: "5 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Exceptional rental demand from aerospace and tech employers — Boeing, Raytheon, and Northrop Grumman nearby",
      "One of the smallest cities in LA County, so residential rental supply is structurally limited",
      "Premium rents with a tenant profile of well-compensated engineering and professional workforce",
      "LAX proximity creates mid-term furnished rental demand from airline crew and contractors",
      "Walkable downtown, beach access, and a tight-knit community attract long-term residents",
      "El Segundo's compact permit department often moves faster than larger city counterparts",
    ],

    permitHeading: "ADU Permitting in El Segundo",
    permitNotes: [
      {
        title: "City of El Segundo Planning & Building Safety",
        body: "El Segundo operates its own Planning and Building Safety Department, separate from LADBS. The city has adopted California's ADU laws and permits ADUs on eligible single-family residential lots. Its compact size means more direct access to plan check staff.",
      },
      {
        title: "Setback Requirements",
        body: "El Segundo applies a 5-foot rear and side setback for detached ADUs — slightly more than the 4-foot state minimum. This is important to account for during design when maximizing ADU footprint on smaller lots. We verify all setback compliance before finalizing floor plans.",
      },
      {
        title: "Noise & Airport Overlay Zones",
        body: "El Segundo's location adjacent to LAX means some residential properties fall within airport noise overlay zones. This affects insulation and window specifications in new construction. We design to appropriate acoustic standards and disclose these requirements upfront.",
      },
      {
        title: "Permit Timeline",
        body: "ADU permitting in El Segundo typically runs 10–16 weeks. El Segundo's smaller department often allows more direct communication than larger city counterparts, which can reduce correction round timelines.",
      },
    ],

    pricingIntro:
      "El Segundo ADU pricing reflects South Bay construction costs, with a modest premium for airport noise insulation on applicable properties. All-inclusive pricing covers design, engineering, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$62,000 – $100,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$82,000 – $152,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$120,000 – $215,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$152,000 – $272,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Does LAX noise affect ADU construction in El Segundo?",
        a: "Some El Segundo properties fall within airport noise overlay zones that require enhanced insulation, acoustic-rated windows, and mechanical ventilation. These are not prohibitive — they add modest cost and are scoped into our all-inclusive fixed price. We identify whether your property is affected during the free site evaluation.",
      },
      {
        q: "What rental income can I expect from an El Segundo ADU?",
        a: "Studio ADUs in El Segundo typically rent for $2,000–$2,800/month. One-bedroom ADUs achieve $2,600–$3,400/month in most neighborhoods. Annual gross rental income of $24,000–$40,000 is realistic. Furnished mid-term rentals targeting aerospace and airline industry tenants can command a further premium.",
      },
      {
        q: "How long does ADU permitting take in El Segundo?",
        a: "Standard ADU projects in El Segundo are typically permitted within 10–16 weeks. El Segundo's compact building department allows for more direct plan reviewer communication than larger city departments. We manage all submissions and correspondence.",
      },
      {
        q: "El Segundo lots seem small — can I still fit a meaningful ADU?",
        a: "El Segundo lots vary in size, and many are more spacious than visitors expect. For tighter lots, we design compact but fully functional ADUs in the 400–600 sq ft range that still achieve strong rental rates given the area's demand. We maximize every square foot through thoughtful layout and storage design.",
      },
    ],

    nearbyAreas: ["Manhattan Beach", "Hawthorne", "Inglewood", "Torrance", "Culver City", "Playa del Rey"],
  },

  // ── Woodland Hills ────────────────────────────────────────────────────────
  {
    slug: "woodland-hills",
    name: "Woodland Hills",
    county: "Los Angeles County",
    fullPath: "/locations/woodland-hills",

    seoTitle: "ADU Builders in Woodland Hills CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in Woodland Hills. Large lots, fire zone expertise, and LADBS navigation. Free property assessment.",

    heroTagline: "Serving Woodland Hills",
    heroHeading: "ADU Design & Build Specialists in Woodland Hills",
    heroSubheading:
      "Woodland Hills homeowners have large lots, strong family housing demand, and a growing rental market. We design, permit, and build ADUs throughout the western San Fernando Valley — including fire zone and hillside properties.",

    introHeading: "ADU Opportunity in Woodland Hills",
    introParagraphs: [
      "Woodland Hills is one of the western San Fernando Valley's most spacious residential communities. Large lots — many ranging from 8,000 to over 20,000 square feet — give homeowners real flexibility in ADU design that denser neighborhoods simply don't offer. Whether you're building a large detached unit with full amenities or converting an existing guest house, the lot sizes here create options.",
      "The western Valley's rental market has grown steadily as high housing costs push renters from the Westside. Woodland Hills benefits from freeway access to major employment centers, its own expanding retail and dining corridor along Ventura Boulevard, and a reputation as one of the Valley's more desirable family neighborhoods. These factors support consistent ADU rental demand from working professionals and families seeking more space than central LA allows.",
    ],

    stats: [
      { value: "$1,900/mo", label: "Avg Studio ADU Rent" },
      { value: "10–20 wks", label: "Typical Permit Timeline (LADBS)" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Large lot sizes — many 8,000–20,000+ sq ft — give real flexibility in ADU design and placement",
      "Strong multigenerational housing demand from extended family households",
      "Ventura Boulevard corridor and retail amenities draw working professional renters",
      "More affordable construction per square foot than coastal markets",
      "Excellent 101/405 freeway access to Westside and downtown employment centers",
      "Growing demand from renters priced out of Santa Monica, Brentwood, and West Hollywood",
    ],

    permitHeading: "ADU Permitting in Woodland Hills",
    permitNotes: [
      {
        title: "LADBS Jurisdiction",
        body: "Woodland Hills is within the City of Los Angeles, so ADU permits are processed by the Los Angeles Department of Building and Safety (LADBS). LADBS runs a dedicated ADU plan check program with typical timelines of 10–20 weeks from complete submission.",
      },
      {
        title: "Very High Fire Hazard Severity Zone (VHFHSZ)",
        body: "Significant portions of Woodland Hills — particularly north of the 101 freeway toward the Santa Monica Mountains — are designated Very High Fire Hazard Severity Zones. This means California Building Code Chapter 7A fire-resistive construction requirements apply: ember-resistant vents, Class A roofing, and ignition-resistant exterior materials. We design and price to these standards from day one.",
      },
      {
        title: "Large Lot Design Considerations",
        body: "Woodland Hills lots are often large enough to support both an ADU and a JADU simultaneously. For properties with guest houses or pool houses, we also assess whether those structures qualify for permit-through-conversion, which can be faster and lower-cost than new construction.",
      },
      {
        title: "Hillside Properties",
        body: "Properties north of the 101 frequently involve slope. Hillside lots require geotechnical investigation and may have stepped foundations and additional grading requirements. We conduct thorough slope and soil assessments during the free property review.",
      },
    ],

    pricingIntro:
      "Woodland Hills ADU costs reflect standard City of LA pricing with modest premiums for fire zone materials and hillside conditions where applicable. All-inclusive pricing covers design, engineering, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$120,000 – $220,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$150,000 – $280,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "My Woodland Hills property is in a fire zone. Can I still build an ADU?",
        a: "Yes — fire zone designation does not prevent ADU construction. It does require fire-resistive materials and systems under California Building Code Chapter 7A: ember-resistant vents, Class A roofing, ignition-resistant exterior cladding, and in some cases dual-pane windows. We scope and price these requirements upfront in your all-inclusive fixed contract.",
      },
      {
        q: "My lot is large — can I build a bigger ADU?",
        a: "Under California law, ADUs can be up to 1,200 sq ft or 50% of the primary dwelling's square footage — whichever is smaller. Large lot size increases placement flexibility but does not directly increase the size cap. If your primary dwelling is large, the 50% rule may allow a larger unit than the standard cap. We calculate your specific maximum during the feasibility review.",
      },
      {
        q: "What's the permitting timeline for a Woodland Hills ADU?",
        a: "Woodland Hills uses LADBS, which runs a dedicated ADU plan check program. Standard timelines are 10–20 weeks from complete submission. Fire zone properties may require additional CAL FIRE compliance documentation, which we prepare as part of our submission package.",
      },
      {
        q: "Is there rental demand in Woodland Hills for ADUs?",
        a: "Yes — Woodland Hills attracts renters seeking more space than West LA or the Westside offers at comparable rent. The 101 freeway provides access to Studio City, Sherman Oaks, and downtown LA employers. Studio ADUs typically rent for $1,600–$2,200/month; one-bedroom units achieve $2,000–$2,800/month in most Woodland Hills neighborhoods.",
      },
    ],

    nearbyAreas: ["Calabasas", "West Hills", "Tarzana", "Encino", "Sherman Oaks", "Reseda"],
  },

  // ── Sherman Oaks ──────────────────────────────────────────────────────────
  {
    slug: "sherman-oaks",
    name: "Sherman Oaks",
    county: "Los Angeles County",
    fullPath: "/locations/sherman-oaks",

    seoTitle: "ADU Builders in Sherman Oaks CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in Sherman Oaks. Central Valley location, LADBS expertise, and garage conversion specialists. Free property assessment.",

    heroTagline: "Serving Sherman Oaks",
    heroHeading: "ADU Design & Build Specialists in Sherman Oaks",
    heroSubheading:
      "Sherman Oaks sits at the geographic and commercial center of the San Fernando Valley — making it one of the most accessible, in-demand ADU rental markets in the Valley. We build throughout Sherman Oaks, from first design to final inspection.",

    introHeading: "Sherman Oaks: A Central Valley Location with Strong ADU Fundamentals",
    introParagraphs: [
      "Sherman Oaks is the business and transit hub of the central San Fernando Valley. Its position on Ventura Boulevard, at the intersection of the 101 and 405 freeways, gives it access to essentially every major employment center in the Los Angeles basin within a reasonable commute. That central location is a primary driver of its rental demand — tenants who work anywhere from Burbank to the Westside consider Sherman Oaks a viable home base.",
      "Sherman Oaks neighborhoods south of Ventura Boulevard — closer to the foothills and Mulholland Drive — tend to have larger lots and quieter streets, making them particularly suitable for detached ADU construction. Neighborhoods north of Ventura are generally flatter and more densely built, with garage conversions being the more common ADU path.",
    ],

    stats: [
      { value: "$2,100/mo", label: "Avg Studio ADU Rent" },
      { value: "10–20 wks", label: "Typical Permit Timeline (LADBS)" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Central Valley location — within practical commute of Burbank, Westside, and downtown LA",
      "101/405 freeway access and E Line Metro connection expand the tenant pool",
      "Mix of flat and foothill lots gives homeowners multiple ADU path options",
      "Strong demand from young professionals and dual-income households priced out of West LA",
      "Active restaurant, retail, and nightlife scene on Ventura Blvd drives rental desirability",
      "More affordable to build than coastal markets with comparable rental yield",
    ],

    permitHeading: "ADU Permitting in Sherman Oaks",
    permitNotes: [
      {
        title: "LADBS Jurisdiction",
        body: "Sherman Oaks is within the City of Los Angeles and permitted through LADBS. LADBS operates a dedicated ADU plan check program. Sherman Oaks addresses use the LADBS South Valley District Office, which handles the bulk of San Fernando Valley ADU submittals.",
      },
      {
        title: "Hillside Properties South of Ventura",
        body: "Properties in Sherman Oaks south of Ventura Boulevard and closer to Mulholland Drive can involve significant slope. Hillside lots require geotechnical investigation and may have stepped or pier-and-grade-beam foundations that add to construction cost. We evaluate slope conditions during the free property review.",
      },
      {
        title: "Fire Zone Overlay",
        body: "Properties in Sherman Oaks Hills — the hilly areas south of Ventura toward Mulholland — may fall within fire hazard severity zones under CAL FIRE maps. Chapter 7A fire-resistive construction applies for affected properties. We verify fire zone status for every property we assess.",
      },
      {
        title: "Permit Timeline",
        body: "LADBS standard ADU plan check typically runs 10–20 weeks from complete submission. The dedicated ADU program at LADBS is specifically designed to reduce review times for ADU-only project types.",
      },
    ],

    pricingIntro:
      "Sherman Oaks ADU pricing is in line with City of LA market rates. Hillside and fire zone properties carry modest cost premiums. All-inclusive pricing covers design, engineering, permitting, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$120,000 – $220,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$150,000 – $280,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Is Sherman Oaks a good ADU rental market?",
        a: "Yes — Sherman Oaks is one of the central Valley's most in-demand rental neighborhoods. Its central location, freeway access, and strong Ventura Boulevard retail and dining scene attract young professionals, couples, and dual-income households. Studio ADUs typically rent for $1,800–$2,400/month; one-bedroom units achieve $2,200–$2,900/month.",
      },
      {
        q: "My Sherman Oaks property is on a hillside. Is an ADU feasible?",
        a: "Hillside ADUs in Sherman Oaks are feasible but require more upfront engineering. Sloped lots need geotechnical investigation to confirm soil stability, and foundations are typically stepped or pier-and-grade-beam designs. These add to cost but are common and manageable. We assess your specific slope and provide a comprehensive feasibility evaluation at no charge.",
      },
      {
        q: "How does permitting work for a Sherman Oaks ADU?",
        a: "Sherman Oaks is within the City of Los Angeles and uses LADBS for all building permits. LADBS runs a dedicated ADU plan check track. Standard ADU projects typically permit in 10–20 weeks. We prepare thorough, LADBS-compliant submissions and manage all review correspondence on your behalf.",
      },
      {
        q: "What's the difference between building south vs. north of Ventura Blvd in Sherman Oaks?",
        a: "South of Ventura tends to be hillier with larger lots and quieter streets — well-suited to detached ADUs on rear flat areas. North of Ventura is flatter and more densely built, where garage conversions are often the most practical option. We assess your specific address and recommend the right path based on your lot's actual conditions.",
      },
    ],

    nearbyAreas: ["Encino", "Studio City", "Tarzana", "Van Nuys", "North Hollywood", "Woodland Hills"],
  },

  // ── Encino ────────────────────────────────────────────────────────────────
  {
    slug: "encino",
    name: "Encino",
    county: "Los Angeles County",
    fullPath: "/locations/encino",

    seoTitle: "ADU Builders in Encino CA | ADU Build LA",
    seoDescription:
      "ADU design, permitting, and construction in Encino. Large lots, premium ADUs, and LADBS expertise. Free property assessment in Encino — no obligation.",

    heroTagline: "Serving Encino",
    heroHeading: "Premium ADU Design & Build in Encino",
    heroSubheading:
      "Encino's large lots, established neighborhoods, and strong rental demand from the professional and entertainment community make it one of the Valley's most compelling ADU investment markets.",

    introHeading: "Why Encino Is One of the Valley's Premier ADU Markets",
    introParagraphs: [
      "Encino is among the most affluent residential communities in the San Fernando Valley, with lot sizes and home values that reflect decades of investment in quality housing. Many Encino properties feature large rear yards, existing pool houses or guest structures, and room for a new detached ADU without compromising the character of the primary residence.",
      "The tenant profile Encino attracts — entertainment industry professionals, healthcare specialists, and families seeking a quieter Valley alternative to Brentwood or Studio City — means ADU rental income is strong and tenant quality is generally high. Encino sits at a premium tier within the Valley market, and well-designed ADUs reflect that positioning.",
    ],

    stats: [
      { value: "$2,300/mo", label: "Avg Studio ADU Rent" },
      { value: "$3,000/mo", label: "Avg 1BR ADU Rent" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Large lots in many Encino neighborhoods give genuine flexibility in ADU design and placement",
      "Premium tenant profile — entertainment professionals, executives, and healthcare workers",
      "Existing pool houses and guest structures may be permittable as ADUs at lower cost",
      "Strong long-term property value growth amplifies the financial return of ADU investment",
      "101 and 405 freeway access to Westside, downtown, and Burbank employment",
      "Quiet, established neighborhoods with mature trees attract high-quality long-term tenants",
    ],

    permitHeading: "ADU Permitting in Encino",
    permitNotes: [
      {
        title: "LADBS Jurisdiction",
        body: "Encino is within the City of Los Angeles and permitted through LADBS. The South Valley District Office handles Encino ADU submittals. LADBS's dedicated ADU plan check program applies.",
      },
      {
        title: "Converting Existing Guest Structures",
        body: "Many Encino properties have existing guest houses, pool houses, or accessory structures. In some cases, these can be permitted as ADUs through a conversion process that is faster and less expensive than new construction. We assess the structure's condition, foundation, and utility connections during the free site evaluation.",
      },
      {
        title: "Hillside Properties",
        body: "Encino properties north of Ventura, particularly toward Mulholland, can involve significant slope. Hillside projects require geotechnical investigation. We evaluate slope conditions as part of every Encino site assessment.",
      },
      {
        title: "Fire Hazard Severity Zones",
        body: "Hillside properties in Encino near the Santa Monica Mountains may fall in Very High Fire Hazard Severity Zones. CAL FIRE maps determine the specific designation for each address. Fire zone ADUs require Chapter 7A fire-resistive construction — we account for this in every scope and estimate.",
      },
    ],

    pricingIntro:
      "Encino ADU pricing reflects City of LA construction costs. Large lots often allow larger, higher-value ADUs that command premium rents. Guest structure conversions can offer a cost-effective alternative to new construction. All-inclusive pricing covers design, engineering, permitting, and construction.",
    pricingRanges: [
      { type: "Guest Structure Conversion", range: "$70,000 – $140,000", note: "Existing structure with foundations" },
      { type: "Garage Conversion ADU", range: "$82,000 – $152,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$122,000 – $225,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$155,000 – $290,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Can I convert my Encino pool house or guest structure into a permitted ADU?",
        a: "Often yes. Existing guest structures with a foundation, basic framing, and utility access are strong ADU conversion candidates. The process is typically faster and less expensive than new construction. We assess the structure's condition, current code compliance gaps, and conversion feasibility during the free site evaluation.",
      },
      {
        q: "What rental income can I expect from an Encino ADU?",
        a: "Encino sits at a premium tier within the Valley market. Studio ADUs typically achieve $2,000–$2,600/month. One-bedroom ADUs routinely rent for $2,600–$3,400/month in most Encino neighborhoods. Well-designed larger units can exceed those ranges for the right tenant profile.",
      },
      {
        q: "How does LADBS handle Encino ADU permits?",
        a: "Encino falls under LADBS South Valley District, which processes all ADU permits using LADBS's dedicated ADU plan check program. Standard timelines are 10–20 weeks from complete submission. Our team manages every step of the LADBS process and handles all correction responses.",
      },
      {
        q: "What if my Encino property is in a fire zone?",
        a: "Encino hillside properties near Mulholland and the Santa Monica Mountains may be in Very High Fire Hazard Severity Zones. Fire zone designation means ADU construction requires Chapter 7A fire-resistive materials — ember vents, Class A roofing, ignition-resistant cladding. We assess your property's fire zone status during the initial evaluation and include all compliance costs in the fixed price.",
      },
    ],

    nearbyAreas: ["Sherman Oaks", "Tarzana", "Woodland Hills", "Studio City", "Calabasas", "Van Nuys"],
  },

  // ── Studio City ───────────────────────────────────────────────────────────
  {
    slug: "studio-city",
    name: "Studio City",
    county: "Los Angeles County",
    fullPath: "/locations/studio-city",

    seoTitle: "ADU Builders in Studio City CA | ADU Build LA",
    seoDescription:
      "Premium ADU design, permitting, and construction in Studio City. One of the Valley's most desirable rental markets — near Burbank studios and the Cahuenga Pass. Free assessment.",

    heroTagline: "Serving Studio City",
    heroHeading: "Premium ADU Design & Build in Studio City",
    heroSubheading:
      "Studio City commands Valley-leading rental rates with proximity to Burbank's studios, a walkable Ventura Boulevard, and a location that connects the Valley to Hollywood. A well-built ADU here is among the Valley's best investment opportunities.",

    introHeading: "Why Studio City Is the Valley's Premier ADU Rental Market",
    introParagraphs: [
      "Studio City is the San Fernando Valley's most desirable residential neighborhood — a status earned by its location at the Cahuenga Pass, its walkable Ventura Boulevard retail and dining scene, and its proximity to the Burbank entertainment corridor and Hollywood just over the hill. Those advantages drive rental demand from entertainment industry professionals, writers, and creative industry workers who want Valley living without Valley isolation.",
      "For homeowners, Studio City's premium market position translates directly into ADU returns. One-bedroom ADUs in Studio City regularly achieve rents that exceed comparable units in many Westside neighborhoods — while construction costs remain lower than the beach cities. That spread is the core ADU investment opportunity here.",
    ],

    stats: [
      { value: "$2,500/mo", label: "Avg Studio ADU Rent" },
      { value: "$3,200/mo", label: "Avg 1BR ADU Rent" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Valley-leading rental rates driven by entertainment industry and creative professional demand",
      "Walking distance to Ventura Boulevard dining, retail, and the weekly Studio City Farmers Market",
      "Short drive or rideshare to Burbank studios, Universal, and Hollywood — prime tenant profile",
      "Hillside streets north of Ventura offer views and premium positioning for higher rents",
      "Freeway access to 101 and 134 expands commute range for prospective tenants",
      "Strong resale market means ADU investment increases total property value meaningfully",
    ],

    permitHeading: "ADU Permitting in Studio City",
    permitNotes: [
      {
        title: "LADBS Jurisdiction",
        body: "Studio City is within the City of Los Angeles and permitted through LADBS. The South Valley District Office handles Studio City ADU submissions. LADBS's dedicated ADU plan check program applies to all Studio City projects.",
      },
      {
        title: "Hillside Properties North of Ventura",
        body: "Studio City has a significant number of homes on hillside lots north of Ventura Boulevard. These properties require geotechnical investigation before plan submission. Hillside ADUs typically have stepped or pier-and-grade-beam foundations and may require retaining walls. We evaluate slope conditions thoroughly during the free site review.",
      },
      {
        title: "Fire Hazard Severity Zones",
        body: "Hillside areas of Studio City, particularly those closest to the Santa Monica Mountains Conservancy land, may be designated Fire Hazard Severity Zones. Chapter 7A fire-resistive construction applies. We confirm fire zone status for every property and account for compliance costs upfront.",
      },
      {
        title: "Design Sensitivity in Established Neighborhoods",
        body: "Studio City's residential neighborhoods are well-established, and LADBS reviewers pay attention to compatibility. Our design team creates ADUs that complement the architecture of the primary residence — appropriate scale, compatible materials, and thoughtful massing — to minimize the risk of plan check objections.",
      },
    ],

    pricingIntro:
      "Studio City ADU pricing reflects a premium within the City of LA market. Hillside and fire zone properties carry modest cost premiums that the rental market more than offsets. All-inclusive pricing covers design, engineering, permitting, and construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$63,000 – $105,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$83,000 – $155,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$125,000 – $225,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$155,000 – $290,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "What rental income can I expect from a Studio City ADU?",
        a: "Studio City commands the Valley's highest ADU rents. Studio units typically achieve $2,200–$2,900/month. One-bedroom ADUs regularly rent for $2,800–$3,600/month, with premium hillside units reaching higher. Annual gross rental income of $33,000–$43,000 is realistic for a well-designed one-bedroom ADU in Studio City.",
      },
      {
        q: "I have a hillside lot in Studio City — is an ADU feasible?",
        a: "Hillside ADUs in Studio City are very buildable, but they require more upfront engineering than flat-lot projects. Geotechnical investigation, slope stability analysis, and more complex foundation systems add cost. However, hillside views and privacy can command rental premiums that offset the higher build cost. We assess every hillside property thoroughly before recommending an approach.",
      },
      {
        q: "How does LADBS permitting work for Studio City?",
        a: "Studio City falls within LADBS South Valley District jurisdiction. All ADU permits are processed through LADBS's dedicated ADU plan check program. Standard timelines are 10–20 weeks from complete submission. We prepare LADBS-compliant submissions and manage all correction responses.",
      },
      {
        q: "Is Studio City a strong market for furnished or short-term ADU rentals?",
        a: "Studio City has active demand for furnished mid-term rentals from entertainment industry professionals on temporary assignments. Mid-term rentals (30+ days) typically exceed standard long-term rents by 20–40%. Short-term rentals (under 30 days) are subject to the City of LA's Home-Sharing Ordinance and require registration. We recommend long-term or mid-term for maximum simplicity and consistent income.",
      },
    ],

    nearbyAreas: ["Sherman Oaks", "Toluca Lake", "North Hollywood", "Burbank", "Encino", "Silver Lake"],
  },

  // ── Venice ────────────────────────────────────────────────────────────────
  {
    slug: "venice",
    name: "Venice",
    county: "Los Angeles County",
    fullPath: "/locations/venice",

    seoTitle: "ADU Builders in Venice CA | ADU Build LA",
    seoDescription:
      "Premium ADU design, permitting, and construction in Venice. Coastal Zone expertise, high rental yields, and LADBS navigation. Free property assessment.",

    heroTagline: "Serving Venice",
    heroHeading: "Premium ADU Design & Build in Venice",
    heroSubheading:
      "Venice is one of LA's most creative, walkable, and in-demand neighborhoods — with ADU rental rates to match. We build premium ADUs in Venice, including Coastal Zone properties, with a focus on design quality and permit efficiency.",

    introHeading: "Venice: High Demand, High Value, High ADU Opportunity",
    introParagraphs: [
      "Venice is unlike any other neighborhood in Los Angeles. Its beach access, walkable Abbot Kinney Blvd, creative community, and proximity to Silicon Beach tech employers create a rental market with exceptionally diverse and high-quality demand. Tech executives at Snap, Google, and the growing Santa Monica/Playa Vista tech corridor share the Venice rental market with artists, designers, and entertainment professionals — and they all pay a premium for quality space.",
      "For Venice homeowners, this translates into some of the strongest ADU rental yields in all of Greater Los Angeles. A well-designed, private ADU in Venice regularly achieves $3,000–$4,500/month — often outperforming larger units in many inland LA neighborhoods. The constraint is lot size: Venice lots tend to be smaller, so ADU design must work harder to maximize livable space within tighter footprints.",
    ],

    stats: [
      { value: "$3,200/mo", label: "Avg Studio ADU Rent" },
      { value: "12–20 wks", label: "Typical Permit Timeline" },
      { value: "4 ft", label: "Min Rear / Side Setback" },
      { value: "1,200 sq ft", label: "Max ADU Size" },
    ],

    benefits: [
      "Top-tier ADU rental rates — beach access and walkability drive premium demand",
      "Silicon Beach tech workforce creates consistent high-income tenant demand",
      "Walkable access to Abbot Kinney Blvd, the Venice Boardwalk, and Main Street Santa Monica",
      "Strong short-term and mid-term furnished rental demand from tech and entertainment visitors",
      "Compact lots reward thoughtful ADU design — private outdoor space commands a meaningful premium",
      "High underlying property values mean ADU investment compounds well over time",
    ],

    permitHeading: "ADU Permitting in Venice",
    permitNotes: [
      {
        title: "LADBS Jurisdiction with Coastal Overlay",
        body: "Venice is within the City of Los Angeles, so building permits are processed through LADBS. However, Venice is almost entirely within the California Coastal Zone — which means most ADU projects also require a Coastal Development Permit (CDP) from either the City of Los Angeles or, in some cases, the California Coastal Commission directly.",
      },
      {
        title: "Coastal Development Permit (CDP)",
        body: "A CDP is required for most new construction and additions in Venice's Coastal Zone. The CDP process adds review steps beyond standard LADBS plan check. Our team has navigated Coastal Zone permitting in Venice and Santa Monica many times. We assess your property's specific Coastal Zone designation during the free site evaluation.",
      },
      {
        title: "Venice Specific Plan",
        body: "Venice is covered by the Venice Specific Plan, which establishes additional design standards for new construction — including scale, setbacks, and in some cases design compatibility with the neighborhood's existing character. These are not prohibitive but require knowledgeable design from day one.",
      },
      {
        title: "Permit Timeline",
        body: "Venice ADU projects require more permitting steps than most LA locations — LADBS review plus CDP process. Total permitting timelines of 12–20 weeks are typical for straightforward projects; Coastal Commission-level review (which applies to certain properties near the beach) can extend that further. We assess your specific property's permit pathway during the initial evaluation.",
      },
    ],

    pricingIntro:
      "Venice ADU pricing reflects coastal LA construction costs and a modest premium for Coastal Zone permitting complexity. The rental market more than justifies the investment. All-inclusive pricing covers design, engineering, all permit fees (including CDP), and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$70,000 – $115,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$92,000 – $168,000", note: "Existing garage footprint" },
      { type: "Attached ADU", range: "$140,000 – $245,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$170,000 – $315,000", note: "New standalone structure" },
    ],

    faqs: [
      {
        q: "Does every Venice ADU require a Coastal Development Permit?",
        a: "Most Venice properties are in the Coastal Zone and require a CDP in addition to standard LADBS building permits. The specific process depends on your property's precise location, proximity to the beach, and whether the project qualifies for a categorical exclusion. We determine the exact permit pathway for your property during the free site evaluation.",
      },
      {
        q: "What rental income can I expect from a Venice ADU?",
        a: "Venice commands some of the highest ADU rents in Los Angeles. Studio ADUs typically achieve $2,800–$3,600/month. One-bedroom ADUs routinely rent for $3,400–$4,500/month. Annual gross rental income of $40,000–$54,000 is realistic for a premium one-bedroom ADU in most Venice neighborhoods.",
      },
      {
        q: "Venice lots are small — can I build a useful ADU?",
        a: "Yes — thoughtful design is the key on smaller lots. We design compact ADUs that maximize livable area, use built-in storage efficiently, and prioritize a private outdoor space where the lot allows. A well-designed 450–600 sq ft Venice ADU with its own entrance and patio commands rents comparable to a larger, less thoughtfully designed unit elsewhere.",
      },
      {
        q: "How long does ADU permitting take in Venice?",
        a: "Venice permitting involves LADBS plan check plus Coastal Zone review. Standard projects typically take 12–20 weeks. Properties requiring direct California Coastal Commission review — generally those closest to the beach — can take longer. We assess the full permit pathway for your address before committing to a timeline estimate.",
      },
    ],

    nearbyAreas: ["Santa Monica", "Mar Vista", "Culver City", "Marina del Rey", "Playa del Rey", "El Segundo"],
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getAllLocations(): LocationData[] {
  return LOCATIONS;
}

export function getLocationBySlug(slug: string): LocationData | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function getAllLocationSlugs(): { slug: string }[] {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}
