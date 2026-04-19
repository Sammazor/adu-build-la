"use client";

import { useActionState, useState } from "react";
import { updateProject, type ProjectActionState } from "@/lib/actions/projects";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { TypedProject } from "@/lib/data/projects";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";

function Field({
  id, label, name, defaultValue, placeholder, rows, note, required,
}: {
  id: string; label: string; name: string; defaultValue?: string;
  placeholder?: string; rows?: number; note?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
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

interface ProjectFormProps {
  project: TypedProject;
}

const initialState: ProjectActionState = { success: false };

export function ProjectForm({ project }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(updateProject, initialState);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(project.featuredImageUrl ?? "");

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="projectId" value={project.id} />

      {/* Identity */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Identity</h3>
        <Field id="name" label="Project Name" name="name" defaultValue={project.name} required />
        <Field id="heroHeading" label="Hero Heading" name="heroHeading" defaultValue={project.heroHeading} />
        <Field id="heroTagline" label="Hero Tagline" name="heroTagline" defaultValue={project.heroTagline} rows={3} />
      </section>

      {/* SEO */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">SEO</h3>
        <Field id="seoTitle" label="SEO Title" name="seoTitle" defaultValue={project.seoTitle} placeholder="Max 120 chars" />
        <Field id="seoDescription" label="SEO Description" name="seoDescription" defaultValue={project.seoDescription} rows={3} placeholder="Max 300 chars" />
      </section>

      {/* Project Stats */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Project Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field id="city" label="City" name="city" defaultValue={project.city} />
          <Field id="projectType" label="Project Type" name="projectType" defaultValue={project.projectType} />
          <Field id="sqFt" label="Sq Ft" name="sqFt" defaultValue={String(project.sqFt)} />
          <Field id="beds" label="Beds" name="beds" defaultValue={project.beds} placeholder='1, 2, "Studio"' />
          <Field id="baths" label="Baths" name="baths" defaultValue={String(project.baths)} />
          <Field id="completedYear" label="Completed Year" name="completedYear" defaultValue={String(project.completedYear)} />
          <Field id="totalBuildWeeks" label="Build Weeks" name="totalBuildWeeks" defaultValue={String(project.totalBuildWeeks)} />
          <Field id="totalProjectMonths" label="Total Timeline" name="totalProjectMonths" defaultValue={project.totalProjectMonths} placeholder="e.g. 9 months" />
          <Field id="projectCost" label="Project Cost" name="projectCost" defaultValue={project.projectCost} placeholder="e.g. $148,000" />
          <Field id="monthlyRent" label="Monthly Rent (optional)" name="monthlyRent" defaultValue={project.monthlyRent ?? ""} placeholder="e.g. $3,200/mo" />
          <Field id="useCase" label="Use Case" name="useCase" defaultValue={project.useCase} />
        </div>
      </section>

      {/* Story */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Challenge / Solution / Result</h3>
        <Field id="challengeHeading" label="Challenge Heading" name="challengeHeading" defaultValue={project.challenge.heading} />
        <Field id="challengeBody" label="Challenge Body" name="challengeBody" defaultValue={project.challenge.body} rows={5} />
        <Field id="solutionHeading" label="Solution Heading" name="solutionHeading" defaultValue={project.solution.heading} />
        <Field id="solutionBody" label="Solution Body" name="solutionBody" defaultValue={project.solution.body} rows={5} />
        <Field id="resultHeading" label="Result Heading" name="resultHeading" defaultValue={project.result.heading} />
        <Field id="resultBody" label="Result Body" name="resultBody" defaultValue={project.result.body} rows={5} />
      </section>

      {/* Media & Settings */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Media & Settings</h3>
        <MediaPickerField
          label="Featured Image"
          name="featuredImageUrl"
          value={featuredImageUrl}
          onChange={setFeaturedImageUrl}
          note="Shown on the projects index and project card."
        />
        <Field id="buildHighlights" label="Build Highlights (one per line)" name="buildHighlights"
          defaultValue={project.buildHighlights.join("\n")} rows={4}
          note="Each line becomes one bullet point" />
        <Field id="tags" label="Tags (comma-separated)" name="tags" defaultValue={project.tags.join(", ")} />
        <Field id="sortOrder" label="Sort Order" name="sortOrder" defaultValue={String(project.sortOrder)} />
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input type="checkbox" name="featuredOnHome" value="true"
              defaultChecked={project.featuredOnHome}
              className="rounded border-gray-300 text-amber-500" />
            Featured on Homepage
          </label>
        </div>
      </section>

      {/* Related Content */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Related Content</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field id="relatedLocationSlug" label="Related Location Slug" name="relatedLocationSlug" defaultValue={project.relatedLocationSlug ?? ""} />
          <Field id="relatedLocationName" label="Related Location Name" name="relatedLocationName" defaultValue={project.relatedLocationName ?? ""} />
          <Field id="relatedModelSlug" label="Related Model Slug" name="relatedModelSlug" defaultValue={project.relatedModelSlug ?? ""} />
          <Field id="relatedModelName" label="Related Model Name" name="relatedModelName" defaultValue={project.relatedModelName ?? ""} />
          <Field id="relatedServiceSlug" label="Related Service Slug" name="relatedServiceSlug" defaultValue={project.relatedServiceSlug ?? ""} />
          <Field id="relatedServiceName" label="Related Service Name" name="relatedServiceName" defaultValue={project.relatedServiceName ?? ""} />
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Project
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
