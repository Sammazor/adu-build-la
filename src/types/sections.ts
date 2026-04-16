// src/types/sections.ts
// Typed discriminated union for all Phase 1 section types.
// Sections are stored as JSONB arrays on content records.

export interface RichTextSection {
  type: "rich_text";
  content: string; // markdown
}

export interface HeroSection {
  type: "hero";
  heading: string;
  subheading?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  imageUrl?: string;
  layout?: "centered" | "split" | "full_bleed";
}

export interface IntroSection {
  type: "intro";
  heading: string;
  body: string; // markdown / plain text
  asideImageUrl?: string;
  imagePosition?: "left" | "right";
}

export interface CtaSection {
  type: "cta";
  heading: string;
  subheading?: string;
  primary_label: string;
  primary_url: string;
  secondary_label?: string;
  secondary_url?: string;
  background?: "dark" | "light" | "brand";
}

export interface FaqListSection {
  type: "faq_list";
  items: { q: string; a: string }[];
}

export type Section = RichTextSection | HeroSection | IntroSection | CtaSection | FaqListSection;

// Type guard helpers
export function isRichTextSection(s: Section): s is RichTextSection {
  return s.type === "rich_text";
}

export function isHeroSection(s: Section): s is HeroSection {
  return s.type === "hero";
}

export function isIntroSection(s: Section): s is IntroSection {
  return s.type === "intro";
}

export function isCtaSection(s: Section): s is CtaSection {
  return s.type === "cta";
}

/**
 * Safely cast raw JSONB from Prisma to a typed Section array.
 * Invalid entries are filtered out silently.
 */
export function parseSections(raw: unknown): Section[] {
  if (!Array.isArray(raw)) return [];
  const validTypes = new Set(["rich_text", "hero", "intro", "cta", "faq_list"]);
  return raw.filter(
    (item): item is Section =>
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      validTypes.has((item as { type: string }).type)
  );
}
