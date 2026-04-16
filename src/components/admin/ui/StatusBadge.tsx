import { cn } from "@/lib/utils";

type Status = "draft" | "review" | "scheduled" | "published" | "archived" | string;

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  review: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  review: "In Review",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
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
