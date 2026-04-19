import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Location } from "@prisma/client";

export interface LocationStat { value: string; label: string; }
export interface LocationPermitNote { title: string; body: string; }
export interface LocationPricingRange { type: string; range: string; note: string; }
export interface LocationFAQ { q: string; a: string; }

export interface TypedLocation extends Omit<Location, "introParagraphs" | "stats" | "benefits" | "permitNotes" | "pricingRanges" | "faqs" | "nearbyAreas"> {
  introParagraphs: string[];
  stats: LocationStat[];
  benefits: string[];
  permitNotes: LocationPermitNote[];
  pricingRanges: LocationPricingRange[];
  faqs: LocationFAQ[];
  nearbyAreas: string[];
}

function typed(loc: Location): TypedLocation {
  return loc as unknown as TypedLocation;
}

export const getAllLocations = cache(async (): Promise<TypedLocation[]> => {
  const rows = await prisma.location.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(typed);
});

export const getLocationBySlug = cache(async (slug: string): Promise<TypedLocation | null> => {
  const row = await prisma.location.findUnique({ where: { slug } });
  return row ? typed(row) : null;
});

export const getAllLocationSlugs = cache(async (): Promise<{ slug: string }[]> => {
  return prisma.location.findMany({ select: { slug: true } });
});
