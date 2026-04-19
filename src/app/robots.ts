import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch {
    // DB not available at build time
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const dbUrl = settings?.siteUrl;
  const siteUrl =
    (envUrl && !envUrl.includes("localhost") ? envUrl : null) ??
    (dbUrl && !dbUrl.includes("localhost") ? dbUrl : null) ??
    "https://www.adubuildlosangeles.com";

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
        disallow: ["/admin/", "/api/", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
