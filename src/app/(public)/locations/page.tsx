import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPageOverride } from "@/lib/data/sitePageOverrides";
import { getAllLocations } from "@/lib/data/locations";
import { LocationCard } from "@/components/public/cards/LocationCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageOverride("locations-index");
  return buildMetadata({
    title: cms?.seoTitle ?? "ADU Services Across Los Angeles County",
    description:
      cms?.seoDescription ??
      "ADU Build LA serves homeowners throughout Los Angeles County. Find your city for local permitting guidance, pricing expectations, and a free property assessment.",
    canonical: cms?.canonicalUrl ?? "/locations",
    ogTitle: cms?.ogTitle ?? undefined,
    ogDescription: cms?.ogDescription ?? undefined,
    ogImageUrl: cms?.ogImageUrl ?? undefined,
    noIndex: cms?.indexPage === false,
  });
}

export default async function LocationsPage() {
  const locations = await getAllLocations();

  const serviceAreas = [
    "Los Angeles",
    "Santa Monica",
    "Pasadena",
    "Glendale",
    "Culver City",
    "Burbank",
    "West Hollywood",
    "Inglewood",
    "Torrance",
    "Long Beach",
    "El Segundo",
    "Mar Vista",
    "Venice",
    "Brentwood",
    "Pacific Palisades",
    "Eagle Rock",
    "Atwater Village",
    "Silver Lake",
    "Los Feliz",
    "Koreatown",
    "Palms",
    "Westchester",
    "Hawthorne",
    "Gardena",
    "Carson",
    "Monterey Park",
    "Alhambra",
    "Arcadia",
    "Monrovia",
    "La Crescenta",
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
              <li className="text-stone-400">Locations</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
              Serving Los Angeles County
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              ADU Builders Across Los Angeles County
            </h1>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
              We serve homeowners throughout Greater Los Angeles. Select your city for
              local permitting guidance, pricing expectations, and city-specific ADU
              information — or get a free estimate now.
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

      {/* ── Service area note ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5">
          <div className="flex items-center gap-2.5 justify-center">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-stone-600 text-center">
              <strong className="text-stone-900 font-semibold">Serving 80+ cities</strong> across
              Los Angeles County — from the Valley to the South Bay, and everything in between.
            </p>
          </div>
        </div>
      </section>

      {/* ── City Guides Grid ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              City Guides
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              Local ADU Expertise for Your City
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              Each city in Los Angeles County has its own permitting authority, zoning rules,
              and rental market dynamics. Our city guides cover what matters most for homeowners
              planning an ADU project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((location) => (
              <LocationCard key={location.slug} location={location} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why local expertise matters ──────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Why It Matters
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Every City Has Different ADU Rules
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                California state law sets the floor for ADU rights, but every city and county
                still has its own permitting authority, design standards, and processing timelines.
                Knowing the specific rules for your city is the difference between an 8-week
                permit and a 6-month headache.
              </p>
              <ul className="space-y-3.5">
                {[
                  "We've permitted ADUs across every major LA-area jurisdiction",
                  "In-house knowledge of LADBS, Santa Monica, Pasadena, Glendale, and Culver City processes",
                  "We know which cities have expedited ADU programs — and how to qualify",
                  "We navigate hillside, coastal, fire zone, and historic overlay requirements",
                  "Our local relationships mean faster responses and fewer correction rounds",
                  "Free property assessment includes jurisdiction-specific feasibility review",
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

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "80+", label: "Cities Served", sub: "Across LA County" },
                { value: "200+", label: "ADUs Completed", sub: "Across all jurisdictions" },
                { value: "15+", label: "Years Experience", sub: "LA-area ADU specialists" },
                { value: "4.9★", label: "Google Rating", sub: "From verified homeowners" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-stone-50 rounded-2xl p-6 border border-stone-200"
                >
                  <div className="text-3xl font-bold text-stone-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-stone-800">{stat.label}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full service area list ───────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-stone-50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Full Service Area
            </div>
            <h2 className="text-3xl font-bold text-stone-900 leading-tight mb-3">
              We Serve All of Los Angeles County
            </h2>
            <p className="text-stone-500 text-base leading-relaxed">
              Don&apos;t see your city below? Contact us — we likely serve your area.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {serviceAreas.map((city) => (
              <span
                key={city}
                className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-600 font-medium"
              >
                {city}
              </span>
            ))}
            <span className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-400 font-medium">
              + Many more
            </span>
          </div>
        </div>
      </section>

      {/* ── Lead Form ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Free Assessment
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Find Out What&apos;s Possible on Your Property
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                Every property is different. We review your lot, your city&apos;s rules, and your
                goals — and give you a clear picture of what you can build, what it will cost,
                and how long it will take. No obligation, no pressure.
              </p>
              <ul className="space-y-3.5">
                {[
                  "City-specific feasibility review for your jurisdiction",
                  "Realistic all-inclusive cost range for your ADU type",
                  "Timeline from design through certificate of occupancy",
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
            <div className="bg-stone-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                Get a Free Property Assessment
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                Tell us about your city and property. We&apos;ll respond within 1 business day.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
