export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

/**
 * Extracts H2/H3 headings from a markdown string and returns TOC items.
 * IDs are derived from heading text: lowercased, spaces → hyphens, special chars stripped.
 */
export function extractTocItems(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    if (h2) {
      items.push({ id: headingToId(h2[1]), label: h2[1], level: 2 });
    } else if (h3) {
      items.push({ id: headingToId(h3[1]), label: h3[1], level: 3 });
    }
  }
  return items;
}

function headingToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
