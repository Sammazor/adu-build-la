"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/requireAdmin";

const settingsSchema = z.object({
  siteName: z.string().min(1).max(100),
  siteUrl: z.string().url("Site URL must be a valid URL"),
  defaultOgImageUrl: z.string().optional().or(z.literal("")),
  googleSiteVerification: z.string().optional().or(z.literal("")),
  analyticsId: z.string().optional().or(z.literal("")),
  noindexSite: z.string().optional(), // checkbox "on" or undefined
  businessPhone: z.string().max(30).optional().or(z.literal("")),
  businessEmail: z.string().email().optional().or(z.literal("")),
  businessAddress: z.string().max(200).optional().or(z.literal("")),
  businessCity: z.string().max(100).optional().or(z.literal("")),
  businessState: z.string().max(50).optional().or(z.literal("")),
  businessZip: z.string().max(10).optional().or(z.literal("")),
  businessHours: z.string().max(200).optional().or(z.literal("")),
  priceRange: z.enum(["$", "$$", "$$$", "$$$$"]).optional(),
  serviceAreaText: z.string().max(1000).optional().or(z.literal("")),
  heroMediaType: z.enum(["none", "image", "video"]).default("none"),
  heroMediaUrl: z.string().url().optional().or(z.literal("")),
});

type SettingsState = { success: boolean; errors?: Record<string, string[]>; message?: string };

export async function updateSettings(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = settingsSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;
  const existing = await prisma.siteSettings.findFirst();

  const payload = {
    siteName: data.siteName,
    siteUrl: data.siteUrl,
    defaultOgImageUrl: data.defaultOgImageUrl || null,
    googleSiteVerification: data.googleSiteVerification || null,
    analyticsId: data.analyticsId || null,
    noindexSite: data.noindexSite === "on",
    businessPhone: data.businessPhone || null,
    businessEmail: data.businessEmail || null,
    businessAddress: data.businessAddress || null,
    businessCity: data.businessCity || null,
    businessState: data.businessState || null,
    businessZip: data.businessZip || null,
    businessHours: data.businessHours || null,
    priceRange: data.priceRange || null,
    serviceAreaText: data.serviceAreaText || null,
    heroMediaType: data.heroMediaType,
    heroMediaUrl: data.heroMediaUrl || null,
  };

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: payload });
  } else {
    await prisma.siteSettings.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: true, message: "Settings saved successfully." };
}
