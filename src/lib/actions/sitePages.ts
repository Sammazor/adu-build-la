"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/requireAdmin";
import { sanitizeMarkdown } from "@/lib/security/sanitize";

// ── Schema ────────────────────────────────────────────────────────────────────

const sitePageSchema = z.object({
  pageKey: z.string().min(1).max(100),

  heroHeading: z.string().max(255).optional().or(z.literal("")),
  heroSubheading: z.string().max(500).optional().or(z.literal("")),
  heroCtaPrimaryLabel: z.string().max(100).optional().or(z.literal("")),
  heroCtaPrimaryUrl: z.string().max(500).optional().or(z.literal("")),
  heroCtaSecondaryLabel: z.string().max(100).optional().or(z.literal("")),
  heroCtaSecondaryUrl: z.string().max(500).optional().or(z.literal("")),
  heroImageUrl: z.string().optional().or(z.literal("")),

  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(165).optional().or(z.literal("")),
  canonicalUrl: z.string().optional().or(z.literal("")),
  ogTitle: z.string().max(100).optional().or(z.literal("")),
  ogDescription: z.string().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().optional().or(z.literal("")),
  indexPage: z.string().optional(),
  primaryKeyword: z.string().max(255).optional().or(z.literal("")),
});

export type SitePageActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_SECTION_TYPES = new Set(["rich_text", "intro", "cta", "faq_list"]);

function parseSectionsInput(raw: string | undefined): unknown[] {
  if (!raw || raw.trim() === "") return [];
  if (raw.length > 512_000) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Record<string, unknown>).type === "string" &&
          VALID_SECTION_TYPES.has((item as Record<string, unknown>).type as string)
      )
      .map((item) => {
        if (item.type === "rich_text" && typeof item.content === "string") {
          return { ...item, content: sanitizeMarkdown(item.content) };
        }
        if (item.type === "intro") {
          return {
            ...item,
            heading: typeof item.heading === "string" ? item.heading.slice(0, 255) : "",
            body: typeof item.body === "string" ? sanitizeMarkdown(item.body) : "",
          };
        }
        return item;
      })
      .slice(0, 20);
  } catch {
    return [];
  }
}

function nullish(val: string | undefined): string | null {
  return val && val.trim() !== "" ? val.trim() : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE KEY → public path mapping for cache revalidation
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_KEY_PATHS: Record<string, string[]> = {
  homepage: ["/"],
  "services-index": ["/services"],
  "locations-index": ["/locations"],
  "contact": ["/contact"],
  "estimate": ["/estimate"],
  "build-your-adu": ["/build-your-adu"],
  "projects": ["/projects"],
  "adu-models": ["/adu-models"],
};

// ── Upsert ────────────────────────────────────────────────────────────────────

export async function upsertSitePage(
  _prevState: SitePageActionState,
  formData: FormData
): Promise<SitePageActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = sitePageSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;
  const sections = parseSectionsInput(formData.get("sectionsJson") as string);

  await prisma.sitePageOverride.upsert({
    where: { pageKey: data.pageKey },
    create: {
      pageKey: data.pageKey,
      heroHeading: nullish(data.heroHeading),
      heroSubheading: nullish(data.heroSubheading),
      heroCtaPrimaryLabel: nullish(data.heroCtaPrimaryLabel),
      heroCtaPrimaryUrl: nullish(data.heroCtaPrimaryUrl),
      heroCtaSecondaryLabel: nullish(data.heroCtaSecondaryLabel),
      heroCtaSecondaryUrl: nullish(data.heroCtaSecondaryUrl),
      heroImageUrl: nullish(data.heroImageUrl),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: sections as any,
      seoTitle: nullish(data.seoTitle),
      seoDescription: nullish(data.seoDescription),
      canonicalUrl: nullish(data.canonicalUrl),
      ogTitle: nullish(data.ogTitle),
      ogDescription: nullish(data.ogDescription),
      ogImageUrl: nullish(data.ogImageUrl),
      indexPage: data.indexPage === "on",
      primaryKeyword: nullish(data.primaryKeyword),
    },
    update: {
      heroHeading: nullish(data.heroHeading),
      heroSubheading: nullish(data.heroSubheading),
      heroCtaPrimaryLabel: nullish(data.heroCtaPrimaryLabel),
      heroCtaPrimaryUrl: nullish(data.heroCtaPrimaryUrl),
      heroCtaSecondaryLabel: nullish(data.heroCtaSecondaryLabel),
      heroCtaSecondaryUrl: nullish(data.heroCtaSecondaryUrl),
      heroImageUrl: nullish(data.heroImageUrl),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: sections as any,
      seoTitle: nullish(data.seoTitle),
      seoDescription: nullish(data.seoDescription),
      canonicalUrl: nullish(data.canonicalUrl),
      ogTitle: nullish(data.ogTitle),
      ogDescription: nullish(data.ogDescription),
      ogImageUrl: nullish(data.ogImageUrl),
      indexPage: data.indexPage === "on",
      primaryKeyword: nullish(data.primaryKeyword),
    },
  });

  // Revalidate admin list + the public page(s) for this key
  revalidatePath("/admin/site-pages");
  revalidatePath(`/admin/site-pages/${data.pageKey}`);
  const publicPaths = PAGE_KEY_PATHS[data.pageKey] ?? [];
  for (const p of publicPaths) revalidatePath(p);

  return { success: true, message: "Page settings saved." };
}
