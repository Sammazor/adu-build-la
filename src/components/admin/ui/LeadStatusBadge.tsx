import { cn } from "@/lib/utils";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost"
  | "nurture"
  | "disqualified"
  | string;

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-purple-100 text-purple-700",
  proposal: "bg-indigo-100 text-indigo-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-600",
  nurture: "bg-orange-100 text-orange-700",
  disqualified: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal Sent",
  won: "Won",
  lost: "Lost",
  nurture: "Nurture",
  disqualified: "Disqualified",
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-gray-100 text-gray-600";
  const label = statusLabels[status] ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
