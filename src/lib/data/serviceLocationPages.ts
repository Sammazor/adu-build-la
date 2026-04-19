import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { ServiceLocationPage } from "@prisma/client";

export interface ServiceLocationFaq { q: string; a: string; }
export interface ServiceLocationPricingRange { type: string; range: string; note: string; }
export interface ServiceLocationConsideration { title: string; body: string; }
export interface ServiceLocationRelatedPath { href: string; label: string; description: string; }

export interface TypedServiceLocationPage extends Omit<ServiceLocationPage, "whyParagraphs" | "considerations" | "pricingRanges" | "faqs" | "relatedPaths"> {
  whyParagraphs: string[];
  considerations: ServiceLocationConsideration[];
  pricingRanges: ServiceLocationPricingRange[];
  faqs: ServiceLocationFaq[];
  relatedPaths: ServiceLocationRelatedPath[];
}

function typed(p: ServiceLocationPage): TypedServiceLocationPage {
  return p as unknown as TypedServiceLocationPage;
}

export const getAllServiceLocationPages = cache(async (): Promise<TypedServiceLocationPage[]> => {
  const rows = await prisma.serviceLocationPage.findMany({
    orderBy: [{ locationSlug: "asc" }, { serviceSlug: "asc" }],
  });
  return rows.map(typed);
});

export const getServiceLocationPage = cache(
  async (locationSlug: string, serviceSlug: string): Promise<TypedServiceLocationPage | null> => {
    const row = await prisma.serviceLocationPage.findUnique({
      where: { locationSlug_serviceSlug: { locationSlug, serviceSlug } },
    });
    return row ? typed(row) : null;
  }
);

export const getAllServiceLocationParams = cache(
  async (): Promise<{ locationSlug: string; serviceSlug: string }[]> => {
    return prisma.serviceLocationPage.findMany({
      select: { locationSlug: true, serviceSlug: true },
    });
  }
);
