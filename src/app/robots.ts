import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch {
    // DB not available at build time
  }

  const siteUrl =
    settings?.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://adubuildla.com";

  // If noindex is enabled in settings, disallow all crawling
  if (settings?.noindexSite) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/_next/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
