import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AuthorForm } from "@/components/admin/forms/AuthorForm";
import { AuthorDeleteButton } from "@/components/admin/forms/AuthorDeleteButton";
import { ArrowLeft, FileText } from "lucide-react";

interface EditAuthorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAuthorPage({ params }: EditAuthorPageProps) {
  const { id } = await params;

  const [author, postCount] = await Promise.all([
    prisma.author.findUnique({ where: { id } }),
    prisma.post.count({ where: { authorId: id } }),
  ]);

  if (!author) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/authors"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Authors
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/posts?author=${author.id}`}
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            {postCount} post{postCount !== 1 ? "s" : ""}
          </Link>
          <AuthorDeleteButton authorId={author.id} postCount={postCount} />
        </div>
      </div>
      <AdminHeader title={author.name} description={author.title ?? `/${author.slug}`} />
      <AuthorForm author={author} />
    </div>
  );
}
