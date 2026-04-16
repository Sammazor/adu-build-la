import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { ProjectData } from "@/data/projects";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const bedsLabel =
    project.beds === "Studio" ? "Studio" : `${project.beds} Bed`;

  return (
    <Link
      href={project.fullPath}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-200 hover:shadow-md hover:shadow-stone-900/[0.06] transition-all duration-200 flex flex-col"
    >
      {/* Color band — project type indicator */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-amber-400" />

      <div className="p-6 flex flex-col flex-1">
        {/* Location + type */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
            {project.city}
          </div>
          <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-semibold text-stone-600">
            {project.projectType}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-stone-900 text-base leading-snug mb-2 group-hover:text-stone-700">
          {project.name}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-stone-500 leading-relaxed mb-5 flex-1 line-clamp-3">
          {project.heroTagline}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-stone-50 rounded-xl px-2.5 py-2 text-center">
            <div className="text-sm font-bold text-stone-900 leading-none">
              {project.sqFt}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">sq ft</div>
          </div>
          <div className="bg-stone-50 rounded-xl px-2.5 py-2 text-center">
            <div className="text-sm font-bold text-stone-900 leading-none">
              {bedsLabel}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">sleeping</div>
          </div>
          <div className="bg-stone-50 rounded-xl px-2.5 py-2 text-center">
            <div className="text-sm font-bold text-stone-900 leading-none">
              {project.projectCost}
            </div>
            <div className="text-[10px] text-stone-500 mt-1">project cost</div>
          </div>
        </div>

        {/* CTA */}
        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 group-hover:text-amber-700">
          View project{" "}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
