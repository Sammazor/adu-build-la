/**
 * Static FAQ collections for ADU Build LA public pages.
 *
 * CMS-migration-ready — each FaqItem maps 1:1 to a future `Faq` Prisma model
 * with fields: question (string), answer (string), category (string), sortOrder (int).
 * To migrate: replace these arrays with Prisma queries filtered by category.
 */

export interface FaqItem {
  q: string;
  a: string;
}

// ─── General ADU / Process FAQs ───────────────────────────────────────────────
// Used on: homepage, project detail pages

export const GENERAL_FAQS: FaqItem[] = [
  {
    q: "How long does the ADU process take from start to finish?",
    a: "The full process — design through certificate of occupancy — typically takes 9–14 months in Los Angeles County, depending on the city and ADU type. Garage conversions and JADUs tend to move faster (6–9 months), while new detached ADUs typically run 10–14 months. The permit phase is usually the largest variable: LADBS currently runs 10–16 weeks for standard plan check; Santa Monica and Culver City run 12–16 weeks. We set accurate expectations upfront based on current conditions.",
  },
  {
    q: "How much does an ADU cost in Los Angeles?",
    a: "All-inclusive ADU costs in LA typically range from $80,000 for a Junior ADU (JADU) to $280,000 or more for a large detached ADU. Our pricing covers design, engineering, permitting, full construction, and the certificate of occupancy — no hidden costs. Garage conversions start from $95,000; new detached units start from $150,000. Your final price depends on size, scope, site conditions, and finish tier. We provide a detailed fixed-price estimate after the free property assessment.",
  },
  {
    q: "Do I need to live on the property to build or rent an ADU?",
    a: "No — California state law removed owner-occupancy requirements for most ADU types. You can build and rent an ADU without living on the property. A small number of older local ordinances still exist, but most LA County cities now allow non-owner-occupied ADUs freely. We confirm the specific rules for your city as part of the free property assessment.",
  },
  {
    q: "Will my property taxes increase when I add an ADU?",
    a: "In California, adding an ADU triggers a partial reassessment — only the newly constructed structure is reassessed at current market value. Your primary residence keeps its existing Prop 13 assessed value. In most cases, an ADU addition adds $80,000–$150,000 to your assessed value, resulting in roughly $900–$1,700 per year in additional property tax — a modest increase relative to rental income that typically runs $2,000–$4,200/month in the LA market.",
  },
  {
    q: "Can I convert my garage into an ADU?",
    a: "Yes — garage conversions are one of the most cost-effective ADU paths. California state law allows conversion of attached or detached garages into ADUs regardless of setbacks, provided the footprint doesn't expand. You give up the garage parking space, but most LA cities no longer require replacement parking for garage conversions. We assess your garage's structural condition, foundation type, and utility connections as part of the free property review.",
  },
  {
    q: "Does ADU Build LA handle everything, or will I need to hire other contractors?",
    a: "We handle the full process under one contract — design, architecture, engineering, permitting, and construction. You won't need a separate architect, structural engineer, or general contractor. We're an ADU-exclusive design-build firm, which means the same team that designs your ADU also builds it. You'll have one project manager as your single point of contact from initial consultation through certificate of occupancy.",
  },
  {
    q: "What happens if permits take longer than expected?",
    a: "Permit timelines vary by city, and we set expectations upfront based on current plan check backlogs. Our team proactively follows up with plan check departments and responds to correction notices quickly — typically within a few business days. We've navigated permit processes across every major LA-area jurisdiction, so we're not caught off-guard by local requirements. Your construction start is sequenced around permit approval, and we keep you informed throughout.",
  },
  {
    q: "How do I know my ADU will comply with my city's zoning rules?",
    a: "Before any design work begins, we conduct a detailed feasibility assessment: your lot dimensions, setbacks, existing coverage, utility locations, and your city's specific ADU rules. We confirm what's buildable before you spend a dollar on design. This assessment is free and typically takes 2–3 business days. If there's a site constraint that limits your options, you'll know about it before committing to anything.",
  },
];

// ─── Service-focused FAQs ─────────────────────────────────────────────────────
// Used on: service detail pages

export const SERVICE_FAQS: FaqItem[] = [
  {
    q: "What's included in your all-inclusive pricing?",
    a: "Every ADU Build LA project includes architectural design, structural engineering, all permit fees and city approval management, full construction from foundation through finish, and the final inspection and certificate of occupancy. There are no separate design contracts, no hidden permit fees, and no open-ended construction budgets. We provide a single fixed price that covers everything.",
  },
  {
    q: "How does the design-build process work?",
    a: "We start with a free property assessment to confirm what's buildable on your lot and provide an initial price estimate. Once you move forward, our in-house architectural team creates a full design — floor plan, elevations, and 3D views — which you review and approve before anything is submitted to the city. After permit approval, our construction team builds exactly what was designed. One contract, one team, one accountability chain.",
  },
  {
    q: "How long does permitting take in Los Angeles?",
    a: "Permit timelines vary by city and ADU type. In Los Angeles (LADBS), standard plan check currently runs 10–16 weeks. Santa Monica and Culver City run 12–16 weeks. Pasadena typically runs 10–14 weeks. Garage conversions and JADUs often move faster than new detached ADUs. We give you a realistic estimate for your specific city and project type upfront — based on current conditions, not best-case scenarios.",
  },
  {
    q: "Do you work in my city?",
    a: "We serve all of Los Angeles County, including the City of Los Angeles, Santa Monica, Pasadena, Glendale, Culver City, Burbank, Torrance, Long Beach, and surrounding areas. Each city has its own permit process and zoning rules — our team has active experience in all of them. If you're unsure whether we cover your area, contact us and we'll confirm immediately.",
  },
  {
    q: "What's the minimum lot size required to build an ADU?",
    a: "California state law sets a minimum lot size of 800 sq ft for most ADU types, but in practice, almost all residential lots in LA County comfortably exceed this. More relevant constraints are setback requirements (typically 4 feet from side and rear property lines for detached ADUs) and lot coverage limits. We assess your specific lot dimensions and city rules as part of the free property review — there's no point guessing until we've looked at your parcel.",
  },
  {
    q: "Can I customize the design, or are your ADUs pre-designed templates?",
    a: "Both options are available. We offer pre-designed model floor plans — studio through 2-bedroom — that are optimized for LA lot sizes and permit efficiently. These can be customized with different finishes, layout tweaks, and optional additions. We also do fully custom design for homeowners with specific site requirements or a clear vision. Pre-designed models reduce design time and cost; custom design offers maximum flexibility. We'll recommend the right approach after reviewing your property.",
  },
  {
    q: "What warranty do you provide on completed ADUs?",
    a: "Every project includes a 2-year workmanship warranty from the date of certificate of occupancy, covering defects in materials and construction quality. Structural components carry longer coverage per California contractor law (10 years for latent defects). We also coordinate manufacturer warranties on all major systems — HVAC, appliances, windows, and roofing. Our project manager remains your contact for post-occupancy support.",
  },
  {
    q: "What financing options are available for ADU construction?",
    a: "Most of our clients finance ADU construction through a cash-out refinance, HELOC, construction-to-permanent loan, or ADU-specific loan products from lenders like RenoFi. Some use personal savings or gift funds. We don't provide financing directly, but we've worked with many lenders and can provide the documentation they typically require — cost estimates, permit status, and project timelines. Ask us for a lender referral list during your consultation.",
  },
];

// ─── Model-specific FAQs ──────────────────────────────────────────────────────
// Used on: adu-models/[slug] (supplement to model.faqs from aduModels.ts)
// These are generic questions not covered by model-specific content.
// NOTE: model detail pages currently use model.faqs from aduModels.ts directly.
// This export is available for future use or to supplement model-specific FAQs.

export const MODEL_FAQS: FaqItem[] = [
  {
    q: "Are pre-designed models truly fixed price?",
    a: "Pre-designed models have a fixed starting price that covers the standard configuration. Your actual price is confirmed after we review your specific site — factors like soil conditions, slope, utility connections, and finish tier affect the final number. Once we've assessed your property, we provide a firm all-inclusive fixed price for your specific project. The starting price is accurate for typical flat lots with standard site conditions.",
  },
  {
    q: "How much can I customize a pre-designed model?",
    a: "Pre-designed models are a starting point, not a finished product. You can customize finishes (countertops, flooring, tile, cabinetry), appliances, exterior materials, window configurations, and some layout adjustments. More significant layout changes that affect structural or mechanical systems are evaluated case-by-case. Our design team walks you through available options at the start of the design phase.",
  },
  {
    q: "Can I see a completed example of this model?",
    a: "We have completed examples of most of our models — some of which our clients have agreed to allow for private showings during or after construction. Contact us to ask about current availability. We also maintain a portfolio of completed projects on this website, and our team can share detailed photos and specs from past builds similar to the model you're considering.",
  },
];
