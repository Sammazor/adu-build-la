"use client";

import { useActionState, useState } from "react";
import { updateLocation, type LocationActionState } from "@/lib/actions/locations";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { TypedLocation } from "@/lib/data/locations";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";

function Field({
  id, label, name, defaultValue, placeholder, rows, note,
}: {
  id: string; label: string; name: string; defaultValue?: string;
  placeholder?: string; rows?: number; note?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}
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

interface LocationFormProps {
  location: TypedLocation;
}

const initialState: LocationActionState = { success: false };

export function LocationForm({ location }: LocationFormProps) {
  const [state, formAction, pending] = useActionState(updateLocation, initialState);
  const [heroImageUrl, setHeroImageUrl] = useState(location.heroImageUrl ?? "");

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locationId" value={location.id} />

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Identity</h3>
        <Field id="name" label="Location Name" name="name" defaultValue={location.name} />
        <Field id="heroTagline" label="Hero Tagline" name="heroTagline" defaultValue={location.heroTagline} />
        <Field id="heroHeading" label="Hero Heading" name="heroHeading" defaultValue={location.heroHeading} />
        <Field id="heroSubheading" label="Hero Subheading" name="heroSubheading" defaultValue={location.heroSubheading} rows={3} />
        <Field id="introHeading" label="Intro Section Heading" name="introHeading" defaultValue={location.introHeading} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">SEO</h3>
        <Field id="seoTitle" label="SEO Title" name="seoTitle" defaultValue={location.seoTitle} placeholder="Max 120 chars" />
        <Field id="seoDescription" label="SEO Description" name="seoDescription" defaultValue={location.seoDescription} rows={3} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Pricing Intro</h3>
        <Field id="pricingIntro" label="Pricing Section Intro" name="pricingIntro" defaultValue={location.pricingIntro} rows={4} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Media</h3>
        <MediaPickerField
          label="Hero Image"
          name="heroImageUrl"
          value={heroImageUrl}
          onChange={setHeroImageUrl}
          note="Shown as the hero background on the location city page."
        />
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Location
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
