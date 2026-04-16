"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/security/requireAdmin";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().optional().or(z.literal("")),
  title: z.string().max(100).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type AuthorActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  authorId?: string;
};

// ─── Create author ────────────────────────────────────────────────────────────

export async function createAuthor(
  _prevState: AuthorActionState,
  formData: FormData
): Promise<AuthorActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = authorSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = result.data;
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);

  const existing = await prisma.author.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, errors: { slug: ["This slug is already in use."] } };
  }

  const author = await prisma.author.create({
    data: {
      name: data.name,
      slug,
      title: data.title || null,
      bio: data.bio || null,
      avatarUrl: data.avatarUrl || null,
    },
  });

  revalidatePath("/admin/authors");
  redirect(`/admin/authors/${author.id}`);
}

// ─── Update author ────────────────────────────────────────────────────────────

const updateAuthorSchema = authorSchema.extend({
  authorId: z.string().uuid(),
});

export async function updateAuthor(
  _prevState: AuthorActionState,
  formData: FormData
): Promise<AuthorActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = updateAuthorSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = result.data;
  const existing = await prisma.author.findUnique({ where: { id: data.authorId } });
  if (!existing) return { success: false, errors: { authorId: ["Author not found"] } };

  await prisma.author.update({
    where: { id: data.authorId },
    data: {
      name: data.name,
      title: data.title || null,
      bio: data.bio || null,
      avatarUrl: data.avatarUrl || null,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/authors");
  revalidatePath(`/admin/authors/${data.authorId}`);

  return { success: true, message: "Author saved.", authorId: data.authorId };
}

// ─── Delete author ────────────────────────────────────────────────────────────

export async function deleteAuthor(authorId: string): Promise<{ success: boolean; error?: string }> {
  try { await requireAdmin(); } catch { return { success: false, error: "Unauthorized" }; }

  // Validate input
  if (!authorId || typeof authorId !== "string" || authorId.length > 36) {
    return { success: false, error: "Invalid author ID" };
  }

  const postCount = await prisma.post.count({ where: { authorId } });
  if (postCount > 0) {
    return { success: false, error: `Cannot delete — author has ${postCount} post${postCount !== 1 ? "s" : ""}. Reassign first.` };
  }

  await prisma.author.delete({ where: { id: authorId } });
  revalidatePath("/admin/authors");

  return { success: true };
}
