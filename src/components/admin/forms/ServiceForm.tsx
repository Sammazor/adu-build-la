"use client";

import { useActionState, useState } from "react";
import { updateService, type ServiceActionState } from "@/lib/actions/services";
import { SeoPanel } from "@/components/admin/seo/SeoPanel";
import { Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import type { ServicePage } from "@/types/prisma-app";

const initialState: ServiceActionState = { success: false };

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
] as const;

function Field({
  id, label, name, type = "text", defaultValue, placeholder, note, error, rows, maxLength,
}: {
  id: string; label: string; name: string; type?: string;
  defaultValue?: string | null; placeholder?: string; note?: string; error?: string;
  rows?: number; maxLength?: number;
}) {
  const base = "w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";
  const border = error ? "border-red-400" : "border-gray-200";
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}
      {rows ? (
        <textarea id={id} name={name} rows={rows} defaultValue={defaultValue ?? ""} placeholder={placeholder}
          maxLength={maxLength} className={`${base} ${border} resize-none`} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder}
          maxLength={maxLength} className={`${base} ${border}`} />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Extract intro + CTA content from sections JSON
function extractSections(sections: unknown): {
  introHeading: string; introBody: string;
  ctaHeading: string; ctaBody: string; ctaPrimaryLabel: string; ctaPrimaryUrl: string;
} {
  const empty = { introHeading: "", introBody: "", ctaHeading: "", ctaBody: "", ctaPrimaryLabel: "", ctaPrimaryUrl: "" };
  if (!Array.isArray(sections)) return empty;
  let intro = empty;

  for (const s of sections as Record<string, unknown>[]) {
    if (s.type === "intro") {
      intro = {
        ...intro,
        introHeading: (s.heading as string) ?? "",
        introBody: (s.body as string) ?? "",
      };
    }
    if (s.type === "cta") {
      intro = {
        ...intro,
        ctaHeading: (s.heading as string) ?? "",
        ctaBody: (s.body as string) ?? "",
        ctaPrimaryLabel: (s.ctaPrimaryLabel as string) ?? "",
        ctaPrimaryUrl: (s.ctaPrimaryUrl as string) ?? "",
      };
    }
  }
  return intro;
}

export function ServiceForm({ service }: { service: ServicePage }) {
  const [state, action, isPending] = useActionState(updateService, initialState);
  const [status, setStatus] = useState(service.status);
  const sectionData = extractSections(service.sections);

  function fe(field: string) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={action} className="space-y-6 mt-6">
      <input type="hidden" name="serviceId" value={service.id} />

      {state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* ── Main editing area ─────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Basic info */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
              Basic Information
            </h2>
            <Field id="name" label="Service Name*" name="name" defaultValue={service.name}
              placeholder="ADU Design & Architecture" error={fe("name")} />
            <Field id="shortDescription" label="Short Description" name="shortDescription"
              defaultValue={service.shortDescription} rows={3} maxLength={500}
              placeholder="Brief description shown on service cards (max 500 chars)"
              note="Displayed on the /services index page and linked cards." error={fe("shortDescription")} />
          </section>

          {/* Hero */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
              Hero Image
            </h2>
            <Field id="heroImageUrl" label="Hero Image URL" name="heroImageUrl"
              defaultValue={service.heroImageUrl}
              placeholder="https://… (paste from Media Library)"
              note="Full-width banner image at the top of this service page. Recommended: 1920×800px." />
            {service.heroImageUrl && (
              <div className="flex items-center gap-2 mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.heroImageUrl} alt="Hero preview" className="w-24 h-16 object-cover rounded-lg border border-gray-200" />
                <a href={service.heroImageUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700">
                  <ExternalLink className="w-3 h-3" /> Preview
                </a>
              </div>
            )}
          </section>

          {/* Intro section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
              Intro Section
              <span className="text-xs font-normal text-gray-400 ml-2">Appears at the top of the service page</span>
            </h2>
            {sectionData.introHeading || sectionData.introBody ? (
              <>
                <Field id="introHeading" label="Intro Heading" name="introHeading"
                  defaultValue={sectionData.introHeading} placeholder="Our Comprehensive Design Process" />
                <Field id="introBody" label="Intro Body Text" name="introBody" rows={5}
                  defaultValue={sectionData.introBody} placeholder="Describe this service in 2–4 paragraphs…" />
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">
                This service page does not have an editable intro section in the current template.
                Intro content is managed in the page template code.
              </p>
            )}
          </section>

          {/* CTA section */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
              CTA Section
              <span className="text-xs font-normal text-gray-400 ml-2">Bottom call-to-action block</span>
            </h2>
            {sectionData.ctaHeading || sectionData.ctaPrimaryLabel ? (
              <>
                <Field id="ctaHeading" label="CTA Heading" name="ctaHeading"
                  defaultValue={sectionData.ctaHeading} placeholder="Ready to Get Started?" />
                <Field id="ctaBody" label="CTA Body" name="ctaBody" rows={2}
                  defaultValue={sectionData.ctaBody} placeholder="Supporting text for the CTA…" />
                <div className="grid grid-cols-2 gap-4">
                  <Field id="ctaPrimaryLabel" label="Primary Button Label" name="ctaPrimaryLabel"
                    defaultValue={sectionData.ctaPrimaryLabel} placeholder="Get a Free Estimate" />
                  <Field id="ctaPrimaryUrl" label="Primary Button URL" name="ctaPrimaryUrl"
                    defaultValue={sectionData.ctaPrimaryUrl} placeholder="/estimate" />
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">
                CTA section is managed from the database. Run the seed or manually add a CTA section to this service to enable editing.
              </p>
            )}
          </section>

          {/* SEO */}
          <SeoPanel
            slug={service.slug}
            defaults={{
              seoTitle: service.seoTitle ?? undefined,
              seoDescription: service.seoDescription ?? undefined,
              canonicalUrl: service.canonicalUrl ?? undefined,
              ogTitle: service.ogTitle ?? undefined,
              ogDescription: service.ogDescription ?? undefined,
              ogImageUrl: service.ogImageUrl ?? undefined,
              indexPage: service.indexPage,
              primaryKeyword: service.primaryKeyword ?? undefined,
            }}
            errors={state.errors}
          />
        </div>

        {/* ── Right: status + actions ───────────────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="status" value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value as typeof status)}
                    className="w-4 h-4 text-stone-900 border-gray-300 focus:ring-stone-500" />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>

            <button type="submit" disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>

          {/* Read-only info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">Slug</dt>
                <dd className="font-mono text-gray-600">{service.slug}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">Service code</dt>
                <dd className="font-mono text-gray-600">{service.serviceCode}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">Path</dt>
                <dd className="font-mono text-gray-600">{service.fullPath}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </form>
  );
}
