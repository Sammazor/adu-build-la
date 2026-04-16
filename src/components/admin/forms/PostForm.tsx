"use client";

import { useActionState, useEffect, useState, useCallback } from "react";
import { createPost, updatePost } from "@/lib/actions/posts";
import { SeoPanel } from "@/components/admin/seo/SeoPanel";
import { CharCount } from "@/components/admin/ui/CharCount";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/utils/slugify";
import { computeWordCount, computeReadingTime } from "@/lib/utils/reading-time";
import {
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Eye,
  FileText,
  Search,
  BookOpen,
} from "lucide-react";
import type { Post, Author } from "@prisma/client";

interface PostFormProps {
  post?: Post & { author: Author };
  authors: Author[];
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "Send for Review" },
  { value: "published", label: "Publish" },
  { value: "archived", label: "Archive" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  review: "bg-yellow-50 text-yellow-700 border-yellow-200",
  published: "bg-green-50 text-green-700 border-green-200",
  archived: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  review: "In Review",
  published: "Published",
  archived: "Archived",
};

interface FaqItem {
  q: string;
  a: string;
}

const initialState = { success: false, errors: undefined };

const MARKDOWN_GUIDE = `**Bold**  _Italic_  [Link text](url)
## H2 heading  ### H3 heading
- Bullet list  1. Numbered list
> Blockquote  \`inline code\`
---  (horizontal rule)`;

// ─── Publish readiness checker ────────────────────────────────────────────────

interface ReadinessItem {
  key: string;
  label: string;
  done: boolean;
  critical: boolean;
}

function useReadinessChecks(
  title: string,
  body: string,
  excerpt: string,
  seoTitle: string,
  seoDesc: string,
  primaryKeyword: string,
  faqCount: number,
  wordCount: number
): ReadinessItem[] {
  return [
    { key: "title", label: "Title written", done: title.trim().length >= 5, critical: true },
    { key: "body", label: `Content ≥ 900 words (${wordCount})`, done: wordCount >= 900, critical: true },
    { key: "seo-title", label: "SEO title set (50–70 chars)", done: seoTitle.length >= 50 && seoTitle.length <= 70, critical: true },
    { key: "seo-desc", label: "Meta description set (120–165 chars)", done: seoDesc.length >= 120 && seoDesc.length <= 165, critical: true },
    { key: "keyword", label: "Primary keyword set", done: primaryKeyword.trim().length > 0, critical: false },
    { key: "excerpt", label: "Excerpt written", done: excerpt.trim().length > 0, critical: false },
    { key: "faq", label: "FAQs added", done: faqCount > 0, critical: false },
  ];
}

function ReadinessPanel({
  checks,
  currentStatus,
}: {
  checks: ReadinessItem[];
  currentStatus: string;
}) {
  const criticalDone = checks.filter((c) => c.critical && c.done).length;
  const criticalTotal = checks.filter((c) => c.critical).length;
  const allDone = checks.filter((c) => c.done).length;
  const allTotal = checks.length;
  const isPublishReady = criticalDone === criticalTotal;
  const pct = Math.round((allDone / allTotal) * 100);

  if (currentStatus === "published") return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Publish Readiness</span>
        <span className={cn("text-xs font-medium", isPublishReady ? "text-green-600" : "text-amber-600")}>
          {pct}%
        </span>
      </div>
      <div className="px-4 pt-3 pb-1">
        <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", isPublishReady ? "bg-green-500" : "bg-amber-400")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="px-4 pb-4 space-y-1.5">
        {checks.map((c) => (
          <li key={c.key} className="flex items-center gap-2">
            {c.done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
            ) : c.critical ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 shrink-0" />
            )}
            <span className={cn("text-xs", c.done ? "text-gray-500 line-through" : c.critical ? "text-red-600 font-medium" : "text-gray-500")}>
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PostForm({ post, authors }: PostFormProps) {
  const isEditing = !!post;

  const [state, formAction, isPending] = useActionState(
    isEditing ? updatePost : createPost,
    initialState
  );

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [body, setBody] = useState(() => {
    if (!post?.sections) return "";
    const sections = post.sections as Array<{ type: string; content?: string }>;
    const rt = sections.find((s) => s.type === "rich_text");
    return (rt as { type: string; content?: string })?.content ?? "";
  });
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [showMdGuide, setShowMdGuide] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // SEO field state (lifted from SeoPanel so readiness checks can see them)
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(post?.seoDescription ?? "");
  const [primaryKeyword, setPrimaryKeyword] = useState(post?.primaryKeyword ?? "");

  // FAQ items state
  const [faqItems, setFaqItems] = useState<FaqItem[]>(() => {
    if (!post?.sections) return [];
    const sections = post.sections as unknown as Array<{ type: string; items?: FaqItem[] }>;
    const faqSection = sections.find((s) => s.type === "faq_list");
    return faqSection?.items ?? [];
  });

  const wordCount = computeWordCount(body);
  const readingTime = computeReadingTime(wordCount);
  const currentStatus = post?.status ?? "draft";

  const readinessChecks = useReadinessChecks(
    title, body, excerpt, seoTitle, seoDesc, primaryKeyword, faqItems.length, wordCount
  );

  // Word count color
  const wordCountColor =
    wordCount === 0 ? "text-gray-400"
    : wordCount < 600 ? "text-red-500"
    : wordCount < 900 ? "text-amber-500"
    : "text-green-600";

  // Auto-generate slug
  useEffect(() => {
    if (!slugTouched && !isEditing && title) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched, isEditing]);

  // Dirty tracking
  const markDirty = useCallback(() => setIsDirty(true), []);

  // Warn on nav away with unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Clear dirty on successful save
  useEffect(() => {
    if (state.success) setIsDirty(false);
  }, [state.success]);

  function fieldError(field: string) {
    return state.errors?.[field]?.[0] ?? null;
  }

  function addFaqItem() {
    setFaqItems((prev) => [...prev, { q: "", a: "" }]);
    markDirty();
  }

  function removeFaqItem(index: number) {
    setFaqItems((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  }

  function updateFaqItem(index: number, field: "q" | "a", value: string) {
    setFaqItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    markDirty();
  }

  // Keyword density helper
  const keywordInBody = primaryKeyword.trim()
    ? body.toLowerCase().split(primaryKeyword.toLowerCase().trim()).length - 1
    : 0;
  const keywordDensity = wordCount > 0 && primaryKeyword.trim()
    ? ((keywordInBody / wordCount) * 100).toFixed(1)
    : null;

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      onChange={markDirty}
    >
      {isEditing && <input type="hidden" name="postId" value={post.id} />}
      <input type="hidden" name="faqItems" value={JSON.stringify(faqItems)} />

      {/* ── Left: main content (2/3) ──────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-5">

        {/* Title */}
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Title (H1) <span className="text-red-500">*</span>
          </label>
          <input
            id="post-title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => { setTitle(e.target.value); markDirty(); }}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition",
              fieldError("title") ? "border-red-400" : "border-gray-300"
            )}
            placeholder="How Much Does an ADU Cost in Los Angeles?"
          />
          {fieldError("title") && (
            <p className="text-xs text-red-500 mt-1">{fieldError("title")}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="post-slug" className="block text-sm font-medium text-gray-700 mb-1.5">
            URL Slug
          </label>
          <div className="flex items-center">
            <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-xs text-gray-500 whitespace-nowrap">
              /blog/
            </span>
            <input
              id="post-slug"
              name="slug"
              type="text"
              value={slug}
              readOnly={isEditing}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={cn(
                "flex-1 px-3.5 py-2.5 rounded-r-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition",
                isEditing ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white",
                fieldError("slug") ? "border-red-400" : "border-gray-300"
              )}
              placeholder="my-blog-post-slug"
            />
          </div>
          {isEditing ? (
            <p className="text-xs text-gray-400 mt-1">Slug is locked after creation to preserve URLs.</p>
          ) : (
            slug && <p className="text-xs text-gray-400 mt-1">Full URL: <span className="font-mono">/blog/{slug}</span></p>
          )}
          {fieldError("slug") && (
            <p className="text-xs text-red-500 mt-1">{fieldError("slug")}</p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="post-excerpt" className="text-sm font-medium text-gray-700">
              Excerpt{" "}
              <span className="text-gray-400 font-normal text-xs">(shown on blog index and in social shares)</span>
            </label>
            <CharCount current={excerpt.length} max={300} />
          </div>
          <textarea
            id="post-excerpt"
            name="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => { setExcerpt(e.target.value); markDirty(); }}
            maxLength={300}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none transition"
            placeholder="1–2 sentence summary. This appears on the blog index and may be used for meta description if left blank above."
          />
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="post-image" className="block text-sm font-medium text-gray-700 mb-1.5">
            Featured Image URL
          </label>
          <input
            id="post-image"
            name="featuredImageUrl"
            type="text"
            defaultValue={post?.featuredImageUrl ?? ""}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition"
            placeholder="https://… (paste URL after uploading via Media)"
          />
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <label htmlFor="post-body" className="text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowMdGuide((v) => !v)}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5 transition-colors"
                title="Markdown quick reference"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                MD
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("text-xs font-medium tabular-nums", wordCountColor)}>
                {wordCount.toLocaleString()} words · ~{readingTime} min
                {wordCount > 0 && wordCount < 900 && (
                  <span className="ml-1 opacity-70">(target: 900+)</span>
                )}
                {wordCount >= 900 && <span className="ml-1">✓</span>}
              </span>
              {keywordDensity !== null && (
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    parseFloat(keywordDensity) < 0.5 || parseFloat(keywordDensity) > 3
                      ? "text-amber-500"
                      : "text-green-600"
                  )}
                  title="Keyword density"
                >
                  KD: {keywordDensity}%
                </span>
              )}
            </div>
          </div>

          {showMdGuide && (
            <div className="mb-2 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 whitespace-pre-line leading-relaxed">
              {MARKDOWN_GUIDE}
            </div>
          )}

          <textarea
            id="post-body"
            name="body"
            rows={32}
            required
            value={body}
            onChange={(e) => { setBody(e.target.value); markDirty(); }}
            className={cn(
              "w-full px-3.5 py-3 rounded-lg border text-sm text-gray-900 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-y transition",
              fieldError("body") ? "border-red-400" : "border-gray-300"
            )}
            placeholder={`Write your article in Markdown…\n\n## Section Heading\n\nYour paragraph content here.\n\n- Bullet point\n- Another point\n\n## Another Section\n\nMore content…`}
          />
          {fieldError("body") && (
            <p className="text-xs text-red-500 mt-1">{fieldError("body")}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Markdown supported. ## and ### headings auto-generate the table of contents on the public page.
          </p>
        </div>

        {/* FAQ Editor */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">FAQ Section</span>
              <span className="text-xs text-gray-400">
                {faqItems.length === 0
                  ? "None — add up to 8"
                  : `${faqItems.length} Q&A pair${faqItems.length !== 1 ? "s" : ""}`}
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline">· improves SEO &amp; structured data</span>
            </div>
            {faqItems.length < 8 && (
              <button
                type="button"
                onClick={addFaqItem}
                className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-stone-900 px-2.5 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Q&amp;A
              </button>
            )}
          </div>

          <div className="p-4 space-y-4 bg-white">
            {faqItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No FAQs yet. FAQs appear at the bottom of the article and are included in Google&apos;s FAQ rich results.
              </p>
            ) : (
              faqItems.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3.5 space-y-2.5 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">FAQ {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(i)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                      title="Remove this FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                    <input
                      type="text"
                      value={item.q}
                      onChange={(e) => updateFaqItem(i, "q", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition bg-white"
                      placeholder="What does an ADU cost in Los Angeles?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                    <textarea
                      rows={3}
                      value={item.a}
                      onChange={(e) => updateFaqItem(i, "a", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent resize-none transition bg-white"
                      placeholder="A complete, factual answer…"
                    />
                  </div>
                </div>
              ))
            )}

            {faqItems.length > 0 && faqItems.length < 8 && (
              <button
                type="button"
                onClick={addFaqItem}
                className="w-full py-2.5 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another Q&amp;A
              </button>
            )}
          </div>
        </div>

        {/* SEO Panel */}
        <SeoPanel
          slug={slug}
          defaults={{
            seoTitle: seoTitle || undefined,
            seoDescription: seoDesc || undefined,
            canonicalUrl: post?.canonicalUrl ?? undefined,
            ogTitle: post?.ogTitle ?? undefined,
            ogDescription: post?.ogDescription ?? undefined,
            ogImageUrl: post?.ogImageUrl ?? undefined,
            indexPage: post?.indexPage ?? true,
            primaryKeyword: primaryKeyword || undefined,
          }}
          errors={state.errors}
          onSeoTitleChange={setSeoTitle}
          onSeoDescChange={setSeoDesc}
          onPrimaryKeywordChange={setPrimaryKeyword}
        />

        {/* Save feedback */}
        {state.errors && !state.success && Object.keys(state.errors).length > 0 && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            Please fix the errors above before saving.
          </div>
        )}

        {state.success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Saved successfully.
          </div>
        )}
      </div>

      {/* ── Right: sidebar (1/3) ──────────────────────────────────────────── */}
      <div className="space-y-4">

        {/* Publish panel */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className={cn("px-4 py-3 border-b border-gray-100 flex items-center justify-between", STATUS_COLORS[currentStatus] || STATUS_COLORS.draft)}>
            <span className="text-xs font-semibold uppercase tracking-wide">
              {STATUS_LABELS[currentStatus] ?? currentStatus}
            </span>
            {post?.publishedAt && currentStatus === "published" && (
              <span className="text-xs opacity-70">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="p-4 space-y-3.5">
            {/* Status */}
            <div>
              <label htmlFor="post-status" className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                id="post-status"
                name="status"
                defaultValue={post?.status ?? "draft"}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label htmlFor="post-author" className="block text-xs font-medium text-gray-600 mb-1">
                Author
              </label>
              <select
                id="post-author"
                name="authorId"
                defaultValue={post?.authorId ?? authors[0]?.id ?? ""}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheduled publish date */}
            <div>
              <label htmlFor="post-scheduled" className="block text-xs font-medium text-gray-600 mb-1">
                Schedule Publish
              </label>
              <input
                id="post-scheduled"
                name="scheduledAt"
                type="datetime-local"
                defaultValue={
                  post?.scheduledAt
                    ? new Date(post.scheduledAt).toISOString().slice(0, 16)
                    : ""
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
            </div>

            {/* Save / dirty indicator */}
            <div className="space-y-2 pt-0.5">
              {isDirty && !isPending && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Unsaved changes
                </p>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isPending ? "Saving…" : isEditing ? "Save Changes" : "Create Post"}
              </button>

              {post?.status === "published" && post.fullPath && (
                <a
                  href={post.fullPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:text-stone-900 hover:border-gray-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Live Post
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Readiness panel */}
        <ReadinessPanel checks={readinessChecks} currentStatus={currentStatus} />

        {/* Stats card */}
        {post && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <p className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Content Stats</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-500"><FileText className="w-3.5 h-3.5" /> Words</span>
                <span className={cn("font-medium tabular-nums",
                  post.wordCount >= 900 ? "text-green-600"
                  : post.wordCount >= 600 ? "text-amber-500"
                  : post.wordCount > 0 ? "text-red-400"
                  : "text-gray-400"
                )}>
                  {post.wordCount > 0 ? post.wordCount.toLocaleString() : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-500"><Eye className="w-3.5 h-3.5" /> Reading time</span>
                <span className="font-medium text-gray-700">
                  {post.readingTimeMinutes > 0 ? `~${post.readingTimeMinutes} min` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-500"><Search className="w-3.5 h-3.5" /> Keyword</span>
                <span className="font-medium text-gray-700 text-right max-w-[110px] truncate">
                  {post.primaryKeyword || "—"}
                </span>
              </div>
              {post.publishedAt && (
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-1">
                  <span className="text-gray-500">Published</span>
                  <span className="font-medium text-gray-700">{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Last saved</span>
                <span className="font-medium text-gray-700">{new Date(post.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
