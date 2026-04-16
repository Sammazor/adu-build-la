"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/security/requireAdmin";

// ─── Update media metadata ────────────────────────────────────────────────────

const updateMediaSchema = z.object({
  mediaId: z.string().uuid(),
  title: z.string().max(255).optional().or(z.literal("")),
  altText: z.string().max(500).optional().or(z.literal("")),
  caption: z.string().max(1000).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  seoTitle: z.string().max(255).optional().or(z.literal("")),
  locationLabel: z.string().max(255).optional().or(z.literal("")),
  locationCity: z.string().max(100).optional().or(z.literal("")),
  locationState: z.string().max(100).optional().or(z.literal("")),
  locationZip: z.string().max(10).optional().or(z.literal("")),
  latitude: z.string().optional().or(z.literal("")),
  longitude: z.string().optional().or(z.literal("")),
});

export type MediaActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function updateMediaMetadata(
  _prevState: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = updateMediaSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;

  // Parse decimal lat/lon
  let latitude: string | null = null;
  let longitude: string | null = null;
  if (data.latitude && data.latitude !== "") {
    const n = parseFloat(data.latitude);
    if (!isNaN(n) && n >= -90 && n <= 90) latitude = n.toFixed(7);
  }
  if (data.longitude && data.longitude !== "") {
    const n = parseFloat(data.longitude);
    if (!isNaN(n) && n >= -180 && n <= 180) longitude = n.toFixed(7);
  }

  await prisma.media.update({
    where: { id: data.mediaId },
    data: {
      title: data.title || null,
      altText: data.altText ?? "",
      caption: data.caption || null,
      description: data.description || null,
      seoTitle: data.seoTitle || null,
      locationLabel: data.locationLabel || null,
      locationCity: data.locationCity || null,
      locationState: data.locationState || null,
      locationZip: data.locationZip || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${data.mediaId}`);

  return { success: true, message: "Media metadata saved." };
}

// ─── Delete media ─────────────────────────────────────────────────────────────

export async function deleteMedia(mediaId: string): Promise<{ success: boolean; error?: string }> {
  try { await requireAdmin(); } catch { return { success: false, error: "Unauthorized" }; }

  if (!mediaId || typeof mediaId !== "string" || mediaId.length > 36) {
    return { success: false, error: "Invalid media ID" };
  }

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) return { success: false, error: "Media not found" };

  // Delete from Vercel Blob storage
  try {
    await del(media.url);
  } catch {
    // Blob may already be gone — continue to remove DB record
  }

  await prisma.media.delete({ where: { id: mediaId } });

  revalidatePath("/admin/media");

  return { success: true };
}
