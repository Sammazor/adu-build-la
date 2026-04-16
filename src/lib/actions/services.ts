"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/requireAdmin";

const serviceSchema = z.object({
  serviceId: z.string().uuid(),
  name: z.string().min(2).max(200),
  shortDescription: z.string().max(500).optional().or(z.literal("")),
  heroImageUrl: z.string().optional().or(z.literal("")),
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
  // Intro section fields (stored in sections JSON)
  introHeading: z.string().max(200).optional().or(z.literal("")),
  introBody: z.string().max(3000).optional().or(z.literal("")),
  // CTA section fields
  ctaHeading: z.string().max(200).optional().or(z.literal("")),
  ctaBody: z.string().max(1000).optional().or(z.literal("")),
  ctaPrimaryLabel: z.string().max(100).optional().or(z.literal("")),
  ctaPrimaryUrl: z.string().max(500).optional().or(z.literal("")),
});

export type ServiceActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function updateService(
  _prevState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = serviceSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;

  // Fetch existing to preserve sections structure
  const existing = await prisma.servicePage.findUnique({ where: { id: data.serviceId } });
  if (!existing) return { success: false, errors: { serviceId: ["Service page not found"] } };

  // Merge editable fields into sections JSON
  // Preserve any sections we don't edit; update Intro and CTA by type
  const existingSections = Array.isArray(existing.sections) ? existing.sections as Record<string, unknown>[] : [];

  const updatedSections = existingSections.map((s) => {
    if (s.type === "intro" && (data.introHeading || data.introBody)) {
      return {
        ...s,
        heading: data.introHeading || s.heading,
        body: data.introBody || s.body,
      };
    }
    if (s.type === "cta" && (data.ctaHeading || data.ctaBody || data.ctaPrimaryLabel || data.ctaPrimaryUrl)) {
      return {
        ...s,
        heading: data.ctaHeading || s.heading,
        body: data.ctaBody || s.body,
        ctaPrimaryLabel: data.ctaPrimaryLabel || s.ctaPrimaryLabel,
        ctaPrimaryUrl: data.ctaPrimaryUrl || s.ctaPrimaryUrl,
      };
    }
    return s;
  });

  await prisma.servicePage.update({
    where: { id: data.serviceId },
    data: {
      name: data.name,
      shortDescription: data.shortDescription || null,
      heroImageUrl: data.heroImageUrl || null,
      status: data.status,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: updatedSections as any,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      canonicalUrl: data.canonicalUrl || existing.fullPath,
      ogTitle: data.ogTitle || null,
      ogDescription: data.ogDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      indexPage: data.indexPage === "on",
      primaryKeyword: data.primaryKeyword || null,
      publishedAt: data.status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${data.serviceId}`);
  revalidatePath(existing.fullPath);
  revalidatePath("/services");

  return { success: true, message: "Service page saved." };
}
