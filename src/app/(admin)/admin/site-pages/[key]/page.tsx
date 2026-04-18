import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { SitePageForm } from "@/components/admin/forms/SitePageForm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SITE_PAGES } from "@/lib/data/sitePagesList";

interface EditSitePageProps {
  params: Promise<{ key: string }>;
}

export default async function EditSitePageAdminPage({ params }: EditSitePageProps) {
  const { key } = await params;

  const pageDef = SITE_PAGES.find((p) => p.key === key);
  if (!pageDef) notFound();

  const override = await prisma.sitePageOverride
    .findUnique({ where: { pageKey: key } })
    .catch(() => null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/site-pages"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Site Pages
        </Link>
        <a
          href={pageDef.path}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View live
        </a>
      </div>

      <AdminHeader
        title={pageDef.label}
        description={`Override CMS settings for the built-in ${pageDef.label} page`}
      />

      <SitePageForm
        pageKey={key}
        pageLabel={pageDef.label}
        publicPath={pageDef.path}
        override={override}
      />
    </div>
  );
}
