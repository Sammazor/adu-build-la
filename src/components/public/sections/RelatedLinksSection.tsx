import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RelatedLinkItem {
  href: string;
  /**
   * Short badge label indicating content type.
   * e.g. "City Guide", "ADU Model", "Completed Project", "Service"
   * Future CMS: store as a string field on the relation record.
   */
  typeLabel: string;
  title: string;
  /**
   * One-sentence description shown under the title.
   * Keep to ~100 characters for consistent card height.
   */
  description: string;
}

interface RelatedLinksSectionProps {
  items: RelatedLinkItem[];
  eyebrow?: string;
  heading: string;
  subheading?: string;
  /**
   * Optional "view all" CTA below the grid.
   */
  viewAllHref?: string;
  viewAllLabel?: string;
  /**
   * Section background.
   * @default "stone-50"
   */
  variant?: "white" | "stone-50";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RelatedLinksSection({
  items,
  eyebrow,
  heading,
  subheading,
  viewAllHref,
  viewAllLabel = "View all",
  variant = "stone-50",
}: RelatedLinksSectionProps) {
  if (items.length === 0) return null;

  const bg = variant === "white" ? "bg-white" : "bg-stone-50";

  return (
    <section className={`py-20 ${bg} border-t border-stone-100`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            {eyebrow && (
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-2">
                {eyebrow}
              </div>
            )}
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 leading-tight">
              {heading}
            </h2>
            {subheading && (
              <p className="text-stone-500 text-sm leading-relaxed mt-2">{subheading}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors shrink-0"
            >
              {viewAllLabel} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl border border-stone-200 p-5 hover:border-amber-200 hover:shadow-sm hover:shadow-stone-900/[0.05] transition-[border-color,box-shadow] duration-200 flex flex-col gap-3"
            >
              {/* Type badge */}
              <span className="inline-block self-start px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-semibold text-stone-500">
                {item.typeLabel}
              </span>

              {/* Title + description */}
              <div className="flex-1">
                <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-1.5 group-hover:text-stone-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* CTA arrow */}
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:text-amber-700 transition-colors mt-auto">
                View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view-all */}
        {viewAllHref && (
          <div className="mt-6 sm:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              {viewAllLabel} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
