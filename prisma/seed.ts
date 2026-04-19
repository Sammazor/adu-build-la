import "dotenv/config";
import { PrismaClient, ContentStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { getAllProjects } from "../src/data/projects";
import { getAllLocations } from "../src/data/locations";
import { getAllModels } from "../src/data/aduModels";
import { getAllServiceLocationPages } from "../src/data/serviceLocationPages";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin user ────────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@adubuildla.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "changeme123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      name: "Admin",
      email: adminEmail,
      passwordHash,
      role: "super_admin",
      isActive: true,
    },
  });
  console.log(`✅ Admin user: ${adminUser.email}`);

  // ─── Default author ────────────────────────────────────────────────────────
  const defaultAuthor = await prisma.author.upsert({
    where: { slug: "adu-build-la-team" },
    update: {},
    create: {
      name: "ADU Build LA Team",
      slug: "adu-build-la-team",
      title: "ADU Specialists",
      bio: "The ADU Build LA team brings decades of combined experience in ADU design, permitting, and construction across Los Angeles County.",
    },
  });
  console.log(`✅ Default author: ${defaultAuthor.name}`);

  // ─── Site settings (singleton) ─────────────────────────────────────────────
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: "ADU Build LA",
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com",
        businessCity: "Los Angeles",
        businessState: "CA",
        priceRange: "$$$",
        businessHours: "Mon–Fri 8am–6pm, Sat 9am–4pm",
        serviceAreaText:
          "Los Angeles, Santa Monica, Culver City, West Hollywood, Pasadena, Burbank, Glendale, Torrance, Long Beach, El Segundo",
      },
    });
    console.log("✅ Site settings created");
  } else {
    console.log("⏭  Site settings already exist, skipping");
  }

  // ─── Lead sources ──────────────────────────────────────────────────────────
  const leadSources = [
    { name: "Homepage Hero Form", sourceType: "organic" as const, pagePath: "/" },
    { name: "Contact Page Form", sourceType: "organic" as const, pagePath: "/contact" },
    { name: "Estimate Page Form", sourceType: "organic" as const, pagePath: "/estimate" },
    { name: "Blog", sourceType: "organic" as const, pagePath: "/blog" },
    { name: "Paid Search", sourceType: "paid_search" as const, pagePath: null },
    { name: "Direct", sourceType: "direct" as const, pagePath: null },
  ];

  for (const source of leadSources) {
    const existing = await prisma.leadSource.findFirst({ where: { name: source.name } });
    if (!existing) {
      await prisma.leadSource.create({ data: source });
    }
  }
  console.log("✅ Lead sources seeded");

  // ─── Service pages ─────────────────────────────────────────────────────────
  const services = [
    {
      name: "ADU Design & Architecture",
      slug: "adu-design",
      serviceCode: "adu-design",
      shortDescription:
        "Custom ADU designs tailored to your property, lifestyle, and Los Angeles zoning requirements. From concept to permitted plans.",
      iconName: "pencil-ruler",
      primaryKeyword: "ADU design Los Angeles",
      seoTitle: "ADU Design & Architecture Los Angeles | ADU Build LA",
      seoDescription:
        "Custom ADU design and architecture services in Los Angeles. We handle everything from concept to city-approved plans. Starting from $150,000.",
      sections: [
        {
          type: "intro",
          heading: "Expert ADU Design for Los Angeles Homeowners",
          body: "Our architectural team specializes exclusively in ADU design across Los Angeles County. We know the local zoning codes, setback requirements, and permit processes inside and out — so your project moves forward without delays.\n\nFrom junior ADUs to two-story detached units, every design is customized to your lot, your goals, and your budget.",
        },
        {
          type: "cta",
          heading: "Ready to Design Your ADU?",
          subheading: "Get a free consultation with our design team.",
          primary_label: "Request a Free Estimate",
          primary_url: "/estimate",
          secondary_label: "View ADU Models",
          secondary_url: "/adu-models",
          background: "dark",
        },
      ],
    },
    {
      name: "ADU Permitting & Approvals",
      slug: "adu-permitting",
      serviceCode: "adu-permitting",
      shortDescription:
        "We handle the full permitting process with the City of Los Angeles and surrounding municipalities — from plan check to final approval.",
      iconName: "file-check",
      primaryKeyword: "ADU permits Los Angeles",
      seoTitle: "ADU Permitting & Approvals Los Angeles | ADU Build LA",
      seoDescription:
        "Full-service ADU permit management in Los Angeles. We navigate plan check, city approvals, and inspections so you don't have to.",
      sections: [
        {
          type: "intro",
          heading: "Hassle-Free ADU Permitting in Los Angeles",
          body: "Permitting is often the most frustrating part of an ADU project. Our team has permitted hundreds of ADUs across Los Angeles, and we handle every step — plan check submissions, responses to corrections, utility coordination, and final sign-off.\n\nMost clients see their permits approved in 6–12 weeks. We track every deadline so nothing falls through the cracks.",
        },
        {
          type: "cta",
          heading: "Start Your Permit Process Today",
          subheading: "We'll assess your property and outline the permit timeline.",
          primary_label: "Get a Free Consultation",
          primary_url: "/estimate",
          secondary_label: "Learn About the Process",
          secondary_url: "/blog",
          background: "dark",
        },
      ],
    },
    {
      name: "ADU Construction",
      slug: "adu-construction",
      serviceCode: "adu-construction",
      shortDescription:
        "Full-service ADU construction from foundation to finish. Licensed, bonded, and experienced in LA County building requirements.",
      iconName: "hard-hat",
      primaryKeyword: "ADU construction Los Angeles",
      seoTitle: "ADU Construction Los Angeles | Build Your ADU | ADU Build LA",
      seoDescription:
        "Professional ADU construction in Los Angeles. Licensed and insured general contractor specializing in ADUs. Starting from $150,000.",
      sections: [
        {
          type: "intro",
          heading: "ADU Construction Done Right",
          body: "We self-perform the core trades on every ADU we build — no subcontracting your project to unfamiliar crews. Our construction team has built ADUs across every neighborhood in Los Angeles, from compact studio units to two-bedroom, two-story structures.\n\nEvery build includes weekly progress updates, a dedicated project manager, and a 1-year workmanship warranty.",
        },
        {
          type: "cta",
          heading: "Build Your ADU with Confidence",
          subheading: "ADUs starting from $150,000. Request a free estimate.",
          primary_label: "Get a Free Estimate",
          primary_url: "/estimate",
          secondary_label: "See Our Projects",
          secondary_url: "/projects",
          background: "dark",
        },
      ],
    },
    {
      name: "Garage Conversion ADU",
      slug: "garage-conversion",
      serviceCode: "garage-conversion",
      shortDescription:
        "Convert your existing garage into a fully permitted, legal ADU. One of the most cost-effective ways to add rental income or housing in LA.",
      iconName: "home",
      primaryKeyword: "garage conversion ADU Los Angeles",
      seoTitle: "Garage Conversion ADU Los Angeles | ADU Build LA",
      seoDescription:
        "Convert your garage into a legal ADU in Los Angeles. Expert garage conversion specialists — design, permits, and construction included.",
      sections: [
        {
          type: "intro",
          heading: "Turn Your Garage Into a Legal ADU",
          body: "A garage conversion is often the fastest and most affordable path to an ADU. By working with your existing structure, we can dramatically reduce construction time and cost — often completing a garage conversion ADU in 12–16 weeks after permitting.\n\nWe handle every aspect: structural assessment, architectural drawings, permit filing, and full interior build-out.",
        },
        {
          type: "cta",
          heading: "Is Your Garage a Candidate?",
          subheading: "Get a free property assessment and conversion cost estimate.",
          primary_label: "Request a Free Assessment",
          primary_url: "/estimate",
          secondary_label: "Learn More",
          secondary_url: "/blog",
          background: "dark",
        },
      ],
    },
    {
      name: "Junior ADU (JADU)",
      slug: "junior-adu",
      serviceCode: "junior-adu",
      shortDescription:
        "Junior ADUs (JADUs) are units up to 500 sq ft created within your existing home. Lower cost, simpler permitting, and powerful for rental income.",
      iconName: "layout",
      primaryKeyword: "junior ADU Los Angeles",
      seoTitle: "Junior ADU (JADU) Los Angeles | ADU Build LA",
      seoDescription:
        "Junior ADU specialists in Los Angeles. We design and build JADUs up to 500 sq ft within your existing home. Simpler permits, faster build.",
      sections: [
        {
          type: "intro",
          heading: "Junior ADUs: Maximum Value, Minimum Footprint",
          body: "A Junior ADU (JADU) is carved out of your existing living space — converting a bedroom, bonus room, or attached garage into a self-contained unit up to 500 square feet. JADUs have simpler permitting requirements than full ADUs and can often be completed in a matter of months.\n\nThey're ideal for homeowners who want rental income or a space for family members without a major construction footprint.",
        },
        {
          type: "cta",
          heading: "Explore Your JADU Options",
          subheading: "Find out if your home qualifies for a Junior ADU.",
          primary_label: "Get a Free Consultation",
          primary_url: "/estimate",
          secondary_label: "Learn About JADUs",
          secondary_url: "/blog",
          background: "dark",
        },
      ],
    },
  ];

  for (const service of services) {
    await prisma.servicePage.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        ...service,
        fullPath: `/services/${service.slug}`,
        status: ContentStatus.published,
        publishedAt: new Date(),
        sections: service.sections,
        canonicalUrl: `/services/${service.slug}`,
        indexPage: true,
      },
    });
  }
  console.log(`✅ ${services.length} service pages seeded`);

  // ─── Blog posts ────────────────────────────────────────────────────────────
  const posts = [
    // ── UPGRADED ARTICLE 1: ADU Cost ─────────────────────────────────────────
    {
      allowUpdate: true,
      title: "How Much Does an ADU Cost in Los Angeles in 2025?",
      slug: "how-much-does-an-adu-cost-in-los-angeles",
      excerpt:
        "A thorough breakdown of ADU costs in Los Angeles — what each cost category actually covers, typical all-in ranges by project type, the site conditions that move the number, and how to evaluate a contractor quote before you sign anything.",
      primaryKeyword: "ADU cost Los Angeles",
      seoTitle: "How Much Does an ADU Cost in Los Angeles? (2025 Guide)",
      seoDescription:
        "Realistic ADU cost breakdown for Los Angeles homeowners. All-in ranges by type, what drives the price, how to read a quote, and what to ask before committing to a budget.",
      body: `## The Honest Answer: It Depends on More Than Just Size

Ask five ADU contractors what an ADU costs in Los Angeles and you'll get five different answers — not because any of them are being evasive, but because the price genuinely varies based on factors that can't be assessed from a zip code alone. A 400 sq ft detached studio on a flat Culver City lot is a materially different project from a 400 sq ft detached studio on a sloped Silver Lake lot with a 60-amp panel and a sewer lateral that hasn't been touched since the 1970s.

This guide breaks down what actually goes into an ADU price, what typical ranges look like by project type, and what questions to ask before you commit to a contractor or a budget.

## The Four Cost Categories That Make Up Every ADU

Regardless of project type, every ADU involves the same broad cost buckets. The relative weight of each shifts by project — a garage conversion spends very little on site work but more on electrical and plumbing; a detached new build spends heavily on foundation and framing.

### Design and Architecture

A complete ADU permit package includes: a site plan with dimensioned setbacks, floor plan with room labels and square footage, exterior elevations on all four sides, foundation plan, roof framing plan, and Title 24 energy compliance calculations. For a straightforward detached studio, design-only services from a third-party architect typically run $8,000–$20,000. Complex or two-story projects can run $15,000–$30,000+.

At ADU Build LA, architecture and engineering are included in our all-in project price — there is no separate design contract.

### Permitting and City Fees

Permit fees are set by each municipality and calculated based on project type, square footage, and construction valuation. In the City of Los Angeles (LADBS), ADU permit fees commonly fall in the **$5,000–$15,000 range**. Independent cities like Burbank, Santa Monica, and Long Beach set their own fee schedules — some are higher, some are lower.

California law caps school district fees for ADUs at a reduced rate (as of recent legislation, new ADUs under 500 sq ft are exempt). Your contractor should be able to give you a realistic permit fee estimate for your specific city before you sign anything.

### Site Work and Utilities

This is the category that most often surprises homeowners who got an initial ballpark without a site visit. Common site work costs include:

- **Electrical panel upgrade**: If your main panel is 100 amps or below (common in pre-1980s homes), you'll likely need an upgrade to support the ADU's dedicated circuits. A panel upgrade typically costs $3,000–$8,000.
- **Sewer lateral**: If the lateral connecting your property to the city sewer is old, undersized, or failing a required video inspection, replacement can run $5,000–$20,000+ depending on depth and distance.
- **Grading and drainage**: Sloped lots require cut-and-fill work and drainage design. This can range from minor ($2,000–$5,000) to significant ($15,000+) on steep or complex sites.
- **Utility trenching**: Running new electrical, gas, water, and sewer lines from the main house to a detached ADU involves trenching — the distance and what's in the ground drive the cost.

A contractor who doesn't walk your property before quoting cannot reliably account for these items.

### Construction

The construction cost — labor and materials for the actual building — is the largest component. For a standard detached ADU on a flat lot in Los Angeles, expect **$275–$450 per square foot** for full construction. Two-story structures, hillside lots, premium finishes, or supply chain constraints can push this above $500/sq ft.

## All-In Cost Ranges by ADU Type

These ranges reflect total project cost — design, permitting, site work, and construction — assuming standard lots, standard soil conditions, and mid-range finishes:

| ADU Type | Typical All-In Range | Notes |
|---|---|---|
| Junior ADU (JADU) | $60,000 – $120,000 | Conversion within existing home footprint |
| Garage Conversion | $80,000 – $160,000 | Depends on structure condition and plumbing distance |
| Attached ADU | $120,000 – $230,000 | Addition to existing structure |
| Detached Studio (under 500 sq ft) | $150,000 – $250,000 | New construction, flat lot |
| Detached 1-Bedroom (500–800 sq ft) | $200,000 – $320,000 | New construction, flat lot |
| Detached 2-Bedroom (800–1,200 sq ft) | $270,000 – $400,000+ | New construction, larger footprint |

Hillside lots, poor soil conditions, long utility runs, and premium finishes can push any of these well above the upper end.

## What "All-Inclusive" vs. "Construction Only" Actually Means

This distinction matters more than most homeowners realize. Some contractors quote a **construction cost only** and list design, permitting, and site work as separate items that you discover later. Others — including ADU Build LA — quote a single all-inclusive number that covers every category.

When you're comparing quotes, confirm what's actually included. A construction-only quote of $140,000 for a garage conversion might become $180,000–$200,000 once design ($12,000), permits ($8,000), electrical panel upgrade ($6,000), and plumbing rough-in ($15,000) are added back. The "cheaper" quote ends up costing more.

## What Moves the Price Up or Down

**Lot conditions** are the biggest variable. A flat, well-serviced lot with a modern electrical panel and accessible sewer is the best-case scenario for cost. A sloped lot with limited access, an aged panel, and a long utility run to the rear adds meaningfully to the budget.

**ADU type** shapes the baseline cost. Converting an existing structure (garage, attached space) starts from something that's already built — lower cost, but more constrained. New detached construction gives you full design flexibility but costs more.

**Size** drives cost but not linearly. Going from 400 to 600 sq ft increases construction cost, but fixed costs — design, permits, utility connections — stay roughly the same, which means larger units often have a lower per-square-foot all-in cost.

**Finishes** affect construction cost but rarely proportionally affect rental income. Mid-grade finishes in a well-designed unit outperform premium finishes in a poorly designed one for both livability and rental appeal.

## Questions to Ask Any Contractor Before You Sign

Before committing to a price, get clear written answers to these:

1. Is this quote all-inclusive, or does it exclude design, permits, or site work?
2. Have you walked my property? What site conditions are you assuming?
3. Are permit fees included in this number, or will they be billed separately?
4. What happens if the site assessment reveals conditions not visible today (e.g., failing sewer lateral)?
5. What does the payment schedule look like, and what triggers each milestone payment?

A contractor who can't answer these specifically — in writing — is a contractor who will be presenting you with change orders later.

## The Only Way to Get a Number You Can Actually Use

Online calculators are useful for initial orientation. City-specific ranges are useful for setting expectations. But the only number worth building a budget around is one produced after a contractor has walked your property, reviewed your existing utilities, confirmed your setbacks, and assessed your lot conditions. A free property assessment does exactly this — and the good ones do it with no obligation and no pressure.`,
      faqItems: [
        {
          q: "What is the cheapest type of ADU to build in Los Angeles?",
          a: "A Junior ADU (JADU) is typically the least expensive option — often $60,000–$120,000 all-in — because it's created within the existing footprint of your home without new foundation work or a separate structure. A garage conversion is the next most affordable at $80,000–$160,000. New detached construction is the most expensive because it starts from an empty lot.",
        },
        {
          q: "Why are ADU costs in Los Angeles higher than in other parts of California?",
          a: "LA's higher costs reflect the city's labor market, material costs, and permitting complexity. LADBS plan check requirements, local seismic standards, Title 24 energy compliance, and the prevalence of older housing stock with aged utilities all contribute. Some independent cities within LA County (like Santa Monica or Culver City) have additional requirements that add cost.",
        },
        {
          q: "Can I finance the cost of building an ADU?",
          a: "Yes. Common options include a cash-out refinance, a home equity line of credit (HELOC), a home equity loan, or an ADU-specific construction loan. Some California programs have offered subsidized ADU financing for income-qualified homeowners. Which option makes sense depends on your equity position, current mortgage, and how you plan to use the ADU — a lender familiar with ADU projects can walk you through the options.",
        },
        {
          q: "Does ADU construction increase my property taxes?",
          a: "Yes, but only for the assessed value of the new ADU — your existing home's assessed value is protected under Proposition 13 and doesn't change. The ADU's construction value is added to your assessment. For a $200,000 ADU, this typically adds roughly $2,000–$2,500 per year in property taxes — usually a small fraction of the annual rental income the ADU generates.",
        },
        {
          q: "How do I know if a contractor's quote is realistic?",
          a: "A realistic quote should be: (1) all-inclusive, covering design, permits, site work, and construction; (2) based on an actual site visit, not just your address; (3) itemized enough that you can see what's included and what isn't; and (4) accompanied by a written contract that specifies scope, timeline, and payment schedule. A quote delivered over the phone or via email without a site visit is a ballpark at best.",
        },
      ],
    },

    // ── UPGRADED ARTICLE 2: ADU Permit Process ────────────────────────────────
    {
      allowUpdate: true,
      title: "The ADU Permit Process in Los Angeles: A Step-by-Step Guide",
      slug: "adu-permit-process-los-angeles",
      excerpt:
        "A step-by-step walkthrough of the ADU permit process in Los Angeles — what happens at each stage, realistic timelines, the most common causes of delay, and how experienced contractors keep projects moving through LADBS.",
      primaryKeyword: "ADU permit process Los Angeles",
      seoTitle: "ADU Permit Process in Los Angeles: Step-by-Step Guide (2025)",
      seoDescription:
        "Complete guide to the ADU permit process in Los Angeles. What each step involves, realistic timelines by city, common delays and how to avoid them, and what a CO means for your rental.",
      body: `## Why the Permit Process Deserves Your Attention

The permit phase is the part of an ADU project that most homeowners underestimate — and the part that most often determines whether a project goes smoothly or becomes a source of extended stress and cost. Construction timelines are largely predictable once a permit is in hand. Permit timelines are not.

Understanding what happens at each stage, why delays occur, and what separates a clean submission from a messy one helps you evaluate contractors, set realistic expectations, and plan your project intelligently.

## Who Issues ADU Permits in Los Angeles?

This is the first point of confusion for many homeowners: "Los Angeles" is not one permitting authority. Depending on where your property is:

- **City of Los Angeles properties**: Permitted by LADBS (Los Angeles Department of Building and Safety), which operates multiple district offices and a dedicated ADU plan check program.
- **Independent cities within LA County**: Burbank, Glendale, Santa Monica, Culver City, Pasadena, Long Beach, El Segundo, and others each have their own building departments with their own processes, staff, timelines, and fee schedules. A contractor who only knows LADBS may be poorly prepared for these jurisdictions.

Knowing which authority governs your address is step one.

## Step 1: Property Eligibility Assessment

Before any plans are drawn, a qualified ADU professional confirms your property's eligibility and establishes the parameters of what can be built.

This assessment covers:
- **Zoning classification**: Most residential zones allow ADUs, but the type and size may vary.
- **Lot size and coverage**: Your existing structures use a portion of your allowable lot coverage; an ADU must fit within what remains.
- **Setbacks**: California law sets a minimum 4-foot rear and interior side setback for detached ADUs. Some cities require 5 feet. Front setbacks apply differently.
- **Existing structure review**: For a garage conversion or attached addition, the existing structure's condition, height, and location are assessed.
- **Utility capacity**: Panel amperage, sewer lateral condition, and water service size are reviewed for adequacy.

This step takes **1–2 weeks** and is typically part of a contractor's free initial assessment.

## Step 2: Architectural Design and Engineering

Once the scope and parameters are confirmed, the design phase produces the full permit package. A complete LADBS submission requires:

- **Site plan**: Dimensioned to show property lines, the existing structure, the proposed ADU footprint, setbacks, and utility locations
- **Floor plan**: Room layout with labels, dimensions, and square footage
- **Exterior elevations**: All four sides of the proposed structure
- **Foundation plan**: Footing size and placement, foundation type
- **Roof framing plan**: Structural layout of the roof
- **Title 24 energy compliance report**: California's energy code requires demonstrated compliance calculations before permits can issue

For projects with two-story structures, hillside locations, or non-standard structural conditions, a licensed structural engineer's stamped drawings are also required.

**Timeline**: 4–8 weeks for a standard detached ADU; 6–10 weeks for complex projects.

**What can extend this**: Design revisions after the program is set, delayed soil reports on hillside sites, or overloaded design teams.

## Step 3: Plan Check Submission

Completed plans are submitted to LADBS (or the applicable city's building department) for plan check review. The plan checker reviews the submission against applicable codes: local zoning, California Building Code, Title 24, and ADU-specific state law requirements.

The City of Los Angeles operates a **dedicated ADU plan check program** that routes ADU applications to reviewers specifically familiar with ADU requirements. This typically produces faster, more consistent review than the general construction queue.

**Initial review timeline**:
- City of Los Angeles (LADBS): typically 4–8 weeks for first response
- Independent cities: varies widely — some are faster (Culver City has historically been efficient), some are slower

**What you receive back**: Either a notice that permits are ready to issue (rare on first submission) or a correction notice listing required changes.

## Step 4: Correction Notices and Resubmittal

Receiving a correction notice is not a failure — it's a normal part of the process. LADBS reviewers flag code issues, request additional documentation, or note items that need clarification. Most first submissions receive some corrections.

What matters is the quality of the initial submission:

- **Clean first submission** (prepared by an experienced ADU architect): 3–6 corrections, resolved in 1–2 rounds, 2–4 weeks of back-and-forth
- **Incomplete first submission**: 10–20+ corrections, multiple rounds, 6–12 weeks of back-and-forth

An architect who has submitted dozens of ADU applications to your specific city knows what reviewers look for and what triggers correction notices. This knowledge directly shortens your permit timeline.

**Resubmittal timeline**: 1–3 weeks per round, depending on correction complexity.

## Step 5: Permit Issuance

Once the plan check is cleared, permits are issued. You'll receive a **building permit** (the primary permit covering structural work) plus any required separate permits for mechanical, electrical, and plumbing work.

Permit issuance typically takes **1–2 weeks** from plan check approval. Once permits are in hand, construction can legally begin.

**Permit fees** are collected at issuance. In the City of Los Angeles, total ADU permit fees commonly run **$5,000–$15,000** depending on project scope and construction valuation. Independent cities have their own fee schedules.

## Step 6: Construction and Required Inspections

Once construction begins, LADBS (or your city) requires inspections at specific milestones. These inspections must be passed before work can proceed past each stage. Required inspections for a typical ADU include:

- **Foundation/slab inspection**: Before concrete is poured
- **Framing inspection**: After framing is complete, before insulation or sheathing
- **Rough MEP inspection**: Rough mechanical, electrical, and plumbing installed but not yet covered
- **Insulation inspection**: After insulation is installed, before drywall
- **Drywall nailing inspection** (some jurisdictions)
- **Final inspection**: All work complete

LADBS typically schedules inspections 3–10 days out. A contractor with a well-planned construction schedule books inspections proactively so they don't become bottlenecks.

**Construction timeline by project type**: Garage conversion: 10–16 weeks. Attached ADU: 14–20 weeks. Detached ADU: 16–24 weeks.

## Step 7: Final Inspection and Certificate of Occupancy

When construction is complete, the final inspection confirms the work matches the approved plans and meets all applicable codes. If the inspector finds deficiencies, they're noted and must be corrected before the inspection can be passed.

After passing final inspection, the building department issues a **Certificate of Occupancy (CO)**. The CO is the document that makes your ADU legally habitable and legally rentable. Without it, the unit is unpermitted — a significant legal and financial liability.

Never occupy or rent an ADU before the CO is issued.

## The Most Common Causes of Permit Delays

In practice, the same issues cause the majority of permit delays:

**Underprepared initial submission.** The single largest driver of extended permit timelines. A design team that doesn't know your specific city's requirements will submit plans that generate extensive correction notices. The correction cycle — submit, wait, correct, resubmit, wait — can easily add 2–4 months to a project.

**Utility upgrade requirements discovered late.** If the sewer lateral fails inspection or the electrical panel requires upgrade, these create separate permit applications and utility work that run in parallel to (or interrupt) the main project timeline.

**HOA restrictions.** If your property is subject to a homeowners association, confirm their rules before submitting to the city. Some HOAs require their own approval before you can proceed. HOA approval runs alongside city permitting — it doesn't replace it — but discovering an HOA restriction after city plans are submitted forces a rework.

**Design changes after submission.** Changing your floor plan, moving a bathroom, or modifying the structure after plans are submitted requires a plan check amendment — effectively restarting that portion of the review. Lock in the design before submitting.

**Structural complexity on hillside or two-story projects.** More engineering means more review, more correction potential, and more iterations. Budget extra time on complex sites.

## Realistic Total Timelines

| Project Type | Design + Permitting | Construction | Total |
|---|---|---|---|
| Garage Conversion | 3–5 months | 2–4 months | 5–9 months |
| Attached ADU | 3–5 months | 3–5 months | 6–10 months |
| Detached ADU (flat lot) | 4–6 months | 4–6 months | 8–12 months |
| Detached ADU (complex/hillside) | 5–8 months | 5–7 months | 10–15 months |

The difference between the low and high ends is almost entirely driven by permit process quality — a clean submission with an experienced team versus an underprepared one.

## What You Can Do to Keep Your Project on Track

**Work with a team that has submitted many projects to your specific city.** City-specific experience is not interchangeable — a contractor who knows LADBS well but has never submitted to the City of Santa Monica will encounter friction they could have avoided.

**Lock in your design before submitting.** Every change after submission costs time. Spend the extra week or two in design to be certain before the plans go in.

**Get utility conditions assessed early.** Panel capacity, sewer lateral condition, and water service size should be evaluated before design is finalized — not after permits are submitted.

**Plan your timeline conservatively.** A permit that takes 12 weeks instead of an expected 10 weeks doesn't need to be a crisis if you planned for contingency. A permit that takes 12 weeks when you promised a tenant move-in date of 8 weeks is a problem.`,
      faqItems: [
        {
          q: "Do I need a permit to convert my garage into an ADU?",
          a: "Yes. A garage-to-ADU conversion requires a building permit regardless of how minimal the structural changes appear. The conversion involves electrical, plumbing, and energy compliance work that all require plan check and inspection. An unpermitted garage conversion cannot be legally rented and creates significant liability at resale.",
        },
        {
          q: "Can I submit ADU plans to LADBS online?",
          a: "LADBS has expanded its online submittal and e-plan check capabilities, and the dedicated ADU program accepts electronic submissions. The specific process depends on your project type and which LADBS district office manages your area. Your architect or contractor should be current on the preferred submittal method, as this has evolved and continues to change.",
        },
        {
          q: "What happens if my ADU fails final inspection?",
          a: "A failed final inspection generates a list of deficiencies that must be corrected. Once corrections are made, you request a re-inspection. This can add 1–3 weeks to the project timeline. Deficiencies at final inspection usually reflect work that doesn't match the approved plans, code violations, or incomplete work. A contractor with strong quality control catches these issues before calling for inspection.",
        },
        {
          q: "Do I need a separate permit for the garage conversion portion if I'm also building a detached ADU?",
          a: "If the two structures are separate projects, they may require separate permits. If you're doing both simultaneously under one contract, your contractor may be able to combine them under one permit application. The specifics depend on the scope and LADBS's project classification. Your contractor or architect should clarify how multiple structures on the same lot are handled at the applicable building department.",
        },
        {
          q: "Can my neighbor block or delay my ADU permit?",
          a: "In most cases, no. California law significantly limits the ability of neighbors or local governments to block ADU permits on grounds of neighbor objection or discretionary review. ADUs that comply with state law standards must be permitted ministerially — meaning the city reviews for code compliance, not for community opposition. However, projects in Coastal Zones (like parts of Venice or Santa Monica) may require additional review from the California Coastal Commission.",
        },
      ],
    },
    // ── ARTICLE 4: ADU Cost Deep Dive ─────────────────────────────────────────
    {
      title: "ADU Cost in Los Angeles: What Homeowners Should Expect",
      slug: "adu-cost-los-angeles-what-to-expect",
      excerpt:
        "A practical breakdown of ADU costs in Los Angeles — what drives the price, typical ranges by project type, and the questions to ask before you commit to a budget.",
      primaryKeyword: "ADU cost Los Angeles",
      seoTitle: "ADU Cost in Los Angeles: What Homeowners Should Expect (2025)",
      seoDescription:
        "Realistic ADU cost ranges for Los Angeles homeowners. What drives the price, how to read a contractor quote, and what's included in a genuine all-in estimate.",
      body: `## Why ADU Costs in Los Angeles Vary So Much

If you've searched for ADU pricing online, you've probably seen ranges that span hundreds of thousands of dollars. That's not evasiveness — it reflects real variation in project scope, site conditions, and finish level. A junior ADU carved out of a spare bedroom has almost nothing in common cost-wise with a two-story detached unit on a hillside lot. Understanding what drives cost helps you evaluate quotes and plan your budget more accurately.

## The Main Cost Categories

Every ADU project — regardless of type — involves the same broad cost buckets. Knowing what's in each one makes it easier to compare proposals.

### Design and Architecture

An ADU design package covers the drawings that go to the permit office: site plan, floor plans, exterior elevations, sections, foundation plan, and Title 24 energy compliance calculations. For a straightforward detached ADU, expect this to run roughly $8,000–$20,000 if you hire separately. At ADU Build LA, design is included in our all-in price — there's no separate architecture contract.

### Permitting Fees

Permit fees are set by the city and vary by project type and valuation. In the City of Los Angeles, ADU permit fees typically fall in the $5,000–$15,000 range. Some cities charge more; others less. School district fees, which California law caps for ADUs, apply in most jurisdictions. Your contractor should be able to give you a permit fee estimate for your specific city before you sign anything.

### Site Work and Utilities

This is often where budgets get surprised. Upgrading an undersized electrical panel, extending a sewer lateral, improving lot drainage, or dealing with a sloped site adds real cost. Before finalizing a budget, a contractor should walk your property and flag any site work requirements.

### Construction

The construction cost — labor and materials — is the largest portion. Per-square-foot cost for an ADU in Los Angeles typically runs **$250–$450 for a standard detached build**, but can be higher for two-story structures, hillside projects, or premium finishes.

## Cost by ADU Type

| ADU Type | Typical All-In Range |
|---|---|
| Junior ADU (JADU) | $60,000 – $120,000 |
| Garage Conversion | $80,000 – $160,000 |
| Attached ADU | $120,000 – $230,000 |
| Detached Studio | $150,000 – $250,000 |
| Detached 1–2 Bedroom | $200,000 – $380,000+ |

These ranges assume standard lots and finishes. Hillside lots, poor soil conditions, or premium material selections can push costs above these bands.

## What "All-Inclusive" Actually Means

Some contractors quote a construction cost only and list design, permits, and site work as separate line items. Others — including ADU Build LA — quote a single all-inclusive number that covers design, permitting, site work, and construction. When comparing quotes, make sure you're comparing the same scope. A low construction-only quote can easily become the most expensive option once the other costs are added back.

## Questions to Ask Before Committing to a Budget

- Does this price include design and permitting, or just construction?
- What site conditions have been assumed, and what would change the price?
- Are permit fees included or billed separately as they're incurred?
- What's the payment schedule, and at what milestones?
- Is there a contingency built in, and how is it handled if not needed?

Getting clear answers to these questions upfront prevents budget surprises mid-project.

## The Most Reliable Way to Get an Accurate Number

Online calculators and rule-of-thumb ranges are useful for initial planning. But an accurate cost for your specific project requires a site visit: review of your lot conditions, existing utilities, zoning, and what you want to build. ADU Build LA offers free property assessments for Los Angeles homeowners — no cost, no obligation — that produce a realistic all-in estimate for your specific property.`,
      faqItems: [
        {
          q: "What's a realistic starting budget for an ADU in Los Angeles?",
          a: "For most homeowners, a realistic budget starts around $80,000 for a garage conversion JADU and goes up from there. A detached ADU with its own foundation, utilities, and separate structure typically starts around $150,000 for a studio and can range considerably higher depending on size, site conditions, and finishes. There is no reliable single number without a site assessment.",
        },
        {
          q: "Why do ADU quotes vary so much between contractors?",
          a: "Quotes vary because contractors scope projects differently. Some quote construction only; others include design, permitting, and site work. Some assume ideal site conditions; others account for unknowns. Make sure any quote you're comparing is all-inclusive and based on an actual site visit, not assumptions.",
        },
        {
          q: "Do permit fees count toward the ADU cost?",
          a: "Yes — permit fees are a real project cost, typically $5,000–$15,000 in the City of Los Angeles depending on project type and valuation. A contractor who quotes you a construction price only and then bills permit fees separately is not giving you a complete picture of your total cost.",
        },
        {
          q: "What site conditions most affect ADU cost?",
          a: "The most common cost drivers beyond the basic build are: sloped or hillside lots (requiring stepped foundations or retaining walls), undersized electrical panels (requiring upgrade), aging sewer laterals, poor drainage requiring grading work, and limited lot access that complicates construction logistics.",
        },
        {
          q: "Is it worth paying more for a higher-finish ADU?",
          a: "It depends on your goal. If you're building to rent, mid-grade finishes typically deliver a better return on incremental spend than premium finishes — rental rates in most LA neighborhoods don't reward ultra-high-end finishes proportionally. If the ADU will house family members long-term, the calculus is different. A good contractor can help you think through this before locking in a spec level.",
        },
      ],
    },

    // ── ARTICLE 5: Garage Conversion Cost ─────────────────────────────────────
    {
      title: "Garage Conversion Cost in Los Angeles: What Changes the Price",
      slug: "garage-conversion-cost-los-angeles",
      excerpt:
        "What does a garage conversion actually cost in Los Angeles? A practical breakdown of the variables that move the price — and what to watch out for when getting quotes.",
      primaryKeyword: "garage conversion cost Los Angeles",
      seoTitle: "Garage Conversion Cost in Los Angeles: What Changes the Price (2025)",
      seoDescription:
        "Realistic garage conversion costs for Los Angeles homeowners. What drives the price from $80K to $160K+, what's included, and how to avoid budget surprises.",
      body: `## What Does a Garage Conversion Cost in Los Angeles?

A garage conversion in Los Angeles typically costs **$80,000–$160,000**, with most single-car conversions landing in the $90,000–$130,000 range when done by an experienced ADU contractor. Two-car garages — which offer more usable space — often run $110,000–$160,000 or more.

These aren't simple numbers to pin down, because multiple variables shift the cost significantly. Understanding what those variables are helps you interpret quotes, plan your budget, and avoid surprises.

## What's Already There (and What Isn't)

A garage conversion starts with an existing structure, which is why it's generally less expensive than building something new from the ground up. But the existing structure also comes with constraints:

**Foundation and slab**: Most LA garages sit on a concrete slab. If the slab is in good condition and the right depth, you can work with it. If it's cracked, too thin, or at the wrong elevation for drainage, you may need partial or full slab work — which adds cost.

**Framing and walls**: Existing framing may need reinforcement, especially if you're adding interior walls, a bathroom, or a loft. Some garages have minimal framing that needs to be brought up to residential standards.

**Roof**: If the garage roof is at the end of its useful life or was never designed for a living space load, a roof replacement or upgrade may be required.

## The Biggest Cost Variables

### Electrical

Converting a garage to a habitable unit requires a full residential electrical installation: subpanel or panel upgrade, proper circuit layout, GFCI protection, and lighting to code. If your main panel is already at capacity, a panel upgrade adds $3,000–$8,000 to the project.

### Plumbing

Adding a kitchen and bathroom to a space that had neither means running new supply and drain lines. How far those lines need to travel — and whether they can tie into the existing system without major rerouting — drives cost. Some garages are close to the house plumbing stack; others require longer runs.

### HVAC

Garages don't have heating or cooling. A converted ADU needs a proper HVAC system. Mini-split systems (heat pump / air conditioning) are the most common choice for LA conversions — efficient, relatively compact, and code-compliant. Expect $5,000–$10,000 for a quality mini-split installation including electrical.

### Insulation and Moisture Barrier

Garages are typically uninsulated. Bringing a garage to Title 24 energy code requires proper insulation in walls, ceiling, and often the slab (or a moisture barrier). Depending on the existing construction, this can range from straightforward to complex.

### Ceiling Height

Many garages have lower ceiling heights than a standard living space. California ADU law requires at least 7-foot ceiling height for habitable rooms. If your garage ceiling is below 7 feet, you have two options: lower the floor (expensive) or raise the roof structure (also expensive). Most LA garages built after the 1970s have sufficient height, but older garages may not.

## What's Typically Included in a Garage Conversion Quote

A complete, all-inclusive garage conversion quote should cover:
- Architectural drawings and permit submission
- All permit and city fees
- Foundation/slab work if required
- Framing, insulation, drywall
- Electrical, plumbing, HVAC
- Windows, exterior door, interior finishes
- Kitchen and bathroom installation
- Final inspection and certificate of occupancy

Be cautious of quotes that exclude permit fees, site conditions, or utility connections — these are real costs that need to be in the budget.

## Garage Conversion vs. Detached ADU

If your garage is in poor structural condition, the cost gap between conversion and new construction narrows. A well-built detached ADU on a new foundation, starting from scratch, often costs $150,000–$280,000 but gives you full control over size, layout, and placement. A garage conversion is typically faster and less expensive, but you're working within the constraints of the existing structure.

The right choice depends on your garage's condition, your goals, and your lot. A site visit is the only reliable way to know which option makes more sense for your property.`,
      faqItems: [
        {
          q: "Can I convert a two-car garage into an ADU in Los Angeles?",
          a: "Yes. Two-car garage conversions are common across LA and can produce a well-proportioned one-bedroom or even two-bedroom ADU. The existing footprint typically gives you 400–500+ square feet to work with. The conversion process and permit requirements are the same as a single-car conversion.",
        },
        {
          q: "Does a garage conversion require a separate entrance?",
          a: "A garage conversion that creates a completely separate unit requires its own exterior entrance. If you're creating a Junior ADU (JADU), it must have an exterior door but can share the main house bathroom under certain conditions. A full ADU must be self-contained with its own kitchen and bathroom.",
        },
        {
          q: "Do I lose my parking when I convert my garage?",
          a: "California ADU law prohibits cities from requiring replacement parking when a garage is converted to an ADU. You may lose covered parking, but you cannot be denied an ADU permit purely because parking is being eliminated. Check with your contractor about your specific city's rules.",
        },
        {
          q: "How long does a garage conversion take from start to finish?",
          a: "A typical garage conversion takes 8–14 months total: roughly 3–5 months for design and permitting, then 3–5 months of construction. The permitting phase varies by city and project complexity. Working with a contractor who knows the local permit process well can shorten this considerably.",
        },
        {
          q: "What's the rental income potential for a converted garage ADU in Los Angeles?",
          a: "Rental rates depend heavily on location, size, and finish quality, but garage conversion ADUs in Los Angeles commonly rent for $1,500–$2,800 per month. Properties in West Side neighborhoods, beach cities, and desirable East Side areas tend to command the higher end of that range. A free property assessment can give you a realistic rental income projection for your specific address.",
        },
      ],
    },

    // ── ARTICLE 6: ADU Permit Timeline ────────────────────────────────────────
    {
      title: "ADU Permit Timeline in Los Angeles: From Plans to Final Sign-Off",
      slug: "adu-permit-timeline-los-angeles",
      excerpt:
        "How long does it actually take to get an ADU permit in Los Angeles? A realistic timeline — from design through final inspection — with explanations of what causes delays and how to avoid them.",
      primaryKeyword: "ADU permit timeline Los Angeles",
      seoTitle: "ADU Permit Timeline in Los Angeles: From Plans to Final Sign-Off",
      seoDescription:
        "Realistic ADU permit timeline for Los Angeles. How long each step takes, what causes delays, and how to keep your project on track from plan check to certificate of occupancy.",
      body: `## Why the ADU Permit Timeline Matters

The permit process is often the most unpredictable part of an ADU project. Construction timelines are reasonably predictable; permit timelines are less so. Understanding what's in each phase — and what can extend or compress it — helps you plan accurately and set realistic expectations with family members or future tenants.

## The Phases of an ADU Permit in Los Angeles

### Phase 1: Design and Plan Preparation (4–8 Weeks)

Before anything is submitted to the city, your design team prepares the permit package. For an ADU, this means:

- **Site plan**: Showing the property with the proposed ADU location, setbacks, and dimensions
- **Floor plan**: Room layout, square footage, window and door locations
- **Exterior elevations**: All four sides of the structure
- **Foundation plan**: Footing design and structural connections
- **Title 24**: California energy compliance calculations

The complexity of your project drives how long this takes. A garage conversion with a straightforward floor plan can be designed in 3–4 weeks. A detached two-story on a hillside lot may take 6–10 weeks, particularly if a structural engineer's drawings are needed.

**What can slow this phase:** Changing your mind about the design mid-way through, delays in getting soil reports or survey data, or a design team that has too many active projects.

### Phase 2: Plan Check Submission and Initial Review (3–6 Weeks)

Once plans are complete, they're submitted to LADBS (or your city's building department) for plan check. The City of Los Angeles offers a **dedicated ADU plan check program** that processes ADU applications separately from general construction — in practice, this means somewhat faster initial reviews compared to the general queue.

Initial review typically takes 3–6 weeks in the City of LA. Independent cities like Burbank, Glendale, or Long Beach have their own timelines — some are faster, some are slower.

**What comes back**: Either an approval to issue permits, or a list of corrections (called a "correction notice"). Most first submissions receive at least some corrections.

### Phase 3: Corrections and Resubmittal (1–4 Weeks)

Correction notices are normal. An experienced ADU architect prepares responses and resubmits. A single round of corrections and response typically takes 1–2 weeks. Second rounds — if corrections are substantial — take another 1–2 weeks.

**What can slow this phase:** Extensive corrections (usually a sign the initial submission was underprepared), disagreement with the reviewer requiring escalation, or slow turnaround on engineering responses.

### Phase 4: Permit Issuance (1–2 Weeks)

Once the plan check is cleared, permits are formally issued. You'll receive the building permit along with mechanical, electrical, and plumbing permits as applicable. Construction can begin.

### Phase 5: Construction and Inspections (12–24 Weeks)

Construction timelines depend on project type and complexity. Key milestones that require LADBS inspection include:

- **Framing inspection**: After framing is complete but before insulation or drywall
- **Rough MEP inspection**: Rough mechanical, electrical, and plumbing before walls are closed
- **Insulation inspection**: Before drywall is installed
- **Final inspection**: After all work is complete

Scheduling inspections requires coordination — LADBS typically books inspections 3–10 days out. A good contractor plans the construction schedule around inspection availability.

### Phase 6: Final Inspection and Certificate of Occupancy (1–2 Weeks)

Once construction is complete and final inspection is passed, LADBS issues a Certificate of Occupancy. This is the document that makes your ADU legally habitable and rentable. In most cases the final inspection and CO issuance happen within 1–2 weeks of each other.

## Realistic Total Timeline by Project Type

| Project Type | Permitting | Construction | Total |
|---|---|---|---|
| Garage Conversion | 3–5 months | 3–5 months | 6–10 months |
| Attached ADU | 3–5 months | 4–6 months | 7–11 months |
| Detached ADU (standard lot) | 4–6 months | 5–7 months | 9–13 months |
| Detached ADU (hillside/complex) | 5–8 months | 6–9 months | 11–17 months |

## The Biggest Causes of Permit Delays

**Incomplete initial submissions.** A plan check that comes back with 15 corrections instead of 3–4 adds weeks. The difference is usually preparation quality, not reviewer difficulty.

**Utility upgrades that require separate permits.** If your electrical panel needs upgrading, that's a separate application process. Same with sewer laterals. Good planning addresses these early.

**HOA complications.** If your property is subject to an HOA, confirm their rules before submitting to the city. Some HOAs restrict ADUs or require their own approval process, which runs parallel to — not instead of — city permitting.

**Structural complexity.** Two-story structures, hillside lots, or unusual soil conditions require more engineering time and more thorough plan check review.

## How to Keep Your Project on Schedule

Work with a design team that has submitted many ADU applications to your specific city — they know what reviewers look for and how to prepare a clean first submission. Confirm all site conditions (panel capacity, sewer access, soil) before plans are finalized so you're not doing this during permit review. And plan your overall timeline conservatively: it's better to move in six weeks earlier than expected than to have made commitments based on an optimistic schedule.`,
      faqItems: [
        {
          q: "How long does an ADU permit take in Los Angeles?",
          a: "For a typical detached ADU in the City of Los Angeles, the permitting phase (design through permit issuance) runs 4–6 months. Simpler projects like garage conversions can be faster; complex hillside or two-story projects can take longer. Construction then adds another 4–7 months depending on scope.",
        },
        {
          q: "What is the LADBS ADU plan check program?",
          a: "LADBS operates a dedicated ADU plan check program that processes ADU applications separately from general construction permits. In practice, this means ADU applications are reviewed by staff familiar with ADU-specific requirements and move through the queue somewhat independently. Your contractor or architect submits to this program directly.",
        },
        {
          q: "Can I speed up the ADU permit process?",
          a: "The most effective way to speed up permitting is to submit clean, complete plans the first time — reducing correction rounds. Hiring a design team with extensive LADBS ADU experience is the single biggest factor. Expedited review options exist but add cost; discuss this with your contractor based on your timeline needs.",
        },
        {
          q: "Do I need a permit for every change during construction?",
          a: "Significant changes to the approved plans — relocating walls, changing structural elements, modifying the approved electrical layout — typically require a plan check amendment. Minor field changes may be approved by the inspector on site. Work with your contractor to flag any changes before they're made so the permit stays clean.",
        },
        {
          q: "What is a Certificate of Occupancy and why does it matter?",
          a: "A Certificate of Occupancy (CO) is the document LADBS issues after final inspection confirms the ADU was built to the approved plans and meets code. Without a CO, the unit is not legally habitable or rentable. Never skip the final inspection — an unpermitted unit creates legal and financial exposure when you eventually sell the property.",
        },
      ],
    },

    // ── ARTICLE 7: Best ADU Size for Small Backyards ──────────────────────────
    {
      title: "Best ADU Size for Small Backyards in Los Angeles",
      slug: "best-adu-size-small-backyard-los-angeles",
      excerpt:
        "How do you design a useful, comfortable ADU when your Los Angeles backyard is tight? A practical guide to ADU sizing decisions, layout strategies, and what actually fits on small lots.",
      primaryKeyword: "ADU size small backyard Los Angeles",
      seoTitle: "Best ADU Size for Small Backyards in Los Angeles | ADU Build LA",
      seoDescription:
        "How to choose the right ADU size for a small Los Angeles backyard. Setback rules, realistic footprints, layout tips, and what to prioritize in a compact unit.",
      body: `## ADU Size on Small Lots: The Core Tension

Small-backyard ADU projects involve a fundamental tension: you want to maximize usable living space, but the lot imposes hard limits — setbacks, lot coverage caps, and simple geometry. The goal is to build the most livable unit that actually fits your property legally, not the largest unit theoretically possible.

This guide walks through how to think about ADU sizing on constrained Los Angeles lots, what the rules actually allow, and what layout decisions matter most.

## What California and Los Angeles Law Allow

California's ADU laws set minimum rights that no city can override. In the City of Los Angeles (and most of LA County):

**Maximum ADU size**: 1,200 square feet for a detached ADU, or 50% of the existing primary dwelling's square footage — whichever is less. For most standard LA homes, this cap is rarely the binding constraint; the lot itself is.

**Setbacks**: Detached ADUs require a minimum 4-foot rear and side setback. This is a state-mandated floor — cities cannot require more. Some cities apply 5-foot setbacks; verify your specific jurisdiction.

**Lot coverage**: Most Los Angeles residential zones cap total lot coverage at 40–50%. An existing home typically uses 30–40% of the lot. The remaining coverage capacity limits how much additional footprint you can add.

**Height**: Single-story detached ADUs are typically limited to 16 feet. Two-story ADUs can reach 25 feet in most zones.

## What Realistically Fits on a Small Backyard

"Small backyard" in Los Angeles commonly means 800–1,800 square feet of rear yard space. Here's what typically fits:

**Studio ADU (300–400 sq ft)**: Fits on very tight lots. A well-designed 350 sq ft studio can include a full kitchen, bathroom, sleeping area, and small living zone if the layout is thoughtful. These work well as rental units and are faster and less expensive to build.

**One-bedroom ADU (450–650 sq ft)**: The sweet spot for most small LA backyards. Enough space for separate living, sleeping, kitchen, and bath without requiring a large footprint. A 500 sq ft one-bedroom typically needs a building footprint of roughly 400–450 sq ft (accounting for exterior walls).

**Two-bedroom ADU (650–900 sq ft)**: Possible on many standard LA lots. A two-bedroom unit with this footprint requires more rear yard depth — roughly 20–25 feet of usable depth plus setbacks. Works well when the lot is wider than it is deep.

## Layout Decisions That Matter More Than Size

In a compact ADU, layout quality matters more than raw square footage. The decisions that most affect livability:

### Ceiling Height

Higher ceilings make small spaces feel significantly larger. A 9-foot ceiling in a 400 sq ft studio reads very differently than the same footprint with an 8-foot ceiling. Many lots support a taller single-story unit — it's worth discussing with your architect.

### Open-Plan vs. Compartmentalized

Small ADUs benefit from open-plan living areas. Combining kitchen, dining, and living into one undivided space avoids the cramped feeling of multiple tiny rooms. The bedroom and bathroom are the only rooms that need separation.

### Storage

Thoughtful built-in storage — closets that use full wall height, kitchen cabinets to ceiling, storage under stairs if applicable — dramatically improves how a small unit functions. Plan storage from the start, not as an afterthought.

### Light and Cross-Ventilation

Small units that feel comfortable have good natural light and airflow. Orient the unit to maximize south-facing windows where possible. Include windows on at least two walls. A skylight in the bathroom or hallway can transform an otherwise interior-feeling space.

## When to Consider a JADU Instead

If your property has an underused bedroom with a separate exterior access point — or could add one — a Junior ADU (JADU) can be created without touching the backyard at all. JADUs are limited to 500 sq ft and must be within the existing home footprint, but they're faster to permit and significantly less expensive to build.

If your primary goal is rental income with minimal disruption to your backyard and existing home, a JADU is worth evaluating before committing to new construction.

## Getting the Size Right for Your Property

The right ADU size isn't the maximum the city allows — it's the size that makes the best use of your available space while remaining financially practical. The way to find it is a property assessment that measures your available rear yard, confirms your setbacks and lot coverage capacity, and gives you a realistic view of what can be built.`,
      faqItems: [
        {
          q: "What is the minimum ADU size allowed in Los Angeles?",
          a: "California law requires cities to allow a minimum ADU of at least 800 sq ft regardless of lot size, though most projects are designed larger. There is no practical lower limit — some homeowners build 300–400 sq ft studio units that are still fully code-compliant and useful as rental units.",
        },
        {
          q: "Can I build an ADU if my backyard is very small?",
          a: "Possibly, but it depends on your specific lot dimensions, setback requirements, and existing lot coverage. Some lots that appear too small can actually accommodate a compact studio ADU once the geometry is worked out. The only reliable answer is a site assessment that maps your actual available space.",
        },
        {
          q: "Does a larger ADU always generate more rental income?",
          a: "Not proportionally. Rental rates increase with size, but not linearly — going from 400 to 600 sq ft might increase rent by 20–30%, while construction cost increases more significantly. For pure rental return, a well-designed smaller unit often outperforms a larger one when you factor in the additional construction cost.",
        },
        {
          q: "What setbacks apply to a small detached ADU in Los Angeles?",
          a: "In the City of Los Angeles, detached ADUs require a minimum 4-foot rear yard setback and 4-foot interior side yard setback. These are state law minimums. Some cities require 5 feet. Front yard setbacks apply differently — ADUs generally cannot be placed in the front setback area.",
        },
        {
          q: "Can I build a two-story ADU on a small lot?",
          a: "Yes, in many cases. A two-story ADU doubles your usable floor area without increasing the ground footprint — which makes it particularly useful on tight lots. However, two-story structures require more engineering, have higher per-square-foot costs, and require neighbors' privacy to be considered. Your architect should assess whether a two-story configuration works for your specific property and neighborhood context.",
        },
      ],
    },

    // ── ARTICLE 8: How to Choose the Right ADU Builder ────────────────────────
    {
      title: "How to Choose the Right ADU Builder in Los Angeles",
      slug: "how-to-choose-adu-builder-los-angeles",
      excerpt:
        "What separates a qualified ADU builder from a general contractor who dabbles in ADUs? A practical guide to evaluating proposals, asking the right questions, and avoiding the most common hiring mistakes.",
      primaryKeyword: "choose ADU builder Los Angeles",
      seoTitle: "How to Choose the Right ADU Builder in Los Angeles | ADU Build LA",
      seoDescription:
        "How to evaluate and choose an ADU builder in Los Angeles. What questions to ask, what red flags to watch for, and what separates genuine ADU specialists from generalists.",
      body: `## Why Choosing the Right Builder Matters More Than the Price

An ADU is a significant investment — typically $100,000–$350,000 depending on project type. Choosing the wrong builder doesn't just create frustration; it can result in permit delays, cost overruns, construction defects, or a unit that can't pass final inspection. The time spent evaluating builders carefully at the start is far less costly than addressing problems mid-project.

This guide covers what to look for, what to ask, and what to be skeptical of when evaluating ADU contractors in Los Angeles.

## ADU Specialists vs. General Contractors

A general contractor who "does ADUs" is not the same as a firm that specializes in ADUs. The differences matter:

**Permitting knowledge**: ADU permitting in Los Angeles has specific requirements — LADBS program-specific submission standards, SB 9 and ADU law nuances, city-specific rules for independent jurisdictions like Burbank or Glendale. A contractor who does a few ADUs a year doesn't accumulate the same permit knowledge as one who submits dozens per year.

**Design integration**: Firms that handle both design and construction understand how design decisions affect constructibility and cost. Firms that outsource design to a third-party architect and hand off plans to a construction crew have more coordination risk.

**Subcontractor relationships**: ADU projects require reliable electrical, plumbing, HVAC, and framing crews. Contractors with established ADU-focused subcontractor teams experience fewer scheduling gaps and coordination issues.

## What to Look for in an ADU Builder

### California Contractor's License

Any contractor doing work over $500 in California must hold a valid contractor's license. For general construction (ADUs, remodels), look for a **Class B General Building Contractor** license. Verify the license at the California Contractors State License Board (CSLB) website. Also confirm the license is active, bonded, and that the business name matches.

### Workers' Compensation and General Liability Insurance

Ask for certificates of insurance. Workers' comp protects you if a worker is injured on your property. General liability covers property damage. Both should be current and name you as an additional insured on the project.

### ADU-Specific Experience

Ask specifically about ADU projects, not general construction experience. Relevant questions:
- How many ADUs have you permitted and built in the last two years?
- What cities have you worked in?
- Can you walk me through a recent LADBS plan check submission?
- Have you handled projects similar to mine (hillside, garage conversion, detached, etc.)?

### References and Completed Projects

Ask for references from recent ADU clients — specifically homeowners whose projects are complete and have received their Certificate of Occupancy. Ask those references about communication, budget accuracy, timeline, and how problems were handled when they arose.

### What's Actually Included in the Quote

Get quotes in writing and be specific about what's included. A complete ADU quote should cover design, engineering, all permit and city fees, site work, construction, inspections, and final certificate of occupancy. Quotes that exclude any of these items require you to estimate and budget those costs separately — which creates risk.

## Red Flags to Watch For

**No physical business address or license verification.** Unlicensed work is a serious risk — you have limited recourse if problems arise.

**Price that's dramatically lower than other quotes.** Sometimes this reflects a genuinely lean operation; more often it means scope exclusions, cheaper materials, or unqualified labor that will cost you more later.

**Pressure to sign quickly or pay a large deposit immediately.** California limits initial deposits to 10% or $1,000, whichever is less. Contractors who pressure you to sign same-day or pay more than the legal deposit upfront are red flags.

**No timeline commitment.** A reputable contractor can give you a realistic timeline — design, permit, construction — with contractual milestones. "We'll get to it when we can" is not a project schedule.

**Reluctance to pull permits.** Any contractor who suggests doing the work without permits is asking you to take all the risk. An unpermitted ADU cannot be legally rented, creates problems at resale, and may require demolition if discovered.

## The Right Questions to Ask

Before signing anything with an ADU contractor, ask:

1. Is your team in-house or do you subcontract the design and construction?
2. Who will be my single point of contact throughout the project?
3. How do you handle cost surprises or scope changes?
4. What does your payment schedule look like, and what triggers each payment?
5. How many active projects will your team be running alongside mine?
6. What's your process when construction hits an unexpected site condition?

How a contractor answers these questions tells you as much as what they say.

## Getting the Right Estimate

An accurate estimate requires more than a phone call. A contractor who quotes you a price before walking your property is making assumptions. The site visit is where a good contractor discovers what your specific lot and structure require — and where you see how they think and communicate. Treat the estimate process as your first evaluation of the contractor, not just a price comparison.`,
      faqItems: [
        {
          q: "How do I verify that an ADU contractor is licensed in California?",
          a: "Go to the California Contractors State License Board (CSLB) website and search by contractor name, license number, or business name. Confirm the license is active, the classification is appropriate (Class B for general construction), and that the bond and workers' comp are current. This takes about two minutes and is worth doing before any substantive conversation.",
        },
        {
          q: "What is the maximum deposit a contractor can require in California?",
          a: "Under California law, a contractor cannot require an initial deposit of more than 10% of the total contract price or $1,000 — whichever is less. Be very cautious of any contractor who asks for a larger upfront payment before work begins.",
        },
        {
          q: "Should I use a design-build firm or hire an architect and contractor separately?",
          a: "For ADUs specifically, design-build firms have a practical advantage: design and construction are coordinated by the same team, reducing the gap between what's designed and what can realistically be built at the quoted price. Separate architect and contractor arrangements can work well but require more active management from you and more coordination between two parties with separate financial interests.",
        },
        {
          q: "How many ADU contractor quotes should I get?",
          a: "Three quotes is a reasonable benchmark. It gives you enough data to understand the price range without creating so much process that you're comparing incomparable scopes. Make sure all three quotes cover the same scope — all-in versus construction-only quotes are not comparable numbers.",
        },
        {
          q: "What should be in an ADU construction contract?",
          a: "A solid ADU contract should specify: complete project scope, total contract price, payment schedule and milestones, timeline with start and estimated completion dates, change order process, warranty terms, and license and insurance information. Anything agreed verbally should be in the written contract. If a contractor resists putting something in writing, that's a signal.",
        },
      ],
    },

    // ── ARTICLE 9: Detached vs Attached ADU (upgraded version) ───────────────
    {
      title: "Detached vs. Attached ADU: Which Option Fits Your Property Best?",
      slug: "detached-vs-attached-adu-which-fits-your-property",
      excerpt:
        "Detached and attached ADUs are both good options — but the right choice depends on your lot, your goals, and your budget. A practical comparison for Los Angeles homeowners.",
      primaryKeyword: "detached vs attached ADU Los Angeles",
      seoTitle: "Detached vs. Attached ADU: Which Option Fits Your Property? | ADU Build LA",
      seoDescription:
        "Comparing detached and attached ADUs for Los Angeles homeowners. Cost, privacy, timeline, and lot suitability — how to choose the right option for your property.",
      body: `## The Choice That Shapes Everything Else

Whether to build a detached or attached ADU is one of the earliest and most consequential decisions in an ADU project. It affects cost, construction timeline, privacy, rental income potential, and the long-term character of your property.

Both options are legal in Los Angeles. Both can generate rental income and add property value. But they serve different situations, and choosing the wrong one for your property adds cost and complexity that could have been avoided.

## Detached ADU: A Fully Separate Structure

A detached ADU is an independent building, set apart from the main house, with its own foundation, utilities, entrance, and living space. It can be located anywhere on the lot that meets setback and lot coverage requirements.

### When a Detached ADU Makes Sense

**You have rear yard space**: Detached ADUs require room. A typical detached ADU footprint — after accounting for 4-foot setbacks from all property lines — needs at least 15–20 feet of rear yard depth to produce a useful unit, and more for a one-bedroom or larger.

**Privacy is the priority**: A detached unit offers complete separation from the main house — no shared walls, no shared entrance, no noise path between units. This is what most tenants prefer and typically commands higher rent.

**You want maximum rental income**: For long-term rental or vacation rental purposes, a detached ADU with full privacy generally outperforms an attached unit in the same market, assuming comparable size and finish.

**Long-term property value matters**: A well-designed detached ADU adds a distinct, independently valuable structure to your property. This is often reflected in appraisal and resale value more than an attached addition.

### What to Consider

Detached ADUs cost more than attached ones and take longer to permit and build. They require more lot space. On very small lots, they may simply not be feasible after setbacks are accounted for.

**Typical cost**: $150,000–$350,000+
**Typical total timeline**: 10–16 months (design through CO)

## Attached ADU: Connected to the Main House

An attached ADU shares at least one wall with the existing home. This includes rear additions, side additions, basement conversions, and attached garage conversions. It must have its own private entrance but can share utilities with the main house more easily.

### When an Attached ADU Makes Sense

**Your lot has limited rear yard space**: If the rear yard is constrained, building onto the side or rear of the house uses the footprint more efficiently than trying to place a separate structure.

**You want to house family members nearby**: Attached configurations often work well for multigenerational living — there's proximity without full exposure to shared common areas.

**Budget is the primary constraint**: Attached ADUs are generally less expensive than detached because they share foundation, walls, and sometimes roof structure with the existing home.

**The existing structure can be leveraged**: If you have an attached garage that can be converted, a basement that meets height requirements, or a room over the garage, these can become ADUs with less new construction than building from scratch.

### What to Consider

Shared walls mean more noise transmission between units. Tenants and homeowners who share a wall are more aware of each other's presence. Design decisions — insulation, wall assembly, layout of loud rooms — can mitigate this but not eliminate it.

**Typical cost**: $100,000–$230,000
**Typical total timeline**: 7–13 months (design through CO)

## Side-by-Side Comparison

| Factor | Detached ADU | Attached ADU |
|---|---|---|
| Privacy from main house | High | Moderate |
| Typical cost range | $150K – $350K+ | $100K – $230K |
| Lot space required | More | Less |
| Construction timeline | Longer | Shorter |
| Rental income potential | Higher | Good |
| Multigenerational fit | Depends on layout | Often good |
| Impact on backyard | Significant | Less |

## The Lot-First Approach

The most reliable way to choose between detached and attached is to start with your lot, not your preference. Some lots make the choice for you: a small backyard with an existing attached garage often points toward garage conversion. A large open rear yard often makes a detached unit the clear winner.

A property assessment maps your specific lot and surfaces both options — including which is feasible, what each would look like, and what each would cost on your property.`,
      faqItems: [
        {
          q: "Can I build both a detached ADU and a Junior ADU on the same property?",
          a: "Yes. California law allows one detached ADU plus one Junior ADU (JADU) on a single-family lot. The JADU must be within the existing home footprint (or an attached structure). This combination can maximize rental income on a property: the detached ADU rents for market rate, and the JADU can serve as a secondary rental or multigenerational space.",
        },
        {
          q: "Does an attached ADU affect the structural integrity of my home?",
          a: "Done correctly, no. An attached ADU is designed and engineered to integrate properly with the existing structure. The key is having a qualified architect and structural engineer who understand how the addition ties into the existing framing, foundation, and load path. Cutting corners on structural design is where problems arise.",
        },
        {
          q: "Which type of ADU adds more value to my property?",
          a: "Both add meaningful value. Detached ADUs are generally appraised more favorably because they're independent structures that could in theory be sold or developed separately in some future scenario. That said, attached ADUs in tight markets still add significant value, particularly when they expand the home's livable square footage. Your specific property, neighborhood, and market matter more than the general type.",
        },
        {
          q: "Can an attached ADU share utilities with the main house?",
          a: "Yes. Attached ADUs can share a utility meter with the main house (sub-metered for internal tracking) or have a separate meter installed. Separate meters are common for rental situations. This is a decision to make early in the design process, as it affects electrical panel sizing and the utility connection design.",
        },
        {
          q: "Is a garage conversion considered a detached or attached ADU?",
          a: "It depends on whether your garage is attached or detached. A detached garage converted to living space becomes a detached ADU. An attached garage becomes an attached ADU. The permit process and cost structure are similar for both; the primary difference is how it relates to the main house.",
        },
      ],
    },

    // ── ARTICLE 10: Hillside Lot ADU ──────────────────────────────────────────
    {
      title: "Can You Build an ADU on a Hillside Lot in Los Angeles?",
      slug: "adu-hillside-lot-los-angeles",
      excerpt:
        "Hillside lots in LA create real challenges for ADU construction — but many are buildable. Here's what homeowners in hillside neighborhoods need to know about slope, permits, access, and cost.",
      primaryKeyword: "ADU hillside lot Los Angeles",
      seoTitle: "Can You Build an ADU on a Hillside Lot in Los Angeles? | ADU Build LA",
      seoDescription:
        "Everything Los Angeles hillside homeowners need to know about building an ADU on a sloped lot. Feasibility, cost factors, permit requirements, and what makes hillside ADUs harder.",
      body: `## Hillside ADUs: Harder, But Often Buildable

Los Angeles has thousands of hillside residential properties — in Silver Lake, Eagle Rock, Echo Park, Highland Park, Beachwood Canyon, Mount Washington, and the Hollywood Hills, among others. Many homeowners in these neighborhoods want to add an ADU but assume the slope makes it impossible or prohibitively expensive.

The reality is more nuanced. Many hillside lots can support an ADU. The structural approach is different, the cost is higher than a flat-lot project, and the permit process involves more engineering review. But "harder" doesn't mean "impossible," and for hillside homeowners who have the right lot, an ADU can generate substantial rental income in high-demand neighborhoods.

## What Makes Hillside ADU Projects Different

### Foundation and Structural Design

On a flat lot, most ADUs use a standard concrete slab-on-grade. On a hillside, the foundation must be designed to handle the slope — which typically means one of three approaches:

**Stepped foundation**: The foundation follows the slope in a stair-step pattern, with the structure stepping up with the grade. This is the most common approach for moderate slopes.

**Pier-and-grade-beam**: Concrete piers are drilled into the hillside, connected by grade beams that support the structure. This allows the building to span across a slope without excessive excavation.

**Raised floor framing over a daylight basement**: On steeper slopes, the ADU may be raised above grade on the downhill side, with usable space below — essentially a daylight basement that becomes part of the living area or garage.

Each approach has different cost and design implications. Your architect and structural engineer determine which approach is right for your specific slope, soil conditions, and ADU design.

### Soils and Geotechnical Engineering

Hillside construction in LA often requires a **soils report** (geotechnical investigation). The soils report assesses soil bearing capacity, expansion potential, and slope stability. LADBS typically requires a soils report for hillside projects — it's submitted with the structural engineering and is part of the plan check package.

A soils report typically costs $2,000–$5,000 and adds 2–4 weeks to the pre-permit phase.

### Grading and Drainage

Building on a slope requires managing water: both the water that flows toward the structure from uphill, and the water that needs to drain away from the foundation. Poor drainage design on a hillside is a long-term liability. Your plans must include a grading and drainage plan that satisfies LADBS.

Some hillside lots also sit in or near **High Fire Hazard Severity Zones (HFHSZ)**. Properties in these zones require fire-resistive exterior construction — specific roofing, vents, eaves, and siding materials that meet California Building Code Chapter 7A requirements. This adds cost but is non-negotiable.

### Access to the Site

Construction access matters more than homeowners typically expect. Hillside lots often have narrow driveways or steep approaches that limit what equipment can reach the site. Limited access means more manual labor for material handling, which adds time and cost. Before committing to a design and budget, your contractor should assess what equipment can realistically access your site.

## Hillside-Specific Permit Considerations

**LADBS Hillside requirements**: LADBS applies additional scrutiny to hillside projects. Structural drawings must address slope stability, foundation design, and drainage explicitly. First-submission corrections are more common on hillside projects than flat-lot ones.

**Grading permits**: Significant grading work may require a separate grading permit from LADBS's Grading Division. Your contractor should flag early whether this applies.

**Retaining walls**: If your design requires retaining walls over a certain height, these may require separate engineering and permitting. Coordinate this early — a retaining wall that crosses a property line or is over a public easement involves additional review.

## Cost Impact on Hillside ADU Projects

Compared to a comparable ADU on a flat lot, hillside projects typically add 20–50% or more to construction cost, depending on:

- Slope severity
- Soil conditions and geotechnical findings
- Degree of grading required
- Access constraints
- Fire zone requirements

A detached ADU that might cost $200,000 on a standard flat lot could cost $250,000–$320,000+ on a hillside lot, with the difference coming from foundation engineering, soils work, grading, and access-related labor.

## When a Hillside ADU Still Makes Sense

Despite higher costs, hillside ADU projects can make strong financial sense:

**Rental demand is high**: Hillside neighborhoods like Silver Lake, Eagle Rock, and Highland Park have strong rental markets. A well-designed ADU in these areas can command premium rents.

**Property values are high**: Adding a legal ADU to a hillside property in a desirable neighborhood adds disproportionate value relative to the construction cost in many cases.

**The alternative is wasted space**: Many hillside properties have sloped rear yards that aren't usable as lawn or garden. An ADU makes productive use of space that otherwise sits idle.

## Starting Point: A Site Assessment

Whether your hillside lot can support an ADU, and at what cost, requires a site visit. The geometry, slope, soil conditions, access, and fire zone status all vary lot by lot, and none of them can be reliably assessed from the street or from an aerial photo.`,
      faqItems: [
        {
          q: "Do hillside ADU projects always require a soils report?",
          a: "Not always, but frequently. LADBS typically requires a geotechnical report for hillside projects, particularly on steeper slopes or where the structural approach involves significant foundation work. Your architect or structural engineer can determine early whether your project will require one. Budget $2,000–$5,000 and 3–4 weeks for the soils investigation if it's needed.",
        },
        {
          q: "What is a High Fire Hazard Severity Zone and does it affect my ADU?",
          a: "HFHSZ designations identify areas with elevated wildfire risk. Properties in these zones must use fire-resistive construction materials — specific roofing, exterior vents, eaves, and siding that meet California Building Code Chapter 7A. Many hillside neighborhoods in LA fall within these zones. Your ADU must be designed and built to these standards. Your contractor should confirm your property's fire zone status early.",
        },
        {
          q: "Can I use an existing hillside structure for an ADU conversion?",
          a: "Potentially, yes. If you have an existing detached structure — a lower-level storage room, an older accessory building, or a garage built into the hillside — it may be convertible to an ADU if it meets minimum height requirements and can be brought to code. This is worth exploring, as a conversion is typically less expensive than new construction.",
        },
        {
          q: "How does a hillside ADU affect my property's drainage?",
          a: "It must be designed carefully. Hillside construction changes how water moves across your lot. A well-designed project includes drainage swales, waterproofing at the foundation, and a plan for managing both surface runoff and subsurface water. Drainage design is reviewed as part of the LADBS plan check. Inadequate drainage is one of the most common sources of long-term problems with hillside construction.",
        },
        {
          q: "Is it worth building an ADU on a hillside lot?",
          a: "For many homeowners, yes — particularly in high-demand hillside neighborhoods like Silver Lake, Eagle Rock, or Highland Park where rental income and property values support the higher construction cost. The only way to evaluate it accurately for your specific property is a site assessment that determines feasibility, realistic cost, and projected rental income.",
        },
      ],
    },

    // ── ARTICLE 11: ADU Rental Income and ROI ─────────────────────────────────
    {
      title: "ADU Rental Income and ROI in Los Angeles: What Homeowners Should Consider",
      slug: "adu-rental-income-roi-los-angeles",
      excerpt:
        "What can you actually expect to earn from an ADU rental in Los Angeles? A practical guide to rental income ranges, return-on-investment calculations, and the factors that most affect your financial outcome.",
      primaryKeyword: "ADU rental income Los Angeles ROI",
      seoTitle: "ADU Rental Income and ROI in Los Angeles: What to Expect | ADU Build LA",
      seoDescription:
        "Realistic ADU rental income ranges for Los Angeles neighborhoods. How to think about ROI, what affects monthly rent, and whether an ADU makes financial sense for your property.",
      body: `## How to Think About ADU Return on Investment

An ADU is a significant capital investment. Understanding what return to expect — and how to calculate it — helps you make a well-informed decision about whether to build, what type to build, and what to prioritize in the design.

This guide covers realistic rental income ranges, how to think about ROI, and the factors that most affect your financial outcome. It does not make guarantees — rental markets change, and individual properties vary. What it does is give you a framework for thinking through the numbers honestly.

## What ADUs Actually Rent For in Los Angeles

Rental rates for ADUs in Los Angeles vary enormously by neighborhood, size, finish level, and unit type. The ranges below are general reference points — your specific property's rental income potential depends on its location, the unit's quality, and current market conditions.

| Neighborhood Type | Studio ADU | 1-Bed ADU | 2-Bed ADU |
|---|---|---|---|
| West Side (Santa Monica, Culver City) | $2,000–$2,800 | $2,500–$3,500 | $3,200–$4,500 |
| East Side (Silver Lake, Eagle Rock) | $1,800–$2,500 | $2,200–$3,200 | $2,800–$4,000 |
| Valley (Sherman Oaks, Studio City) | $1,600–$2,300 | $2,000–$2,800 | $2,500–$3,500 |
| Long Beach / South Bay | $1,500–$2,200 | $1,900–$2,600 | $2,400–$3,200 |

These ranges reflect unfurnished, long-term rental. Furnished or short-term rental rates can be higher but involve more management.

## Simple ROI Calculation

A straightforward way to evaluate an ADU investment:

**Annual gross rental income** ÷ **Total ADU cost** = **Gross yield**

Example: A $200,000 garage conversion ADU in Silver Lake renting for $2,200/month generates $26,400/year in gross rental income. Gross yield: 13.2%.

From gross income, subtract annual operating costs:
- Property taxes (the ADU's assessed value will be added to your property tax bill)
- Insurance adjustment
- Maintenance and repairs (typically estimated at 1–2% of property value per year)
- Vacancy (assume some months without a tenant, even in a strong market)
- Property management if you use one (typically 8–10% of rent)

A realistic net yield after these costs for a well-located LA ADU typically runs 7–11%, depending on costs and vacancy. This is meaningfully higher than many other passive investment options, and the asset is part of your property.

## Factors That Most Affect Your ADU's Rental Income

### Location

Location is the dominant variable. The same 500 sq ft one-bedroom ADU can command $1,800/month in one neighborhood and $3,000/month two miles away. There's no substitute for understanding your specific neighborhood's rental market.

### Unit Quality and Layout

Tenants in competitive rental markets choose based on kitchen quality, bathroom condition, light, and how the space lives. A well-designed ADU with good natural light, a functional kitchen, and quality finishes commands meaningfully higher rent than a minimally built unit of the same size. The incremental cost to upgrade finishes is typically recouped in rent within 12–18 months in a strong market.

### Unit Type

A fully self-contained unit — private entrance, kitchen, bathroom, no shared walls — commands the highest rent. Attached units with shared walls or shared laundry typically rent for 10–20% less than comparable detached units.

### Legal vs. Unpermitted

A permitted ADU with a Certificate of Occupancy is legally rentable. An unpermitted unit creates landlord liability and fair housing exposure. Many tenants specifically look for permitted units, particularly in the segment of renters who rely on housing vouchers or employee housing programs. Build permitted.

## Beyond Monthly Rent: Property Value

A permitted ADU typically adds value to your property at resale. How much value depends on your neighborhood, the quality of the unit, and market conditions at the time of sale. Appraisers in Los Angeles have become more sophisticated about valuing ADUs — the income approach is increasingly used, meaning a well-rented ADU can add significant appraised value.

This means the ADU's return isn't just rental income over time — it's also reflected in what your property is worth if you sell.

## Is an ADU the Right Financial Decision?

For most Los Angeles homeowners who have an eligible lot and realistic rental expectations, an ADU is a financially sound investment. The combination of rental income, property value appreciation, and the relative security of owning a hard asset in a supply-constrained housing market makes a compelling case.

That said, it's not the right decision for everyone. If you're financing the construction with a high-interest loan, if your neighborhood has high vacancy rates, or if the project cost significantly exceeds what a realistic rental income can support, the math may not work. Run the numbers for your specific situation before committing.

A free property assessment from ADU Build LA covers not just construction cost but also realistic rental income potential for your address — giving you the inputs you need to make an informed decision.`,
      faqItems: [
        {
          q: "How much does an ADU typically rent for in Los Angeles?",
          a: "Rental income varies significantly by neighborhood, unit size, and quality. A studio ADU in Los Angeles typically rents for $1,500–$2,800/month; a one-bedroom $2,000–$3,500/month; and a two-bedroom $2,500–$4,500/month. West Side neighborhoods and desirable East Side areas command higher rents than the Valley or South Bay. Your specific neighborhood and unit quality are the primary determinants.",
        },
        {
          q: "Does adding an ADU increase my property taxes?",
          a: "Yes, but only for the value added by the ADU — not for your existing home. California's Proposition 13 limits reassessment, so your existing home's assessed value doesn't change. The new ADU's construction value is added to your assessment. For a $200,000 ADU, this might add approximately $2,000–$2,500 per year in property taxes, which is typically a small fraction of the rental income generated.",
        },
        {
          q: "Should I use a property manager for my ADU rental?",
          a: "A property manager (typically costing 8–10% of monthly rent) handles tenant screening, leasing, maintenance coordination, and rent collection. For homeowners who live on-site, self-managing a single ADU is often feasible. For those who prefer not to be directly involved in tenant relationships, a property manager is a reasonable cost. Factor this into your net income projections.",
        },
        {
          q: "Can I rent my ADU on Airbnb or other short-term rental platforms?",
          a: "Short-term rental regulations in Los Angeles have changed significantly in recent years. The City of LA has restrictions on short-term rentals that apply to some ADU configurations. Check the current City of LA Home-Sharing ordinance and confirm your property's eligibility before planning a short-term rental strategy. This is an area where regulations change — consult with a local real estate attorney or your city's planning department for current rules.",
        },
        {
          q: "How long does it take to recoup the cost of building an ADU through rental income?",
          a: "At typical LA rental rates and project costs, gross payback period (total project cost ÷ annual gross rent) is commonly 8–15 years. Net payback after operating costs is longer. However, this calculation doesn't account for property value appreciation, which can be substantial in LA's supply-constrained market. Most homeowners who plan to hold their property long-term find the overall financial case compelling even with a long raw payback period.",
        },
      ],
    },

    // ── UPGRADED ARTICLE 3: Detached vs Attached ──────────────────────────────
    {
      allowUpdate: true,
      title: "Detached vs. Attached ADU: Which Is Right for Your Property?",
      slug: "detached-vs-attached-adu",
      excerpt:
        "Detached and attached ADUs both generate rental income and add property value — but they suit different lots, goals, and budgets. A practical guide to making the right call for your specific property.",
      primaryKeyword: "detached vs attached ADU Los Angeles",
      seoTitle: "Detached vs. Attached ADU in Los Angeles: Which Is Right for Your Property?",
      seoDescription:
        "Practical comparison of detached and attached ADUs for Los Angeles homeowners. Cost, privacy, lot requirements, timeline, and a decision framework based on your property's actual conditions.",
      body: `## Why This Decision Matters More Than Most

The choice between a detached and attached ADU shapes nearly every other decision in your project — cost, timeline, tenant experience, privacy, design flexibility, and how your property functions for years afterward. It's worth thinking through carefully rather than defaulting to whichever type sounds more appealing in the abstract.

Both options are legal throughout Los Angeles and LA County. Both can generate meaningful rental income. Both add property value. The question isn't which is better — it's which is better for your specific lot, your specific goals, and your specific budget.

## Detached ADU: A Fully Independent Structure

A detached ADU is a separate building on your property — its own foundation, its own roof, its own entrance, its own address in many cases. It's physically independent of your main house in every meaningful way.

### When a Detached ADU Is the Right Choice

**Your rear yard has usable depth.** After accounting for the 4-foot rear and interior side setbacks California law requires, you need roughly 15–20 feet of usable rear yard depth to produce a livable detached studio, and more for a one-bedroom or larger. If your rear yard provides this, a detached unit is usually the better investment.

**Privacy is your primary goal.** A detached ADU offers complete separation — no shared walls, no shared entrance, no noise path between the main house and the ADU. This is what most market-rate renters prefer and typically supports higher rents than equivalent attached configurations.

**You're optimizing for long-term rental income.** A tenant in a detached unit experiences it as a freestanding home, not as an appendage of someone else's house. This distinction drives both tenant quality and tenant retention — people stay longer in units where they feel genuinely private.

**You want maximum design flexibility.** Starting from a blank footprint lets you orient the unit for natural light, choose the floor plan layout without constraint from the existing structure, and design for the highest livability per square foot.

### What to Understand About Detached ADUs

They cost more and take longer than attached options. The additional cost reflects new foundation work, new utility connections from the main house to the ADU site, and a fully independent structural system. The additional time reflects the greater complexity of permitting new construction versus a conversion.

On very small lots or lots where most of the rear yard is occupied by existing structures, a detached ADU may simply not be feasible after setbacks are applied. A site assessment confirms this quickly.

**Typical all-in cost**: $150,000–$380,000+ depending on size, site conditions, and finishes
**Typical total timeline**: 10–16 months design through certificate of occupancy

## Attached ADU: Connected to the Main Structure

An attached ADU shares at least one wall with your existing home. This includes rear additions, side additions, conversions of attached garages, basement conversions where the ceiling meets height requirements, and second-story additions in some configurations.

### When an Attached ADU Is the Right Choice

**Your lot doesn't have sufficient rear yard space.** On lots where the rear yard is tight, building onto the existing structure — sideways or backward — uses the available space more efficiently than trying to fit a separate building within setback constraints.

**You want a shorter timeline and lower cost.** Attached ADUs generally cost 20–40% less than comparable detached units and move through permitting faster. If budget and schedule are primary concerns, attached is usually the more practical choice.

**The existing structure has usable potential.** An attached garage that can be converted, a basement that meets ceiling height minimums, or a side yard addition that connects naturally to the home's existing layout — these represent opportunities to build from what already exists rather than starting from zero.

**The ADU will house family members.** Multigenerational living arrangements often work well with attached configurations — proximity without full separation. The shared wall that's a drawback for tenant privacy can be an advantage when the goal is having aging parents or adult children nearby.

**You want less impact on your backyard.** A detached unit in the rear yard eliminates or significantly reduces your usable outdoor space. An addition or attached garage conversion doesn't touch the yard at all.

### What to Understand About Attached ADUs

Shared walls mean acoustic connection. With proper insulation — resilient channel, dense-pack insulation, appropriate drywall mass — noise transmission can be meaningfully reduced, but it can't be fully eliminated. This matters more for long-term rentals with strangers than for family occupancy.

Attached ADUs are also more constrained by the existing structure. The position of load-bearing walls, the location of existing plumbing stacks, and the roofline of the house all shape what's possible. A good architect works with these constraints; a careless one creates expensive problems.

**Typical all-in cost**: $100,000–$235,000 depending on type and scope
**Typical total timeline**: 7–12 months design through certificate of occupancy

## The Garage Conversion: A Special Case

A garage conversion — whether the garage is attached or detached — deserves specific mention because it's the most common ADU type in Los Angeles, and it straddles the detached/attached distinction in a way that confuses some homeowners.

- An **attached garage conversion** becomes an attached ADU. It shares a wall (or at least a foundation/roof) with the main house.
- A **detached garage conversion** becomes a detached ADU — an independent structure, separate from the house.

In both cases, you're converting an existing structure rather than building new. This typically means lower cost and faster permitting than new construction, but you're also inheriting the structure's constraints: existing foundation, existing framing, existing ceiling height, existing placement on the lot.

## Side-by-Side Comparison

| Factor | Detached ADU | Attached ADU | Garage Conversion |
|---|---|---|---|
| Privacy from main house | High | Moderate | High (if detached) / Moderate (if attached) |
| Typical all-in cost | $150K – $380K+ | $100K – $235K | $80K – $160K |
| Lot space required | More | Less | Uses existing footprint |
| Construction timeline | 10–16 months | 7–12 months | 6–10 months |
| Rental income potential | Highest | Good | Good |
| Design flexibility | Highest | Moderate | Lowest |
| Backyard impact | Significant | Minimal to none | None (if attached) |

## A Decision Framework for Your Property

Rather than choosing a type based on preference and then seeing if it fits your lot, work in the other direction:

**1. Start with your lot.** Map your rear yard dimensions, subtract setbacks, and see what footprint is available. If there's sufficient usable space for a detached unit, that option is on the table. If not, you're looking at attached or garage conversion options.

**2. Consider your existing structures.** Do you have an attached or detached garage? A basement? A large side yard adjacent to the house? These existing elements may offer conversion opportunities that are faster and less expensive than new construction.

**3. Clarify your primary goal.** Rental income maximization, multigenerational living, budget minimization, and timeline minimization each point toward somewhat different answers. Know your priority before evaluating options.

**4. Get specific numbers for your property.** General ranges only take you so far. The all-in cost for a detached ADU on your specific lot — with your specific utility conditions, soil, access, and setbacks — may be materially different from the range in any guide. A site assessment gives you a real number to work with.

The most common mistake is choosing a type based on what sounds good and then discovering mid-project that the lot doesn't support it, or that the cost gap between types is much larger or smaller than expected. The site assessment prevents this.`,
      faqItems: [
        {
          q: "Can I build both a detached ADU and an attached ADU on the same property?",
          a: "California law allows one ADU plus one Junior ADU (JADU) per single-family lot. A JADU must be within the existing dwelling or an attached structure. So you can have a detached ADU in the rear yard plus a JADU created from a room within your home — but you can't have two full detached ADUs on a standard single-family lot. Some multifamily lots have different rules.",
        },
        {
          q: "Does a detached ADU require a separate utility meter?",
          a: "Not necessarily, but it's common for rental situations. A detached ADU can share utilities with the main house (sub-metered internally) or have separate meters installed. Separate meters for electricity, gas, and water allow you to bill tenants directly for utilities and create clear accountability. Whether to install separate meters is a decision best made during design, as it affects the electrical panel design and utility trench layout.",
        },
        {
          q: "Which type of ADU adds more value at resale?",
          a: "Detached ADUs are generally appraised more favorably because they represent an independent rentable structure with their own legal status. Attached ADUs add value too — primarily by increasing the home's total livable square footage. In practice, both add meaningful value in LA's market; the detached type tends to add more on a per-dollar-spent basis when the location supports premium rental rates.",
        },
        {
          q: "Can I convert my detached garage into a livable ADU if it doesn't have plumbing?",
          a: "Yes, but adding plumbing is a significant part of the project. Running supply and drain lines from the main house to the detached structure involves trenching under the yard and connecting to the existing plumbing system. The distance and what's underground (concrete, other utilities, tree roots) drives cost. This is one reason detached garage conversions can cost more than people expect — the shell may look simple, but the utility connections aren't.",
        },
        {
          q: "Is noise a real problem with an attached ADU?",
          a: "It can be, depending on construction quality and layout. An attached ADU with no acoustic treatment — just standard single-layer drywall on a shared wall — will transmit sound clearly in both directions. With proper construction — resilient channel, dense-pack insulation, double-layer drywall — transmission is significantly reduced. The key is designing for acoustic separation from the start, not retrofitting after complaints. Your architect should treat the shared wall assembly as a design requirement, not an afterthought.",
        },
      ],
    },
  ];

  for (const post of posts) {
    const wordCount = post.body.split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    // Build sections: rich_text always first; faq_list appended when present
    const sections: object[] = [{ type: "rich_text", content: post.body }];
    if ("faqItems" in post && Array.isArray(post.faqItems) && post.faqItems.length > 0) {
      sections.push({ type: "faq_list", items: post.faqItems });
    }

    const postData = {
      title: post.title,
      slug: post.slug,
      fullPath: `/blog/${post.slug}`,
      excerpt: post.excerpt,
      status: ContentStatus.published,
      authorId: defaultAuthor.id,
      sections,
      wordCount,
      readingTimeMinutes,
      primaryKeyword: post.primaryKeyword,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      canonicalUrl: `/blog/${post.slug}`,
      indexPage: true,
    };

    // Posts with allowUpdate: true write new content on re-seed (for upgraded articles)
    const allowUpdate = "allowUpdate" in post && post.allowUpdate === true;

    try {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: allowUpdate ? postData : {},
        create: { ...postData, publishedAt: new Date() },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`⚠️  Skipping post "${post.slug}": ${msg.slice(0, 120)}`);
    }
  }
  console.log(`✅ ${posts.length} blog posts seeded`);

  // ─── Projects ──────────────────────────────────────────────────────────────
  const projects = getAllProjects();
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        fullPath: p.fullPath,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        heroHeading: p.heroHeading,
        heroTagline: p.heroTagline,
        city: p.city,
        projectType: p.projectType,
        sqFt: p.sqFt,
        beds: String(p.beds),
        baths: p.baths,
        completedYear: p.completedYear,
        totalBuildWeeks: p.totalBuildWeeks,
        totalProjectMonths: p.totalProjectMonths,
        projectCost: p.projectCost,
        monthlyRent: p.monthlyRent ?? null,
        useCase: p.useCase,
        challenge: p.challenge as object,
        solution: p.solution as object,
        result: p.result as object,
        buildHighlights: p.buildHighlights as object[],
        scopeItems: p.scopeItems as object[],
        tags: p.tags as string[],
        relatedLocationSlug: p.relatedLocationSlug ?? null,
        relatedLocationName: p.relatedLocationName ?? null,
        relatedModelSlug: p.relatedModelSlug ?? null,
        relatedModelName: p.relatedModelName ?? null,
        relatedServiceSlug: p.relatedServiceSlug ?? null,
        relatedServiceName: p.relatedServiceName ?? null,
        featuredOnHome: p.featuredOnHome ?? false,
        featuredImageUrl: p.featuredImageUrl ?? null,
        sortOrder: p.sortOrder ?? 0,
      },
      create: {
        slug: p.slug,
        name: p.name,
        fullPath: p.fullPath,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        heroHeading: p.heroHeading,
        heroTagline: p.heroTagline,
        city: p.city,
        projectType: p.projectType,
        sqFt: p.sqFt,
        beds: String(p.beds),
        baths: p.baths,
        completedYear: p.completedYear,
        totalBuildWeeks: p.totalBuildWeeks,
        totalProjectMonths: p.totalProjectMonths,
        projectCost: p.projectCost,
        monthlyRent: p.monthlyRent ?? null,
        useCase: p.useCase,
        challenge: p.challenge as object,
        solution: p.solution as object,
        result: p.result as object,
        buildHighlights: p.buildHighlights as object[],
        scopeItems: p.scopeItems as object[],
        tags: p.tags as string[],
        relatedLocationSlug: p.relatedLocationSlug ?? null,
        relatedLocationName: p.relatedLocationName ?? null,
        relatedModelSlug: p.relatedModelSlug ?? null,
        relatedModelName: p.relatedModelName ?? null,
        relatedServiceSlug: p.relatedServiceSlug ?? null,
        relatedServiceName: p.relatedServiceName ?? null,
        featuredOnHome: p.featuredOnHome ?? false,
        featuredImageUrl: p.featuredImageUrl ?? null,
        sortOrder: p.sortOrder ?? 0,
      },
    });
  }
  console.log(`✅ ${projects.length} projects seeded`);

  // ─── Locations ─────────────────────────────────────────────────────────────
  const locations = getAllLocations();
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {
        name: loc.name,
        county: loc.county,
        fullPath: loc.fullPath,
        seoTitle: loc.seoTitle,
        seoDescription: loc.seoDescription,
        heroTagline: loc.heroTagline,
        heroHeading: loc.heroHeading,
        heroSubheading: loc.heroSubheading,
        introHeading: loc.introHeading,
        introParagraphs: loc.introParagraphs,
        stats: loc.stats as object[],
        benefits: loc.benefits,
        permitHeading: loc.permitHeading,
        permitNotes: loc.permitNotes as object[],
        pricingIntro: loc.pricingIntro,
        pricingRanges: loc.pricingRanges as object[],
        faqs: loc.faqs as object[],
        nearbyAreas: loc.nearbyAreas,
      },
      create: {
        slug: loc.slug,
        name: loc.name,
        county: loc.county,
        fullPath: loc.fullPath,
        seoTitle: loc.seoTitle,
        seoDescription: loc.seoDescription,
        heroTagline: loc.heroTagline,
        heroHeading: loc.heroHeading,
        heroSubheading: loc.heroSubheading,
        introHeading: loc.introHeading,
        introParagraphs: loc.introParagraphs,
        stats: loc.stats as object[],
        benefits: loc.benefits,
        permitHeading: loc.permitHeading,
        permitNotes: loc.permitNotes as object[],
        pricingIntro: loc.pricingIntro,
        pricingRanges: loc.pricingRanges as object[],
        faqs: loc.faqs as object[],
        nearbyAreas: loc.nearbyAreas,
      },
    });
  }
  console.log(`✅ ${locations.length} locations seeded`);

  // ─── ADU Models ────────────────────────────────────────────────────────────
  const aduModels = getAllModels();
  for (const m of aduModels) {
    await prisma.aduModel.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        tagline: m.tagline,
        fullPath: m.fullPath,
        modelType: m.modelType,
        badge: m.badge ?? null,
        seoTitle: m.seoTitle,
        seoDescription: m.seoDescription,
        heroHeading: m.heroHeading,
        heroSubheading: m.heroSubheading,
        specs: m.specs as object,
        idealForHeading: m.idealForHeading,
        idealForBody: m.idealForBody,
        idealForItems: m.idealForItems,
        featureGroups: m.featureGroups as object[],
        startingFrom: m.startingFrom,
        startingFromNote: m.startingFromNote,
        faqs: m.faqs as object[],
        tags: m.tags,
      },
      create: {
        slug: m.slug,
        name: m.name,
        tagline: m.tagline,
        fullPath: m.fullPath,
        modelType: m.modelType,
        badge: m.badge ?? null,
        seoTitle: m.seoTitle,
        seoDescription: m.seoDescription,
        heroHeading: m.heroHeading,
        heroSubheading: m.heroSubheading,
        specs: m.specs as object,
        idealForHeading: m.idealForHeading,
        idealForBody: m.idealForBody,
        idealForItems: m.idealForItems,
        featureGroups: m.featureGroups as object[],
        startingFrom: m.startingFrom,
        startingFromNote: m.startingFromNote,
        faqs: m.faqs as object[],
        tags: m.tags,
      },
    });
  }
  console.log(`✅ ${aduModels.length} ADU models seeded`);

  // ─── Service + Location pages ───────────────────────────────────────────────
  const slPages = getAllServiceLocationPages();
  for (const sl of slPages) {
    await prisma.serviceLocationPage.upsert({
      where: {
        locationSlug_serviceSlug: {
          locationSlug: sl.locationSlug,
          serviceSlug: sl.serviceSlug,
        },
      },
      update: {
        locationName: sl.locationName,
        serviceName: sl.serviceName,
        fullPath: sl.fullPath,
        seoTitle: sl.seoTitle,
        seoDescription: sl.seoDescription,
        heroTagline: sl.heroTagline,
        heroHeading: sl.heroHeading,
        heroSubheading: sl.heroSubheading,
        whyHeading: sl.whyHeading,
        whyParagraphs: sl.whyParagraphs,
        considerationsHeading: sl.considerationsHeading,
        considerations: sl.considerations as object[],
        pricingHeading: sl.pricingHeading,
        pricingIntro: sl.pricingIntro,
        pricingRanges: sl.pricingRanges as object[],
        faqs: sl.faqs as object[],
        relatedLocationPath: sl.relatedLocationPath,
        relatedServicePath: sl.relatedServicePath,
        relatedPaths: (sl.relatedPaths ?? []) as object[],
      },
      create: {
        locationSlug: sl.locationSlug,
        serviceSlug: sl.serviceSlug,
        locationName: sl.locationName,
        serviceName: sl.serviceName,
        fullPath: sl.fullPath,
        seoTitle: sl.seoTitle,
        seoDescription: sl.seoDescription,
        heroTagline: sl.heroTagline,
        heroHeading: sl.heroHeading,
        heroSubheading: sl.heroSubheading,
        whyHeading: sl.whyHeading,
        whyParagraphs: sl.whyParagraphs,
        considerationsHeading: sl.considerationsHeading,
        considerations: sl.considerations as object[],
        pricingHeading: sl.pricingHeading,
        pricingIntro: sl.pricingIntro,
        pricingRanges: sl.pricingRanges as object[],
        faqs: sl.faqs as object[],
        relatedLocationPath: sl.relatedLocationPath,
        relatedServicePath: sl.relatedServicePath,
        relatedPaths: (sl.relatedPaths ?? []) as object[],
      },
    });
  }
  console.log(`✅ ${slPages.length} service+location pages seeded`);

  console.log("\n🎉 Seed complete.");
  console.log(`\n📧 Admin login: ${adminEmail}`);
  console.log(`🔑 Password:    ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });