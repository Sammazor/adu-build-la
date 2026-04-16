"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CharCount } from "@/components/admin/ui/CharCount";
import { cn } from "@/lib/utils";

interface SeoPanelProps {
  slug?: string;
  defaults?: {
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageUrl?: string;
    indexPage?: boolean;
    primaryKeyword?: string;
  };
  errors?: Record<string, string[]>;
  // Lifted state callbacks so PostForm can track values for readiness checks
  onSeoTitleChange?: (val: string) => void;
  onSeoDescChange?: (val: string) => void;
  onPrimaryKeywordChange?: (val: string) => void;
}

function truncateTitle(t: string) {
  if (t.length <= 60) return { text: t, truncated: false };
  return { text: t.slice(0, 57) + "…", truncated: true };
}

function truncateDesc(d: string) {
  if (d.length <= 155) return { text: d, truncated: false };
  return { text: d.slice(0, 152) + "…", truncated: true };
}

export function SeoPanel({
  slug,
  defaults = {},
  errors = {},
  onSeoTitleChange,
  onSeoDescChange,
  onPrimaryKeywordChange,
}: SeoPanelProps) {
  const [open, setOpen] = useState(true);
  const [seoTitle, setSeoTitle] = useState(defaults.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(defaults.seoDescription ?? "");
  const [primaryKeyword, setPrimaryKeyword] = useState(defaults.primaryKeyword ?? "");
  const [ogOpen, setOgOpen] = useState(false);

  const titleDisplay = truncateTitle(seoTitle || "Your page title will appear here");
  const descDisplay = truncateDesc(
    seoDesc || "Your meta description will appear here. Write 120–165 characters to give searchers a clear preview of your page."
  );
  const isFilled = seoTitle.length >= 50 && seoDesc.length >= 120;
  const hasIssues = seoTitle.length > 0 && (seoTitle.length < 50 || seoTitle.length > 70)
    || seoDesc.length > 0 && (seoDesc.length < 120 || seoDesc.length > 165);

  const serpSlug = slug || "your-post-slug";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <div className="flex items-center gap-2">
          <span>SEO Settings</span>
          {isFilled ? (
            <span className="text-xs text-green-600 font-normal">✓ complete</span>
          ) : hasIssues ? (
            <span className="text-xs text-red-500 font-normal">needs attention</span>
          ) : (
            <span className="text-xs text-amber-600 font-normal">incomplete</span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-white">

          {/* Primary keyword */}
          <div>
            <label htmlFor="primaryKeyword" className="block text-xs font-medium text-gray-600 mb-1">
              Primary Keyword{" "}
              <span className="text-gray-400 font-normal">(the phrase this page targets in search)</span>
            </label>
            <input
              id="primaryKeyword"
              name="primaryKeyword"
              type="text"
              value={primaryKeyword}
              onChange={(e) => {
                setPrimaryKeyword(e.target.value);
                onPrimaryKeywordChange?.(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              placeholder="e.g. ADU cost Los Angeles"
            />
          </div>

          {/* SEO Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="seoTitle" className="text-xs font-medium text-gray-600">
                SEO Title
              </label>
              <CharCount current={seoTitle.length} min={50} max={70} />
            </div>
            <input
              id="seoTitle"
              name="seoTitle"
              type="text"
              value={seoTitle}
              onChange={(e) => {
                setSeoTitle(e.target.value);
                onSeoTitleChange?.(e.target.value);
              }}
              maxLength={80}
              className={cn(
                "w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent",
                errors.seoTitle ? "border-red-400" : "border-gray-300"
              )}
              placeholder="Page title for Google (50–70 chars)"
            />
            {errors.seoTitle && (
              <p className="text-xs text-red-500 mt-1">{errors.seoTitle[0]}</p>
            )}
          </div>

          {/* SEO Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="seoDescription" className="text-xs font-medium text-gray-600">
                Meta Description
              </label>
              <CharCount current={seoDesc.length} min={120} max={165} />
            </div>
            <textarea
              id="seoDescription"
              name="seoDescription"
              value={seoDesc}
              onChange={(e) => {
                setSeoDesc(e.target.value);
                onSeoDescChange?.(e.target.value);
              }}
              rows={3}
              maxLength={175}
              className={cn(
                "w-full px-3 py-2 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none",
                errors.seoDescription ? "border-red-400" : "border-gray-300"
              )}
              placeholder="Meta description for search results (120–165 chars)"
            />
            {errors.seoDescription && (
              <p className="text-xs text-red-500 mt-1">{errors.seoDescription[0]}</p>
            )}
          </div>

          {/* SERP Preview */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2.5">Google Preview</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-4 h-4 rounded-full bg-gray-300 shrink-0" />
                <span>adubuildla.com</span>
                <span className="text-gray-400">›</span>
                <span className="text-gray-400 truncate">blog › {serpSlug}</span>
              </div>
              <p className={cn(
                "text-base font-medium leading-snug",
                seoTitle ? (titleDisplay.truncated ? "text-red-600" : "text-blue-700") : "text-gray-300"
              )}>
                {titleDisplay.text}
                {titleDisplay.truncated && (
                  <span className="text-xs text-red-500 font-normal ml-1">(truncated)</span>
                )}
              </p>
              <p className={cn("text-xs leading-relaxed", seoDesc ? (descDisplay.truncated ? "text-amber-600" : "text-gray-600") : "text-gray-300")}>
                {descDisplay.text}
                {descDisplay.truncated && (
                  <span className="text-xs text-amber-500 font-normal ml-1">(truncated)</span>
                )}
              </p>
            </div>
          </div>

          {/* Canonical URL */}
          <div>
            <label htmlFor="canonicalUrl" className="block text-xs font-medium text-gray-600 mb-1">
              Canonical URL{" "}
              <span className="text-gray-400 font-normal">(leave blank — defaults to /blog/{serpSlug})</span>
            </label>
            <input
              id="canonicalUrl"
              name="canonicalUrl"
              type="text"
              defaultValue={defaults.canonicalUrl ?? ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              placeholder="/blog/my-post"
            />
          </div>

          {/* Index toggle */}
          <div className="flex items-center gap-3">
            <input
              id="indexPage"
              name="indexPage"
              type="checkbox"
              defaultChecked={defaults.indexPage !== false}
              className="w-4 h-4 rounded border-gray-300 text-stone-900 focus:ring-stone-500"
            />
            <label htmlFor="indexPage" className="text-xs font-medium text-gray-700">
              Allow search engines to index this page
            </label>
          </div>

          {/* OG fields — collapsed */}
          <div className="border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => setOgOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {ogOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              Social / Open Graph overrides{" "}
              <span className="text-gray-300">(optional — defaults to SEO fields above)</span>
            </button>

            {ogOpen && (
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="ogTitle" className="block text-xs font-medium text-gray-600 mb-1">
                    OG Title <span className="text-gray-400 font-normal">(defaults to SEO title)</span>
                  </label>
                  <input
                    id="ogTitle"
                    name="ogTitle"
                    type="text"
                    defaultValue={defaults.ogTitle ?? ""}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="Social share title"
                  />
                </div>
                <div>
                  <label htmlFor="ogDescription" className="block text-xs font-medium text-gray-600 mb-1">
                    OG Description <span className="text-gray-400 font-normal">(defaults to meta description)</span>
                  </label>
                  <textarea
                    id="ogDescription"
                    name="ogDescription"
                    rows={2}
                    defaultValue={defaults.ogDescription ?? ""}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none"
                    placeholder="Social share description"
                  />
                </div>
                <div>
                  <label htmlFor="ogImageUrl" className="block text-xs font-medium text-gray-600 mb-1">
                    OG Image URL
                  </label>
                  <input
                    id="ogImageUrl"
                    name="ogImageUrl"
                    type="text"
                    defaultValue={defaults.ogImageUrl ?? ""}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    placeholder="https://… or /og-image.jpg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
