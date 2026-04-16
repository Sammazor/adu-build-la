import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

/**
 * ConfiguratorCta — inline promotion strip for /build-your-custom-adu.
 *
 * variant="banner"  → horizontal strip (default, for mid-page placement)
 * variant="card"    → standalone card (for sidebars or tight column contexts)
 */
interface ConfiguratorCtaProps {
  variant?: "banner" | "card";
  heading?: string;
  sub?: string;
}

export function ConfiguratorCta({
  variant = "banner",
  heading = "Not sure what to build?",
  sub = "Use our interactive configurator to design your ADU step by step — size, finishes, style, and floor plan — and get a budget estimate in minutes.",
}: ConfiguratorCtaProps) {
  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-900 leading-snug">{heading}</p>
            <p className="text-xs text-stone-500 mt-1 leading-snug">{sub}</p>
          </div>
        </div>
        <Link
          href="/build-your-custom-adu"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
        >
          Open ADU Configurator
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // banner (default)
  return (
    <section className="bg-stone-900 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-7 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-snug">{heading}</p>
              <p className="text-stone-400 text-sm mt-0.5 leading-snug max-w-xl">{sub}</p>
            </div>
          </div>
          <Link
            href="/build-your-custom-adu"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 active:bg-amber-700 transition-colors shrink-0 min-h-[48px]"
          >
            Design Your ADU
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
