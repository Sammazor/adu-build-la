import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ExternalLink, Settings2 } from "lucide-react";

export default async function AdminAduModelsPage() {
  const models = await prisma.aduModel.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true, modelType: true, startingFrom: true, badge: true, fullPath: true, updatedAt: true },
  }).catch(() => []);

  return (
    <div>
      <AdminHeader
        title="ADU Models"
        description={`${models.length} ADU model${models.length !== 1 ? "s" : ""} — edit content, pricing, and images`}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Model</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Starting From</th>
              <th className="px-4 py-3 w-16 hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {models.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/adu-models/${m.id}`} className="font-medium text-gray-900 hover:text-stone-700">
                      {m.name}
                    </Link>
                    {m.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{m.badge}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{m.fullPath}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{m.modelType}</td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{m.startingFrom}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/adu-models/${m.id}`} className="text-gray-300 hover:text-stone-600 transition-colors" title="Edit">
                      <Settings2 className="w-3.5 h-3.5" />
                    </Link>
                    <a href={m.fullPath} target="_blank" rel="noopener noreferrer"
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
