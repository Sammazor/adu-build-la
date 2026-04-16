import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;

  const service = await prisma.servicePage.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/services"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Services
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={service.status} />
          <a href={service.fullPath} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            View live
          </a>
        </div>
      </div>
      <AdminHeader title={service.name} description={service.fullPath} />
      <ServiceForm service={service} />
    </div>
  );
}
