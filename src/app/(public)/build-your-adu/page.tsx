import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPageOverride } from "@/lib/data/sitePageOverrides";
import { AduWizard } from "@/components/public/tools/AduWizard";
import { CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageOverride("build-your-adu");
  return buildMetadata({
    title: cms?.seoTitle ?? "Build Your ADU — Free ADU Planner & Cost Estimator",
    description:
      cms?.seoDescription ??
      "Answer 9 quick questions and get a personalized ADU plan for your Los Angeles property — recommended ADU type, size range, budget estimate, and next steps. Free, no obligation.",
    canonical: cms?.canonicalUrl ?? "/build-your-adu",
    ogTitle: cms?.ogTitle ?? undefined,
    ogDescription: cms?.ogDescription ?? undefined,
    ogImageUrl: cms?.ogImageUrl ?? undefined,
    noIndex: cms?.indexPage === false,
  });
}

const faqs = [
  {
    q: "How accurate is the budget estimate from the planner?",
    a: "The planner gives you a realistic starting range based on ADU type, size, and bedroom count — the same parameters we use in our initial client conversations. Final pricing depends on your specific lot, site conditions, and finish selections. A free property assessment gives you a precise all-inclusive quote.",
  },
  {
    q: "Do I need to have a specific ADU type in mind to use this tool?",
    a: "No. If you select 'Not sure yet' for any question, the planner will recommend the best direction based on your goals and budget. Most homeowners who use the tool discover options they hadn't considered.",
  },
  {
    q: "What happens after I submit my information?",
    a: "We review your answers, confirm the feasibility for your specific address and city, and follow up within 1 business day with a personalized recommendation — including an all-inclusive cost range for your property.",
  },
  {
    q: "Does my property qualify for an ADU?",
    a: "The vast majority of single-family lots in Los Angeles and surrounding cities qualify for at least one ADU. California state law has significantly loosened restrictions since 2020. We confirm your specific options — lot coverage, setbacks, utility requirements — as part of the free property assessment.",
  },
  {
    q: "How long does it take to build an ADU in Los Angeles?",
    a: "From the start of design to move-in, most ADU projects take 9–14 months total. Garage conversions are typically faster (6–9 months). The largest variable is the permitting phase, which ranges from 8 to 20 weeks depending on your city.",
  },
  {
    q: "What does 'all-inclusive' pricing mean?",
    a: "Our pricing includes architectural design, structural engineering, all permit and city fees, materials, labor, and construction management. There are no separate design fees, permit fees, or engineering charges — one contract covers the full project from design through certificate of occupancy.",
  },
];

export default function BuildYourAduPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,53,15,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-24 lg:pb-32">
          {/* Breadcrumb */}
          <nav className="mb-8 sm:mb-10" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-stone-500">
              <li>
                <Link href="/" className="hover:text-stone-300 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">Build Your ADU</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
              Free ADU Planner
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              Build Your ADU — Find the Right Fit for Your Property
            </h1>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
              Answer 9 quick questions and get a personalized ADU plan — recommended type, size
              range, budget estimate, and the best next step for your Los Angeles property.
              Takes about 2 minutes.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                "Free — no obligation",
                "Personalized to your goals",
                "Covers all LA cities",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-stone-400">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Wizard ───────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-12 items-start">
            {/* Left: wizard */}
            <div className="lg:sticky lg:top-24">
              <AduWizard />
            </div>

            {/* Right: explainer copy */}
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                How It Works
              </div>
              <h2 className="text-2xl font-bold text-stone-900 leading-tight mb-4">
                Get a personalized ADU plan in 2 minutes
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Every ADU project starts with understanding what&apos;s realistic for your property
                and your goals. This planner asks the same questions our design team uses in initial
                consultations — and gives you a concrete starting point: ADU type, size range,
                and a realistic budget.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { n: "01", title: "Answer 9 quick questions", body: "ADU type, size, bedrooms, features, intended use, city, budget, and timeline." },
                  { n: "02", title: "Get your personalized plan", body: "We match your answers to the right ADU direction, size range, and budget estimate." },
                  { n: "03", title: "Book a free property assessment", body: "We confirm what's buildable on your specific lot and give you an all-inclusive quote." },
                ].map((step) => (
                  <li key={step.n} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white font-bold text-xs">{step.n}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 text-sm mb-0.5">{step.title}</div>
                      <p className="text-stone-500 text-xs leading-relaxed">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-6">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">
                  After the planner
                </div>
                <ul className="space-y-2">
                  {[
                    "Free lot and setback review",
                    "Confirm which ADU types are buildable",
                    "All-inclusive price estimate",
                    "Permit timeline for your city",
                    "Response within 1 business day",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                  Browse all ADU services
                </Link>
                <Link
                  href="/adu-models"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                  View pre-designed ADU models
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                  See completed ADU projects
                </Link>
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                  ADU permitting by city
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              <HelpCircle className="w-4 h-4" />
              Common Questions
            </div>
            <h2 className="text-3xl font-bold text-stone-900 leading-tight mb-3">
              About the ADU Planner
            </h2>
            <p className="text-stone-500 text-base">
              Questions about using the tool or what to expect after you submit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-stone-50 rounded-2xl border border-stone-200 p-6"
              >
                <h3 className="font-semibold text-stone-900 text-sm mb-2 leading-snug">{faq.q}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
            Ready to go further?
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-4">
            Get an All-Inclusive Quote for Your Lot
          </h2>
          <p className="text-stone-400 text-base leading-relaxed mb-8">
            The planner gives you a direction. A free property assessment gives you real numbers
            — lot review, permit timeline, and an all-inclusive price for your specific address.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-colors"
            >
              Get a Free Estimate <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors"
            >
              Talk to a Specialist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
