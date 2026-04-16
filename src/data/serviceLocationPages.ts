/**
 * Service + city landing page data for ADU Build LA.
 *
 * These pages live at /locations/[locationSlug]/[serviceSlug] and combine
 * a specific service intent with a specific city context to deliver genuinely
 * useful, locally specific content rather than generic service pages.
 *
 * CMS-migration-ready: every field maps 1:1 to a future `ServiceLocationPage`
 * Prisma model. To migrate: replace getAllServiceLocationPages() and
 * getServiceLocationPage() with Prisma queries — no template changes needed.
 */

export interface ServiceLocationFaq {
  q: string;
  a: string;
}

export interface ServiceLocationPricingRange {
  type: string;
  range: string;
  note: string;
}

export interface ServiceLocationData {
  // ── Identity ────────────────────────────────────────────────────────────
  locationSlug: string;
  serviceSlug: string;
  locationName: string;
  serviceName: string;
  fullPath: string;

  // ── SEO ─────────────────────────────────────────────────────────────────
  seoTitle: string;
  seoDescription: string;

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroTagline: string;
  heroHeading: string;
  heroSubheading: string;

  // ── Why this service in this city ────────────────────────────────────────
  whyHeading: string;
  whyParagraphs: string[];

  // ── City-specific process / permitting / considerations ──────────────────
  considerationsHeading: string;
  considerations: { title: string; body: string }[];

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricingHeading: string;
  pricingIntro: string;
  pricingRanges: ServiceLocationPricingRange[];

  // ── FAQs ─────────────────────────────────────────────────────────────────
  faqs: ServiceLocationFaq[];

  // ── Related links ────────────────────────────────────────────────────────
  /** Slug of base city page */
  relatedLocationPath: string;
  /** Full path of base service page */
  relatedServicePath: string;
  /** Optional extra related paths */
  relatedPaths?: { href: string; label: string; description: string }[];
}

// ─── Page data ────────────────────────────────────────────────────────────────

const SERVICE_LOCATION_PAGES: ServiceLocationData[] = [
  // ── /locations/los-angeles/adu-design ─────────────────────────────────────
  {
    locationSlug: "los-angeles",
    serviceSlug: "adu-design",
    locationName: "Los Angeles",
    serviceName: "ADU Design & Architecture",
    fullPath: "/locations/los-angeles/adu-design",

    seoTitle: "ADU Design & Architecture in Los Angeles | ADU Build LA",
    seoDescription:
      "Expert ADU design for Los Angeles properties. Custom floor plans, 3D renderings, and LADBS-ready permit drawings. In-house architecture team. Free consultation.",

    heroTagline: "ADU Design · City of Los Angeles",
    heroHeading: "Custom ADU Design for Los Angeles Properties",
    heroSubheading:
      "Los Angeles has some of the most varied residential conditions in California — from hillside lots above Silver Lake to flat grid blocks in the Valley. Our in-house architecture team designs ADUs that work with your specific property, zoning, and LADBS requirements.",

    whyHeading: "Why ADU Design in Los Angeles Requires Local Expertise",
    whyParagraphs: [
      "Designing an ADU for a Los Angeles property is not a template exercise. The city's R1 zoning varies by neighborhood, lot coverage rules differ between standard and hillside parcels, and LADBS plan check reviewers have specific requirements around site plan clarity, Title 24 energy compliance, and setback documentation. A design that works in one neighborhood may require significant revision in another.",
      "Our architecture team works exclusively on ADU projects across LA County, which means we understand how LADBS reviewers approach different project types — detached new construction, garage conversions, attached additions, and JADUs. That focus reduces correction rounds, which directly shortens your permit timeline. We prepare construction documents to LADBS standards from day one, not as an afterthought.",
      "Good ADU design in Los Angeles also has to account for context: the scale of your existing home, the character of your neighborhood, your tenants' expectations, and how the unit will perform as a rental over many years. We design for all of it — not just for the plan check submission.",
    ],

    considerationsHeading: "Design Considerations for Los Angeles ADUs",
    considerations: [
      {
        title: "LADBS Plan Check Requirements",
        body: "LADBS requires complete, precise documentation for ADU plan check: site plan with dimensioned setbacks, floor plan with room labels and square footage, exterior elevations on all four sides, foundation plan, roof plan, and Title 24 energy compliance calculations. Our documents are prepared to LADBS standards — we've gone through the review process hundreds of times and know what triggers correction notices.",
      },
      {
        title: "Hillside vs. Flat Lot Design",
        body: "Hillside lots in Silver Lake, Eagle Rock, Highland Park, and the Hollywood Hills require stepped foundations, retaining walls in some cases, and careful attention to grading and drainage. Design for a hillside ADU is materially different from a flat lot. We design both, and we assess your specific topography before committing to any approach.",
      },
      {
        title: "Maximizing Floor Plan Efficiency",
        body: "Los Angeles's 1,200 sq ft ADU size cap (or 50% of primary dwelling size) means every square foot counts. We design compact, livable floor plans that avoid wasted circulation space, integrate storage thoughtfully, and create the feeling of a complete home rather than a converted structure. Tenants pay for quality layouts, not just square footage.",
      },
      {
        title: "Title 24 Energy Compliance",
        body: "California's Title 24 energy code applies to all ADU construction and must be demonstrated with a compliance report before LADBS approves permit issuance. We include Title 24 calculations in every project and design to meet compliance efficiently — appropriate insulation, window specifications, and mechanical systems from the start.",
      },
    ],

    pricingHeading: "ADU Design Fees in Los Angeles",
    pricingIntro:
      "Our ADU design fee is included in our all-inclusive project price — there is no separate architecture contract. The ranges below reflect total all-inclusive project costs for Los Angeles, covering design, engineering, permitting fees, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion — design included" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Full design through completion" },
      { type: "Attached ADU", range: "$120,000 – $220,000", note: "Custom design for your home" },
      { type: "Detached ADU", range: "$150,000 – $280,000", note: "Full architecture and construction" },
    ],

    faqs: [
      {
        q: "Do I need a separate architect to design an ADU in Los Angeles?",
        a: "Not with ADU Build LA. We have an in-house architecture and design team — no third-party architect coordination. Your project uses one contract, one team, and one point of contact from design through certificate of occupancy. This eliminates the coordination delays that happen when design and construction are separated.",
      },
      {
        q: "How long does the ADU design phase take in Los Angeles?",
        a: "Design typically takes 4–8 weeks from kickoff to a permit-ready document set, depending on project complexity. Hillside and custom projects take longer; garage conversions and pre-designed models move faster. We run design and engineering in parallel wherever possible to compress the timeline before permit submission.",
      },
      {
        q: "Can I customize the design, or do you only offer pre-designed models?",
        a: "Both options are available. Our pre-designed ADU models — studio through 2-bedroom — can be adapted to most lots and customized for finishes, layout adjustments, and site-specific conditions. Fully custom design is available for homeowners with specific vision or lot constraints that require a bespoke approach. We'll recommend the right path after reviewing your property.",
      },
      {
        q: "Will my ADU design need to match the style of my existing home?",
        a: "LADBS does not require stylistic matching, but our design team considers the primary residence's architecture when developing the ADU design. Complementary massing, compatible roof lines, and cohesive exterior materials help the ADU feel like part of the property rather than an afterthought — which matters to tenants and to future buyers.",
      },
    ],

    relatedLocationPath: "/locations/los-angeles",
    relatedServicePath: "/services/adu-design",
    relatedPaths: [
      { href: "/locations/los-angeles/adu-construction", label: "ADU Construction in Los Angeles", description: "Full construction services for your LA ADU project" },
      { href: "/adu-models", label: "Browse ADU Floor Plans", description: "Pre-designed studio through 2-bedroom models" },
    ],
  },

  // ── /locations/los-angeles/adu-construction ───────────────────────────────
  {
    locationSlug: "los-angeles",
    serviceSlug: "adu-construction",
    locationName: "Los Angeles",
    serviceName: "ADU Construction",
    fullPath: "/locations/los-angeles/adu-construction",

    seoTitle: "ADU Construction in Los Angeles | ADU Build LA",
    seoDescription:
      "Licensed ADU construction in Los Angeles. Full-service builds — foundation through finish — with a dedicated project manager and fixed-price contract. Free estimate.",

    heroTagline: "ADU Construction · City of Los Angeles",
    heroHeading: "Full-Service ADU Construction in Los Angeles",
    heroSubheading:
      "Building an ADU in Los Angeles means working through LADBS inspections, navigating LA-specific code requirements, and managing a construction schedule that accounts for the city's permitting and inspection timelines. We do this exclusively.",

    whyHeading: "What ADU Construction in Los Angeles Actually Involves",
    whyParagraphs: [
      "Constructing an ADU in the City of Los Angeles is a multi-phase process that spans from rough framing through LADBS final inspection. The city requires inspections at multiple stages — foundation, framing, rough mechanical, insulation, drywall, and final — and each inspection must pass before the next phase begins. An experienced contractor who understands LADBS's inspection requirements keeps the schedule moving. One that doesn't can cost weeks.",
      "Labor and material costs in Los Angeles sit at the higher end of the California market. Concrete work, foundation costs, and finish-level labor reflect LA's cost-of-living and prevailing wage environment. Our fixed-price contracts account for current LA-area pricing — not optimistic estimates that inflate by the time construction begins.",
      "The biggest risk in Los Angeles ADU construction is scope ambiguity — especially on older properties where structural conditions, aging utilities, or deferred maintenance create unexpected requirements mid-project. We conduct thorough pre-construction assessments and scope every known variable into the fixed price before any work begins.",
    ],

    considerationsHeading: "Construction Considerations for Los Angeles ADUs",
    considerations: [
      {
        title: "LADBS Inspection Sequence",
        body: "LADBS requires inspections at foundation, rough framing, rough plumbing, rough electrical, rough HVAC, insulation, lath (if applicable), drywall, and final. Each must be scheduled, passed, and documented before the next phase proceeds. We build our construction schedules around inspection sequencing — the project manager coordinates every inspection on your behalf.",
      },
      {
        title: "Utility Connections and Service Upgrades",
        body: "New ADU construction in Los Angeles typically requires coordination with LADWP for electrical service — particularly if the existing panel lacks capacity for a new habitable unit. Separate metering is sometimes required. We scope utility requirements during design and include all necessary work in the fixed-price contract.",
      },
      {
        title: "Hillside and Non-Standard Foundation Conditions",
        body: "A significant portion of City of LA properties sit on sloped lots, expansive soils, or older post-and-pier foundations. All of these affect ADU construction methodology and cost. We assess foundation conditions early — before permit submission — so the construction scope reflects your specific site rather than an assumed flat lot.",
      },
      {
        title: "Fire Zone Construction Requirements",
        body: "LA's hillside neighborhoods and foothill adjacencies often fall in Very High Fire Hazard Severity Zones. Chapter 7A fire-resistive construction requirements — ember-resistant vents, Class A roofing, ignition-resistant cladding — are non-negotiable and must be included in permitted construction documents. We design and build to these standards and price them into the contract from day one.",
      },
    ],

    pricingHeading: "ADU Construction Costs in Los Angeles",
    pricingIntro:
      "All-inclusive project pricing for ADU construction in the City of Los Angeles, covering design, engineering, all permitting fees, and full construction. Prices reflect current LA-area labor and material costs.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion within existing structure" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Full conversion with habitability upgrades" },
      { type: "Attached ADU", range: "$120,000 – $220,000", note: "Addition connected to primary home" },
      { type: "Detached ADU", range: "$150,000 – $280,000", note: "New standalone construction" },
    ],

    faqs: [
      {
        q: "How long does ADU construction take in Los Angeles after permits are approved?",
        a: "Construction timelines depend heavily on ADU type. Garage conversions typically take 10–16 weeks post-permit. Attached and detached ADUs generally run 16–26 weeks, depending on size, site conditions, and material lead times. We provide a project-specific schedule at contract signing — not a generic range.",
      },
      {
        q: "What does 'all-inclusive' pricing mean for LA ADU construction?",
        a: "All-inclusive means one fixed price covers design, engineering, all LADBS plan check and permit fees, utility coordination, full construction labor and materials, and the final inspection leading to certificate of occupancy. There is no separate design contract, no surprise permit fee invoice, and no open-ended 'time and materials' exposure.",
      },
      {
        q: "Do I need to find my own subcontractors, or does ADU Build LA handle everything?",
        a: "We handle everything. Our team manages foundation, framing, roofing, plumbing, electrical, HVAC, insulation, drywall, tile, cabinetry, and finish work under our general contractor license. You have one contact, one contract, and one team for the entire build.",
      },
      {
        q: "What inspections does LADBS require during ADU construction?",
        a: "LADBS requires inspections at foundation, rough framing, rough plumbing, rough electrical, rough HVAC, insulation, and final. Each phase must be approved before proceeding to the next. Our project manager schedules every inspection, is on-site for each one, and manages any correction notices immediately.",
      },
    ],

    relatedLocationPath: "/locations/los-angeles",
    relatedServicePath: "/services/adu-construction",
    relatedPaths: [
      { href: "/locations/los-angeles/adu-design", label: "ADU Design in Los Angeles", description: "In-house architecture and permit drawings for your LA ADU" },
      { href: "/projects", label: "View Completed Projects", description: "Real ADU builds with costs, timelines, and outcomes" },
    ],
  },

  // ── /locations/santa-monica/garage-conversion ──────────────────────────────
  {
    locationSlug: "santa-monica",
    serviceSlug: "garage-conversion",
    locationName: "Santa Monica",
    serviceName: "Garage Conversion ADU",
    fullPath: "/locations/santa-monica/garage-conversion",

    seoTitle: "Garage Conversion ADU in Santa Monica | ADU Build LA",
    seoDescription:
      "Convert your Santa Monica garage into a fully permitted ADU. Coastal Zone expertise, premium design, and a fixed-price contract. Free property assessment.",

    heroTagline: "Garage Conversion ADU · Santa Monica",
    heroHeading: "Convert Your Santa Monica Garage Into a Premium ADU",
    heroSubheading:
      "Garage conversions are one of the fastest paths to rental income in Santa Monica — leveraging an existing structure within a premium coastal market. We handle design, Coastal Zone permitting, and construction under one contract.",

    whyHeading: "Why Garage Conversions Are Compelling in Santa Monica",
    whyParagraphs: [
      "Santa Monica has a significant stock of detached garages — many attached to Craftsman bungalows and 1940s–1960s properties throughout Sunset Park, Mid-City, and the streets north of Montana Avenue. These garages represent ready-made ADU opportunities: existing foundations, existing structural framing, and existing utility adjacency. Converting them avoids the cost of new construction while still delivering a fully permitted, income-generating ADU.",
      "The Santa Monica rental market amplifies the return. A converted garage that might achieve $1,800/month in a mid-market neighborhood will reach $3,000–$4,000/month in Santa Monica's premium coastal context. That rental income profile means the investment payback period on a $100,000–$160,000 garage conversion is materially shorter than most real estate investment alternatives in Southern California.",
      "The key constraint in Santa Monica is permitting complexity. Many properties are in or near the Coastal Zone, and some conversions trigger Coastal Development Permit requirements. We assess every Santa Monica property for Coastal Zone status before committing to a scope or timeline — so there are no permit surprises after design work has begun.",
    ],

    considerationsHeading: "Permitting & Process Considerations for Santa Monica Garage Conversions",
    considerations: [
      {
        title: "Coastal Development Permit Assessment",
        body: "Santa Monica's Coastal Zone covers a substantial portion of the city's residential areas. Properties in the Coastal Zone may require a Coastal Development Permit (CDP) in addition to standard City of Santa Monica building permits. Some projects qualify for categorical exclusions that simplify the process. We determine your property's specific permit pathway during the free site evaluation — before any fees or commitments.",
      },
      {
        title: "Structural Assessment of Existing Garage",
        body: "Not all garages are equal as ADU conversion candidates. We assess the existing structure's foundation type (slab vs. raised), framing condition, roof pitch, and ceiling height — all of which affect the quality of the finished ADU and the cost of conversion. A thorough structural assessment before design begins prevents scope surprises mid-project.",
      },
      {
        title: "Utility Upgrades for Habitable Use",
        body: "Converting a garage to habitable space requires electrical upgrades (typically a dedicated circuit panel or sub-panel), plumbing for kitchen and bathroom, insulation to meet California energy code, and mechanical ventilation. Santa Monica has specific requirements around water and electrical service connections. We scope all utility work upfront.",
      },
      {
        title: "Design Compatibility in Santa Monica Neighborhoods",
        body: "Santa Monica's planning department values design quality and neighborhood compatibility. Garage conversion exteriors should complement the primary residence's architecture. We design exteriors that respect the existing home's scale and materials — which matters both for permit approval and for tenant appeal in a market where renters have high expectations.",
      },
    ],

    pricingHeading: "Garage Conversion ADU Costs in Santa Monica",
    pricingIntro:
      "Santa Monica garage conversion pricing reflects the coastal LA premium in labor costs and the potential for Coastal Zone permitting complexity. All-inclusive pricing covers design, all permits (including CDP if required), and full construction.",
    pricingRanges: [
      { type: "Studio Garage Conversion", range: "$90,000 – $140,000", note: "Single-car garage converted to studio" },
      { type: "1-Bedroom Garage Conversion", range: "$110,000 – $165,000", note: "Two-car or large single-car garage" },
      { type: "With Coastal Development Permit", range: "Add $8,000 – $15,000", note: "Additional cost for CDP process if required" },
    ],

    faqs: [
      {
        q: "Do I need a Coastal Development Permit to convert my Santa Monica garage?",
        a: "It depends on your property's location within Santa Monica's Coastal Zone. Some garage conversions qualify for categorical exclusions that bypass the full CDP process; others require a standard CDP review. We determine your property's specific situation during the free site evaluation — at no charge. We've navigated Santa Monica's Coastal Zone process many times.",
      },
      {
        q: "Will I lose my parking space if I convert my garage in Santa Monica?",
        a: "Yes — garage conversion eliminates the parking space. However, California state law prohibits cities from requiring replacement parking for ADU garage conversions. Santa Monica has adopted this provision. You are not required to provide replacement parking, though you may choose to do so if your lot allows it.",
      },
      {
        q: "What rental income can I expect from a converted Santa Monica garage ADU?",
        a: "A well-designed garage conversion ADU in Santa Monica typically achieves $2,800–$4,000/month depending on size, finishes, and neighborhood. Annual gross rental income of $34,000–$48,000 is realistic for a quality one-bedroom conversion in most Santa Monica neighborhoods.",
      },
      {
        q: "How long does a Santa Monica garage conversion take from start to finish?",
        a: "From design kickoff to certificate of occupancy, a Santa Monica garage conversion typically takes 8–14 months. Design takes 4–6 weeks; Coastal Zone review and standard permit check adds 10–18 weeks; construction takes 10–16 weeks post-permit. CDP projects add time. We provide a property-specific schedule during the assessment.",
      },
    ],

    relatedLocationPath: "/locations/santa-monica",
    relatedServicePath: "/services/garage-conversion",
    relatedPaths: [
      { href: "/locations/venice/adu-design", label: "ADU Design in Venice", description: "Coastal ADU design for Venice properties" },
      { href: "/adu-models", label: "Garage Conversion Floor Plans", description: "Pre-designed models optimized for garage conversion" },
    ],
  },

  // ── /locations/pasadena/adu-construction ──────────────────────────────────
  {
    locationSlug: "pasadena",
    serviceSlug: "adu-construction",
    locationName: "Pasadena",
    serviceName: "ADU Construction",
    fullPath: "/locations/pasadena/adu-construction",

    seoTitle: "ADU Construction in Pasadena CA | ADU Build LA",
    seoDescription:
      "Full-service ADU construction in Pasadena. Detached ADUs, garage conversions, and JADUs — including historic overlay areas. Fixed-price contracts. Free estimate.",

    heroTagline: "ADU Construction · Pasadena",
    heroHeading: "ADU Construction in Pasadena — Built Right the First Time",
    heroSubheading:
      "Pasadena's large lots, abundant garages, and diverse permit process — including historic overlay areas — create a unique construction environment. We've built throughout Pasadena and understand how to navigate its requirements efficiently.",

    whyHeading: "ADU Construction in Pasadena: What Makes It Distinct",
    whyParagraphs: [
      "Pasadena offers some of the most ADU-favorable lot conditions in the San Gabriel Valley. Many properties feature large rear yards, existing detached garages with substantial footprints, and mature landscaping that creates natural privacy screens for new ADU construction. The land gives builders more to work with than in denser coastal or Valley cities.",
      "The Pasadena rental market is anchored by Caltech, JPL, Huntington Hospital, and a strong base of professional services employment. That mix produces a diverse tenant pool — research professionals, healthcare workers, families — that creates consistent demand at a range of price points. A well-built Pasadena ADU is not a high-risk speculative investment; it's a reliable income asset in a stable market.",
      "The construction complexity in Pasadena comes primarily from its historic areas. Bungalow Heaven, the Prospect Park area, and several other Pasadena neighborhoods have Design Commission review requirements that influence materials selection, massing, and siting. Experienced Pasadena builders know what the Design Commission responds well to — and what triggers lengthy revision requests.",
    ],

    considerationsHeading: "Construction Considerations for Pasadena ADUs",
    considerations: [
      {
        title: "Pasadena Building & Safety Division Inspections",
        body: "ADU construction in Pasadena follows the City's Building & Safety Division inspection sequence: foundation, rough framing, rough plumbing, rough electrical, insulation, and final. Pasadena inspectors are generally thorough and timely. We schedule every inspection and have a project manager on-site for each one.",
      },
      {
        title: "Historic District Design Compliance",
        body: "ADU construction in Pasadena's historic areas — including Bungalow Heaven and the Prospect Park district — must satisfy Design Commission compatibility standards. This affects choice of exterior materials (wood siding, specific window profiles, historically appropriate roofing), massing relative to the primary structure, and siting. We've navigated Design Commission review for numerous Pasadena projects and design to these standards from day one.",
      },
      {
        title: "Detached Garage Construction and Foundation Prep",
        body: "Many Pasadena homeowners choose to build new detached ADUs rather than convert existing structures. New detached construction in Pasadena typically uses post-tension slab or conventional slab foundations on the flat, single-story properties common in the city's residential grid. We assess soil conditions and recommend the appropriate foundation type before final pricing.",
      },
      {
        title: "Utility Service Coordination with Pasadena Water and Power",
        body: "Pasadena has its own municipal utility — Pasadena Water and Power — separate from LADWP. Electrical and water service upgrades for new ADU construction are coordinated with PWP, not LADWP. Lead times for service connections and metering vary by project type. We manage all PWP coordination as part of the construction process.",
      },
    ],

    pricingHeading: "ADU Construction Costs in Pasadena",
    pricingIntro:
      "Pasadena ADU construction costs are competitive with the broader San Gabriel Valley market. Historic overlay projects may carry modest premiums for compatible materials and Design Commission preparation. All-inclusive pricing covers design, permits, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Interior conversion" },
      { type: "Garage Conversion ADU", range: "$80,000 – $145,000", note: "Detached or attached garage" },
      { type: "Attached ADU", range: "$120,000 – $210,000", note: "Addition to primary home" },
      { type: "Detached ADU (Flat Lot)", range: "$150,000 – $270,000", note: "New standalone construction" },
    ],

    faqs: [
      {
        q: "Can you build an ADU on my Pasadena historic district property?",
        a: "Yes. We've completed ADU construction in Bungalow Heaven, the Prospect Park area, and other Pasadena historic neighborhoods. The key is designing to Design Commission standards from the start — appropriate scale, compatible materials, and sympathetic massing. Garage conversions often face less scrutiny than new standalone structures in these areas.",
      },
      {
        q: "How long does ADU construction take in Pasadena?",
        a: "Post-permit construction typically takes 10–18 weeks for garage conversions and 16–26 weeks for new detached or attached ADUs. The total timeline from design kickoff to certificate of occupancy is usually 10–18 months depending on project type and whether Design Commission review applies. We provide a project-specific schedule at contract signing.",
      },
      {
        q: "Does Pasadena use LADWP or a different utility for my ADU?",
        a: "Pasadena has its own municipal utility — Pasadena Water and Power (PWP). Electrical service and metering for your ADU are coordinated with PWP, not LADWP. We manage all utility coordination, including PWP service applications and scheduling, as part of the construction process.",
      },
      {
        q: "What is the best ADU type for a standard Pasadena property?",
        a: "For properties with existing detached garages, garage conversion is usually the fastest and most cost-effective path. For larger lots without suitable garages, new detached ADUs maximize rental income. For properties in historic areas, we recommend the ADU type most likely to move efficiently through Design Commission review — which varies by specific neighborhood and lot. We make a recommendation after the free site assessment.",
      },
    ],

    relatedLocationPath: "/locations/pasadena",
    relatedServicePath: "/services/adu-construction",
    relatedPaths: [
      { href: "/locations/glendale/junior-adu", label: "Junior ADU in Glendale", description: "Lower-cost ADU option for homeowners in adjacent cities" },
      { href: "/projects", label: "View Completed Projects", description: "Real ADU builds with costs, timelines, and outcomes" },
    ],
  },

  // ── /locations/glendale/junior-adu ────────────────────────────────────────
  {
    locationSlug: "glendale",
    serviceSlug: "junior-adu",
    locationName: "Glendale",
    serviceName: "Junior ADU (JADU)",
    fullPath: "/locations/glendale/junior-adu",

    seoTitle: "Junior ADU (JADU) in Glendale CA | ADU Build LA",
    seoDescription:
      "Build a Junior ADU in Glendale. JADUs up to 500 sq ft with simpler permitting and lower cost — ideal for multigenerational living or rental income. Free assessment.",

    heroTagline: "Junior ADU (JADU) · Glendale",
    heroHeading: "Junior ADU Design & Build in Glendale",
    heroSubheading:
      "A Junior ADU lets Glendale homeowners add a fully permitted living space within their existing home — with simpler permitting, lower cost, and faster completion than a full detached ADU. Ideal for extended family, a young adult returning home, or a rental unit.",

    whyHeading: "Why JADUs Are Popular in Glendale",
    whyParagraphs: [
      "Glendale has one of the most active multigenerational housing cultures of any city in the San Fernando Valley. Extended family households — particularly families housing parents, adult children, or relatives who have relocated from elsewhere — are common throughout the city's diverse residential neighborhoods. A Junior ADU offers exactly the right solution: a private, self-contained living space within the existing home footprint, at a cost that makes sense relative to the rental income or family utility it generates.",
      "JADUs are also the most accessible ADU type for Glendale homeowners who are newer to ADU investment. The simpler permitting process, lower cost, and shorter construction timeline mean you can move from decision to occupied unit in less time and with less financial exposure than a full detached ADU. That accessibility matters when you're deciding whether to commit to an ADU project at all.",
      "Glendale's rental market supports meaningful JADU income. A well-finished JADU in a desirable Glendale neighborhood — particularly one with its own entrance, kitchenette, and private bath — can achieve $1,500–$2,200/month, generating $18,000–$26,000 in annual income from a project that may cost $60,000–$100,000 total.",
    ],

    considerationsHeading: "JADU Permitting & Process in Glendale",
    considerations: [
      {
        title: "What Qualifies as a JADU in Glendale",
        body: "A Junior ADU must be created within the walls of an existing single-family structure — including attached garages. It can be up to 500 sq ft and must include an efficiency kitchen (a single-burner cooking unit is permitted). It must have a separate entrance, which can be either an exterior door or a shared interior entry. Glendale has adopted California's JADU standards in full.",
      },
      {
        title: "Simpler Permitting Than a Full ADU",
        body: "JADUs have a streamlined permitting pathway in Glendale. They are generally exempt from certain impact fees, do not require owner-occupancy as a condition of a rental (since 2020), and often involve fewer structural changes than a full ADU or garage conversion. Plan check for a straightforward JADU typically runs 8–14 weeks.",
      },
      {
        title: "Interior Reconfiguration Scope",
        body: "JADU construction typically involves interior partition work, a new entrance door, bathroom addition or upgrade, efficiency kitchen installation, and electrical/plumbing rough-in. In some cases, an exterior entrance must be cut through an existing wall — which requires structural engineering review. We assess the existing floor plan and propose the most efficient conversion layout.",
      },
      {
        title: "Shared Utility Connections",
        body: "JADUs share utility connections with the primary dwelling — a key cost advantage over full ADUs. There is no requirement for a separate electrical meter or separate water service. This significantly reduces utility-related construction costs and reduces coordination complexity with Glendale Water and Power.",
      },
    ],

    pricingHeading: "Junior ADU Costs in Glendale",
    pricingIntro:
      "JADUs represent the most affordable ADU type in Glendale. Lower cost reflects shared utility infrastructure and simpler structural scope. All-inclusive pricing covers design, permits, and full construction.",
    pricingRanges: [
      { type: "Studio JADU (< 350 sq ft)", range: "$55,000 – $80,000", note: "Simple interior conversion" },
      { type: "Full JADU (350–500 sq ft)", range: "$70,000 – $100,000", note: "Larger conversion with full bath" },
      { type: "JADU with New Exterior Entrance", range: "Add $5,000 – $12,000", note: "When new door opening required" },
    ],

    faqs: [
      {
        q: "Can I create a JADU from my attached garage in Glendale?",
        a: "Yes — attached garages are specifically permitted as JADU conversion candidates under California law. The conversion uses the existing garage footprint, avoids building new exterior walls, and typically costs less than converting an interior room due to the garage's existing separation from the primary living space.",
      },
      {
        q: "Do I need to live on the property to rent out a Glendale JADU?",
        a: "California law removed owner-occupancy requirements for JADUs in 2020. You can rent a JADU to any tenant without living in the primary dwelling. This change made JADUs as flexible as full ADUs from a rental standpoint.",
      },
      {
        q: "What is the difference between a JADU and a full ADU in Glendale?",
        a: "A JADU must be created within the existing home's walls (including attached garages) and is capped at 500 sq ft. A full ADU can be detached, can be up to 1,200 sq ft, and can be new construction on a separate foundation. JADUs are simpler to permit and lower-cost; full ADUs generate more rental income and provide more tenant privacy.",
      },
      {
        q: "How long does it take to build a JADU in Glendale?",
        a: "From design kickoff to certificate of occupancy, a Glendale JADU typically takes 5–9 months: 3–5 weeks for design, 8–14 weeks for permitting, and 8–12 weeks for construction. JADUs are generally the fastest ADU type to complete in Glendale.",
      },
    ],

    relatedLocationPath: "/locations/glendale",
    relatedServicePath: "/services/junior-adu",
    relatedPaths: [
      { href: "/locations/burbank/adu-design", label: "ADU Design in Burbank", description: "Full ADU design services for Burbank homeowners" },
      { href: "/services/garage-conversion", label: "Garage Conversion ADU", description: "Full garage-to-ADU conversion as an alternative" },
    ],
  },

  // ── /locations/burbank/adu-design ─────────────────────────────────────────
  {
    locationSlug: "burbank",
    serviceSlug: "adu-design",
    locationName: "Burbank",
    serviceName: "ADU Design & Architecture",
    fullPath: "/locations/burbank/adu-design",

    seoTitle: "ADU Design & Architecture in Burbank CA | ADU Build LA",
    seoDescription:
      "Custom ADU design for Burbank properties. In-house architecture team — floor plans, 3D renderings, and Burbank permit-ready drawings. Free consultation.",

    heroTagline: "ADU Design · Burbank",
    heroHeading: "Custom ADU Design for Burbank Properties",
    heroSubheading:
      "Burbank's mid-century residential neighborhoods offer excellent ADU design conditions: generous lot sizes, abundant detached garages, and a planning environment that responds well to thoughtful, well-documented submissions.",

    whyHeading: "ADU Design in Burbank: Working With the City's Conditions",
    whyParagraphs: [
      "Burbank's residential fabric is primarily 1940s–1960s construction — single-story California ranches and Craftsman-influenced bungalows on 6,000–9,000 sq ft lots. This housing stock shapes ADU design in important ways. Many homes have detached garages that are structurally sound and well-positioned for conversion. Others have rear yards that are flat and largely unencumbered, creating ideal conditions for a small detached ADU.",
      "The design challenge in Burbank is doing more with less: lot coverage limits, the desire to preserve outdoor space for the primary residence, and the city's preference for compatible exterior materials mean that ADU design requires thoughtful site planning as much as floor plan expertise. Our team designs ADUs that maximize livable square footage within the constraints your specific Burbank lot presents.",
      "We also design with Burbank's rental market context in mind. Burbank renters — many of whom work in the entertainment industry at Warner Bros. or Disney — have high expectations for finish quality and functional layout. A well-designed Burbank ADU is not just a code-compliant structure; it's a competitive rental product in a market that has plenty of options.",
    ],

    considerationsHeading: "Design Considerations for Burbank ADUs",
    considerations: [
      {
        title: "City of Burbank Building Division Requirements",
        body: "Burbank's Building Division requires complete construction documents for ADU permit submission: site plan with dimensioned setbacks and lot coverage calculations, floor plan, four-sided elevations, foundation and framing plans, and Title 24 energy compliance. Our documents are prepared to Burbank's specific requirements — we've been through the process many times.",
      },
      {
        title: "Garage Assessment and Conversion Design",
        body: "Burbank's detached garages vary widely in condition and convertibility. Pre-war garages may have rubble or brick foundations that require replacement; post-war garages often have solid concrete slabs in good condition. Before designing a garage conversion, we assess foundation type, framing condition, ceiling height, and utility access — all of which affect design scope and cost.",
      },
      {
        title: "Detached ADU Siting and Rear Yard Planning",
        body: "For homeowners building new detached ADUs, rear yard siting is critical. Burbank requires 4-foot rear and side setbacks for detached ADUs. On lots with existing trees, drainage features, or pool equipment, siting the ADU footprint requires careful planning. We create a site plan that maximizes ADU footprint while preserving practical use of remaining outdoor space.",
      },
      {
        title: "Fire Zone Overlay Areas",
        body: "Parts of Burbank adjacent to the Verdugo Hills fall within fire hazard severity zones. ADU design for properties in these areas must incorporate Chapter 7A fire-resistive elements from the outset. We identify fire zone status during the initial property assessment and incorporate all required design elements before permit submission.",
      },
    ],

    pricingHeading: "ADU Design and Project Costs in Burbank",
    pricingIntro:
      "ADU design is included in our all-inclusive project pricing — no separate architect fee. The ranges below reflect total all-inclusive project costs for Burbank, covering design, engineering, all permit fees, and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$60,000 – $100,000", note: "Design included" },
      { type: "Garage Conversion ADU", range: "$80,000 – $150,000", note: "Custom design through completion" },
      { type: "Attached ADU", range: "$120,000 – $215,000", note: "Addition to primary home" },
      { type: "Detached ADU", range: "$150,000 – $275,000", note: "New construction, full design" },
    ],

    faqs: [
      {
        q: "Does ADU Build LA have an in-house architecture team for Burbank projects?",
        a: "Yes — our in-house architecture and design team handles all ADU design, including permit-ready construction documents, 3D renderings, and Title 24 energy compliance calculations. You don't need to hire a separate architect. One contract covers design and construction from kickoff to certificate of occupancy.",
      },
      {
        q: "How do I know if my Burbank garage is a good ADU design candidate?",
        a: "The key factors are ceiling height (minimum 8 feet for comfortable habitable space), foundation condition (concrete slab preferred over older rubble or brick), and lot coverage math. We assess all of these during the free property review and give you a clear answer — along with any structural scope that would be required to make the conversion work.",
      },
      {
        q: "Can I see design examples or models before committing to Burbank ADU design?",
        a: "Yes. We offer pre-designed ADU models that can be adapted to most Burbank lots — studio through 2-bedroom floor plans with proven permitting track records. We can also show you examples from completed Burbank-area projects. The right starting point depends on your lot and goals — we discuss options during the free consultation.",
      },
      {
        q: "How long does ADU design take for a Burbank project?",
        a: "Design typically takes 4–7 weeks from project kickoff to a complete, permit-ready document set. Garage conversions using adapted pre-designed floor plans can move faster. Custom designs for larger detached ADUs or unusual lot conditions take longer. We run structural engineering in parallel to compress the overall timeline before permit submission.",
      },
    ],

    relatedLocationPath: "/locations/burbank",
    relatedServicePath: "/services/adu-design",
    relatedPaths: [
      { href: "/locations/studio-city/garage-conversion", label: "Garage Conversion in Studio City", description: "Garage ADU conversion in the adjacent Valley neighborhood" },
      { href: "/adu-models", label: "Browse Pre-Designed ADU Floor Plans", description: "Studio through 2-bedroom models adapted to Burbank lots" },
    ],
  },

  // ── /locations/studio-city/garage-conversion ──────────────────────────────
  {
    locationSlug: "studio-city",
    serviceSlug: "garage-conversion",
    locationName: "Studio City",
    serviceName: "Garage Conversion ADU",
    fullPath: "/locations/studio-city/garage-conversion",

    seoTitle: "Garage Conversion ADU in Studio City CA | ADU Build LA",
    seoDescription:
      "Convert your Studio City garage into a fully permitted ADU. Premium design, LADBS navigation, and fixed-price construction. Free property assessment.",

    heroTagline: "Garage Conversion ADU · Studio City",
    heroHeading: "Convert Your Studio City Garage Into a Premium ADU",
    heroSubheading:
      "Studio City's premium rental market makes garage conversion one of the most compelling ADU investments in the San Fernando Valley. We handle design, LADBS permitting, and construction in one contract — start to finish.",

    whyHeading: "Why Garage Conversion Makes Sense in Studio City",
    whyParagraphs: [
      "Studio City commands the Valley's highest rental rates — driven by its Cahuenga Pass location, Ventura Boulevard walkability, and proximity to Burbank's entertainment studios. That market premium applies to garage conversion ADUs just as much as to new construction. A well-finished converted garage in Studio City can achieve $2,500–$3,500/month, making it one of the most efficient investments per construction dollar in the Valley.",
      "Studio City has a meaningful stock of mid-century properties with detached garages — many of them structurally sound and well-positioned in rear yards with the footprint to accommodate a one-bedroom conversion. These garages often have concrete slab foundations, substantial framing, and existing utility adjacency that make the conversion scope manageable and predictable.",
      "The design imperative in Studio City is quality. The neighborhood's entertainment industry tenant base has elevated expectations for finish quality and layout functionality. A garage conversion in Studio City that achieves market rent looks more like a carefully designed small home than a retrofitted parking structure. Our team designs to that standard — not just to code minimum.",
    ],

    considerationsHeading: "Permitting & Process for Studio City Garage Conversions",
    considerations: [
      {
        title: "LADBS Jurisdiction and Dedicated ADU Plan Check",
        body: "Studio City is within the City of Los Angeles and permitted through LADBS's South Valley District. LADBS runs a dedicated ADU plan check program designed specifically for ADU project types — including garage conversions. Our documents are prepared to LADBS standards and formatted for the dedicated ADU submission pathway.",
      },
      {
        title: "Hillside Properties North of Ventura",
        body: "Garage conversions on Studio City hillside properties — particularly streets north of Ventura Boulevard — involve additional considerations. Sloped driveways, detached garages perched on slopes, and properties in fire hazard zones all affect the conversion scope. We assess every hillside property individually and provide a comprehensive scope before any commitment.",
      },
      {
        title: "Ceiling Height and Habitable Space Requirements",
        body: "California requires 7-foot minimum ceiling height in habitable rooms. Many Studio City garages have 8–9 foot ceilings that accommodate this comfortably. Some single-car garages with lower roof lines may require roof modifications to achieve required ceiling height — we assess this during the structural review and include any required modifications in the scope.",
      },
      {
        title: "Replacement Parking Is Not Required",
        body: "Under California state law, cities cannot require replacement parking for garage conversion ADUs. Studio City homeowners who convert their garage do not need to provide an alternative parking space. This is sometimes a concern — we clarify it upfront so it doesn't become a design constraint.",
      },
    ],

    pricingHeading: "Garage Conversion ADU Costs in Studio City",
    pricingIntro:
      "Studio City garage conversion pricing reflects City of LA construction costs and the design quality the rental market demands. All-inclusive pricing covers design, LADBS permitting, and full construction through certificate of occupancy.",
    pricingRanges: [
      { type: "Studio Garage Conversion", range: "$83,000 – $130,000", note: "Single-car garage to studio" },
      { type: "1-Bedroom Garage Conversion", range: "$100,000 – $155,000", note: "Larger garage or with addition" },
      { type: "Premium Finish Tier", range: "Add $10,000 – $25,000", note: "High-end finishes to maximize rent" },
    ],

    faqs: [
      {
        q: "What rental income can I expect from a Studio City garage conversion?",
        a: "Studio City's premium market means converted garages achieve strong rents relative to their construction cost. A well-designed studio conversion typically achieves $2,200–$2,800/month. A one-bedroom conversion with quality finishes can reach $2,800–$3,600/month. Annual gross rental income of $33,000–$43,000 is realistic for a premium one-bedroom unit.",
      },
      {
        q: "How does LADBS process a garage conversion permit in Studio City?",
        a: "Studio City falls under LADBS South Valley District. Our submission goes through LADBS's dedicated ADU plan check track, which processes garage conversions separately from standard construction projects. Standard plan check runs 10–20 weeks from complete submission. We prepare LADBS-compliant documents and manage all correction responses.",
      },
      {
        q: "Can I add a bathroom to my Studio City garage conversion?",
        a: "Yes — a full bathroom is standard for garage conversions and is what makes the unit a rentable independent living space. We design and permit the plumbing rough-in for a full bathroom (shower/tub, toilet, and vanity) as part of the standard garage conversion scope.",
      },
      {
        q: "My Studio City garage is on a hillside. Is conversion still feasible?",
        a: "Often yes, but hillside garages require more detailed assessment. Key factors are the garage's foundation type, how it's accessed (flat driveway vs. sloped), and whether the structure sits on a slope that requires shoring or retaining walls. We assess hillside garage feasibility during the free property review and give you a clear picture of scope and cost before committing to design.",
      },
    ],

    relatedLocationPath: "/locations/studio-city",
    relatedServicePath: "/services/garage-conversion",
    relatedPaths: [
      { href: "/locations/burbank/adu-design", label: "ADU Design in Burbank", description: "Custom ADU design for adjacent Valley properties" },
      { href: "/locations/los-angeles/adu-construction", label: "ADU Construction in Los Angeles", description: "Full construction services for City of LA projects" },
    ],
  },

  // ── /locations/venice/adu-design ──────────────────────────────────────────
  {
    locationSlug: "venice",
    serviceSlug: "adu-design",
    locationName: "Venice",
    serviceName: "ADU Design & Architecture",
    fullPath: "/locations/venice/adu-design",

    seoTitle: "ADU Design in Venice CA | ADU Build LA",
    seoDescription:
      "Custom ADU design for Venice properties — including Coastal Zone lots. In-house architecture team with CDP experience. Premium design for the Venice rental market. Free consultation.",

    heroTagline: "ADU Design · Venice",
    heroHeading: "Custom ADU Design for Venice Properties",
    heroSubheading:
      "Venice's compact lots, Coastal Zone regulations, and premium rental market create a unique ADU design environment. Thoughtful, efficient design is the difference between a good Venice ADU and a great one — and between a smooth permit process and a frustrating one.",

    whyHeading: "Why ADU Design in Venice Requires Specialized Expertise",
    whyParagraphs: [
      "Venice is almost entirely within California's Coastal Zone — which means ADU design here involves considerations that don't exist in most of LA. The Venice Specific Plan establishes design standards beyond standard LADBS requirements. Coastal Development Permit review adds design scrutiny around height, massing, and visual character. Getting this right from the first design iteration — rather than revising through multiple correction rounds — requires experience with Venice's specific regulatory context.",
      "Venice lots also create a design challenge that rewards expertise. Many are 30–40 feet wide and 100–120 feet deep, with a primary structure that already occupies much of the buildable area. Fitting a meaningful ADU — one with genuine livability, a private entrance, and ideally some outdoor space — into the remaining lot requires creative site planning and efficient floor plan design. There is no margin for wasted square footage.",
      "The Venice rental market's premium positioning means that design quality directly affects rental income. Tenants paying $3,000–$4,500/month for a Venice ADU are making a deliberate quality-of-life choice. They expect high-quality finishes, good natural light, thoughtful storage, and a unit that feels intentionally designed — not a converted garage with a fresh coat of paint. Our design standards reflect what the Venice market rewards.",
    ],

    considerationsHeading: "Design Considerations for Venice ADUs",
    considerations: [
      {
        title: "Venice Specific Plan Compliance",
        body: "The Venice Specific Plan governs new construction throughout most of Venice. It establishes standards around maximum height (generally 30 feet), setbacks, lot coverage, and in some areas design compatibility with adjacent structures. ADU design in Venice must comply with the Specific Plan from the first draft — revisions after plan check submission to address Specific Plan conflicts add weeks to the timeline.",
      },
      {
        title: "Coastal Development Permit Design Review",
        body: "Properties requiring a Coastal Development Permit face an additional design review layer. CDP reviewers assess whether the project is consistent with Venice's certified Local Coastal Program — including visual character, public view protection, and consistency with neighborhood scale. Our design team is familiar with what CDP reviewers look for and designs to minimize the risk of CDP-related revision requests.",
      },
      {
        title: "Maximizing Livability on Small Lots",
        body: "Venice lot coverage constraints and the Specific Plan's setback requirements often leave a compact building envelope for the ADU. We design for maximum livability within tight footprints: efficient circulation, integrated storage, full-height cabinetry, and prioritized outdoor connection where the lot allows. A 450 sq ft Venice ADU designed well will outperform a 600 sq ft ADU designed carelessly — in both tenant satisfaction and rental rate.",
      },
      {
        title: "LADBS + CDP Coordination in Design",
        body: "Venice ADU design involves coordinating requirements from two review bodies: LADBS (building code and zoning) and the Coastal Development Permit process (LCP consistency). Designing to satisfy both simultaneously — rather than treating them as sequential — requires familiarity with both sets of requirements. We handle the full document set for both permit pathways under one design process.",
      },
    ],

    pricingHeading: "ADU Design and Project Costs in Venice",
    pricingIntro:
      "ADU design is included in our all-inclusive project pricing — no separate architecture fee. Venice project costs reflect coastal LA construction costs and Coastal Zone permitting complexity. All-inclusive pricing covers design, all permits (including CDP where applicable), and full construction.",
    pricingRanges: [
      { type: "Junior ADU (JADU)", range: "$70,000 – $115,000", note: "Design and construction included" },
      { type: "Garage Conversion ADU", range: "$92,000 – $168,000", note: "Includes Coastal Zone permit work" },
      { type: "Attached ADU", range: "$140,000 – $245,000", note: "Custom design and construction" },
      { type: "Detached ADU", range: "$170,000 – $315,000", note: "Full architecture through CO" },
    ],

    faqs: [
      {
        q: "Does ADU design in Venice require a specialist in Coastal Zone regulations?",
        a: "Yes — or at least a team with active experience in Venice's specific regulatory context. The Venice Specific Plan and CDP requirements create design constraints that don't exist in most of LA. An architect unfamiliar with these frameworks risks submitting plans that trigger time-consuming correction requests. Our team has designed ADUs in Venice and navigated the Coastal Zone process multiple times.",
      },
      {
        q: "How do you fit a livable ADU on a small Venice lot?",
        a: "Thoughtful design. We prioritize efficient floor plans without wasted circulation space, integrate built-in storage to compensate for limited square footage, maximize natural light through window placement, and create private outdoor connection — even on smaller lots — wherever the building envelope allows it. We also work with our structural engineer early to find any opportunities to push into the allowed envelope without triggering additional design review.",
      },
      {
        q: "What does the Coastal Development Permit add to ADU design in Venice?",
        a: "The CDP review adds a requirement to demonstrate that the design is consistent with Venice's Local Coastal Program — which includes standards around visual character, neighborhood scale, and public view protection. Our design documents include the CDP application materials alongside the LADBS construction document set, so both review processes can proceed without separate design iterations.",
      },
      {
        q: "How long does the ADU design phase take in Venice?",
        a: "Design typically takes 5–8 weeks from kickoff to a complete permit-ready document set — slightly longer than non-coastal projects due to Specific Plan and CDP coordination. We run LADBS and CDP application preparation in parallel where possible. Following design, permit timelines are 12–20 weeks depending on CDP pathway. We provide a full project timeline during the initial consultation.",
      },
    ],

    relatedLocationPath: "/locations/venice",
    relatedServicePath: "/services/adu-design",
    relatedPaths: [
      { href: "/locations/santa-monica/garage-conversion", label: "Garage Conversion in Santa Monica", description: "Adjacent coastal city — similar Coastal Zone considerations" },
      { href: "/locations/culver-city", label: "ADU Services in Culver City", description: "Nearby high-demand market without Coastal Zone complexity" },
    ],
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getAllServiceLocationPages(): ServiceLocationData[] {
  return SERVICE_LOCATION_PAGES;
}

export function getServiceLocationPage(
  locationSlug: string,
  serviceSlug: string
): ServiceLocationData | undefined {
  return SERVICE_LOCATION_PAGES.find(
    (p) => p.locationSlug === locationSlug && p.serviceSlug === serviceSlug
  );
}

export function getAllServiceLocationParams(): { locationSlug: string; serviceSlug: string }[] {
  return SERVICE_LOCATION_PAGES.map((p) => ({
    locationSlug: p.locationSlug,
    serviceSlug: p.serviceSlug,
  }));
}
