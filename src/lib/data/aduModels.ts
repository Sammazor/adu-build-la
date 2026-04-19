import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { AduModel } from "@prisma/client";

export interface AduModelSpec {
  sqFt: number;
  beds: number | "Studio";
  baths: number;
  floors: number;
  ceilingHeight: string;
}

export interface AduModelFeatureGroup {
  category: string;
  items: string[];
}

export interface AduModelFAQ { q: string; a: string; }

export interface TypedAduModel extends Omit<AduModel, "specs" | "idealForItems" | "featureGroups" | "faqs" | "tags"> {
  specs: AduModelSpec;
  idealForItems: string[];
  featureGroups: AduModelFeatureGroup[];
  faqs: AduModelFAQ[];
  tags: string[];
}

function typed(m: AduModel): TypedAduModel {
  return m as unknown as TypedAduModel;
}

export const getAllModels = cache(async (): Promise<TypedAduModel[]> => {
  const rows = await prisma.aduModel.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(typed);
});

export const getModelBySlug = cache(async (slug: string): Promise<TypedAduModel | null> => {
  const row = await prisma.aduModel.findUnique({ where: { slug } });
  return row ? typed(row) : null;
});

export const getAllModelSlugs = cache(async (): Promise<{ slug: string }[]> => {
  return prisma.aduModel.findMany({ select: { slug: true } });
});

export const getModelsForService = cache(async (serviceSlug: string, limit = 3): Promise<TypedAduModel[]> => {
  const serviceToModels: Record<string, string[]> = {
    "garage-conversion": ["garage-conversion-450"],
    "adu-construction": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750"],
    "adu-design": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750", "garage-conversion-450"],
    "permitting": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750", "garage-conversion-450"],
    "project-management": ["studio-400", "1-bed-500", "1-bed-650", "2-bed-750", "garage-conversion-450"],
  };
  const slugs = serviceToModels[serviceSlug];
  const rows = slugs
    ? await prisma.aduModel.findMany({ where: { slug: { in: slugs } }, take: limit, orderBy: { sortOrder: "asc" } })
    : await prisma.aduModel.findMany({ take: limit, orderBy: { sortOrder: "asc" } });
  return rows.map(typed);
});
