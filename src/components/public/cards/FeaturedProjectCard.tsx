import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, DollarSign } from "lucide-react";
import type { ProjectData } from "@/data/projects";

interface FeaturedProjectCardProps {
  project: ProjectData;
}

// Gradient placeholder colors per project type — used when no image is set
const TYPE_GRADIENTS: Record<string, string> = {
  "Garage Conversion ADU": "from-stone-700 to-stone-900",
  "Detached ADU": "from-amber-800 to-stone-900",
  "Junior ADU (JADU)": "from-stone-600 to-stone-800",
  "Attached ADU": "from-amber-900 to-stone-900",
};

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const gradient =
    TYPE_GRADIENTS[project.projectType] ?? "from-stone-700 to-stone-900";
  const bedsLabel =
    project.beds === "Studio" ? "Studio" : `${project.beds} Bed`;

  return (
    <Link
      href={project.fullPath}
      className="group relative bg-stone-900 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:shadow-stone-900/20 transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      aria-label={`View project: ${project.name}`}
    >
      {/* Image / gradient hero */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {project.featuredImageUrl ? (
          <Image
            src={project.featuredImageUrl}
            alt={`${project.name} — ${project.city} ADU project by ADU Build LA`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Placeholder gradient until real photos are added */
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            aria-hidden
          >
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden
            />
          </div>
        )}

        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"
          aria-hidden
        />

        {/* Project type badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-sm text-xs font-semibold text-stone-200 border border-stone-700/60">
            {project.projectType}
          </span>
        </div>

        {/* Cost badge */}
        {project.projectCost && (
          <div className="absolute top-3.5 right-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-sm text-xs font-bold text-stone-900">
              <DollarSign className="w-3 h-3" aria-hidden />
              {project.projectCost.replace("$", "")}
            </span>
          </div>
        )}

        {/* City + size overlay at bottom of image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden />
            <span className="text-sm font-semibold text-white leading-none">
              {project.city}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <span>{project.sqFt} sq ft</span>
            <span className="text-stone-600" aria-hidden>·</span>
            <span>{bedsLabel}</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="font-bold text-stone-900 text-base leading-snug mb-2 group-hover:text-amber-700 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed mb-4 flex-1 line-clamp-2">
          {project.heroTagline}
        </p>

        {/* Rent / use case row */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
          {project.monthlyRent ? (
            <div>
              <div className="text-xs text-stone-400 leading-none mb-0.5">Monthly rent</div>
              <div className="text-sm font-bold text-stone-900">{project.monthlyRent}</div>
            </div>
          ) : (
            <div>
              <div className="text-xs text-stone-400 leading-none mb-0.5">Use case</div>
              <div className="text-sm font-semibold text-stone-700">{project.useCase}</div>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 group-hover:text-amber-700 shrink-0">
            View project{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden />
          </div>
        </div>
      </div>
    </Link>
  );
}
