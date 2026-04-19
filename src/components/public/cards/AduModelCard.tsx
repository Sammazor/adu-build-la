import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";
import type { TypedAduModel } from "@/lib/data/aduModels";

interface AduModelCardProps {
  model: TypedAduModel;
}

export function AduModelCard({ model }: AduModelCardProps) {
  const bedsLabel =
    model.specs.beds === "Studio" ? "Studio" : `${model.specs.beds} Bed`;
  const bathsLabel = `${model.specs.baths} Bath`;

  return (
    <Link
      href={model.fullPath}
      className="group relative bg-white rounded-2xl border border-stone-200 p-6 hover:border-amber-200 hover:shadow-md hover:shadow-stone-900/[0.06] transition-all duration-200 flex flex-col"
    >
      {/* Badge */}
      {model.badge && (
        <div className="absolute -top-3 left-6">
          <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-900 text-xs font-bold shadow-sm">
            {model.badge}
          </span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shrink-0">
          <Maximize2 className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Starting from
          </div>
          <div className="text-lg font-bold text-stone-900 leading-none mt-0.5">
            {model.startingFrom}
          </div>
        </div>
      </div>

      {/* Name */}
      <h3 className="font-bold text-stone-900 text-lg leading-snug mb-1 group-hover:text-stone-700">
        {model.name}
      </h3>

      {/* Spec pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-semibold text-stone-700">
          {model.specs.sqFt} sq ft
        </span>
        <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-semibold text-stone-700">
          {bedsLabel}
        </span>
        <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-semibold text-stone-700">
          {bathsLabel}
        </span>
        {model.modelType === "garage-conversion" && (
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg text-xs font-semibold text-amber-700">
            Conversion
          </span>
        )}
      </div>

      {/* Tagline */}
      <p className="text-sm text-stone-500 leading-relaxed mb-5 flex-1 line-clamp-3">
        {model.tagline}
      </p>

      {/* CTA */}
      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 group-hover:text-amber-700 mt-auto">
        View model{" "}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
