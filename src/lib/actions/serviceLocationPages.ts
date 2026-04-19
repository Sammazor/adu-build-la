"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/requireAdmin";

const slpSchema = z.object({
  locationSlug: z.string().min(1).max(100),
  serviceSlug: z.string().min(1).max(100),
  seoTitle: z.string().max(120).optional().or(z.literal("")),
  seoDescription: z.string().max(300).optional().or(z.literal("")),
  heroTagline: z.string().max(255).optional().or(z.literal("")),
  heroHeading: z.string().max(255).optional().or(z.literal("")),
  heroSubheading: z.string().max(1000).optional().or(z.literal("")),
  whyHeading: z.string().max(255).optional().or(z.literal("")),
  considerationsHeading: z.string().max(255).optional().or(z.literal("")),
  pricingHeading: z.string().max(255).optional().or(z.literal("")),
  pricingIntro: z.string().max(2000).optional().or(z.literal("")),
});

export type SLPActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function updateServiceLocationPage(
  _prevState: SLPActionState,
  formData: FormData
): Promise<SLPActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = slpSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = result.data;

  const existing = await prisma.serviceLocationPage.findUnique({
    where: { locationSlug_serviceSlug: { locationSlug: d.locationSlug, serviceSlug: d.serviceSlug } },
  });
  if (!existing) return { success: false, errors: { locationSlug: ["Page not found"] } };

  await prisma.serviceLocationPage.update({
    where: { locationSlug_serviceSlug: { locationSlug: d.locationSlug, serviceSlug: d.serviceSlug } },
    data: {
      seoTitle: d.seoTitle || existing.seoTitle,
      seoDescription: d.seoDescription || existing.seoDescription,
      heroTagline: d.heroTagline || existing.heroTagline,
      heroHeading: d.heroHeading || existing.heroHeading,
      heroSubheading: d.heroSubheading || existing.heroSubheading,
      whyHeading: d.whyHeading || existing.whyHeading,
      considerationsHeading: d.considerationsHeading || existing.considerationsHeading,
      pricingHeading: d.pricingHeading || existing.pricingHeading,
      pricingIntro: d.pricingIntro || existing.pricingIntro,
    },
  });

  revalidatePath(`/locations/${d.locationSlug}/${d.serviceSlug}`);
  revalidatePath("/admin/service-location-pages");

  return { success: true, message: "Page saved." };
}
