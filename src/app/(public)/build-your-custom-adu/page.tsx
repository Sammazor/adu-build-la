import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { AduConfigurator } from "@/components/public/configurator/AduConfigurator";
import { ArrowRight, Check } from "lucide-react";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Build Your Custom ADU — Interactive ADU Configurator | ADU Build LA",
    description:
      "Configure your dream ADU step by step — choose your type, size, finishes, and style. Get a personalized floor plan preview, budget range, and recommendation. Free, no obligation.",
    canonical: "/build-your-custom-adu",
  });
}

const faqs = [
  {
    q: "How detailed is the budget estimate from the configurator?",
    a: "The configurator gives you a realistic all-inclusive range calibrated to your ADU type, square footage, bedroom count, and finish tier — the same parameters we use in initial client consultations. Final pricing is confirmed after a free property assessment, which accounts for your specific lot conditions, site access, and utility connections.",
  },
  {
    q: "What does 'all-inclusive pricing' mean?",
    a: "Our pricing covers architectural design, structural engineering, all city permit and impact fees, materials, labor, and construction management — one contract from design through certificate of occupancy. No separate design fee, no permit surprises.",
  },
  {
    q: "Can I change my selections after I submit?",
    a: "Absolutely. The configurator is a starting point for conversation. When we follow up, we'll walk through your selections, discuss alternatives, and refine the scope based on your specific property and goals.",
  },
  {
    q: "Do the floor plans shown match what will be built?",
    a: "The floor plans are schematic illustrations of our standard model configurations — they show the general layout and room arrangement for each preset. Your final architectural drawings are fully custom-designed to your lot dimensions, zoning constraints, and design preferences.",
  },
  {
    q: "Which cities do you build ADUs in?",
    a: "We build ADUs throughout Los Angeles County, including the City of Los Angeles, Santa Monica, Culver City, Pasadena, Glendale, Burbank, Long Beach, and surrounding unincorporated areas. Each jurisdiction has slightly different permitting processes — we're experienced in all of them.",
  },
  {
    q: "How long does the ADU permitting process take in LA?",
    a: "Permitting typically takes 8 to 20 weeks depending on your jurisdiction. The City of LA, Culver City, and Santa Monica have streamlined their ADU approval processes significantly since 2020. Garage conversions and JADUs often move faster than fully detached ADUs.",
  },
];

export default function BuildYourCustomAduPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(217,119,6,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-stone-400">Build Your Custom ADU</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Interactive Configurator
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Design your ADU,{" "}
              <span className="text-amber-400">step by step</span>
            </h1>
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
              Configure every aspect of your ADU — from type and size to finishes and exterior style. See matching floor plans, get a budget estimate, and receive a personalized recommendation.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                "13 configuration steps",
                "Live floor plan preview",
                "Instant budget range",
                "No obligation",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-sm text-stone-400">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Configurator ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AduConfigurator />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-2">
              What happens next
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              From configuration to construction
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Configure",
                desc: "Complete the 13-step configurator. Every selection refines your floor plan preview and budget estimate in real time.",
              },
              {
                step: "02",
                title: "Property Assessment",
                desc: "We review your configuration and your property — lot dimensions, zoning, setbacks, utility connections — and provide a confirmed all-inclusive quote.",
              },
              {
                step: "03",
                title: "Design & Build",
                desc: "Our in-house team handles everything: architectural drawings, permit submission, construction management, and final inspection.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-stone-50 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Common questions</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-sm font-bold text-stone-900 mb-1.5">{faq.q}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links ────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">
            Continue exploring
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/adu-models", label: "View ADU Models" },
              { href: "/services", label: "Our Services" },
              { href: "/locations", label: "City ADU Guides" },
              { href: "/projects", label: "Completed Projects" },
              { href: "/build-your-adu", label: "Quick ADU Planner" },
              { href: "/estimate", label: "Get an Estimate" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:border-stone-400 hover:text-stone-900 transition-colors"
              >
                {link.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-stone-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Ready to go further?
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Schedule your free property assessment
          </h2>
          <p className="text-stone-400 text-base leading-relaxed mb-8">
            Your configuration gives us a strong starting point. A free property assessment confirms feasibility, permit timeline, and delivers a precise all-inclusive price for your address.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors"
            >
              Schedule Free Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/adu-models"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors"
            >
              View ADU Models
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
