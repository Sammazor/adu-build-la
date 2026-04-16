import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { PageForm } from "@/components/admin/forms/PageForm";
import { PageDeleteButton } from "@/components/admin/forms/PageDeleteButton";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface EditPageAdminProps {
  params: Promise<{ id: string }>;
}

export default async function EditPageAdminPage({ params }: EditPageAdminProps) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Pages
        </Link>
        <div className="flex items-center gap-3">
          <StatusBadge status={page.status} />
          <a
            href={`/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View live
          </a>
          <PageDeleteButton pageId={page.id} />
        </div>
      </div>
      <AdminHeader title={page.title} description={`/${page.slug}`} />
      <PageForm page={page} />
    </div>
  );
}
