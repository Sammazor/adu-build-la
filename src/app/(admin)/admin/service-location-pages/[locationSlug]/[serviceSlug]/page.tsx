import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ServiceLocationPageForm } from "@/components/admin/forms/ServiceLocationPageForm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { TypedServiceLocationPage } from "@/lib/data/serviceLocationPages";

interface Props {
  params: Promise<{ locationSlug: string; serviceSlug: string }>;
}

export default async function EditServiceLocationPage({ params }: Props) {
  const { locationSlug, serviceSlug } = await params;

  const page = await prisma.serviceLocationPage.findUnique({
    where: { locationSlug_serviceSlug: { locationSlug, serviceSlug } },
  }).catch(() => null);

  if (!page) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/service-location-pages"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Service + Location Pages
        </Link>
        <a href={page.fullPath} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          View live
        </a>
      </div>

      <AdminHeader
        title={`${page.locationName} — ${page.serviceName}`}
        description={page.fullPath}
      />

      <ServiceLocationPageForm page={page as unknown as TypedServiceLocationPage} />
    </div>
  );
}
