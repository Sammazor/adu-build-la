import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

const ALLOWED_ROLES = new Set(["super_admin", "admin", "editor", "viewer"]);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role ?? "";
  if (!ALLOWED_ROLES.has(role)) {
    // Authenticated but wrong role — kick back to login
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="pl-60">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
