import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return format(new Date(date), "MMMM d, yyyy");
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
