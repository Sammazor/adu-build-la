import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/faqs";

// Re-export for convenience — consumers can import FaqItem from here or from @/data/faqs
export type { FaqItem };

interface FaqSectionProps {
  items: FaqItem[];
  /**
   * Short eyebrow label above the heading.
   * @default "Common Questions"
   */
  eyebrow?: string;
  heading: string;
  subheading?: string;
  /**
   * Prompt text for the contact CTA at the bottom.
   * Pass null to suppress the contact row entirely.
   * @default "Have a question not answered above?"
   */
  contactPrompt?: string | null;
  contactLabel?: string;
  /**
   * @default "/contact"
   */
  contactHref?: string;
  /**
   * Background variant.
   * "stone-50" renders on stone-50 (default).
   * "white" renders on white.
   */
  variant?: "stone-50" | "white";
}

export function FaqSection({
  items,
  eyebrow = "Common Questions",
  heading,
  subheading,
  contactPrompt = "Have a question not answered above?",
  contactLabel = "Contact an ADU Specialist",
  contactHref = "/contact",
  variant = "stone-50",
}: FaqSectionProps) {
  const bg = variant === "white" ? "bg-white" : "bg-stone-50";

  return (
    <section className={`py-24 ${bg}`}>
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {eyebrow && (
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              {eyebrow}
            </div>
          )}
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
            {heading}
          </h2>
          {subheading && (
            <p className="text-stone-500 text-lg leading-relaxed mt-4 max-w-xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {items.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white border border-stone-200 rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-semibold text-stone-900 hover:bg-stone-50 transition-colors select-none">
                <span className="text-sm leading-snug pr-4">{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 pt-1 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Contact CTA */}
        {contactPrompt !== null && (
          <div className="mt-10 text-center">
            <p className="text-stone-500 text-sm mb-4">{contactPrompt}</p>
            <Link
              href={contactHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 font-semibold text-sm transition-colors"
            >
              {contactLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
