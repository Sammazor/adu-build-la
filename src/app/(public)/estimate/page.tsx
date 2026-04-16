import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { CheckCircle2, Star, Shield, Clock, Users } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Request a Free ADU Estimate",
    description:
      "Request a free ADU cost estimate for your Los Angeles property. We'll assess your site and provide a detailed all-inclusive quote within 1 business day.",
    canonical: "/estimate",
  });
}

const included = [
  "Property and lot eligibility review",
  "ADU type recommendations for your specific lot",
  "All-inclusive cost range — design, permits, and construction",
  "Permit timeline estimate for your city",
  "No pressure, no obligation",
];

const trustItems = [
  { Icon: Star, label: "4.9 / 5 Rating", sub: "Google Reviews" },
  { Icon: Shield, label: "Licensed & Insured", sub: "CA General Contractor" },
  { Icon: Users, label: "200+ ADUs Built", sub: "Across LA County" },
  { Icon: Clock, label: "Response Within", sub: "1 Business Day" },
];

export default function EstimatePage() {
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
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16 lg:pb-20">
          {/* Breadcrumb */}
          <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-stone-500">
              <li>
                <Link href="/" className="hover:text-stone-300 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">Free Estimate</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Free · No Obligation · Response Within 1 Business Day
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 max-w-2xl">
            Get Your Free ADU Estimate
          </h1>
          <p className="text-stone-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Tell us about your property and goals. We&apos;ll assess your site, confirm what&apos;s
            buildable, and provide an all-inclusive cost and timeline estimate.
          </p>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <item.Icon className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900 leading-none">
                    {item.label}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + sidebar ────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10 items-start">

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 order-1">
              <h2 className="text-xl font-bold text-stone-900 mb-1.5">
                Tell Us About Your Project
              </h2>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                The more context you provide, the more useful our estimate will be. All fields
                marked * are required.
              </p>
              <LeadForm variant="estimate" />
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 space-y-5 order-2">
              {/* What's included */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wide">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" />
                      </div>
                      <span className="text-stone-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing callout */}
              <div className="bg-stone-900 rounded-2xl p-6">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
                  Pricing Guide
                </p>
                <p className="text-white font-bold text-base mb-4 leading-snug">
                  ADUs Starting From $150,000
                </p>
                <ul className="space-y-2">
                  {[
                    ["Junior ADU (JADU)", "$60K – $120K"],
                    ["Garage Conversion", "$80K – $160K"],
                    ["Attached ADU", "$120K – $230K"],
                    ["Detached ADU", "$150K – $380K+"],
                  ].map(([type, range]) => (
                    <li key={type} className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">{type}</span>
                      <span className="text-amber-400 font-semibold">{range}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-stone-600 text-xs mt-4">
                  All-inclusive: design, permits, and construction.
                </p>
              </div>

              {/* Contact alternative */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
                  Prefer to Talk?
                </p>
                <p className="text-stone-700 text-sm font-medium mb-3">
                  Reach out directly — we&apos;re happy to answer questions before you fill anything out.
                </p>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Contact us →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
