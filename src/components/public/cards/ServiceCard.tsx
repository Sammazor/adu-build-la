import Link from "next/link";
import { ArrowRight, Home, Hammer, FileCheck, Wrench, Building2, PenTool, Layers } from "lucide-react";
import type { ElementType } from "react";

interface ServiceCardProps {
  name: string;
  fullPath: string;
  shortDescription: string | null;
  iconName?: string | null;
}

const iconMap: Record<string, ElementType> = {
  home: Home,
  hammer: Hammer,
  "file-check": FileCheck,
  wrench: Wrench,
  building: Building2,
  building2: Building2,
  "pen-tool": PenTool,
  layers: Layers,
};

function ServiceIcon({ iconName }: { iconName?: string | null }) {
  const Icon = (iconName && iconMap[iconName]) || Home;
  return (
    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4 shrink-0">
      <Icon className="w-5 h-5 text-amber-600" />
    </div>
  );
}

export function ServiceCard({ name, fullPath, shortDescription, iconName }: ServiceCardProps) {
  return (
    <Link
      href={fullPath}
      className="group bg-white rounded-2xl border border-stone-200 p-6 hover:border-amber-200 hover:shadow-md hover:shadow-stone-900/[0.06] transition-[border-color,box-shadow] duration-200 flex flex-col"
    >
      <ServiceIcon iconName={iconName} />
      <h3 className="text-base font-bold text-stone-900 mb-2 group-hover:text-stone-700 leading-snug">
        {name}
      </h3>
      {shortDescription && (
        <p className="text-sm text-stone-500 leading-relaxed mb-4 flex-1">{shortDescription}</p>
      )}
      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 group-hover:text-amber-700 mt-auto pt-1">
        Learn more{" "}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
