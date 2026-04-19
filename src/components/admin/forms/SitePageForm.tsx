"use client";

import { useActionState, useState } from "react";
import { upsertSitePage, type SitePageActionState } from "@/lib/actions/sitePages";
import { SeoPanel } from "@/components/admin/seo/SeoPanel";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import {
  Loader2, CheckCircle2, Plus, Trash2, ChevronUp, ChevronDown, ExternalLink, GripVertical,
} from "lucide-react";
import type { SitePageOverride } from "@/types/prisma-app";
import type { SitePageDefaults } from "@/lib/data/sitePageDefaults";

// ── Types ─────────────────────────────────────────────────────────────────────

type SectionType = "rich_text" | "intro" | "cta" | "faq_list";
interface RichTextSection { type: "rich_text"; content: string; }
interface IntroSection { type: "intro"; heading: string; body: string; }
interface CtaSection {
  type: "cta"; heading: string; subheading?: string;
  primary_label: string; primary_url: string;
  secondary_label?: string; secondary_url?: string;
  background?: "dark" | "light" | "brand";
}
interface FaqItem { q: string; a: string; }
interface FaqListSection { type: "faq_list"; items: FaqItem[]; }
type PageSection = RichTextSection | IntroSection | CtaSection | FaqListSection;

function defaultSection(type: SectionType): PageSection {
  switch (type) {
    case "rich_text": return { type: "rich_text", content: "" };
    case "intro": return { type: "intro", heading: "", body: "" };
    case "cta": return { type: "cta", heading: "", primary_label: "Get a Free Estimate", primary_url: "/estimate", background: "dark" };
    case "faq_list": return { type: "faq_list", items: [{ q: "", a: "" }] };
  }
}

function parseSections(raw: unknown): PageSection[] {
  if (!Array.isArray(raw)) return [];
  const validTypes = new Set<SectionType>(["rich_text", "intro", "cta", "faq_list"]);
  return raw.filter(
    (item): item is PageSection =>
      typeof item === "object" && item !== null && "type" in item &&
      validTypes.has((item as { type: SectionType }).type)
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";

/** Shows the live default value as a subtle label when no override is active */
function DefaultBadge({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span className="text-xs text-gray-400 font-normal ml-1.5">
      (default: <span className="italic">{value.length > 60 ? value.slice(0, 60) + "…" : value}</span>)
    </span>
  );
}

function Field({
  id, label, name, value, onChange, placeholder, note, error, rows, maxLength, defaultVal,
}: {
  id: string; label: string; name?: string; value?: string;
  onChange?: (v: string) => void; placeholder?: string; note?: string;
  error?: string; rows?: number; maxLength?: number; defaultVal?: string;
}) {
  const hasOverride = value !== undefined && value !== "";
  const border = error ? "border-red-400" : "border-gray-200";
  const cls = inputCls.replace("border-gray-200", border);
  const effectivePlaceholder = placeholder || (defaultVal ? `Default: ${defaultVal}` : undefined);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {!hasOverride && <DefaultBadge value={defaultVal} />}
      </label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}
      {rows ? (
        <textarea
          id={id} name={name} rows={rows} value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={effectivePlaceholder} maxLength={maxLength}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          id={id} name={name} type="text" value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={effectivePlaceholder} maxLength={maxLength}
          className={cls}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Section editors ───────────────────────────────────────────────────────────

function RichTextEditor({ section, onChange }: { section: RichTextSection; onChange: (s: RichTextSection) => void }) {
  return (
    <textarea rows={10} value={section.content}
      onChange={(e) => onChange({ ...section, content: e.target.value })}
      placeholder={"Write in Markdown:\n\n## Section heading\n\nBody paragraph text...\n\n- Bullet item"}
      className={`${inputCls} resize-y font-mono text-xs`}
    />
  );
}

function IntroEditor({ section, onChange }: { section: IntroSection; onChange: (s: IntroSection) => void }) {
  return (
    <div className="space-y-3">
      <input value={section.heading} onChange={(e) => onChange({ ...section, heading: e.target.value })}
        placeholder="Section heading…" className={inputCls} />
      <textarea rows={5} value={section.body} onChange={(e) => onChange({ ...section, body: e.target.value })}
        placeholder="Body text (Markdown supported)…" className={`${inputCls} resize-none`} />
    </div>
  );
}

function CtaEditor({ section, onChange }: { section: CtaSection; onChange: (s: CtaSection) => void }) {
  return (
    <div className="space-y-3">
      <input value={section.heading} onChange={(e) => onChange({ ...section, heading: e.target.value })}
        placeholder="CTA Heading" className={inputCls} />
      <input value={section.subheading ?? ""} onChange={(e) => onChange({ ...section, subheading: e.target.value })}
        placeholder="Subheading (optional)" className={inputCls} />
      <div className="grid grid-cols-2 gap-3">
        <input value={section.primary_label} onChange={(e) => onChange({ ...section, primary_label: e.target.value })}
          placeholder="Button label" className={inputCls} />
        <input value={section.primary_url} onChange={(e) => onChange({ ...section, primary_url: e.target.value })}
          placeholder="/estimate" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input value={section.secondary_label ?? ""} onChange={(e) => onChange({ ...section, secondary_label: e.target.value })}
          placeholder="Secondary label (optional)" className={inputCls} />
        <input value={section.secondary_url ?? ""} onChange={(e) => onChange({ ...section, secondary_url: e.target.value })}
          placeholder="/projects" className={inputCls} />
      </div>
      <select value={section.background ?? "dark"} onChange={(e) => onChange({ ...section, background: e.target.value as CtaSection["background"] })}
        className={inputCls}>
        <option value="dark">Dark background</option>
        <option value="light">Light background</option>
        <option value="brand">Brand (amber) background</option>
      </select>
    </div>
  );
}

function FaqEditor({ section, onChange }: { section: FaqListSection; onChange: (s: FaqListSection) => void }) {
  function updateItem(i: number, field: "q" | "a", val: string) {
    const items = section.items.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    onChange({ ...section, items });
  }
  return (
    <div className="space-y-4">
      {section.items.map((item, i) => (
        <div key={i} className="space-y-2 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">FAQ #{i + 1}</span>
            <button type="button" onClick={() => onChange({ ...section, items: section.items.filter((_, j) => j !== i) })}
              className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <input value={item.q} onChange={(e) => updateItem(i, "q", e.target.value)} placeholder="Question" className={inputCls} />
          <textarea rows={3} value={item.a} onChange={(e) => updateItem(i, "a", e.target.value)} placeholder="Answer" className={`${inputCls} resize-none`} />
        </div>
      ))}
      <button type="button" onClick={() => onChange({ ...section, items: [...section.items, { q: "", a: "" }] })}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <Plus className="w-4 h-4" /> Add FAQ item
      </button>
    </div>
  );
}

const SECTION_LABELS: Record<SectionType, string> = {
  rich_text: "Rich Text", intro: "Intro Block", cta: "Call to Action", faq_list: "FAQ List",
};

function SectionCard({
  section, index, total, onChange, onMove, onRemove,
}: {
  section: PageSection; index: number; total: number;
  onChange: (s: PageSection) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
        <span className="text-xs font-semibold text-gray-700 flex-1">{SECTION_LABELS[section.type]}</span>
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
        <button type="button" onClick={() => setCollapsed((v) => !v)} className="text-gray-400 hover:text-gray-700 text-xs px-1.5">
          {collapsed ? "Expand" : "Collapse"}
        </button>
        <button type="button" onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
      {!collapsed && (
        <div className="p-4">
          {section.type === "rich_text" && <RichTextEditor section={section} onChange={(s) => onChange(s)} />}
          {section.type === "intro" && <IntroEditor section={section} onChange={(s) => onChange(s)} />}
          {section.type === "cta" && <CtaEditor section={section} onChange={(s) => onChange(s)} />}
          {section.type === "faq_list" && <FaqEditor section={section} onChange={(s) => onChange(s)} />}
        </div>
      )}
    </div>
  );
}

function AddSectionBar({ onAdd }: { onAdd: (type: SectionType) => void }) {
  const types: SectionType[] = ["rich_text", "intro", "cta", "faq_list"];
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {types.map((t) => (
        <button key={t} type="button" onClick={() => onAdd(t)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-stone-400 hover:text-stone-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> {SECTION_LABELS[t]}
        </button>
      ))}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

const initialState: SitePageActionState = { success: false };

interface SitePageFormProps {
  pageKey: string;
  pageLabel: string;
  publicPath: string;
  override?: SitePageOverride | null;
  defaults?: SitePageDefaults;
}

export function SitePageForm({ pageKey, pageLabel, publicPath, override, defaults = {} }: SitePageFormProps) {
  const [state, formAction, isPending] = useActionState(upsertSitePage, initialState);

  const [sections, setSections] = useState<PageSection[]>(() =>
    parseSections(override?.sections)
  );

  // Effective values: use override if set, otherwise empty string (so placeholder shows default)
  const [heroHeading, setHeroHeading] = useState(override?.heroHeading ?? "");
  const [heroSubheading, setHeroSubheading] = useState(override?.heroSubheading ?? "");
  const [heroCtaPrimaryLabel, setHeroCtaPrimaryLabel] = useState(override?.heroCtaPrimaryLabel ?? "");
  const [heroCtaPrimaryUrl, setHeroCtaPrimaryUrl] = useState(override?.heroCtaPrimaryUrl ?? "");
  const [heroCtaSecondaryLabel, setHeroCtaSecondaryLabel] = useState(override?.heroCtaSecondaryLabel ?? "");
  const [heroCtaSecondaryUrl, setHeroCtaSecondaryUrl] = useState(override?.heroCtaSecondaryUrl ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(override?.heroImageUrl ?? "");

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

  // Determine if a field has an active override
  const hasHeroOverride = !!(
    override?.heroHeading || override?.heroSubheading ||
    override?.heroCtaPrimaryLabel || override?.heroImageUrl
  );

  const sectionsJson = JSON.stringify(sections);

  return (
    <form action={formAction} className="space-y-6 mt-6">
      <input type="hidden" name="pageKey" value={pageKey} />
      <input type="hidden" name="sectionsJson" value={sectionsJson} />

      {state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* ── Main column ────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Page info */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">Page</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{pageLabel}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{publicPath}</p>
              </div>
              <a href={publicPath} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> View live
              </a>
            </div>
            <div className={`text-xs rounded-lg px-3 py-2 border ${hasHeroOverride ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
              {hasHeroOverride
                ? "This page has active overrides. Fields left blank will fall back to the hardcoded defaults shown below."
                : "No overrides saved yet — this page is showing its hardcoded defaults. Fill in any field to override it."}
            </div>
          </section>

          {/* Hero */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
              Hero Section
              <span className="text-xs font-normal text-gray-400 ml-2">Leave blank to keep hardcoded default</span>
            </h2>
            <Field id="heroHeading" label="Heading" name="heroHeading"
              value={heroHeading} onChange={setHeroHeading}
              defaultVal={defaults.heroHeading} />
            <Field id="heroSubheading" label="Subheading" name="heroSubheading"
              value={heroSubheading} onChange={setHeroSubheading}
              defaultVal={defaults.heroSubheading} rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <Field id="heroCtaPrimaryLabel" label="Primary Button Label" name="heroCtaPrimaryLabel"
                value={heroCtaPrimaryLabel} onChange={setHeroCtaPrimaryLabel}
                defaultVal={defaults.heroCtaPrimaryLabel} />
              <Field id="heroCtaPrimaryUrl" label="Primary Button URL" name="heroCtaPrimaryUrl"
                value={heroCtaPrimaryUrl} onChange={setHeroCtaPrimaryUrl}
                defaultVal={defaults.heroCtaPrimaryUrl} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="heroCtaSecondaryLabel" label="Secondary Button Label" name="heroCtaSecondaryLabel"
                value={heroCtaSecondaryLabel} onChange={setHeroCtaSecondaryLabel}
                defaultVal={defaults.heroCtaSecondaryLabel} />
              <Field id="heroCtaSecondaryUrl" label="Secondary Button URL" name="heroCtaSecondaryUrl"
                value={heroCtaSecondaryUrl} onChange={setHeroCtaSecondaryUrl}
                defaultVal={defaults.heroCtaSecondaryUrl} />
            </div>
            <MediaPickerField
              label="Hero Background Image"
              name="heroImageUrl"
              value={heroImageUrl}
              onChange={setHeroImageUrl}
              note="Optional background image. Recommended: 1920×800px. Leave blank to use the page's default background."
            />
          </section>

          {/* Sections */}
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
              <SectionCard key={index} section={section} index={index} total={sections.length}
                onChange={(s) => updateSection(index, s)}
                onMove={(dir) => moveSection(index, dir)}
                onRemove={() => removeSection(index)}
              />
            ))}
            <AddSectionBar onAdd={addSection} />
          </section>

          {/* SEO */}
          <SeoPanel
            slug={publicPath.replace(/^\//, "")}
            defaults={{
              seoTitle: override?.seoTitle ?? defaults.seoTitle,
              seoDescription: override?.seoDescription ?? defaults.seoDescription,
              canonicalUrl: override?.canonicalUrl ?? undefined,
              ogTitle: override?.ogTitle ?? undefined,
              ogDescription: override?.ogDescription ?? undefined,
              ogImageUrl: override?.ogImageUrl ?? undefined,
              indexPage: override?.indexPage,
              primaryKeyword: override?.primaryKeyword ?? undefined,
            }}
            errors={state.errors}
          />
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <button type="submit" disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Saving…" : "Save Changes"}
            </button>
            {override?.updatedAt && (
              <p className="text-xs text-gray-400 text-center">
                Last saved {new Date(override.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Defaults reference card */}
          {(defaults.heroHeading || defaults.seoTitle) && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Defaults</h3>
              <dl className="space-y-2 text-xs text-gray-500">
                {defaults.heroHeading && (
                  <div>
                    <dt className="font-medium text-gray-600">Hero Heading</dt>
                    <dd className="text-gray-400 italic">{defaults.heroHeading}</dd>
                  </div>
                )}
                {defaults.seoTitle && (
                  <div>
                    <dt className="font-medium text-gray-600">SEO Title</dt>
                    <dd className="text-gray-400 italic">{defaults.seoTitle}</dd>
                  </div>
                )}
                {defaults.heroCtaPrimaryLabel && (
                  <div>
                    <dt className="font-medium text-gray-600">Primary CTA</dt>
                    <dd className="text-gray-400 italic">{defaults.heroCtaPrimaryLabel} → {defaults.heroCtaPrimaryUrl}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-2">
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
