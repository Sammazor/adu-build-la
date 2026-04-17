import type { SiteSettings } from "@/types/prisma-app";

export function buildLocalBusinessSchema(settings: SiteSettings) {
  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://adubuildla.com";
  const serviceAreas = settings.serviceAreaText
    ? settings.serviceAreaText.split(",").map((c) => ({
        "@type": "City",
        name: c.trim(),
      }))
    : [{ "@type": "City", name: "Los Angeles" }];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: settings.siteName,
    description:
      "ADU design and construction specialists in Los Angeles. Custom ADUs starting from $150,000. Design, permitting, and full build services across LA County.",
    url: siteUrl,
    ...(settings.businessPhone && { telephone: settings.businessPhone }),
    ...(settings.businessEmail && { email: settings.businessEmail }),
    ...(settings.priceRange && { priceRange: settings.priceRange }),
    address: {
      "@type": "PostalAddress",
      ...(settings.businessAddress && { streetAddress: settings.businessAddress }),
      addressLocality: settings.businessCity ?? "Los Angeles",
      addressRegion: settings.businessState ?? "CA",
      ...(settings.businessZip && { postalCode: settings.businessZip }),
      addressCountry: "US",
    },
    areaServed: serviceAreas,
    ...(settings.businessHours && {
      openingHours: settings.businessHours,
    }),
  };
}

export function buildWebsiteSchema(siteUrl: string, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
