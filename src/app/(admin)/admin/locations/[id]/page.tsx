import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { LocationForm } from "@/components/admin/forms/LocationForm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { TypedLocation } from "@/lib/data/locations";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  const location = await prisma.location.findUnique({ where: { id } }).catch(() => null);
  if (!location) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/locations"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Locations
        </Link>
        <a href={location.fullPath} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          View live
        </a>
      </div>

      <AdminHeader
        title={location.name}
        description={`${location.county} · ${location.fullPath}`}
      />

      <LocationForm location={location as unknown as TypedLocation} />
    </div>
  );
}
