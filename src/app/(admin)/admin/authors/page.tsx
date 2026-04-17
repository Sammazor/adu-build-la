import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { Plus, User, FileText } from "lucide-react";

const authorsQuery = () =>
  prisma.author.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

type AuthorWithCount = Awaited<ReturnType<typeof authorsQuery>>[number];

export default async function AuthorsPage() {
  const authors = await authorsQuery();

  return (
    <div>
      <AdminHeader
        title="Authors"
        description={`${authors.length} author${authors.length !== 1 ? "s" : ""}`}
        action={
          <Link
            href="/admin/authors/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Author
          </Link>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {authors.length === 0 ? (
          <div className="text-center py-16">
            <User className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">No authors yet.</p>
            <Link
              href="/admin/authors/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Author
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Author</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Posts</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">Slug</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {authors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/authors/${author.id}`}
                      className="font-medium text-gray-900 hover:text-stone-700 flex items-center gap-2"
                    >
                      {author.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={author.avatarUrl} alt={author.name} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                        </div>
                      )}
                      {author.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{author.title ?? <span className="text-gray-300 italic">—</span>}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts?author=${author.id}`} className="inline-flex items-center gap-1 text-gray-500 hover:text-stone-700">
                      <FileText className="w-3.5 h-3.5" />
                      {author._count.posts}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <code className="text-xs text-gray-400 font-mono">{author.slug}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
