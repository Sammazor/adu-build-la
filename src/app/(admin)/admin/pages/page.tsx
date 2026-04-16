import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ExternalLink, FilePlus, FileText } from "lucide-react";

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <AdminHeader
          title="CMS Pages"
          description={`${pages.length} page${pages.length !== 1 ? "s" : ""} — create and manage standalone SEO pages`}
        />
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          New Page
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {pages.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">No pages yet.</p>
            <Link
              href="/admin/pages/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              <FilePlus className="w-4 h-4" />
              Create your first page
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                  SEO Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                  Sections
                </th>
                <th className="px-4 py-3 w-8 hidden sm:table-cell" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((page) => {
                const sectionCount = Array.isArray(page.sections) ? page.sections.length : 0;
                return (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="font-medium text-gray-900 hover:text-stone-700 block"
                      >
                        {page.title}
                      </Link>
                      <span className="text-xs text-gray-400 font-mono">/{page.slug}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[220px] truncate">
                      {page.seoTitle ?? <span className="text-gray-300 italic">Not set</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                      {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-stone-600 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
