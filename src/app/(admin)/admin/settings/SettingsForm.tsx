"use client";

import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { SiteSettings } from "@prisma/client";

const initialState = { success: false, errors: undefined, message: undefined };

function Field({
  id, label, name, type = "text", defaultValue, placeholder, error, note,
}: {
  id: string; label: string; name: string; type?: string;
  defaultValue?: string | null; placeholder?: string; error?: string; note?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}
      <input
        id={id} name={name} type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition ${error ? "border-red-400" : "border-gray-300"}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, action, isPending] = useActionState(updateSettings, initialState);

  function fe(field: string) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={action} className="space-y-8 max-w-2xl">
      {state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Site Identity */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
          Site Identity
        </h2>
        <Field id="siteName" label="Site Name" name="siteName"
          defaultValue={settings?.siteName} placeholder="ADU Build LA" error={fe("siteName")} />
        <Field id="siteUrl" label="Site URL" name="siteUrl" type="url"
          defaultValue={settings?.siteUrl} placeholder="https://adubuildla.com" error={fe("siteUrl")} />
        <Field id="defaultOgImageUrl" label="Default OG Image URL" name="defaultOgImageUrl"
          defaultValue={settings?.defaultOgImageUrl}
          placeholder="https://adubuildla.com/og-default.jpg"
          note="Fallback social share image. Recommended: 1200×630px." />
      </section>

      {/* SEO & Analytics */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
          SEO & Analytics
        </h2>
        <Field id="googleSiteVerification" label="Google Site Verification" name="googleSiteVerification"
          defaultValue={settings?.googleSiteVerification}
          placeholder="Paste the content= value from your verification meta tag"
          note="From Google Search Console → Verify → HTML tag method." />
        <Field id="analyticsId" label="Google Analytics ID" name="analyticsId"
          defaultValue={settings?.analyticsId} placeholder="G-XXXXXXXXXX" />
        <div className="flex items-start gap-3 pt-1">
          <input id="noindexSite" name="noindexSite" type="checkbox"
            defaultChecked={settings?.noindexSite ?? false}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-stone-900 focus:ring-stone-500" />
          <div>
            <label htmlFor="noindexSite" className="text-sm font-medium text-gray-700">
              Noindex entire site
            </label>
            <p className="text-xs text-red-500 mt-0.5">
              Warning: Prevents ALL pages from appearing in Google. Use only in development.
            </p>
          </div>
        </div>
      </section>

      {/* Business Information */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
          Business Information
          <span className="text-xs font-normal text-gray-400 ml-2">(powers LocalBusiness schema)</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field id="businessPhone" label="Phone" name="businessPhone"
            defaultValue={settings?.businessPhone} placeholder="(310) 555-0100" />
          <Field id="businessEmail" label="Email" name="businessEmail" type="email"
            defaultValue={settings?.businessEmail} placeholder="hello@adubuildla.com" />
        </div>
        <Field id="businessAddress" label="Street Address" name="businessAddress"
          defaultValue={settings?.businessAddress} placeholder="123 Main St" />
        <div className="grid grid-cols-3 gap-4">
          <Field id="businessCity" label="City" name="businessCity"
            defaultValue={settings?.businessCity ?? "Los Angeles"} />
          <Field id="businessState" label="State" name="businessState"
            defaultValue={settings?.businessState ?? "CA"} />
          <Field id="businessZip" label="ZIP" name="businessZip"
            defaultValue={settings?.businessZip} placeholder="90001" />
        </div>
        <Field id="businessHours" label="Business Hours" name="businessHours"
          defaultValue={settings?.businessHours}
          placeholder="Mon–Fri 8am–6pm, Sat 9am–4pm" />
        <div>
          <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <select id="priceRange" name="priceRange"
            defaultValue={settings?.priceRange ?? "$$$"}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white">
            <option value="$">$ — Budget</option>
            <option value="$$">$$ — Moderate</option>
            <option value="$$$">$$$ — Premium</option>
            <option value="$$$$">$$$$ — Luxury</option>
          </select>
        </div>
        <div>
          <label htmlFor="serviceAreaText" className="block text-sm font-medium text-gray-700 mb-1">
            Service Area Cities
          </label>
          <p className="text-xs text-gray-400 mb-1">Comma-separated list of cities you serve.</p>
          <textarea id="serviceAreaText" name="serviceAreaText"
            defaultValue={settings?.serviceAreaText ?? ""}
            rows={3}
            placeholder="Santa Monica, Culver City, West Hollywood, Pasadena…"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 resize-none" />
        </div>
      </section>

      {/* Hero Background Media */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
          Homepage Hero Background
        </h2>
        <div>
          <label htmlFor="heroMediaType" className="block text-sm font-medium text-gray-700 mb-1">
            Background Type
          </label>
          <select
            id="heroMediaType"
            name="heroMediaType"
            defaultValue={settings?.heroMediaType ?? "none"}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white"
          >
            <option value="none">None (default dark gradient)</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Image and video will have a dark overlay applied automatically for text readability.
          </p>
        </div>
        <Field
          id="heroMediaUrl"
          label="Media URL"
          name="heroMediaUrl"
          defaultValue={settings?.heroMediaUrl}
          placeholder="https://… (image or video URL)"
          note="For images: JPG/PNG/WebP. For videos: MP4. Leave blank when type is None."
          error={fe("heroMediaUrl")}
        />
      </section>

      <button type="submit" disabled={isPending}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors disabled:opacity-60">
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
