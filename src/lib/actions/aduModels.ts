"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/requireAdmin";

const aduModelSchema = z.object({
  modelId: z.string().min(1),
  name: z.string().min(2).max(100),
  tagline: z.string().max(500).optional().or(z.literal("")),
  seoTitle: z.string().max(120).optional().or(z.literal("")),
  seoDescription: z.string().max(300).optional().or(z.literal("")),
  heroHeading: z.string().max(255).optional().or(z.literal("")),
  heroSubheading: z.string().max(1000).optional().or(z.literal("")),
  idealForHeading: z.string().max(255).optional().or(z.literal("")),
  idealForBody: z.string().max(2000).optional().or(z.literal("")),
  startingFrom: z.string().max(50).optional().or(z.literal("")),
  startingFromNote: z.string().max(500).optional().or(z.literal("")),
  badge: z.string().max(50).optional().or(z.literal("")),
  heroImageUrl: z.string().optional().or(z.literal("")),
});

export type AduModelActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function updateAduModel(
  _prevState: AduModelActionState,
  formData: FormData
): Promise<AduModelActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = aduModelSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = result.data;

  const existing = await prisma.aduModel.findUnique({ where: { id: d.modelId } });
  if (!existing) return { success: false, errors: { modelId: ["ADU Model not found"] } };

  await prisma.aduModel.update({
    where: { id: d.modelId },
    data: {
      name: d.name,
      tagline: d.tagline || existing.tagline,
      seoTitle: d.seoTitle || existing.seoTitle,
      seoDescription: d.seoDescription || existing.seoDescription,
      heroHeading: d.heroHeading || existing.heroHeading,
      heroSubheading: d.heroSubheading || existing.heroSubheading,
      idealForHeading: d.idealForHeading || existing.idealForHeading,
      idealForBody: d.idealForBody || existing.idealForBody,
      startingFrom: d.startingFrom || existing.startingFrom,
      startingFromNote: d.startingFromNote || existing.startingFromNote,
      badge: d.badge || null,
      heroImageUrl: d.heroImageUrl || null,
    },
  });

  revalidatePath("/adu-models");
  revalidatePath(`/adu-models/${existing.slug}`);
  revalidatePath("/admin/adu-models");

  return { success: true, message: "ADU Model saved." };
}
