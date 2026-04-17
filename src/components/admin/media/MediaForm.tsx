"use client";

import { useActionState } from "react";
import { updateMediaMetadata, type MediaActionState } from "@/lib/actions/media";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";
import type { Media } from "@/types/prisma-app";

const initialState: MediaActionState = { success: false };

function Field({
  id, label, name, type = "text", defaultValue, placeholder, note, error, rows,
}: {
  id: string; label: string; name: string; type?: string;
  defaultValue?: string | null; placeholder?: string; note?: string; error?: string; rows?: number;
}) {
  const base = "w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";
  const border = error ? "border-red-400" : "border-gray-200";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}
      {rows ? (
        <textarea
          id={id} name={name} rows={rows}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={`${base} ${border} resize-none`}
        />
      ) : (
        <input
          id={id} name={name} type={type}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={`${base} ${border}`}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function MediaForm({ media }: { media: Media }) {
  const [state, action, isPending] = useActionState(updateMediaMetadata, initialState);

  function fe(field: string) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="mediaId" value={media.id} />

      {state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Content metadata */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
          Content Metadata
        </h2>
        <Field
          id="title" label="Title" name="title"
          defaultValue={media.title}
          placeholder="Backyard ADU in Culver City"
          note="Human-readable name for the media library. Not shown publicly."
          error={fe("title")}
        />
        <Field
          id="altText" label="Alt Text" name="altText"
          defaultValue={media.altText}
          placeholder="Modern detached ADU with flat roof in Culver City backyard"
          note="Describes the image for screen readers and search engines. Keep it descriptive and specific. Required for SEO."
          error={fe("altText")}
        />
        <Field
          id="caption" label="Caption" name="caption"
          defaultValue={media.caption}
          placeholder="Completed detached ADU, Culver City, CA — 2024"
          note="Short text displayed below the image on certain pages."
          rows={2}
        />
        <Field
          id="description" label="Description" name="description"
          defaultValue={media.description}
          placeholder="Full project description for internal reference…"
          note="Internal notes or full description. Not publicly visible unless used in a section."
          rows={3}
        />
      </section>

      {/* SEO */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
          SEO
        </h2>
        <Field
          id="seoTitle" label="SEO Title / Image Title Tag" name="seoTitle"
          defaultValue={media.seoTitle}
          placeholder="Modern Flat-Roof ADU — Culver City, LA"
          note="Used in the HTML title attribute of the image element where supported. Keep under 70 characters."
          error={fe("seoTitle")}
        />
      </section>

      {/* Location metadata */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <MapPin className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">
            Location Metadata
          </h2>
          <span className="text-xs font-normal text-gray-400 ml-1">(stored in CMS — not embedded in file)</span>
        </div>
        <Field
          id="locationLabel" label="Location Label" name="locationLabel"
          defaultValue={media.locationLabel}
          placeholder="Westside Culver City Project"
          note="Free-form label for this image's location. Used for internal organization."
          error={fe("locationLabel")}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            id="locationCity" label="City" name="locationCity"
            defaultValue={media.locationCity}
            placeholder="Culver City"
          />
          <Field
            id="locationState" label="State" name="locationState"
            defaultValue={media.locationState}
            placeholder="CA"
          />
        </div>
        <Field
          id="locationZip" label="ZIP Code" name="locationZip"
          defaultValue={media.locationZip}
          placeholder="90232"
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            id="latitude" label="Latitude" name="latitude" type="number"
            defaultValue={media.latitude?.toString()}
            placeholder="34.0000"
            note="Decimal degrees (e.g. 34.0195)"
            error={fe("latitude")}
          />
          <Field
            id="longitude" label="Longitude" name="longitude" type="number"
            defaultValue={media.longitude?.toString()}
            placeholder="-118.0000"
            note="Decimal degrees (e.g. -118.3965)"
            error={fe("longitude")}
          />
        </div>
        <p className="text-xs text-gray-400">
          Geo coordinates enable structured location data for future schema markup and local SEO. Not embedded in the image EXIF.
        </p>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors disabled:opacity-60"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? "Saving…" : "Save Metadata"}
      </button>
    </form>
  );
}
