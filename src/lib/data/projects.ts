import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";

// ─── Typed JSON fields ────────────────────────────────────────────────────────

export interface ProjectStory {
  heading: string;
  body: string;
}

export interface ProjectScopeItem {
  phase: string;
  duration: string;
  description: string;
}

// Augments Prisma's Project with properly-typed JSON fields.
export interface TypedProject extends Omit<Project, "challenge" | "solution" | "result" | "buildHighlights" | "scopeItems" | "tags"> {
  challenge: ProjectStory;
  solution: ProjectStory;
  result: ProjectStory;
  buildHighlights: string[];
  scopeItems: ProjectScopeItem[];
  tags: string[];
}

function typed(p: Project): TypedProject {
  return p as unknown as TypedProject;
}

// ─── Accessors ────────────────────────────────────────────────────────────────

export const getAllProjects = cache(async (): Promise<TypedProject[]> => {
  const rows = await prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { completedYear: "desc" }] });
  return rows.map(typed);
});

export const getFeaturedProjects = cache(async (limit = 3): Promise<TypedProject[]> => {
  const rows = await prisma.project.findMany({
    where: { featuredOnHome: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  return rows.map(typed);
});

export const getProjectBySlug = cache(async (slug: string): Promise<TypedProject | null> => {
  const row = await prisma.project.findUnique({ where: { slug } });
  return row ? typed(row) : null;
});

export const getAllProjectSlugs = cache(async (): Promise<{ slug: string }[]> => {
  return prisma.project.findMany({ select: { slug: true } });
});

export const getProjectsByLocation = cache(async (locationSlug: string): Promise<TypedProject[]> => {
  const rows = await prisma.project.findMany({
    where: { relatedLocationSlug: locationSlug },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(typed);
});

export const getProjectsByModel = cache(async (modelSlug: string): Promise<TypedProject[]> => {
  const rows = await prisma.project.findMany({
    where: { relatedModelSlug: modelSlug },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(typed);
});

export const getProjectsByService = cache(async (serviceSlug: string): Promise<TypedProject[]> => {
  const rows = await prisma.project.findMany({
    where: { relatedServiceSlug: serviceSlug },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(typed);
});

export const getOtherProjects = cache(async (excludeSlug: string, limit = 3): Promise<TypedProject[]> => {
  const rows = await prisma.project.findMany({
    where: { slug: { not: excludeSlug } },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  return rows.map(typed);
});
