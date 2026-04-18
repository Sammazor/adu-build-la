export const SITE_PAGES = [
  { key: "homepage",        label: "Homepage",                path: "/" },
  { key: "services-index",  label: "Services Index",          path: "/services" },
  { key: "locations-index", label: "Locations Index",         path: "/locations" },
  { key: "contact",         label: "Contact",                 path: "/contact" },
  { key: "estimate",        label: "Get an Estimate",         path: "/estimate" },
  { key: "build-your-adu",  label: "Build Your ADU (Wizard)", path: "/build-your-adu" },
  { key: "projects",        label: "Projects Portfolio",      path: "/projects" },
  { key: "adu-models",      label: "ADU Models / Floor Plans", path: "/adu-models" },
] as const;

export type SitePageKey = typeof SITE_PAGES[number]["key"];
