"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/security/requireAdmin";
import { leadLimiter } from "@/lib/security/rateLimit";

// ─── Submit lead (public form) ────────────────────────────────────────────────

const submitLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  propertyCity: z.string().max(100).optional().or(z.literal("")),
  serviceInterest: z
    .enum(["design", "build", "design_build", "consulting", "unknown"])
    .optional()
    .or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  // Attribution — never shown to user, submitted as hidden fields
  sourcePageUrl: z.string().max(1000).optional().or(z.literal("")),
  landingPage: z.string().max(1000).optional().or(z.literal("")),
  referrerUrl: z.string().max(1000).optional().or(z.literal("")),
  utmSource: z.string().max(100).optional().or(z.literal("")),
  utmMedium: z.string().max(100).optional().or(z.literal("")),
  utmCampaign: z.string().max(100).optional().or(z.literal("")),
  utmTerm: z.string().max(100).optional().or(z.literal("")),
  utmContent: z.string().max(100).optional().or(z.literal("")),
  gclid: z.string().max(255).optional().or(z.literal("")),
  fbclid: z.string().max(255).optional().or(z.literal("")),
});

type SubmitLeadState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitLead(
  _prevState: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  // Rate limit by IP address
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const limit = leadLimiter.check(ip);
  if (!limit.allowed) {
    return {
      success: false,
      message: "Too many submissions. Please wait a few minutes and try again.",
    };
  }

  const raw = Object.fromEntries(formData.entries());
  const result = submitLeadSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;

  // Find matching lead source by page path
  const sourcePageUrl = data.sourcePageUrl ?? "";
  let leadSource = null;
  if (sourcePageUrl) {
    try {
      const path = new URL(sourcePageUrl).pathname;
      leadSource = await prisma.leadSource.findFirst({
        where: { pagePath: path },
      });
    } catch {
      // sourcePageUrl might not be a full URL in some edge cases
    }
  }

  await prisma.lead.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      propertyCity: data.propertyCity || null,
      serviceInterest: (data.serviceInterest as "design" | "build" | "design_build" | "consulting" | "unknown") || null,
      notes: data.notes || null,
      sourceId: leadSource?.id ?? null,
      sourcePageUrl: data.sourcePageUrl || null,
      landingPage: data.landingPage || null,
      referrerUrl: data.referrerUrl || null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmTerm: data.utmTerm || null,
      utmContent: data.utmContent || null,
      gclid: data.gclid || null,
      fbclid: data.fbclid || null,
      status: "new",
      priority: "medium",
    },
  });

  return { success: true, message: "Thank you! We'll be in touch within 1 business day." };
}

// ─── Update lead status (admin) ───────────────────────────────────────────────

const updateStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost", "nurture", "disqualified"]),
});

type UpdateStatusState = { success: boolean; error?: string };

export async function updateLeadStatus(
  _prevState: UpdateStatusState,
  formData: FormData
): Promise<UpdateStatusState> {
  try { await requireAdmin(); } catch { return { success: false, error: "Unauthorized" }; }

  const result = updateStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) return { success: false, error: "Invalid data" };

  await prisma.lead.update({
    where: { id: result.data.leadId },
    data: { status: result.data.status, updatedAt: new Date() },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${result.data.leadId}`);
  return { success: true };
}

// ─── Toggle spam flag (admin) ────────────────────────────────────────────────

export async function toggleLeadSpam(leadId: string, isSpam: boolean) {
  try { await requireAdmin(); } catch { return; }

  if (!leadId || typeof leadId !== "string" || leadId.length > 36) return;

  await prisma.lead.update({
    where: { id: leadId },
    data: { isSpam, updatedAt: new Date() },
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}
