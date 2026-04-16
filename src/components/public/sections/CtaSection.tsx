import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CtaSection as CtaSectionType } from "@/types/sections";

interface CtaSectionProps {
  section: CtaSectionType;
}

export function CtaSection({ section }: CtaSectionProps) {
  const dark = section.background !== "light";

  return (
    <section
      className={cn(
        "py-20 lg:py-24",
        dark ? "bg-stone-950 text-white" : "bg-stone-50 text-stone-900"
      )}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className={cn(
            "text-3xl lg:text-4xl font-bold leading-tight mb-4",
            dark ? "text-white" : "text-stone-900"
          )}
        >
          {section.heading}
        </h2>
        {section.subheading && (
          <p className={cn("text-lg mb-8 leading-relaxed", dark ? "text-stone-400" : "text-stone-600")}>
            {section.subheading}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={section.primary_url}
            className={cn(
              "px-8 py-4 rounded-xl font-bold text-sm transition-colors",
              dark
                ? "bg-amber-500 hover:bg-amber-400 text-stone-900"
                : "bg-stone-900 hover:bg-stone-800 text-white"
            )}
          >
            {section.primary_label}
          </Link>
          {section.secondary_label && section.secondary_url && (
            <Link
              href={section.secondary_url}
              className={cn(
                "px-8 py-4 rounded-xl font-semibold text-sm transition-colors border",
                dark
                  ? "border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white"
                  : "border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900"
              )}
            >
              {section.secondary_label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
