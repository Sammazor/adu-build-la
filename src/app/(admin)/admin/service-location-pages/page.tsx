import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ExternalLink, Settings2 } from "lucide-react";

export default async function AdminServiceLocationPagesPage() {
  const pages = await prisma.serviceLocationPage.findMany({
    orderBy: [{ locationSlug: "asc" }, { serviceSlug: "asc" }],
    select: {
      locationSlug: true, serviceSlug: true, locationName: true, serviceName: true,
      fullPath: true, seoTitle: true, updatedAt: true,
    },
  }).catch(() => []);

  return (
    <div>
      <AdminHeader
        title="Service + Location Pages"
        description={`${pages.length} city-specific service page${pages.length !== 1 ? "s" : ""}`}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Page</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">SEO Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Last Updated</th>
              <th className="px-4 py-3 w-16 hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pages.map((p) => (
              <tr key={`${p.locationSlug}-${p.serviceSlug}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/service-location-pages/${p.locationSlug}/${p.serviceSlug}`}
                    className="font-medium text-gray-900 hover:text-stone-700 block">
                    {p.locationName} — {p.serviceName}
                  </Link>
                  <span className="text-xs text-gray-400 font-mono">{p.fullPath}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[220px] truncate">
                  {p.seoTitle}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/service-location-pages/${p.locationSlug}/${p.serviceSlug}`}
                      className="text-gray-300 hover:text-stone-600 transition-colors" title="Edit">
                      <Settings2 className="w-3.5 h-3.5" />
                    </Link>
                    <a href={p.fullPath} target="_blank" rel="noopener noreferrer"
                      className="text-gray-300 hover:text-stone-600 transition-colors" title="View live">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
