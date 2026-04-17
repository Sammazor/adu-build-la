import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { LeadStatusBadge } from "@/components/admin/ui/LeadStatusBadge";
import { formatRelativeTime } from "@/lib/utils/formatters";
type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost" | "nurture" | "disqualified";

const STATUS_OPTIONS = [
  { value: "all", label: "All Leads" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "nurture", label: "Nurture" },
];

const SERVICE_LABELS: Record<string, string> = {
  design: "Design",
  build: "Build",
  design_build: "Design + Build",
  consulting: "Consulting",
  unknown: "Unknown",
};

interface LeadsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { status } = await searchParams;
  const filterStatus = status && status !== "all" ? status : undefined;

  const leads = await prisma.lead.findMany({
    where: filterStatus ? { status: filterStatus as LeadStatus } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { source: true },
  });

  return (
    <div>
      <AdminHeader
        title="Leads"
        description={`${leads.length} lead${leads.length !== 1 ? "s" : ""} ${filterStatus ? `with status "${filterStatus}"` : "total"}`}
      />

      {/* Status filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_OPTIONS.map((opt) => {
          const isActive =
            (!filterStatus && opt.value === "all") || filterStatus === opt.value;
          return (
            <Link
              key={opt.value}
              href={opt.value === "all" ? "/admin/leads" : `/admin/leads?status=${opt.value}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                    City
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-medium text-gray-900 hover:text-stone-700"
                      >
                        {lead.firstName} {lead.lastName}
                      </Link>
                      {lead.isSpam && (
                        <span className="ml-2 text-xs text-red-400">[spam]</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {lead.propertyCity ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                      {lead.serviceInterest
                        ? SERVICE_LABELS[lead.serviceInterest] ?? lead.serviceInterest
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell whitespace-nowrap">
                      {formatRelativeTime(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
