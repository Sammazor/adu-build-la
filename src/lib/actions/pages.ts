"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { requireAdmin } from "@/lib/security/requireAdmin";
import { sanitizeMarkdown } from "@/lib/security/sanitize";

// ── Shared schema ─────────────────────────────────────────────────────────────

const basePageSchema = z.object({
  title: z.string().min(2).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),

  // Hero
  heroHeading: z.string().max(255).optional().or(z.literal("")),
  heroSubheading: z.string().max(500).optional().or(z.literal("")),
  heroCtaPrimaryLabel: z.string().max(100).optional().or(z.literal("")),
  heroCtaPrimaryUrl: z.string().max(500).optional().or(z.literal("")),
  heroCtaSecondaryLabel: z.string().max(100).optional().or(z.literal("")),
  heroCtaSecondaryUrl: z.string().max(500).optional().or(z.literal("")),
  heroImageUrl: z.string().optional().or(z.literal("")),

  // Status
  status: z.enum(["draft", "review", "scheduled", "published", "archived"]),

  // SEO
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(165).optional().or(z.literal("")),
  canonicalUrl: z.string().optional().or(z.literal("")),
  ogTitle: z.string().max(100).optional().or(z.literal("")),
  ogDescription: z.string().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().optional().or(z.literal("")),
  indexPage: z.string().optional(),
  primaryKeyword: z.string().max(255).optional().or(z.literal("")),
});

// ── State type ────────────────────────────────────────────────────────────────

export type PageActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_SECTION_TYPES = new Set(["rich_text", "intro", "cta", "faq_list"]);

/** Parse and sanitize the ordered sections JSON submitted from the form textarea. */
function parseSectionsInput(raw: string | undefined): unknown[] {
  if (!raw || raw.trim() === "") return [];
  // Enforce a reasonable size limit on the JSON payload (500 KB)
  if (raw.length > 512_000) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter to only known section types and sanitize rich text content
    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Record<string, unknown>).type === "string" &&
          VALID_SECTION_TYPES.has((item as Record<string, unknown>).type as string)
      )
      .map((item) => {
        // Sanitize rich_text content to prevent XSS
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
      .slice(0, 20); // max 20 sections per page
  } catch {
    return [];
  }
}

function nullish(val: string | undefined): string | null {
  return val && val.trim() !== "" ? val.trim() : null;
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createPage(
  _prevState: PageActionState,
  formData: FormData
): Promise<PageActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());

  // Auto-generate slug from title if blank
  if (!raw.slug || (raw.slug as string).trim() === "") {
    raw.slug = slugify(raw.title as string);
  }

  const result = basePageSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;

  // Slug uniqueness check
  const existing = await prisma.page.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { success: false, errors: { slug: ["This slug is already taken."] } };
  }

  const sections = parseSectionsInput(formData.get("sectionsJson") as string);

  const page = await prisma.page.create({
    data: {
      title: data.title,
      slug: data.slug,
      heroHeading: nullish(data.heroHeading),
      heroSubheading: nullish(data.heroSubheading),
      heroCtaPrimaryLabel: nullish(data.heroCtaPrimaryLabel),
      heroCtaPrimaryUrl: nullish(data.heroCtaPrimaryUrl),
      heroCtaSecondaryLabel: nullish(data.heroCtaSecondaryLabel),
      heroCtaSecondaryUrl: nullish(data.heroCtaSecondaryUrl),
      heroImageUrl: nullish(data.heroImageUrl),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: sections as any,
      status: data.status,
      publishedAt: data.status === "published" ? new Date() : null,
      seoTitle: nullish(data.seoTitle),
      seoDescription: nullish(data.seoDescription),
      canonicalUrl: nullish(data.canonicalUrl) ?? `/${data.slug}`,
      ogTitle: nullish(data.ogTitle),
      ogDescription: nullish(data.ogDescription),
      ogImageUrl: nullish(data.ogImageUrl),
      indexPage: data.indexPage === "on",
      primaryKeyword: nullish(data.primaryKeyword),
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
  redirect(`/admin/pages/${page.id}`);
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updatePage(
  _prevState: PageActionState,
  formData: FormData
): Promise<PageActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = basePageSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;
  const pageId = formData.get("pageId") as string;

  if (!pageId) return { success: false, errors: { pageId: ["Missing page ID."] } };

  const existing = await prisma.page.findUnique({ where: { id: pageId } });
  if (!existing) return { success: false, errors: { pageId: ["Page not found."] } };

  const sections = parseSectionsInput(formData.get("sectionsJson") as string);

  await prisma.page.update({
    where: { id: pageId },
    data: {
      title: data.title,
      heroHeading: nullish(data.heroHeading),
      heroSubheading: nullish(data.heroSubheading),
      heroCtaPrimaryLabel: nullish(data.heroCtaPrimaryLabel),
      heroCtaPrimaryUrl: nullish(data.heroCtaPrimaryUrl),
      heroCtaSecondaryLabel: nullish(data.heroCtaSecondaryLabel),
      heroCtaSecondaryUrl: nullish(data.heroCtaSecondaryUrl),
      heroImageUrl: nullish(data.heroImageUrl),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: sections as any,
      status: data.status,
      publishedAt:
        data.status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
      seoTitle: nullish(data.seoTitle),
      seoDescription: nullish(data.seoDescription),
      canonicalUrl: nullish(data.canonicalUrl) ?? `/${existing.slug}`,
      ogTitle: nullish(data.ogTitle),
      ogDescription: nullish(data.ogDescription),
      ogImageUrl: nullish(data.ogImageUrl),
      indexPage: data.indexPage === "on",
      primaryKeyword: nullish(data.primaryKeyword),
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${pageId}`);
  revalidatePath(`/${existing.slug}`);

  return { success: true, message: "Page saved successfully." };
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deletePage(pageId: string): Promise<{ success: boolean; error?: string }> {
  try { await requireAdmin(); } catch { return { success: false, error: "Unauthorized" }; }

  if (!pageId || typeof pageId !== "string" || pageId.length > 36) {
    return { success: false, error: "Invalid page ID" };
  }

  try {
    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (!page) return { success: false, error: "Page not found." };

    await prisma.page.delete({ where: { id: pageId } });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);

    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete page." };
  }
}
