import { Star, ExternalLink } from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewPlatform {
  name: string;
  /** Full URL of the platform logo image — stored in /public or served from CDN */
  logoUrl?: string;
  /** Alt text for the logo */
  logoAlt?: string;
  /** Numeric rating, e.g. 4.9 */
  rating: number;
  /** Review count as a display string, e.g. "47" */
  reviewCount: string;
  /** Short supporting label, e.g. "Verified customer reviews" */
  label: string;
  /** Optional external link to the review profile */
  href?: string;
}

interface SocialProofSectionProps {
  platforms?: ReviewPlatform[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

// ─── Default platform data ─────────────────────────────────────────────────────
// In a future CMS integration, these values would be fetched from SiteSettings
// or a dedicated ReviewPlatform model. Update these numbers as reviews come in.

export const DEFAULT_PLATFORMS: ReviewPlatform[] = [
  {
    name: "Google",
    logoUrl: "/images/logos/google-logo.svg",
    logoAlt: "Google Reviews",
    rating: 4.9,
    reviewCount: "47",
    label: "Verified Google Reviews",
    href: undefined, // Set to your Google Business profile URL when ready
  },
  {
    name: "Yelp",
    logoUrl: "/images/logos/yelp-logo.svg",
    logoAlt: "Yelp Reviews",
    rating: 4.8,
    reviewCount: "28",
    label: "Verified Yelp Reviews",
    href: undefined,
  },
  {
    name: "Facebook",
    logoUrl: "/images/logos/facebook-logo.svg",
    logoAlt: "Facebook Reviews",
    rating: 5.0,
    reviewCount: "19",
    label: "Verified Facebook Reviews",
    href: undefined,
  },
];

// ─── Star row ─────────────────────────────────────────────────────────────────

function StarRow({ rating, platformKey }: { rating: number; platformKey: string }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.4;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const half = !filled && i === full && hasHalf;
        // Use platform key + star index so IDs are unique across the whole page
        const gradId = `half-${platformKey}-${i}`;
        return (
          <svg
            key={i}
            className="w-4 h-4 shrink-0"
            viewBox="0 0 20 20"
            aria-hidden
          >
            {half ? (
              <>
                <defs>
                  <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#d6d3d1" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#${gradId})`}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </>
            ) : (
              <path
                fill={filled ? "#f59e0b" : "#d6d3d1"}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

// ─── Platform logo (with text fallback) ───────────────────────────────────────

function PlatformLogo({ platform }: { platform: ReviewPlatform }) {
  if (platform.logoUrl) {
    return (
      <div className="h-6 flex items-center">
        <Image
          src={platform.logoUrl}
          alt={platform.logoAlt ?? `${platform.name} logo`}
          width={80}
          height={24}
          className="h-5 w-auto object-contain"
        />
      </div>
    );
  }
  // Text fallback if no logo provided
  return (
    <span className="text-sm font-bold text-stone-700 tracking-tight">
      {platform.name}
    </span>
  );
}

// ─── Platform card ────────────────────────────────────────────────────────────

function PlatformCard({ platform }: { platform: ReviewPlatform }) {
  const content = (
    <div className="flex flex-col gap-3.5 h-full">
      {/* Logo */}
      <PlatformLogo platform={platform} />

      {/* Rating row */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl font-bold text-stone-900 leading-none tabular-nums">
          {platform.rating.toFixed(1)}
        </span>
        <div className="flex flex-col gap-1">
          <StarRow rating={platform.rating} platformKey={platform.name} />
          <span className="text-xs text-stone-500">
            {platform.reviewCount} reviews
          </span>
        </div>
      </div>

      {/* Supporting label */}
      <p className="text-xs text-stone-500 leading-snug mt-auto">{platform.label}</p>
    </div>
  );

  const baseClass =
    "block bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:border-amber-200 hover:shadow-md hover:shadow-stone-900/[0.05] transition-[border-color,box-shadow] duration-200 flex-1";

  if (platform.href) {
    return (
      <a
        href={platform.href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        aria-label={`View ${platform.name} reviews — ${platform.rating} stars`}
      >
        <div className="flex flex-col gap-3.5 h-full">
          <div className="flex items-start justify-between gap-2">
            <PlatformLogo platform={platform} />
            <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" aria-hidden />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl font-bold text-stone-900 leading-none tabular-nums">
              {platform.rating.toFixed(1)}
            </span>
            <div className="flex flex-col gap-1">
              <StarRow rating={platform.rating} platformKey={`${platform.name}-link`} />
              <span className="text-xs text-stone-500">
                {platform.reviewCount} reviews
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-snug mt-auto">{platform.label}</p>
        </div>
      </a>
    );
  }

  return (
    <div className={`${baseClass} cursor-default`}>
      {content}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function SocialProofSection({
  platforms = DEFAULT_PLATFORMS,
  eyebrow = "Client Reviews",
  heading = "Trusted by Los Angeles Homeowners",
  subheading = "Hundreds of homeowners across LA County have trusted us with their ADU projects. Here's what the reviews say.",
}: SocialProofSectionProps) {
  const totalReviews = platforms.reduce(
    (sum, p) => sum + parseInt(p.reviewCount, 10),
    0
  );

  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-t border-stone-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start mb-10 sm:mb-12">
          {/* Left: heading */}
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

          {/* Right: aggregate proof pill */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 border border-stone-200 shadow-sm self-start shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-stone-900 leading-none">
                {totalReviews}+ Reviews
              </div>
              <div className="text-xs text-stone-500 mt-0.5">across all platforms</div>
            </div>
          </div>
        </div>

        {/* Platform cards */}
        <div className="flex flex-col sm:flex-row gap-4">
          {platforms.map((platform) => (
            <PlatformCard key={platform.name} platform={platform} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-stone-400 mt-5 text-center">
          Review counts and ratings reflect our profiles on each platform as of early 2025.
        </p>
      </div>
    </section>
  );
}
