import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { PageForm } from "@/components/admin/forms/PageForm";

export default function NewPageAdminPage() {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Pages
        </Link>
      </div>
      <AdminHeader
        title="New Page"
        description="Create a standalone CMS page with hero, sections, and full SEO control."
      />
      <PageForm />
    </div>
  );
}
