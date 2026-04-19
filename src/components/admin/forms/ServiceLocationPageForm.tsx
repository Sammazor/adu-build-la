"use client";

import { useActionState } from "react";
import { updateServiceLocationPage, type SLPActionState } from "@/lib/actions/serviceLocationPages";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { TypedServiceLocationPage } from "@/lib/data/serviceLocationPages";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";

function Field({
  id, label, name, defaultValue, placeholder, rows,
}: {
  id: string; label: string; name: string; defaultValue?: string;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {rows ? (
        <textarea id={id} name={name} rows={rows} defaultValue={defaultValue}
          placeholder={placeholder} className={`${inputCls} resize-none`} />
      ) : (
        <input id={id} name={name} type="text" defaultValue={defaultValue}
          placeholder={placeholder} className={inputCls} />
      )}
    </div>
  );
}

interface ServiceLocationPageFormProps {
  page: TypedServiceLocationPage;
}

const initialState: SLPActionState = { success: false };

export function ServiceLocationPageForm({ page }: ServiceLocationPageFormProps) {
  const [state, formAction, pending] = useActionState(updateServiceLocationPage, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locationSlug" value={page.locationSlug} />
      <input type="hidden" name="serviceSlug" value={page.serviceSlug} />

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">SEO</h3>
        <Field id="seoTitle" label="SEO Title" name="seoTitle" defaultValue={page.seoTitle} placeholder="Max 120 chars" />
        <Field id="seoDescription" label="SEO Description" name="seoDescription" defaultValue={page.seoDescription} rows={3} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Hero</h3>
        <Field id="heroTagline" label="Hero Tagline" name="heroTagline" defaultValue={page.heroTagline} />
        <Field id="heroHeading" label="Hero Heading" name="heroHeading" defaultValue={page.heroHeading} />
        <Field id="heroSubheading" label="Hero Subheading" name="heroSubheading" defaultValue={page.heroSubheading} rows={3} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Section Headings</h3>
        <Field id="whyHeading" label="Why This Service Heading" name="whyHeading" defaultValue={page.whyHeading} />
        <Field id="considerationsHeading" label="Considerations Heading" name="considerationsHeading" defaultValue={page.considerationsHeading} />
        <Field id="pricingHeading" label="Pricing Heading" name="pricingHeading" defaultValue={page.pricingHeading} />
        <Field id="pricingIntro" label="Pricing Intro" name="pricingIntro" defaultValue={page.pricingIntro} rows={4} />
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Page
        </button>
        {state.success && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" /> {state.message}
          </span>
        )}
        {!state.success && state.message && (
          <span className="text-sm text-red-500">{state.message}</span>
        )}
      </div>
    </form>
  );
}
