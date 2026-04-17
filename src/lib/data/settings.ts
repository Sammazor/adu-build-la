/**
 * Shared, React.cache-memoized data loaders for build-time constants.
 *
 * React.cache deduplicates calls with identical arguments within a single
 * React render tree — including across layout.tsx and its child page.tsx,
 * because they share one React render pass per route.
 *
 * This means: even if layout.tsx and page.tsx both call getSiteSettings(),
 * only one DB query is issued per route during static generation.
 *
 * All functions here are intentionally thin wrappers. The cache boundary is
 * at this module level so every importer shares the same memoized function
 * instance within a render.
 */

import { cache } from "react";
import { prisma } from "@/lib/prisma";

const _publishedServicesQuery = () =>
  prisma.servicePage.findMany({ where: { status: "published" }, orderBy: { createdAt: "asc" } });
export type PublishedService = Awaited<ReturnType<typeof _publishedServicesQuery>>[number];

/**
 * Fetches the single SiteSettings row.
 * Deduplicated across layout + page for every route.
 */
export const getSiteSettings = cache(async () => {
  return prisma.siteSettings.findFirst().catch(() => null);
});

/**
 * Fetches all published service pages (ordered by creation).
 * Used in sidebars, nav, and related-links sections across many routes.
 * Deduplicated — each unique call site within one render gets the cached result.
 */
export const getPublishedServices = cache(async (): Promise<PublishedService[]> => {
  return prisma.servicePage
    .findMany({
      where: { status: "published" },
      orderBy: { createdAt: "asc" },
    })
    .catch(() => [] as PublishedService[]);
});
