"use client";

import { useActionState, useState } from "react";
import { updateAduModel, type AduModelActionState } from "@/lib/actions/aduModels";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { TypedAduModel } from "@/lib/data/aduModels";

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

interface AduModelFormProps {
  model: TypedAduModel;
}

const initialState: AduModelActionState = { success: false };

export function AduModelForm({ model }: AduModelFormProps) {
  const [state, formAction, pending] = useActionState(updateAduModel, initialState);
  const [heroImageUrl, setHeroImageUrl] = useState(model.heroImageUrl ?? "");

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="modelId" value={model.id} />

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Identity</h3>
        <Field id="name" label="Model Name" name="name" defaultValue={model.name} />
        <Field id="tagline" label="Tagline" name="tagline" defaultValue={model.tagline} rows={2} />
        <Field id="badge" label="Badge (optional)" name="badge" defaultValue={model.badge ?? ""} placeholder='e.g. "Most Popular" or "Best Value"' />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">SEO</h3>
        <Field id="seoTitle" label="SEO Title" name="seoTitle" defaultValue={model.seoTitle} placeholder="Max 120 chars" />
        <Field id="seoDescription" label="SEO Description" name="seoDescription" defaultValue={model.seoDescription} rows={3} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Hero</h3>
        <Field id="heroHeading" label="Hero Heading" name="heroHeading" defaultValue={model.heroHeading} />
        <Field id="heroSubheading" label="Hero Subheading" name="heroSubheading" defaultValue={model.heroSubheading} rows={3} />
        <MediaPickerField
          label="Hero Image"
          name="heroImageUrl"
          value={heroImageUrl}
          onChange={setHeroImageUrl}
          note="Shown as the hero background on the ADU model detail page."
        />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Ideal For</h3>
        <Field id="idealForHeading" label="Ideal For Heading" name="idealForHeading" defaultValue={model.idealForHeading} />
        <Field id="idealForBody" label="Ideal For Body" name="idealForBody" defaultValue={model.idealForBody} rows={4} />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Pricing</h3>
        <Field id="startingFrom" label="Starting From" name="startingFrom" defaultValue={model.startingFrom} placeholder="e.g. $150,000" />
        <Field id="startingFromNote" label="Starting From Note" name="startingFromNote" defaultValue={model.startingFromNote} rows={2} />
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save ADU Model
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
