"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { slugify, computeFullPath } from "@/lib/utils/slugify";
import { computeWordCount, computeReadingTime } from "@/lib/utils/reading-time";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/security/requireAdmin";
import { sanitizeMarkdown } from "@/lib/security/sanitize";

// ─── Shared schema ────────────────────────────────────────────────────────────

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  body: z.string().min(100, "Content must be at least 100 characters"),
  status: z.enum(["draft", "review", "scheduled", "published", "archived"]),
  authorId: z.string().uuid("Invalid author"),
  // SEO fields
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(165).optional().or(z.literal("")),
  canonicalUrl: z.string().optional().or(z.literal("")),
  ogTitle: z.string().max(100).optional().or(z.literal("")),
  ogDescription: z.string().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().optional().or(z.literal("")),
  indexPage: z.string().optional(), // checkbox — "on" or undefined
  primaryKeyword: z.string().max(255).optional().or(z.literal("")),
  scheduledAt: z.string().optional().or(z.literal("")),
  faqItems: z.string().optional().or(z.literal("")), // JSON array of {q, a}
});

function parseFaqItems(raw: string | undefined): Array<{ q: string; a: string }> {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is { q: string; a: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof item.q === "string" &&
        typeof item.a === "string" &&
        item.q.trim().length > 0 &&
        item.a.trim().length > 0
      )
      .slice(0, 8);
  } catch {
    return [];
  }
}

function buildSections(body: string, faqItems: Array<{ q: string; a: string }>): object[] {
  const sections: object[] = [{ type: "rich_text", content: body }];
  if (faqItems.length > 0) {
    sections.push({ type: "faq_list", items: faqItems });
  }
  return sections;
}

// Validate publish-required fields
function validatePublishRequirements(data: z.infer<typeof postSchema>) {
  const errors: Record<string, string[]> = {};
  if (data.status === "published") {
    if (!data.seoTitle) errors.seoTitle = ["SEO title is required before publishing"];
    if (!data.seoDescription) errors.seoDescription = ["SEO description is required before publishing"];
  }
  return errors;
}

type PostActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  postId?: string;
};

// ─── Create post ──────────────────────────────────────────────────────────────

export async function createPost(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = postSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = result.data;

  // Generate slug from title if not provided
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);

  // Check slug uniqueness
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, errors: { slug: ["This slug is already in use. Please use a different title or slug."] } };
  }

  // Publish-time validation
  const publishErrors = validatePublishRequirements(data);
  if (Object.keys(publishErrors).length > 0) {
    return { success: false, errors: publishErrors };
  }

  const wordCount = computeWordCount(data.body);
  const readingTimeMinutes = computeReadingTime(wordCount);
  const fullPath = computeFullPath("blog", slug);
  const isPublished = data.status === "published";
  const faqItems = parseFaqItems(data.faqItems);
  const sanitizedBody = sanitizeMarkdown(data.body);

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      fullPath,
      excerpt: data.excerpt || null,
      featuredImageUrl: data.featuredImageUrl || null,
      status: data.status,
      authorId: data.authorId,
      sections: buildSections(sanitizedBody, faqItems),
      wordCount,
      readingTimeMinutes,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      canonicalUrl: data.canonicalUrl || fullPath,
      ogTitle: data.ogTitle || null,
      ogDescription: data.ogDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      indexPage: data.indexPage === "on",
      primaryKeyword: data.primaryKeyword || null,
      publishedAt: isPublished ? new Date() : null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    },
  });

  revalidateTag("posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);

  redirect(`/admin/posts/${post.id}`);
}

// ─── Update post ──────────────────────────────────────────────────────────────

const updatePostSchema = postSchema.extend({
  postId: z.string().uuid(),
});

export async function updatePost(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = updatePostSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = result.data;

  // Fetch existing post — slug is locked after creation
  const existing = await prisma.post.findUnique({ where: { id: data.postId } });
  if (!existing) return { success: false, errors: { postId: ["Post not found"] } };

  // Publish-time validation
  const publishErrors = validatePublishRequirements(data);
  if (Object.keys(publishErrors).length > 0) {
    return { success: false, errors: publishErrors };
  }

  const wordCount = computeWordCount(data.body);
  const readingTimeMinutes = computeReadingTime(wordCount);
  const faqItems = parseFaqItems(data.faqItems);
  const sanitizedBody = sanitizeMarkdown(data.body);

  const wasUnpublished = existing.status !== "published";
  const isNowPublished = data.status === "published";

  await prisma.post.update({
    where: { id: data.postId },
    data: {
      title: data.title,
      // slug is intentionally NOT updated after creation
      excerpt: data.excerpt || null,
      featuredImageUrl: data.featuredImageUrl || null,
      status: data.status,
      authorId: data.authorId,
      sections: buildSections(sanitizedBody, faqItems),
      wordCount,
      readingTimeMinutes,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      canonicalUrl: data.canonicalUrl || existing.fullPath,
      ogTitle: data.ogTitle || null,
      ogDescription: data.ogDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      indexPage: data.indexPage === "on",
      primaryKeyword: data.primaryKeyword || null,
      // Only set publishedAt on first publish
      publishedAt: isNowPublished && wasUnpublished ? new Date() : existing.publishedAt,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      updatedAt: new Date(),
    },
  });

  revalidateTag("posts");
  revalidatePath("/blog");
  revalidatePath(existing.fullPath);

  return { success: true, postId: data.postId };
}
