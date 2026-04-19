import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ExternalLink, Settings2, Star } from "lucide-react";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { completedYear: "desc" }],
    select: {
      id: true, slug: true, name: true, city: true, projectType: true,
      projectCost: true, completedYear: true, featuredOnHome: true, fullPath: true, updatedAt: true,
    },
  }).catch(() => []);

  return (
    <div>
      <AdminHeader
        title="Projects"
        description={`${projects.length} completed project${projects.length !== 1 ? "s" : ""} — edit content, stats, and images`}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Project</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Cost</th>
              <th className="px-4 py-3 w-16 hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.featuredOnHome && (
                      <span title="Featured on homepage"><Star className="w-3 h-3 text-amber-500 shrink-0" /></span>
                    )}
                    <div>
                      <Link href={`/admin/projects/${p.id}`} className="font-medium text-gray-900 hover:text-stone-700 block">
                        {p.name}
                      </Link>
                      <span className="text-xs text-gray-400">{p.city} · {p.completedYear}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{p.projectType}</td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{p.projectCost}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/projects/${p.id}`} className="text-gray-300 hover:text-stone-600 transition-colors" title="Edit">
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
