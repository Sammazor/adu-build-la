import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { PostForm } from "@/components/admin/forms/PostForm";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const [post, authors] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { author: true } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Posts
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={post.status} />
          {post.status === "published" && post.fullPath && (
            <a
              href={post.fullPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors"
              title="View live post"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live
            </a>
          )}
        </div>
      </div>
      <AdminHeader
        title={post.title}
        description={`/blog/${post.slug}`}
      />
      <PostForm post={post} authors={authors} />
    </div>
  );
}
