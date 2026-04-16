/**
 * Sanitization utilities.
 *
 * The rich text stored in the database is user-supplied markdown.
 * RichTextSection.tsx already escapes HTML entities BEFORE processing markdown,
 * which is the correct approach. This module provides:
 *
 * 1. stripHtml — removes all HTML tags from a string (for plain-text contexts)
 * 2. sanitizeMarkdown — strips dangerous patterns from markdown before storage
 * 3. assertSafeRedirect — prevents open redirects in callbackUrl parameters
 */

/**
 * Remove all HTML tags from a string.
 * Used when displaying user content in contexts that don't expect markup.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Sanitize markdown before persisting to the database.
 * Removes patterns that could cause harm if the escaping in the renderer
 * were ever bypassed:
 *  - <script> blocks
 *  - javascript: URIs in links
 *  - data: URIs
 *  - on* event attributes (e.g. in raw HTML embeds)
 */
export function sanitizeMarkdown(md: string): string {
  return md
    // Remove <script> blocks (including content)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove javascript: and data: URIs in markdown links [text](javascript:...)
    .replace(/\]\s*\(\s*(?:javascript|data|vbscript):/gi, "](https://invalid-removed")
    // Remove HTML event handlers in any inline HTML
    .replace(/\bon\w+\s*=/gi, "data-removed=")
    // Remove <iframe>, <object>, <embed>, <form> tags
    .replace(/<\s*\/?\s*(?:iframe|object|embed|form|base)\b[^>]*>/gi, "");
}

/**
 * Validate that a redirect target is safe (same-origin only).
 * Returns /admin as the fallback if the URL is external or otherwise invalid.
 */
export function assertSafeRedirect(
  url: string | null | undefined,
  fallback = "/admin"
): string {
  if (!url) return fallback;

  try {
    // Relative URLs (starting with /) are safe
    if (url.startsWith("/") && !url.startsWith("//")) {
      // Disallow path traversal tricks
      const normalized = new URL(url, "https://placeholder.internal").pathname;
      return normalized || fallback;
    }
    // Absolute URLs must match the app's own origin — reject everything else
    return fallback;
  } catch {
    return fallback;
  }
}
