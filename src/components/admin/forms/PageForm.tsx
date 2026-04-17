"use client";

import { useActionState, useState, useCallback } from "react";
import { createPage, updatePage, type PageActionState } from "@/lib/actions/pages";
import { SeoPanel } from "@/components/admin/seo/SeoPanel";
import { slugify } from "@/lib/utils/slugify";
import {
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import type { Page } from "@/types/prisma-app";

// ── Types ─────────────────────────────────────────────────────────────────────

type SectionType = "rich_text" | "intro" | "cta" | "faq_list";

interface RichTextSection {
  type: "rich_text";
  content: string;
}
interface IntroSection {
  type: "intro";
  heading: string;
  body: string;
}
interface CtaSection {
  type: "cta";
  heading: string;
  subheading?: string;
  primary_label: string;
  primary_url: string;
  secondary_label?: string;
  secondary_url?: string;
  background?: "dark" | "light" | "brand";
}
interface FaqItem {
  q: string;
  a: string;
}
interface FaqListSection {
  type: "faq_list";
  items: FaqItem[];
}

type PageSection = RichTextSection | IntroSection | CtaSection | FaqListSection;

function defaultSection(type: SectionType): PageSection {
  switch (type) {
    case "rich_text":
      return { type: "rich_text", content: "" };
    case "intro":
      return { type: "intro", heading: "", body: "" };
    case "cta":
      return { type: "cta", heading: "", primary_label: "Get a Free Estimate", primary_url: "/estimate", background: "dark" };
    case "faq_list":
      return { type: "faq_list", items: [{ q: "", a: "" }] };
  }
}

function parseSectionsFromPage(raw: unknown): PageSection[] {
  if (!Array.isArray(raw)) return [];
  const validTypes = new Set<SectionType>(["rich_text", "intro", "cta", "faq_list"]);
  return raw.filter(
    (item): item is PageSection =>
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      validTypes.has((item as { type: SectionType }).type)
  );
}

// ── Shared field component ────────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";

function Field({
  id, label, name, type = "text", value, onChange, onBlur, placeholder, note, error, rows, maxLength, readOnly,
}: {
  id: string; label: string; name?: string; type?: string;
  value?: string; onChange?: (v: string) => void; onBlur?: () => void;
  placeholder?: string; note?: string; error?: string; rows?: number; maxLength?: number; readOnly?: boolean;
}) {
  const border = error ? "border-red-400" : "border-gray-200";
  const cls = `${inputCls.replace("border-gray-200", border)}${readOnly ? " bg-gray-50 text-gray-500" : ""}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}
      {rows ? (
        <textarea
          id={id} name={name} rows={rows} value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder} maxLength={maxLength}
          readOnly={readOnly}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          id={id} name={name} type={type} value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onBlur={onBlur}
          placeholder={placeholder} maxLength={maxLength}
          readOnly={readOnly}
          className={cls}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Section editors ───────────────────────────────────────────────────────────

function RichTextEditor({
  section, onChange,
}: { section: RichTextSection; onChange: (s: RichTextSection) => void }) {
  return (
    <textarea
      rows={10}
      value={section.content}
      onChange={(e) => onChange({ ...section, content: e.target.value })}
      placeholder={"Write in Markdown:\n\n## Section heading\n\nBody paragraph text...\n\n- Bullet item\n- Another bullet\n\n> Blockquote"}
      className={`${inputCls} resize-y font-mono text-xs`}
    />
  );
}

function IntroEditor({
  section, onChange,
}: { section: IntroSection; onChange: (s: IntroSection) => void }) {
  return (
    <div className="space-y-3">
      <input
        value={section.heading}
        onChange={(e) => onChange({ ...section, heading: e.target.value })}
        placeholder="Section heading…"
        className={inputCls}
      />
      <textarea
        rows={5}
        value={section.body}
        onChange={(e) => onChange({ ...section, body: e.target.value })}
        placeholder={"Body text (supports Markdown):\n\nTwo or three paragraphs describing this topic...\n\n- Optional bullet\n- Another point"}
        className={`${inputCls} resize-none`}
      />
    </div>
  );
}

const BG_OPTIONS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "brand", label: "Brand (amber)" },
] as const;

function CtaEditor({
  section, onChange,
}: { section: CtaSection; onChange: (s: CtaSection) => void }) {
  return (
    <div className="space-y-3">
      <input
        value={section.heading}
        onChange={(e) => onChange({ ...section, heading: e.target.value })}
        placeholder="CTA heading…"
        className={inputCls}
      />
      <input
        value={section.subheading ?? ""}
        onChange={(e) => onChange({ ...section, subheading: e.target.value })}
        placeholder="Subheading (optional)…"
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={section.primary_label}
          onChange={(e) => onChange({ ...section, primary_label: e.target.value })}
          placeholder="Primary button label"
          className={inputCls}
        />
        <input
          value={section.primary_url}
          onChange={(e) => onChange({ ...section, primary_url: e.target.value })}
          placeholder="/estimate"
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          value={section.secondary_label ?? ""}
          onChange={(e) => onChange({ ...section, secondary_label: e.target.value })}
          placeholder="Secondary button label (optional)"
          className={inputCls}
        />
        <input
          value={section.secondary_url ?? ""}
          onChange={(e) => onChange({ ...section, secondary_url: e.target.value })}
          placeholder="/contact"
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 font-medium">Background:</label>
        {BG_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              name={`cta-bg-${section.heading.slice(0, 8)}`}
              value={opt.value}
              checked={(section.background ?? "dark") === opt.value}
              onChange={() => onChange({ ...section, background: opt.value })}
              className="w-3.5 h-3.5"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function FaqEditor({
  section, onChange,
}: { section: FaqListSection; onChange: (s: FaqListSection) => void }) {
  function updateItem(index: number, field: keyof FaqItem, value: string) {
    const items = section.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ ...section, items });
  }

  function addItem() {
    onChange({ ...section, items: [...section.items, { q: "", a: "" }] });
  }

  function removeItem(index: number) {
    onChange({ ...section, items: section.items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      {section.items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-500">FAQ {i + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              disabled={section.items.length === 1}
              className="text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            value={item.q}
            onChange={(e) => updateItem(i, "q", e.target.value)}
            placeholder="Question…"
            className={inputCls}
          />
          <textarea
            rows={3}
            value={item.a}
            onChange={(e) => updateItem(i, "a", e.target.value)}
            placeholder="Answer…"
            className={`${inputCls} resize-none`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-stone-700 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add FAQ
      </button>
    </div>
  );
}

// ── Section type labels ───────────────────────────────────────────────────────

const SECTION_LABELS: Record<SectionType, string> = {
  rich_text: "Rich Text",
  intro: "Intro Block",
  cta: "Call to Action",
  faq_list: "FAQ List",
};

const SECTION_COLORS: Record<SectionType, string> = {
  rich_text: "bg-blue-50 border-blue-200 text-blue-700",
  intro: "bg-green-50 border-green-200 text-green-700",
  cta: "bg-amber-50 border-amber-200 text-amber-700",
  faq_list: "bg-purple-50 border-purple-200 text-purple-700",
};

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({
  section,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  section: PageSection;
  index: number;
  total: number;
  onChange: (s: PageSection) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  const type = section.type as SectionType;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SECTION_COLORS[type]}`}>
          {SECTION_LABELS[type]}
        </span>
        <span className="text-xs text-gray-400 ml-1">#{index + 1}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
            title={open ? "Collapse" : "Expand"}
          >
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded text-gray-300 hover:text-red-500 transition-colors ml-1"
            title="Remove section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="p-4">
          {section.type === "rich_text" && (
            <RichTextEditor section={section} onChange={onChange as (s: RichTextSection) => void} />
          )}
          {section.type === "intro" && (
            <IntroEditor section={section} onChange={onChange as (s: IntroSection) => void} />
          )}
          {section.type === "cta" && (
            <CtaEditor section={section} onChange={onChange as (s: CtaSection) => void} />
          )}
          {section.type === "faq_list" && (
            <FaqEditor section={section} onChange={onChange as (s: FaqListSection) => void} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Add section bar ───────────────────────────────────────────────────────────

const ADD_OPTIONS: { type: SectionType; label: string; desc: string }[] = [
  { type: "rich_text", label: "Rich Text", desc: "Markdown content block" },
  { type: "intro", label: "Intro Block", desc: "Heading + body paragraph" },
  { type: "cta", label: "Call to Action", desc: "Button + heading block" },
  { type: "faq_list", label: "FAQ List", desc: "Question + answer pairs" },
];

function AddSectionBar({ onAdd }: { onAdd: (type: SectionType) => void }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-4">
      <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">Add section</p>
      <div className="flex flex-wrap gap-2">
        {ADD_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => onAdd(opt.type)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-stone-400 text-xs font-medium text-gray-700 hover:text-stone-900 transition-colors"
            title={opt.desc}
          >
            <Plus className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Status options ────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
] as const;

// ── Main form ─────────────────────────────────────────────────────────────────

const initialState: PageActionState = { success: false };

interface PageFormProps {
  page?: Page;
}

export function PageForm({ page }: PageFormProps) {
  const action = page ? updatePage : createPage;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!page);
  const [status, setStatus] = useState<string>(page?.status ?? "draft");
  const [sections, setSections] = useState<PageSection[]>(() =>
    parseSectionsFromPage(page?.sections)
  );

  // Hero fields
  const [heroHeading, setHeroHeading] = useState(page?.heroHeading ?? "");
  const [heroSubheading, setHeroSubheading] = useState(page?.heroSubheading ?? "");
  const [heroCtaPrimaryLabel, setHeroCtaPrimaryLabel] = useState(page?.heroCtaPrimaryLabel ?? "");
  const [heroCtaPrimaryUrl, setHeroCtaPrimaryUrl] = useState(page?.heroCtaPrimaryUrl ?? "");
  const [heroCtaSecondaryLabel, setHeroCtaSecondaryLabel] = useState(page?.heroCtaSecondaryLabel ?? "");
  const [heroCtaSecondaryUrl, setHeroCtaSecondaryUrl] = useState(page?.heroCtaSecondaryUrl ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(page?.heroImageUrl ?? "");

  function fe(field: string) {
    return state.errors?.[field]?.[0];
  }

  // Auto-slug from title on create
  const handleTitleChange = useCallback(
    (val: string) => {
      setTitle(val);
      if (!slugEdited) setSlug(slugify(val));
    },
    [slugEdited]
  );

  // Section management
  function addSection(type: SectionType) {
    setSections((prev) => [...prev, defaultSection(type)]);
  }

  function updateSection(index: number, section: PageSection) {
    setSections((prev) => prev.map((s, i) => (i === index ? section : s)));
  }

  function moveSection(index: number, dir: -1 | 1) {
    setSections((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  const sectionsJson = JSON.stringify(sections);

  return (
    <form action={formAction} className="space-y-6 mt-6">
      {page && <input type="hidden" name="pageId" value={page.id} />}

      {/* Sections JSON — submitted as hidden field; editors update state only */}
      <input type="hidden" name="sectionsJson" value={sectionsJson} />

      {state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Grid layout */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* ── Main column ───────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Basic info */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
              Page Info
            </h2>

            {/* Title */}
            <Field
              id="title" label="Page Title*" name="title"
              value={title} onChange={handleTitleChange}
              placeholder="About Us" error={fe("title")}
            />

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug*
              </label>
              <p className="text-xs text-gray-400 mb-1">
                Published at <span className="font-mono">/{slug || "…"}</span>
                {page && " — slug is locked after creation"}
              </p>
              {page ? (
                <>
                  <input type="hidden" name="slug" value={page.slug} />
                  <div className="px-3.5 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-500 font-mono">
                    /{page.slug}
                  </div>
                </>
              ) : (
                <input
                  id="slug" name="slug" type="text" value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                  placeholder="about-us"
                  className={`${inputCls} font-mono ${fe("slug") ? "border-red-400" : ""}`}
                />
              )}
              {fe("slug") && <p className="text-xs text-red-500 mt-1">{fe("slug")}</p>}
            </div>
          </section>

          {/* Hero */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
              Hero Section
              <span className="text-xs font-normal text-gray-400 ml-2">Optional — shown at top of page</span>
            </h2>
            <Field id="heroHeading" label="Heading" name="heroHeading"
              value={heroHeading} onChange={setHeroHeading}
              placeholder="About ADU Build LA" />
            <Field id="heroSubheading" label="Subheading" name="heroSubheading"
              value={heroSubheading} onChange={setHeroSubheading}
              placeholder="Los Angeles' trusted ADU design + build firm" rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <Field id="heroCtaPrimaryLabel" label="Primary Button Label" name="heroCtaPrimaryLabel"
                value={heroCtaPrimaryLabel} onChange={setHeroCtaPrimaryLabel}
                placeholder="Get a Free Estimate" />
              <Field id="heroCtaPrimaryUrl" label="Primary Button URL" name="heroCtaPrimaryUrl"
                value={heroCtaPrimaryUrl} onChange={setHeroCtaPrimaryUrl}
                placeholder="/estimate" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="heroCtaSecondaryLabel" label="Secondary Button Label" name="heroCtaSecondaryLabel"
                value={heroCtaSecondaryLabel} onChange={setHeroCtaSecondaryLabel}
                placeholder="View Our Work (optional)" />
              <Field id="heroCtaSecondaryUrl" label="Secondary Button URL" name="heroCtaSecondaryUrl"
                value={heroCtaSecondaryUrl} onChange={setHeroCtaSecondaryUrl}
                placeholder="/projects" />
            </div>
            <Field id="heroImageUrl" label="Hero Background Image URL" name="heroImageUrl"
              value={heroImageUrl} onChange={setHeroImageUrl}
              placeholder="https://… (paste from Media Library)"
              note="Optional background image. Recommended: 1920×800px." />
            {heroImageUrl && (
              <div className="flex items-center gap-2 mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImageUrl} alt="Hero preview" className="w-24 h-16 object-cover rounded-lg border border-gray-200" />
                <a href={heroImageUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700">
                  <ExternalLink className="w-3 h-3" /> Preview
                </a>
              </div>
            )}
          </section>

          {/* Sections builder */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Page Sections
                <span className="text-xs font-normal text-gray-400 ml-2">
                  {sections.length} section{sections.length !== 1 ? "s" : ""}
                </span>
              </h2>
            </div>

            {sections.map((section, index) => (
              <SectionCard
                key={index}
                section={section}
                index={index}
                total={sections.length}
                onChange={(s) => updateSection(index, s)}
                onMove={(dir) => moveSection(index, dir)}
                onRemove={() => removeSection(index)}
              />
            ))}

            <AddSectionBar onAdd={addSection} />
          </section>

          {/* SEO */}
          <SeoPanel
            slug={slug}
            defaults={{
              seoTitle: page?.seoTitle ?? undefined,
              seoDescription: page?.seoDescription ?? undefined,
              canonicalUrl: page?.canonicalUrl ?? undefined,
              ogTitle: page?.ogTitle ?? undefined,
              ogDescription: page?.ogDescription ?? undefined,
              ogImageUrl: page?.ogImageUrl ?? undefined,
              indexPage: page?.indexPage,
              primaryKeyword: page?.primaryKeyword ?? undefined,
            }}
            errors={state.errors}
          />
        </div>

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Status + save */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio" name="status" value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className="w-4 h-4 text-stone-900 border-gray-300 focus:ring-stone-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Saving…" : page ? "Save Changes" : "Create Page"}
            </button>
          </div>

          {/* Read-only info (edit only) */}
          {page && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</h3>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-400">Slug</dt>
                  <dd className="font-mono text-gray-600">{page.slug}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-400">URL</dt>
                  <dd className="font-mono text-gray-600">/{page.slug}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-400">Sections</dt>
                  <dd className="text-gray-600">{sections.length}</dd>
                </div>
                {page.publishedAt && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-400">Published</dt>
                    <dd className="text-gray-600">{new Date(page.publishedAt).toLocaleDateString()}</dd>
                  </div>
                )}
              </dl>
              <a
                href={`/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View live page
              </a>
            </div>
          )}

          {/* Section guide */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Section types</h3>
            <dl className="space-y-1.5 text-xs text-gray-500">
              <div><dt className="font-medium text-gray-700 inline">Rich Text</dt> — full Markdown support</div>
              <div><dt className="font-medium text-gray-700 inline">Intro Block</dt> — heading + paragraphs</div>
              <div><dt className="font-medium text-gray-700 inline">Call to Action</dt> — conversion block</div>
              <div><dt className="font-medium text-gray-700 inline">FAQ List</dt> — Q&A pairs, FAQ schema</div>
            </dl>
          </div>
        </div>
      </div>
    </form>
  );
}
