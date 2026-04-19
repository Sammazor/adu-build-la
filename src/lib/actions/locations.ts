"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/requireAdmin";

const locationSchema = z.object({
  locationId: z.string().min(1),
  name: z.string().min(2).max(100),
  seoTitle: z.string().max(120).optional().or(z.literal("")),
  seoDescription: z.string().max(300).optional().or(z.literal("")),
  heroTagline: z.string().max(255).optional().or(z.literal("")),
  heroHeading: z.string().max(255).optional().or(z.literal("")),
  heroSubheading: z.string().max(1000).optional().or(z.literal("")),
  introHeading: z.string().max(255).optional().or(z.literal("")),
  pricingIntro: z.string().max(2000).optional().or(z.literal("")),
  heroImageUrl: z.string().optional().or(z.literal("")),
});

export type LocationActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function updateLocation(
  _prevState: LocationActionState,
  formData: FormData
): Promise<LocationActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = locationSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = result.data;

  const existing = await prisma.location.findUnique({ where: { id: d.locationId } });
  if (!existing) return { success: false, errors: { locationId: ["Location not found"] } };

  await prisma.location.update({
    where: { id: d.locationId },
    data: {
      name: d.name,
      seoTitle: d.seoTitle || existing.seoTitle,
      seoDescription: d.seoDescription || existing.seoDescription,
      heroTagline: d.heroTagline || existing.heroTagline,
      heroHeading: d.heroHeading || existing.heroHeading,
      heroSubheading: d.heroSubheading || existing.heroSubheading,
      introHeading: d.introHeading || existing.introHeading,
      pricingIntro: d.pricingIntro || existing.pricingIntro,
      heroImageUrl: d.heroImageUrl || null,
    },
  });

  revalidatePath("/locations");
  revalidatePath(`/locations/${existing.slug}`);
  revalidatePath("/admin/locations");

  return { success: true, message: "Location saved." };
}
