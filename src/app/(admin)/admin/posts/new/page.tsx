import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { PostForm } from "@/components/admin/forms/PostForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewPostPage() {
  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Posts
        </Link>
      </div>
      <AdminHeader title="New Blog Post" description="Create and publish a new article." />
      <PostForm authors={authors} />
    </div>
  );
}
