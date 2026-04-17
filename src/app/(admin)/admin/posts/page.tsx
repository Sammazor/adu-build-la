import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatDateShort } from "@/lib/utils/formatters";
type ContentStatus = "draft" | "review" | "scheduled" | "published" | "archived";
import { Plus, ExternalLink, AlertCircle } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "archived", label: "Archived" },
];

interface PostsPageProps {
  searchParams: Promise<{ status?: string }>;
}

function seoHealth(post: {
  seoTitle: string | null;
  seoDescription: string | null;
  primaryKeyword: string | null;
  wordCount: number;
  status: string;
}): { ok: boolean; issues: string[] } {
  if (post.status !== "published") return { ok: true, issues: [] };
  const issues: string[] = [];
  if (!post.seoTitle) issues.push("Missing SEO title");
  else if (post.seoTitle.length < 50 || post.seoTitle.length > 70) issues.push("SEO title length");
  if (!post.seoDescription) issues.push("Missing meta description");
  else if (post.seoDescription.length < 120 || post.seoDescription.length > 165) issues.push("Meta description length");
  if (!post.primaryKeyword) issues.push("No keyword");
  if (post.wordCount > 0 && post.wordCount < 900) issues.push(`Low word count (${post.wordCount})`);
  return { ok: issues.length === 0, issues };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { status } = await searchParams;
  const filterStatus = status && status !== "all" ? status : undefined;

  const posts = await prisma.post.findMany({
    where: filterStatus ? { status: filterStatus as ContentStatus } : undefined,
    orderBy: { updatedAt: "desc" },
    include: { author: true },
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const reviewCount = posts.filter((p) => p.status === "review").length;
  const seoIssuesCount = posts.filter((p) => !seoHealth(p).ok).length;

  return (
    <div>
      <AdminHeader
        title="Blog Posts"
        description={`${posts.length} post${posts.length !== 1 ? "s" : ""}${
          !filterStatus
            ? ` — ${publishedCount} published, ${draftCount} draft${reviewCount > 0 ? `, ${reviewCount} in review` : ""}${seoIssuesCount > 0 ? `, ${seoIssuesCount} SEO issues` : ""}`
            : ""
        }`}
        action={
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        }
      />

      {/* Status filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_OPTIONS.map((opt) => {
          const isActive =
            (!filterStatus && opt.value === "all") || filterStatus === opt.value;
          return (
            <Link
              key={opt.value}
              href={opt.value === "all" ? "/admin/posts" : `/admin/posts?status=${opt.value}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-4">No posts yet.</p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                    Keyword
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                    Words
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                    SEO
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                    Updated
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden xl:table-cell">
                    Author
                  </th>
                  <th className="px-4 py-3 w-8 hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => {
                  const health = seoHealth(post);
                  return (
                    <tr
                      key={post.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        post.status === "draft" ? "opacity-75" : ""
                      }`}
                    >
                      <td className="px-4 py-3 max-w-xs">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="font-medium text-gray-900 hover:text-stone-700 line-clamp-1 block"
                        >
                          {post.title}
                        </Link>
                        <span className="text-xs text-gray-400 font-mono mt-0.5 block truncate max-w-[220px]">
                          /blog/{post.slug}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={post.status} />
                        {post.publishedAt && post.status === "published" && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {formatDateShort(post.publishedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[150px]">
                        {post.primaryKeyword ? (
                          <span className="truncate block">{post.primaryKeyword}</span>
                        ) : (
                          <span className="text-gray-300 italic">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs hidden lg:table-cell whitespace-nowrap">
                        {post.wordCount > 0 ? (
                          <span
                            className={
                              post.wordCount >= 900
                                ? "text-green-600 font-medium"
                                : post.wordCount >= 600
                                ? "text-amber-500 font-medium"
                                : "text-red-400 font-medium"
                            }
                          >
                            {post.wordCount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {post.status === "published" ? (
                          health.ok ? (
                            <span className="text-xs text-green-600 font-medium">✓ OK</span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-xs text-amber-600 cursor-help"
                              title={health.issues.join(" · ")}
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              {health.issues.length} issue{health.issues.length !== 1 ? "s" : ""}
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">
                        {formatDateShort(post.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs hidden xl:table-cell">
                        {post.author.name}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {post.status === "published" && post.fullPath && (
                          <a
                            href={post.fullPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-stone-600 transition-colors"
                            title="View live post"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
