import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AreaLink {
  name: string;
  slug: string;
  note?: string; // e.g. "Coastal Zone • HOA-friendly"
}

interface ServedAreasSectionProps {
  areas?: AreaLink[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

// ─── Default served areas ─────────────────────────────────────────────────────

const DEFAULT_AREAS: AreaLink[] = [
  { name: "Los Angeles", slug: "los-angeles", note: "LADBS • All neighborhoods" },
  { name: "Santa Monica", slug: "santa-monica", note: "Coastal Zone expertise" },
  { name: "Pasadena", slug: "pasadena", note: "Historic overlay experience" },
  { name: "Glendale", slug: "glendale", note: "Fast permit turnaround" },
  { name: "Culver City", slug: "culver-city", note: "Strong rental market" },
  { name: "Silver Lake", slug: "los-angeles", note: "Hillside & sloped lots" },
  { name: "Long Beach", slug: "los-angeles", note: "City & county jurisdictions" },
  { name: "Burbank", slug: "los-angeles", note: "Owner-occupant ADUs" },
  { name: "West Hollywood", slug: "los-angeles", note: "Small-lot solutions" },
  { name: "Mar Vista", slug: "los-angeles", note: "High-density neighborhoods" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ServedAreasSection({
  areas = DEFAULT_AREAS,
  eyebrow = "Service Area",
  heading = "We Build ADUs Across Los Angeles County",
  subheading = "From the beach cities to the San Gabriel Valley — we're experienced in every jurisdiction, permit office, and neighborhood type in LA County.",
}: ServedAreasSectionProps) {
  // Separate areas with dedicated location pages from general LA links
  const dedicated = areas.filter(
    (a) => a.slug !== "los-angeles" || a.name === "Los Angeles"
  );
  const general = areas.filter(
    (a) => a.slug === "los-angeles" && a.name !== "Los Angeles"
  );

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-stone-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start mb-10 sm:mb-12">
          <div className="max-w-xl">
            {eyebrow && (
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                {eyebrow}
              </div>
            )}
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              {heading}
            </h2>
            <p className="text-stone-500 text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          </div>

          <Link
            href="/locations"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-stone-900 text-sm font-semibold transition-colors self-start shrink-0 min-h-[44px]"
          >
            View all locations
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        {/* Dedicated city pages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {dedicated.map((area) => (
            <Link
              key={`${area.name}-${area.slug}`}
              href={`/locations/${area.slug}`}
              className="group flex items-center gap-3.5 px-4 py-4 rounded-xl border border-stone-200 bg-stone-50 hover:border-amber-300 hover:bg-amber-50 transition-all duration-150"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 group-hover:border-amber-300 group-hover:bg-amber-50 flex items-center justify-center shrink-0 transition-colors">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
                  {area.name}
                </div>
                {area.note && (
                  <div className="text-xs text-stone-500 leading-snug mt-0.5 truncate">
                    {area.note}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* General LA area chips for additional cities */}
        {general.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {general.map((area) => (
              <Link
                key={area.name}
                href={`/locations/${area.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-200 bg-stone-50 hover:border-amber-300 hover:bg-amber-50 text-sm text-stone-600 hover:text-stone-900 font-medium transition-all duration-150"
              >
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" aria-hidden />
                {area.name}
              </Link>
            ))}
          </div>
        )}

        {/* Bottom note */}
        <p className="text-sm text-stone-500 mt-6 leading-relaxed">
          Don&apos;t see your city?{" "}
          <Link
            href="/contact"
            className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2 transition-colors"
          >
            Contact us
          </Link>{" "}
          — we serve most of LA County and can advise on your specific jurisdiction.
        </p>
      </div>
    </section>
  );
}
