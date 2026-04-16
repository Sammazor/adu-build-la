import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";

interface PostCardProps {
  title: string;
  slug: string;
  fullPath: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  publishedAt: Date | null;
  readingTimeMinutes: number;
  authorName: string;
}

export function PostCard({
  title,
  fullPath,
  excerpt,
  featuredImageUrl,
  publishedAt,
  readingTimeMinutes,
  authorName,
}: PostCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-200 hover:shadow-md hover:shadow-stone-900/[0.06] transition-all duration-200 flex flex-col">
      {/* Amber accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-amber-400 shrink-0" />

      {/* Featured image */}
      {featuredImageUrl && (
        <Link href={fullPath} className="block overflow-hidden bg-stone-100" style={{ aspectRatio: "16/9" }}>
          <img
            src={featuredImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </Link>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-stone-400 font-medium mb-3">
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTimeMinutes} min read
          </span>
          <span aria-hidden>·</span>
          <span>{authorName}</span>
        </div>

        {/* Title */}
        <Link href={fullPath}>
          <h2 className="font-bold text-stone-900 text-base leading-snug mb-2.5 line-clamp-2 group-hover:text-stone-700 transition-colors">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-stone-500 line-clamp-3 leading-relaxed flex-1">{excerpt}</p>
        )}

        {/* CTA */}
        <Link
          href={fullPath}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 mt-4 transition-colors"
        >
          Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
