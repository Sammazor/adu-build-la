/**
 * Project / portfolio data for ADU Build LA.
 *
 * CMS-migration-ready — every field maps 1:1 to a future `Project` Prisma model.
 * To migrate: replace getAllProjects() / getProjectBySlug() with Prisma queries.
 */

export type ProjectType =
  | "Garage Conversion ADU"
  | "Detached ADU"
  | "Junior ADU (JADU)"
  | "Attached ADU";

export interface ProjectScopeItem {
  phase: string;
  duration: string;
  description: string;
}

export interface ProjectData {
  // ── Identity ────────────────────────────────────────────────────────────
  slug: string;
  name: string;
  fullPath: string;

  // ── SEO ─────────────────────────────────────────────────────────────────
  seoTitle: string;
  seoDescription: string;

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroHeading: string;
  heroTagline: string;

  // ── Project summary ──────────────────────────────────────────────────────
  city: string;
  projectType: ProjectType;
  sqFt: number;
  beds: number | "Studio";
  baths: number;
  completedYear: number;
  totalBuildWeeks: number;       // construction only
  totalProjectMonths: string;    // design → occupancy
  projectCost: string;           // display string
  monthlyRent?: string;          // if applicable
  useCase: string;               // "Rental income" | "Multigenerational" | etc.

  // ── Story: Challenge / Solution / Result ─────────────────────────────────
  challenge: { heading: string; body: string };
  solution: { heading: string; body: string };
  result: { heading: string; body: string };

  // ── Build highlights ─────────────────────────────────────────────────────
  buildHighlights: string[];

  // ── Scope / phase breakdown ──────────────────────────────────────────────
  scopeItems: ProjectScopeItem[];

  // ── Related content ──────────────────────────────────────────────────────
  relatedLocationSlug?: string;
  relatedLocationName?: string;
  relatedModelSlug?: string;
  relatedModelName?: string;
  relatedServiceSlug?: string;
  relatedServiceName?: string;

  // ── Tags (for future filtering) ──────────────────────────────────────────
  tags: string[];

  // ── Homepage feature flag ────────────────────────────────────────────────
  featuredOnHome?: boolean;

  // ── Featured image (for homepage card; optional placeholder fallback) ────
  featuredImageUrl?: string;
}

// ─── Project data ─────────────────────────────────────────────────────────────

const PROJECTS: ProjectData[] = [
  // ── Santa Monica Garage Conversion ───────────────────────────────────────
  {
    slug: "santa-monica-garage-conversion",
    name: "Santa Monica Garage Conversion ADU",
    fullPath: "/projects/santa-monica-garage-conversion",

    seoTitle: "Santa Monica Garage Conversion ADU Project | ADU Build LA",
    seoDescription:
      "We converted a detached 2-car garage in Santa Monica into a fully permitted 440 sq ft ADU — navigating coastal zone permitting and HOA design guidelines. Now renting for $3,200/month.",

    heroHeading: "Santa Monica Garage Conversion ADU",
    heroTagline:
      "A 2-car detached garage transformed into a coastal-style one-bedroom ADU — permitted through Santa Monica's Coastal Zone process and earning $3,200/month in rental income.",

    city: "Santa Monica",
    projectType: "Garage Conversion ADU",
    sqFt: 440,
    beds: 1,
    baths: 1,
    completedYear: 2024,
    totalBuildWeeks: 12,
    totalProjectMonths: "8 months",
    projectCost: "$148,000",
    monthlyRent: "$3,200/mo",
    useCase: "Long-term rental income",

    challenge: {
      heading: "Coastal Zone Permitting and HOA Design Review",
      body: "The property sat within Santa Monica's Coastal Zone, requiring a Coastal Development Permit (CDP) in addition to standard building permits — a process that adds both time and complexity. The homeowner's HOA also had architectural design guidelines requiring new structures to complement the existing Spanish Colonial Revival main residence. The combination of CDP review, HOA approval, and Santa Monica's standard plan check process had the potential to stretch the timeline significantly if not managed carefully.",
    },
    solution: {
      heading: "Parallel Permitting and Coastal-Compliant Design",
      body: "We initiated the HOA design review and the Coastal Development Permit application simultaneously, rather than sequentially — compressing what could have been a 5-month approval chain into 14 weeks. Our architectural team designed the conversion to echo the main house: stucco exterior, clay tile roof accents, arched window openings, and warm white paint to match the existing palette. The result satisfied HOA review on the first submission. We also identified that the existing garage's stem wall foundation was adequate for habitable use, avoiding a full foundation replacement and saving approximately $18,000 in structural costs.",
    },
    result: {
      heading: "A Coastal ADU That Earns $3,200/Month",
      body: "The finished unit is a well-proportioned one-bedroom with 9-foot ceilings, a full kitchen with quartz counters, a walk-in shower, and a private patio enclosed by a new board-formed concrete garden wall. The homeowner secured a 12-month lease at $3,200/month within two weeks of listing — a 21% gross annual return on the construction investment. The ADU also significantly increased the property's appraised value, which the homeowner used to fund a partial refinance.",
    },

    buildHighlights: [
      "Coastal Development Permit secured in 14 weeks — processed alongside standard plan check",
      "HOA design approval on first submission — no revisions required",
      "Existing stem wall foundation retained and reinforced — saved $18,000 vs. new foundation",
      "Garage door opening converted to a custom window wall with thermal-break aluminum frames",
      "9-foot vaulted ceiling achieved by raising the existing roof plate 18 inches",
      "New private concrete patio with board-formed garden wall — adds significant livability",
      "Separate utility sub-metering for gas, electric, and water",
      "Mini-split HVAC with independent temperature control",
    ],

    scopeItems: [
      {
        phase: "Design & Architecture",
        duration: "4 weeks",
        description:
          "Site assessment, as-built documentation of existing garage, HOA design package preparation, and full architectural drawing set including interior layout, elevations, and coastal compatibility narrative.",
      },
      {
        phase: "Permitting",
        duration: "14 weeks",
        description:
          "Simultaneous submission to Santa Monica Building & Safety, HOA architectural review board, and California Coastal Commission. One round of minor corrections from Santa Monica Building; CDP issued without additional review.",
      },
      {
        phase: "Construction",
        duration: "12 weeks",
        description:
          "Foundation reinforcement, wall framing infill, roof plate raise, mechanical rough-in, drywall, tile, cabinetry, and finish work. One city inspection delay of 5 days mid-project; all other inspections passed first-time.",
      },
      {
        phase: "Final Inspection & Occupancy",
        duration: "1 week",
        description:
          "Final LADBS inspection, utility service activation, and certificate of occupancy issued. Unit listed for rent within 3 days of occupancy permit.",
      },
    ],

    relatedLocationSlug: "santa-monica",
    relatedLocationName: "Santa Monica",
    relatedModelSlug: "garage-conversion-450",
    relatedModelName: "Garage Conversion 450",
    relatedServiceSlug: "garage-conversion",
    relatedServiceName: "Garage Conversion ADU",

    tags: ["garage-conversion", "santa-monica", "coastal-zone", "rental", "1-bedroom"],
    featuredOnHome: true,
    featuredImageUrl: undefined,
  },

  // ── Pasadena Detached Backyard ADU ───────────────────────────────────────
  {
    slug: "pasadena-detached-backyard-adu",
    name: "Pasadena Detached Backyard ADU",
    fullPath: "/projects/pasadena-detached-backyard-adu",

    seoTitle: "Pasadena Detached Backyard ADU Project | ADU Build LA",
    seoDescription:
      "A new 650 sq ft detached one-bedroom ADU on a Craftsman-era lot in Pasadena — navigating historic overlay design review. Now renting to a Caltech researcher for $2,600/month.",

    heroHeading: "Pasadena Detached Backyard ADU",
    heroTagline:
      "A new 650 sq ft Craftsman-influenced ADU built in the rear yard of a 1921 bungalow in Pasadena's Bungalow Heaven historic neighborhood. Designed, permitted, and built in under 11 months.",

    city: "Pasadena",
    projectType: "Detached ADU",
    sqFt: 650,
    beds: 1,
    baths: 1,
    completedYear: 2024,
    totalBuildWeeks: 16,
    totalProjectMonths: "11 months",
    projectCost: "$198,000",
    monthlyRent: "$2,600/mo",
    useCase: "Long-term rental income",

    challenge: {
      heading: "Historic Overlay Design Compatibility Review",
      body: "The property sits within Pasadena's Bungalow Heaven Landmark District — one of the most significant historic neighborhoods in Southern California. Any new structure requires design review by the Pasadena Design Commission to ensure compatibility with the area's architectural character. The homeowners had received an initial rejection from a previous contractor whose submitted design used contemporary flat-facade aesthetics that clashed with the district's Craftsman bungalow character. We were brought in to redesign and resubmit.",
    },
    solution: {
      heading: "Craftsman-Authentic Design With Modern Livability",
      body: "Our architectural team conducted a detailed survey of the surrounding streetscape and primary residence before drawing a single line. The new ADU design referenced the main house directly: matching exposed rafter tails, a low-slope gable roof, wood shingle siding in a complementary earth tone, divided-light windows, and a covered front porch with tapered Craftsman columns. Critically, we made the case to the Design Commission that the ADU's rear-yard placement — not visible from the street — warranted expedited review rather than full committee deliberation. The Commission agreed, and the project received administrative approval in 6 weeks rather than the standard 12-week committee cycle.",
    },
    result: {
      heading: "A Craftsman ADU That Outperforms Market Rents",
      body: "The finished unit is a spacious, high-quality one-bedroom that doesn't feel like an afterthought. The 9-foot coffered ceilings, Craftsman-detail built-in bookcase in the living room, and private rear garden create a living experience that commands premium rents. The homeowner leased to a Caltech visiting researcher at $2,600/month on a 24-month lease — significantly above the initial rental income projection — and has since received inquiries for the next vacancy. Annual rental income of $31,200 represents a 15.8% gross yield on construction cost.",
    },

    buildHighlights: [
      "Design Commission approval secured administratively in 6 weeks — half the standard timeline",
      "Craftsman-authentic design: exposed rafter tails, divided-light windows, tapered porch columns",
      "Coffered 9-foot ceilings throughout — premium for a 650 sq ft footprint",
      "Custom built-in Craftsman bookcase in living room — unique feature that drives tenant interest",
      "Private rear garden space with board-on-board cedar privacy fence",
      "Wide-plank white oak LVP flooring — durable and visually generous",
      "Two-zone mini-split HVAC — separate bedroom and living area control",
      "Separate utility metering for gas and electric",
    ],

    scopeItems: [
      {
        phase: "Design & Architecture",
        duration: "5 weeks",
        description:
          "Existing conditions survey, streetscape analysis, Craftsman reference documentation, full architectural drawing set, and Design Commission application package with architectural narrative and material board.",
      },
      {
        phase: "Permitting",
        duration: "16 weeks",
        description:
          "Design Commission administrative review (6 weeks), Pasadena Building & Safety plan check (8 weeks), one correction round (2 weeks). Geotechnical report not required — lot confirmed as standard flat soil condition by early soils investigation.",
      },
      {
        phase: "Construction",
        duration: "16 weeks",
        description:
          "New engineered slab foundation, wood framing, roof assembly, window installation, rough mechanical, insulation, drywall, tile, cabinetry, built-ins, and all finish work. All city inspections passed on first visit.",
      },
      {
        phase: "Final Inspection & Occupancy",
        duration: "1 week",
        description:
          "Final Pasadena Building Department inspection, utility activation, and certificate of occupancy issued. Unit leased within 10 days of listing.",
      },
    ],

    relatedLocationSlug: "pasadena",
    relatedLocationName: "Pasadena",
    relatedModelSlug: "1-bed-650",
    relatedModelName: "1 Bed 650",
    relatedServiceSlug: "adu-construction",
    relatedServiceName: "ADU Construction",

    tags: ["detached-adu", "pasadena", "historic-overlay", "rental", "1-bedroom", "craftsman"],
    featuredOnHome: true,
    featuredImageUrl: undefined,
  },

  // ── Glendale Junior ADU ──────────────────────────────────────────────────
  {
    slug: "glendale-junior-adu-remodel",
    name: "Glendale Junior ADU Remodel",
    fullPath: "/projects/glendale-junior-adu-remodel",

    seoTitle: "Glendale Junior ADU (JADU) Project | ADU Build LA",
    seoDescription:
      "We converted an attached garage and bonus room into a 480 sq ft fully permitted Junior ADU (JADU) in Glendale — on a hillside lot with structural challenges. Completed in 6 months for $91,000.",

    heroHeading: "Glendale Junior ADU Remodel",
    heroTagline:
      "An attached garage and unused bonus room converted into a 480 sq ft Junior ADU on a hillside Glendale lot — navigating structural constraints and earning a multigenerational family its own private living space.",

    city: "Glendale",
    projectType: "Junior ADU (JADU)",
    sqFt: 480,
    beds: 1,
    baths: 1,
    completedYear: 2023,
    totalBuildWeeks: 10,
    totalProjectMonths: "6 months",
    projectCost: "$91,000",
    monthlyRent: undefined,
    useCase: "Multigenerational — parents' suite",

    challenge: {
      heading: "Structural Unknowns in a Hillside Attached Conversion",
      body: "The homeowners wanted to move their aging parents into a private unit within the existing home's footprint — avoiding the cost and timeline of new construction. The attached garage and adjacent bonus room were the obvious candidates, but a preliminary inspection revealed that one shared wall between the garage and bonus room was load-bearing in an unconventional way, tied to the hillside retaining stem wall. No structural drawings existed for the original 1962 construction, requiring a full field investigation. There was also a question about whether the existing electrical panel — a 100A original unit — could support the new unit's HVAC, kitchen, and laundry loads without a full panel upgrade.",
    },
    solution: {
      heading: "Structural Engineer First, Creative Framing Solution",
      body: "We brought our structural engineering partner on-site before any design work began — an approach that costs slightly more upfront but prevents redesign mid-construction. The engineer documented the unconventional load path, designed a new LVL header and temporary shoring sequence, and confirmed the stem wall was stable. The solution eliminated the wall while transferring loads cleanly to a new point-loaded post system hidden within the new partition wall. On the electrical side, our team calculated the JADU's actual load requirements and determined a 200A main panel upgrade was necessary but could be performed during construction without disrupting the main residence for more than a single day. We coordinated the panel changeover with Southern California Edison 6 weeks in advance.",
    },
    result: {
      heading: "A Private Suite for Two — Completed in 6 Months",
      body: "The finished JADU gives the homeowners' parents a genuinely independent living space: a private entry from the side yard, a full kitchen, a comfortable bedroom with a walk-in closet, a full bathroom with grab bars and a roll-in shower, and a small living area with southern exposure windows. The parents moved in within 6 months of the initial consultation — significantly faster than any new construction alternative. The homeowners estimate the arrangement saves the family $2,800–$3,200/month compared to assisted living or care facility costs, providing both financial and emotional value that far exceeds the construction investment.",
    },

    buildHighlights: [
      "Load-bearing wall removed safely using structural engineer-designed LVL header system",
      "Existing stem wall investigated and confirmed stable — no foundation remediation required",
      "200A panel upgrade coordinated with SCE — main house power interrupted for less than 8 hours",
      "Accessibility-forward design: roll-in shower, grab bars, widened doorways (32-inch clear)",
      "Side-yard private entry — fully separate from main house interior access",
      "Southern exposure windows added to what had been a windowless bonus room",
      "In-unit washer/dryer hookups — full independence from main house laundry",
      "Separate sub-metering for electricity — transparent utility tracking",
    ],

    scopeItems: [
      {
        phase: "Structural Investigation & Design",
        duration: "3 weeks",
        description:
          "Structural engineer field investigation, load path documentation, LVL header design, and panel load calculation. Architectural design incorporated structural findings without requiring layout revisions.",
      },
      {
        phase: "Permitting",
        duration: "9 weeks",
        description:
          "JADU permitting in Glendale moved faster than a full ADU — simpler scope and Glendale's familiarity with attached conversions. One correction round related to accessibility documentation. SCE panel upgrade pre-application submitted in parallel.",
      },
      {
        phase: "Construction",
        duration: "10 weeks",
        description:
          "Structural work first: shoring, LVL installation, post system. Then new wall framing, window openings, rough electrical (including panel day), plumbing rough-in, HVAC rough-in, insulation, drywall, tile, cabinetry, and finish work.",
      },
      {
        phase: "Final Inspection & Occupancy",
        duration: "1 week",
        description:
          "Glendale final inspection — all items passed. Certificate of occupancy issued. Parents moved in 4 days after final inspection.",
      },
    ],

    relatedLocationSlug: "glendale",
    relatedLocationName: "Glendale",
    relatedModelSlug: "garage-conversion-450",
    relatedModelName: "Garage Conversion 450",
    relatedServiceSlug: "garage-conversion",
    relatedServiceName: "Garage Conversion ADU",

    tags: ["jadu", "glendale", "hillside", "multigenerational", "attached", "accessible"],
  },

  // ── Culver City 2-Bed Detached ADU ───────────────────────────────────────
  {
    slug: "culver-city-2-bed-detached-adu",
    name: "Culver City 2-Bed Detached ADU",
    fullPath: "/projects/culver-city-2-bed-detached-adu",

    seoTitle: "Culver City 2-Bedroom Detached ADU Project | ADU Build LA",
    seoDescription:
      "A new two-story 750 sq ft two-bedroom ADU built in a compact Culver City rear yard — now renting for $4,200/month to tech industry tenants. Completed in under 10 months.",

    heroHeading: "Culver City 2-Bed Detached ADU",
    heroTagline:
      "A two-story 750 sq ft two-bedroom ADU built in a compact Culver City rear yard — preserving outdoor space for the main house while maximizing rental income in one of LA's strongest ADU markets.",

    city: "Culver City",
    projectType: "Detached ADU",
    sqFt: 750,
    beds: 2,
    baths: 1,
    completedYear: 2024,
    totalBuildWeeks: 18,
    totalProjectMonths: "9.5 months",
    projectCost: "$268,000",
    monthlyRent: "$4,200/mo",
    useCase: "Premium long-term rental",

    challenge: {
      heading: "Maximum Unit Size on a Compact Lot",
      body: "The homeowners' goal was clear: maximize rental income with a two-bedroom unit. The challenge was fitting a 750 sq ft structure into a rear yard that also needed to remain usable for the primary residence — a constraint complicated by Culver City's setback requirements and the homeowners' desire to preserve at least a small private garden adjacent to the main house. A single-story 750 sq ft footprint would have consumed virtually the entire rear yard, requiring either a smaller unit or a two-story approach. Two-story ADUs introduce their own complexity: heightened structural requirements, more involved permitting, and neighbor notification obligations under certain Culver City conditions.",
    },
    solution: {
      heading: "Compact Two-Story Footprint — 375 Sq Ft Per Floor",
      body: "We recommended a two-story design from the outset — 375 sq ft per floor — which reduced the ground footprint by roughly 45% compared to a single-story configuration. This preserved a meaningful garden area for the main house while delivering every square foot of the target program. The structural design used engineered wood framing with a moment-frame system at the ground level, which eliminated the need for shear walls that would have compromised the open-plan ground-floor layout. Culver City's planning department approved the two-story design without requiring discretionary review, as the building height remained within the city's standard 16-foot ADU height limit by using a low-slope roofline. Neighbor notification proceeded without objection.",
    },
    result: {
      heading: "Renting at $4,200/Month — 19% Gross Annual Yield",
      body: "The finished two-bedroom ADU is a genuinely premium rental unit. Ground floor contains an open kitchen, dining, and living area with concrete-look tile floors and 10-foot ceilings. The upper floor has two bedrooms — both with western exposure for natural light — sharing a full bath with double vanity. A private rooftop deck accessible from the second floor is the feature most frequently cited by prospective tenants. The homeowners leased to an Amazon MGM Studios couple at $4,200/month on a 24-month lease. Annual gross rental income of $50,400 represents a 18.8% gross yield on construction cost and is projected to fully recover the investment within 6 years including management costs.",
    },

    buildHighlights: [
      "Two-story design reduced ground footprint 45% — preserved main house rear garden",
      "Engineered moment-frame system enables open ground-floor plan without shear walls",
      "10-foot ceilings on ground floor — premium for a two-story structure",
      "Rooftop deck on second floor — most-cited feature by tenants; permitted as accessible roof deck",
      "Concrete-look large-format tile throughout ground floor — durable, visually premium",
      "Double vanity in upstairs bathroom — serves two-bedroom occupancy well",
      "EV charger rough-in in adjacent parking area — future-proofed for tenant demand",
      "Solar panel conduit pre-run — homeowner plans panel installation in Year 2",
    ],

    scopeItems: [
      {
        phase: "Design & Architecture",
        duration: "5 weeks",
        description:
          "Two-story feasibility study, structural concept with moment-frame system, Culver City height limit compliance review, neighbor notification package, and full architectural and structural drawing set.",
      },
      {
        phase: "Permitting",
        duration: "12 weeks",
        description:
          "Culver City Community Development plan check — two-story structures receive standard review (not discretionary). Neighbor notification completed without objection. One correction round for structural drawing clarification. All permits issued at 12 weeks.",
      },
      {
        phase: "Construction",
        duration: "18 weeks",
        description:
          "Engineered foundation, moment-frame ground-floor framing, second-floor assembly, rooftop deck structure, full mechanical rough-in, insulation, drywall, large-format tile, kitchen and bath, painted exterior, and rooftop deck decking and railing.",
      },
      {
        phase: "Final Inspection & Occupancy",
        duration: "1 week",
        description:
          "Culver City final inspection — passed first visit. Certificate of occupancy issued. Unit leased within 8 days at asking rent.",
      },
    ],

    relatedLocationSlug: "culver-city",
    relatedLocationName: "Culver City",
    relatedModelSlug: "2-bed-750",
    relatedModelName: "2 Bed 750",
    relatedServiceSlug: "adu-construction",
    relatedServiceName: "ADU Construction",

    tags: ["detached-adu", "culver-city", "2-bedroom", "two-story", "rental", "tech-market"],
    featuredOnHome: true,
    featuredImageUrl: undefined,
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getFeaturedProjects(limit = 3): ProjectData[] {
  return PROJECTS.filter((p) => p.featuredOnHome).slice(0, limit);
}

export function getAllProjects(): ProjectData[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): { slug: string }[] {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function getProjectsByLocation(locationSlug: string): ProjectData[] {
  return PROJECTS.filter((p) => p.relatedLocationSlug === locationSlug);
}

export function getProjectsByModel(modelSlug: string): ProjectData[] {
  return PROJECTS.filter((p) => p.relatedModelSlug === modelSlug);
}

export function getProjectsByService(serviceSlug: string): ProjectData[] {
  return PROJECTS.filter((p) => p.relatedServiceSlug === serviceSlug);
}

export function getOtherProjects(excludeSlug: string, limit = 3): ProjectData[] {
  return PROJECTS.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}
