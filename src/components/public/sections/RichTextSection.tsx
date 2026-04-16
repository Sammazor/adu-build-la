import type { RichTextSection as RichTextSectionType } from "@/types/sections";

/** Convert heading text to a URL-safe id (matches extractTocItems logic). */
function hid(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Markdown-to-HTML converter for article body content.
 * Handles: headings, bold, italic, links, bullet lists, ordered lists,
 *          blockquotes, tables, horizontal rules, inline code, paragraphs.
 *
 * Security: HTML special characters are escaped before any pattern replacement.
 */
function markdownToHtml(md: string): string {
  let html = md
    // ── Security: escape HTML ───────────────────────────────────────────────
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // ── Tables ──────────────────────────────────────────────────────────────
    .replace(
      /^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm,
      (_, header, rows) => {
        const headers = header
          .split("|")
          .map((h: string) => `<th>${h.trim()}</th>`)
          .join("");
        const bodyRows = rows
          .trim()
          .split("\n")
          .map((row: string) => {
            const cells = row
              .split("|")
              .filter(Boolean)
              .map((c: string) => `<td>${c.trim()}</td>`)
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");
        return `<div class="overflow-x-auto my-6"><table><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
      }
    )

    // ── Blockquotes ─────────────────────────────────────────────────────────
    .replace(/((?:^&gt; .+\n?)+)/gm, (match) => {
      const content = match
        .trim()
        .split("\n")
        .map((line) => line.replace(/^&gt; /, ""))
        .join(" ");
      return `<blockquote>${content}</blockquote>`;
    })

    // ── Headings (with id anchors for TOC) ──────────────────────────────────
    .replace(/^### (.+)$/gm, (_, t) => `<h3 id="${hid(t)}">${t}</h3>`)
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${hid(t)}">${t}</h2>`)
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")

    // ── Horizontal rule ──────────────────────────────────────────────────────
    .replace(/^---$/gm, "<hr />")

    // ── Inline formatting ────────────────────────────────────────────────────
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")

    // ── Links ────────────────────────────────────────────────────────────────
    // Must run after bold/italic to avoid conflict with * in URLs
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // ── Bullet lists ─────────────────────────────────────────────────────────
  html = html.replace(/((?:^- .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  // ── Ordered lists ────────────────────────────────────────────────────────
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  });

  // ── Paragraphs ───────────────────────────────────────────────────────────
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed; // already a block element
      return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  return html;
}

interface RichTextSectionProps {
  section: RichTextSectionType;
}

export function RichTextSection({ section }: RichTextSectionProps) {
  const html = markdownToHtml(section.content);
  return (
    <div
      className="prose-custom max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
