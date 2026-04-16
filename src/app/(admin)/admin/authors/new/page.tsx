import Link from "next/link";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AuthorForm } from "@/components/admin/forms/AuthorForm";
import { ArrowLeft } from "lucide-react";

export default function NewAuthorPage() {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/authors"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Authors
        </Link>
      </div>
      <AdminHeader title="New Author" description="Create a new content author profile" />
      <AuthorForm />
    </div>
  );
}
