export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbs(items: BreadcrumbItem[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}
