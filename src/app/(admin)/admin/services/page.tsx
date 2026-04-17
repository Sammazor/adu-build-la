import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ExternalLink, FileText } from "lucide-react";

const servicesQuery = () =>
  prisma.servicePage.findMany({ orderBy: { createdAt: "asc" } });

type ServiceItem = Awaited<ReturnType<typeof servicesQuery>>[number];

export default async function ServicesPage() {
  const services: ServiceItem[] = await servicesQuery();

  return (
    <div>
      <AdminHeader
        title="Service Pages"
        description={`${services.length} service page${services.length !== 1 ? "s" : ""} — edit content, SEO, and images`}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No service pages found. Run the database seed to create them.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">SEO Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Keyword</th>
                <th className="px-4 py-3 w-8 hidden sm:table-cell" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((service: ServiceItem) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="font-medium text-gray-900 hover:text-stone-700 block"
                    >
                      {service.name}
                    </Link>
                    <span className="text-xs text-gray-400 font-mono">{service.fullPath}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[220px] truncate">
                    {service.seoTitle ?? <span className="text-gray-300 italic">Not set</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {service.primaryKeyword ?? <span className="text-gray-300 italic">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <a href={service.fullPath} target="_blank" rel="noopener noreferrer"
                      className="text-gray-300 hover:text-stone-600 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
