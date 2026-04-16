import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, Phone } from "lucide-react";
import type { HeroSection as HeroSectionType } from "@/types/sections";

interface HeroSectionProps {
  section?: HeroSectionType;
  // Allow passing props directly for hardcoded homepage use
  heading?: string;
  subheading?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  /** Optional badge override (defaults to standard badge) */
  badge?: string;
  /** Optional eyebrow line above the headline */
  eyebrow?: string;
  /** Show the phone CTA variant instead of default secondary */
  ctaSecondaryVariant?: "default" | "phone";
  /** Micro-proof items below CTA — up to 3 short strings */
  microProof?: string[];
  /** Hero background media — "none" falls back to the default dark gradient */
  heroMediaType?: "none" | "image" | "video";
  heroMediaUrl?: string | null;
}

export function HeroSection({
  section,
  heading,
  subheading,
  ctaPrimaryLabel,
  ctaPrimaryUrl,
  ctaSecondaryLabel,
  ctaSecondaryUrl,
  badge,
  eyebrow,
  ctaSecondaryVariant = "default",
  microProof,
  heroMediaType = "none",
  heroMediaUrl,
}: HeroSectionProps) {
  const showMedia = (heroMediaType === "image" || heroMediaType === "video") && !!heroMediaUrl;
  const h = section?.heading ?? heading ?? "";
  const sh = section?.subheading ?? subheading;
  const primaryLabel = section?.ctaPrimaryLabel ?? ctaPrimaryLabel;
  const primaryUrl = section?.ctaPrimaryUrl ?? ctaPrimaryUrl;
  const secondaryLabel = section?.ctaSecondaryLabel ?? ctaSecondaryLabel;
  const secondaryUrl = section?.ctaSecondaryUrl ?? ctaSecondaryUrl;

  return (
    <section className="relative bg-stone-950 text-white overflow-hidden">
      {/* Background media: image or video */}
      {showMedia && heroMediaType === "image" && (
        <Image
          src={heroMediaUrl!}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
          aria-hidden
        />
      )}
      {showMedia && heroMediaType === "video" && (
        <video
          src={heroMediaUrl!}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
      )}

      {/* Dark overlay — always rendered; heavier when media is present for readability */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: showMedia
            ? "linear-gradient(to bottom, rgba(12,10,9,0.65) 0%, rgba(12,10,9,0.55) 100%)"
            : "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(120,53,15,0.22) 0%, transparent 70%)",
        }}
      />
      {/* Subtle grid texture (only without media, it clashes visually over photos/video) */}
      {!showMedia && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
      )}

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24 lg:py-36">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" aria-hidden />
            <span>{badge ?? "Los Angeles ADU Specialists · 200+ Projects Completed"}</span>
          </div>

          {/* Optional eyebrow */}
          {eyebrow && (
            <p className="text-amber-400 text-sm font-semibold tracking-wide uppercase mb-3">
              {eyebrow}
            </p>
          )}

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-5 sm:mb-6">
            {h}
          </h1>

          {/* Subheading */}
          {sh && (
            <p className="text-base sm:text-lg lg:text-xl text-stone-400 max-w-2xl mb-8 sm:mb-10 leading-relaxed">
              {sh}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            {primaryLabel && primaryUrl && (
              <Link
                href={primaryUrl}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 min-h-[52px]"
              >
                {primaryLabel}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            )}
            {secondaryLabel && secondaryUrl && (
              ctaSecondaryVariant === "phone" ? (
                <Link
                  href={secondaryUrl}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
                >
                  <Phone className="w-4 h-4" aria-hidden />
                  {secondaryLabel}
                </Link>
              ) : (
                <Link
                  href={secondaryUrl}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
                >
                  {secondaryLabel}
                </Link>
              )
            )}
          </div>

          {/* Micro-proof items */}
          {microProof && microProof.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 sm:mt-6">
              {microProof.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs text-stone-500">
                  <span className="w-1 h-1 rounded-full bg-amber-500 inline-block shrink-0" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Social proof row */}
          <div className="flex flex-wrap items-center gap-3 mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-stone-800">
            <div className="flex shrink-0" aria-label="5 stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden />
              ))}
            </div>
            <span className="text-stone-400 text-sm leading-snug">
              <strong className="text-stone-300 font-semibold">4.9/5</strong> on Google Reviews
              {" · "}
              <strong className="text-stone-300 font-semibold">200+</strong> homeowners served
              across LA County
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
