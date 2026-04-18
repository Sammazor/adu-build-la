import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ExternalLink, Settings2 } from "lucide-react";
import { SITE_PAGES } from "@/lib/data/sitePagesList";

export default async function SitePagesAdminPage() {
  const overrides = await prisma.sitePageOverride
    .findMany({ select: { pageKey: true, updatedAt: true, seoTitle: true } })
    .catch(() => []);

  const overrideMap = new Map(overrides.map((o) => [o.pageKey, o]));

  return (
    <div>
      <AdminHeader
        title="Site Pages"
        description="Override SEO, hero, and body sections for the site's built-in pages"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                Page
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                SEO Title Override
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                Last Saved
              </th>
              <th className="px-4 py-3 w-8 hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {SITE_PAGES.map((page) => {
              const override = overrideMap.get(page.key);
              return (
                <tr key={page.key} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/site-pages/${page.key}`}
                      className="font-medium text-gray-900 hover:text-stone-700 block"
                    >
                      {page.label}
                    </Link>
                    <span className="text-xs text-gray-400 font-mono">{page.path}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[220px] truncate">
                    {override?.seoTitle ?? <span className="text-gray-300 italic">Using default</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {override?.updatedAt
                      ? new Date(override.updatedAt).toLocaleDateString()
                      : <span className="text-gray-300 italic">Never</span>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/site-pages/${page.key}`}
                        className="text-gray-300 hover:text-stone-600 transition-colors"
                        title="Edit"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href={page.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-stone-600 transition-colors"
                        title="View live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
