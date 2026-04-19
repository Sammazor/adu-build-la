import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPageOverride } from "@/lib/data/sitePageOverrides";
import { getAllModels } from "@/lib/data/aduModels";
import { AduModelCard } from "@/components/public/cards/AduModelCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { CheckCircle2, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageOverride("adu-models");
  return buildMetadata({
    title: cms?.seoTitle ?? "ADU Models — Floor Plans & Pricing",
    description:
      cms?.seoDescription ??
      "Browse ADU Build LA's pre-designed ADU models for Los Angeles. Studio, 1-bedroom, and 2-bedroom floor plans starting from $95,000. Request a free estimate.",
    canonical: cms?.canonicalUrl ?? "/adu-models",
    ogTitle: cms?.ogTitle ?? undefined,
    ogDescription: cms?.ogDescription ?? undefined,
    ogImageUrl: cms?.ogImageUrl ?? undefined,
    noIndex: cms?.indexPage === false,
  });
}

export default async function AduModelsPage() {
  const models = await getAllModels();

  const whyModels = [
    "Pre-designed floor plans are optimized for LA lot sizes and setback rules",
    "Fixed starting prices — no open-ended custom design cost surprises",
    "Faster design phase — start permitting sooner",
    "Proven layouts with strong rental market performance across LA",
    "Every model is fully customizable — finishes, layout tweaks, and additions",
    "Our team recommends the right model after a free property assessment",
  ];

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
              <li className="text-stone-400">ADU Models</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
              Pre-Designed Floor Plans
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              ADU Models for Los Angeles Homeowners
            </h1>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
              Browse our pre-designed ADU floor plans — optimized for LA lot sizes,
              zoning rules, and rental income. Studio through 2-bedroom, starting from $95,000.
              Every model is fully customizable.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors min-h-[52px]"
              >
                Get a Free Estimate <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing range strip ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              { label: "Garage Conversion", from: "From $95K" },
              { label: "Studio ADU", from: "From $150K" },
              { label: "1-Bedroom ADU", from: "From $165K" },
              { label: "2-Bedroom ADU", from: "From $230K" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span className="font-bold text-amber-600">{item.from}</span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Models Grid ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              {models.length} Models Available
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              Choose Your ADU Model
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              Each model is designed for real Los Angeles lots — standard setbacks, typical
              utility configurations, and LA-area rental market demands. Select a model to
              explore its floor plan, features, and pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {models.map((model) => (
              <AduModelCard key={model.slug} model={model} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Start With a Model ───────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Why Pre-Designed Models
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Proven Plans, Predictable Pricing
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                Starting from a pre-designed model doesn&apos;t mean you get a cookie-cutter ADU.
                It means you start with a tested, LA-optimized floor plan and skip the
                open-ended custom design phase — saving time and giving you a reliable
                cost estimate from day one.
              </p>
              <ul className="space-y-3.5">
                {whyModels.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-stone-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: comparison */}
            <div className="space-y-4">
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                  Starting From a Model
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Fixed starting price — know your budget on day one",
                    "Design phase: 2–3 weeks",
                    "Permit-ready drawings faster",
                    "Proven rental performance",
                    "Fully customizable finishes and options",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-stone-200">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                  Full Custom Design
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Open-ended design cost — price TBD through process",
                    "Design phase: 6–12 weeks",
                    "Longer path to permit submission",
                    "Maximum flexibility for unique requirements",
                    "Right choice for complex sites or specific vision",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-stone-600">
                      <span className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0 inline-block" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-stone-400 px-1">
                Not sure which path fits your project? We&apos;ll advise after the free property assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead Form ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Free Assessment
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Find Out Which Model Fits Your Property
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                Not every model works on every lot. We review your property, your city&apos;s
                zoning rules, and your goals — then recommend the model that maximizes value
                for your specific situation. Free, no pressure, no obligation.
              </p>
              <ul className="space-y-3.5">
                {[
                  "Lot and setback review — confirm which models are buildable",
                  "Model recommendation based on your goals and budget",
                  "All-inclusive price estimate for your shortlisted model",
                  "Response within 1 business day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-stone-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                Get a Free Property Assessment
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                We&apos;ll match you with the right model and give you a real cost estimate.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
