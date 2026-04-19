import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllLocations } from "@/lib/data/locations";
import { getAllModels } from "@/lib/data/aduModels";
import { getAllProjects } from "@/lib/data/projects";
import { getAllServiceLocationPages } from "@/lib/data/serviceLocationPages";

const FALLBACK_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let siteUrl = FALLBACK_URL;
  let services: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; updatedAt: Date; publishedAt: Date | null }[] = [];
  let cmsPages: { slug: string; updatedAt: Date }[] = [];

  try {
    const settings = await prisma.siteSettings.findFirst();
    siteUrl = settings?.siteUrl ?? FALLBACK_URL;

    services = await prisma.servicePage.findMany({
      where: { status: "published", indexPage: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    posts = await prisma.post.findMany({
      where: { status: "published", indexPage: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    cmsPages = await prisma.page.findMany({
      where: { status: "published", indexPage: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    // DB not available at build time — static pages still included
  }

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/adu-models`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/estimate`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/build-your-adu`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/build-your-custom-adu`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = (await getAllLocations()).map((loc) => ({
    url: `${siteUrl}${loc.fullPath}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const modelPages: MetadataRoute.Sitemap = (await getAllModels()).map((m) => ({
    url: `${siteUrl}${m.fullPath}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectPages: MetadataRoute.Sitemap = (await getAllProjects()).map((p) => ({
    url: `${siteUrl}${p.fullPath}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cmsPageEntries: MetadataRoute.Sitemap = cmsPages.map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const serviceLocationPages: MetadataRoute.Sitemap = (await getAllServiceLocationPages()).map((p) => ({
    url: `${siteUrl}${p.fullPath}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...locationPages,
    ...serviceLocationPages,
    ...modelPages,
    ...projectPages,
    ...postPages,
    ...cmsPageEntries,
  ];
}
