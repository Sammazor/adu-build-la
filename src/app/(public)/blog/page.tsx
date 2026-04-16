import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/public/cards/PostCard";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/formatters";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "ADU Blog & Guides — Los Angeles ADU Advice",
    description:
      "Expert guides on ADU costs, permits, design, and construction in Los Angeles. Practical, detailed advice from the ADU Build LA team.",
    canonical: "/blog",
  });
}

const TOPIC_LINKS = [
  { label: "ADU Costs & Pricing", href: "/blog/how-much-does-an-adu-cost-in-los-angeles" },
  { label: "Permitting in LA", href: "/blog/adu-permit-process-los-angeles" },
  { label: "Garage Conversions", href: "/services/garage-conversion" },
  { label: "City Guides", href: "/locations" },
  { label: "ADU Models & Floor Plans", href: "/adu-models" },
  { label: "Completed Projects", href: "/projects" },
];

export default async function BlogIndexPage() {
  const posts = await prisma.post
    .findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 24,
      include: { author: true },
    })
    .catch(() => []);

  const [featured, ...rest] = posts;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,53,15,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-8 sm:pt-10 pb-14 sm:pb-20 lg:pb-28">
          {/* Breadcrumb */}
          <nav className="mb-8 sm:mb-10" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-stone-500">
              <li>
                <Link href="/" className="hover:text-stone-300 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">Blog</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
              ADU Knowledge Base
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              ADU Guides for Los Angeles Homeowners
            </h1>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
              Practical, detailed guides on ADU costs, permits, design, and construction
              in Los Angeles — written by the ADU Build LA team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors min-h-[52px]"
              >
                Get a Free Estimate <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Topic strip ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide mr-1">
              Browse:
            </span>
            {TOPIC_LINKS.map((topic) => (
              <Link
                key={topic.label}
                href={topic.href}
                className="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:border-amber-300 hover:text-amber-700 transition-colors"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        /* ── Empty state ─────────────────────────────────────────────────── */
        <section className="py-32 bg-stone-50">
          <div className="max-w-xl mx-auto px-6 text-center">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-900 mb-3">
              Guides coming soon
            </h2>
            <p className="text-stone-500 text-lg mb-8">
              We&apos;re publishing detailed ADU guides for Los Angeles homeowners. Check back
              soon — or reach out directly if you have a specific question.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors"
            >
              Talk to an ADU Specialist
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* ── Featured post ──────────────────────────────────────────────── */}
          {featured && (
            <section className="py-10 sm:py-12 bg-white">
              <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-6">
                  Latest Article
                </div>
                <Link
                  href={featured.fullPath}
                  className="group grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-0 rounded-3xl border border-stone-200 overflow-hidden hover:border-amber-200 hover:shadow-lg hover:shadow-stone-900/[0.07] transition-all duration-200"
                >
                  {/* Left: content */}
                  <div className="p-8 lg:p-10 flex flex-col justify-between bg-white order-2 lg:order-1">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-stone-400 font-medium mb-4">
                        {featured.publishedAt && (
                          <span>{formatDate(featured.publishedAt)}</span>
                        )}
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {featured.readingTimeMinutes} min read
                        </span>
                        <span aria-hidden>·</span>
                        <span>{featured.author.name}</span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 leading-tight mb-4 group-hover:text-stone-700 transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-stone-500 leading-relaxed line-clamp-3">
                          {featured.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 group-hover:text-amber-700 transition-colors">
                      Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Right: image */}
                  <div className="order-1 lg:order-2 bg-stone-100 overflow-hidden" style={{ minHeight: "240px" }}>
                    {featured.featuredImageUrl ? (
                      <img
                        src={featured.featuredImageUrl}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        style={{ minHeight: "240px" }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center" style={{ minHeight: "240px" }}>
                        <BookOpen className="w-16 h-16 text-stone-300" />
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* ── Posts grid ────────────────────────────────────────────────── */}
          {rest.length > 0 && (
            <section className="py-10 sm:py-12 bg-stone-50 border-t border-stone-100">
              <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-8">
                  More Articles
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <PostCard
                      key={post.id}
                      title={post.title}
                      slug={post.slug}
                      fullPath={post.fullPath}
                      excerpt={post.excerpt}
                      featuredImageUrl={post.featuredImageUrl}
                      publishedAt={post.publishedAt}
                      readingTimeMinutes={post.readingTimeMinutes}
                      authorName={post.author.name}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-stone-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
            Ready to Start?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Get Personalized Advice for Your Property
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            Reading guides is a good start. A free property assessment gives you exact
            answers for your specific lot, city, and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors min-h-[52px]"
            >
              Request a Free Estimate
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
