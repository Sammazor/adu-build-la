import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { LocationData } from "@/data/locations";

interface LocationCardProps {
  location: LocationData;
}

export function LocationCard({ location }: LocationCardProps) {
  // Show the first two stats from the location's stats array
  const previewStats = location.stats.slice(0, 2);

  return (
    <Link
      href={location.fullPath}
      className="group bg-white rounded-2xl border border-stone-200 p-6 hover:border-amber-200 hover:shadow-md hover:shadow-stone-900/[0.06] transition-all duration-200 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-stone-700">
            {location.name}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">{location.county}</p>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm text-stone-500 leading-relaxed mb-5 flex-1">
        {location.heroSubheading.split(".")[0].trim()}.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {previewStats.map((stat) => (
          <div key={stat.label} className="bg-stone-50 rounded-xl px-3 py-2.5 text-center">
            <div className="text-base font-bold text-stone-900 leading-none">{stat.value}</div>
            <div className="text-[11px] text-stone-500 mt-1 leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 group-hover:text-amber-700 mt-auto">
        View city guide{" "}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
