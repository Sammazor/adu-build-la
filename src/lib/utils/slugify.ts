/**
 * Convert a string to a URL-safe slug.
 * Lowercase, hyphenated, strips special chars, trims leading/trailing hyphens.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Compute the full URL path for a content record.
 * e.g. computeFullPath("blog", "my-post") → "/blog/my-post"
 */
export function computeFullPath(base: string, slug: string): string {
  const cleanBase = base.startsWith("/") ? base : `/${base}`;
  return `${cleanBase}/${slug}`;
}
