"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/requireAdmin";

const projectSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(2).max(255),
  seoTitle: z.string().max(120).optional().or(z.literal("")),
  seoDescription: z.string().max(300).optional().or(z.literal("")),
  heroHeading: z.string().max(255).optional().or(z.literal("")),
  heroTagline: z.string().max(1000).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  projectType: z.string().max(100).optional().or(z.literal("")),
  sqFt: z.coerce.number().int().positive().optional(),
  beds: z.string().max(20).optional().or(z.literal("")),
  baths: z.coerce.number().positive().optional(),
  completedYear: z.coerce.number().int().min(2000).max(2100).optional(),
  totalBuildWeeks: z.coerce.number().int().positive().optional(),
  totalProjectMonths: z.string().max(50).optional().or(z.literal("")),
  projectCost: z.string().max(50).optional().or(z.literal("")),
  monthlyRent: z.string().max(50).optional().or(z.literal("")),
  useCase: z.string().max(255).optional().or(z.literal("")),
  challengeHeading: z.string().max(255).optional().or(z.literal("")),
  challengeBody: z.string().max(5000).optional().or(z.literal("")),
  solutionHeading: z.string().max(255).optional().or(z.literal("")),
  solutionBody: z.string().max(5000).optional().or(z.literal("")),
  resultHeading: z.string().max(255).optional().or(z.literal("")),
  resultBody: z.string().max(5000).optional().or(z.literal("")),
  relatedLocationSlug: z.string().max(100).optional().or(z.literal("")),
  relatedLocationName: z.string().max(100).optional().or(z.literal("")),
  relatedModelSlug: z.string().max(100).optional().or(z.literal("")),
  relatedModelName: z.string().max(100).optional().or(z.literal("")),
  relatedServiceSlug: z.string().max(100).optional().or(z.literal("")),
  relatedServiceName: z.string().max(100).optional().or(z.literal("")),
  featuredOnHome: z.string().optional(),
  featuredImageUrl: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).optional(),
  buildHighlights: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
});

export type ProjectActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function updateProject(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  try { await requireAdmin(); } catch { return { success: false, errors: { _: ["Unauthorized"] } }; }

  const raw = Object.fromEntries(formData.entries());
  const result = projectSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = result.data;

  const existing = await prisma.project.findUnique({ where: { id: d.projectId } });
  if (!existing) return { success: false, errors: { projectId: ["Project not found"] } };

  const challengeHeading = d.challengeHeading ?? (existing.challenge as {heading?: string}).heading ?? "";
  const challengeBody = d.challengeBody ?? (existing.challenge as {body?: string}).body ?? "";
  const solutionHeading = d.solutionHeading ?? (existing.solution as {heading?: string}).heading ?? "";
  const solutionBody = d.solutionBody ?? (existing.solution as {body?: string}).body ?? "";
  const resultHeading = d.resultHeading ?? (existing.result as {heading?: string}).heading ?? "";
  const resultBody = d.resultBody ?? (existing.result as {body?: string}).body ?? "";

  const buildHighlights = d.buildHighlights
    ? d.buildHighlights.split("\n").map((s) => s.trim()).filter(Boolean)
    : (existing.buildHighlights as string[]);

  const tags = d.tags
    ? d.tags.split(",").map((s) => s.trim()).filter(Boolean)
    : (existing.tags as string[]);

  await prisma.project.update({
    where: { id: d.projectId },
    data: {
      name: d.name,
      seoTitle: d.seoTitle || existing.seoTitle,
      seoDescription: d.seoDescription || existing.seoDescription,
      heroHeading: d.heroHeading || existing.heroHeading,
      heroTagline: d.heroTagline || existing.heroTagline,
      city: d.city || existing.city,
      projectType: d.projectType || existing.projectType,
      sqFt: d.sqFt ?? existing.sqFt,
      beds: d.beds || existing.beds,
      baths: d.baths ?? existing.baths,
      completedYear: d.completedYear ?? existing.completedYear,
      totalBuildWeeks: d.totalBuildWeeks ?? existing.totalBuildWeeks,
      totalProjectMonths: d.totalProjectMonths || existing.totalProjectMonths,
      projectCost: d.projectCost || existing.projectCost,
      monthlyRent: d.monthlyRent || null,
      useCase: d.useCase || existing.useCase,
      challenge: { heading: challengeHeading, body: challengeBody },
      solution: { heading: solutionHeading, body: solutionBody },
      result: { heading: resultHeading, body: resultBody },
      buildHighlights,
      tags,
      relatedLocationSlug: d.relatedLocationSlug || null,
      relatedLocationName: d.relatedLocationName || null,
      relatedModelSlug: d.relatedModelSlug || null,
      relatedModelName: d.relatedModelName || null,
      relatedServiceSlug: d.relatedServiceSlug || null,
      relatedServiceName: d.relatedServiceName || null,
      featuredOnHome: d.featuredOnHome === "true",
      featuredImageUrl: d.featuredImageUrl || null,
      sortOrder: d.sortOrder ?? existing.sortOrder,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  revalidatePath("/admin/projects");

  return { success: true, message: "Project saved." };
}
