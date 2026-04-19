import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ExternalLink, Settings2 } from "lucide-react";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true, county: true, fullPath: true, updatedAt: true, seoTitle: true },
  }).catch(() => []);

  return (
    <div>
      <AdminHeader
        title="Locations"
        description={`${locations.length} city page${locations.length !== 1 ? "s" : ""} — edit content, SEO, and hero sections`}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">SEO Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Last Updated</th>
              <th className="px-4 py-3 w-16 hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {locations.map((loc) => (
              <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/locations/${loc.id}`} className="font-medium text-gray-900 hover:text-stone-700 block">
                    {loc.name}
                  </Link>
                  <span className="text-xs text-gray-400 font-mono">{loc.fullPath}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[220px] truncate">
                  {loc.seoTitle}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                  {new Date(loc.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/locations/${loc.id}`} className="text-gray-300 hover:text-stone-600 transition-colors" title="Edit">
                      <Settings2 className="w-3.5 h-3.5" />
                    </Link>
                    <a href={loc.fullPath} target="_blank" rel="noopener noreferrer"
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
