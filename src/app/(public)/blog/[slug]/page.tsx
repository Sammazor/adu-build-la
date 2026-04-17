import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getPublishedServices, type PublishedService } from "@/lib/data/settings";
import { buildArticleMetadata } from "@/lib/seo/metadata";
import { buildArticleSchema } from "@/lib/schema/article";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildFaqSchema } from "@/lib/schema/faq";
import { parseSections } from "@/types/sections";
import { RichTextSection } from "@/components/public/sections/RichTextSection";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { ConfiguratorCta } from "@/components/public/sections/ConfiguratorCta";
import { RelatedLinksSection } from "@/components/public/sections/RelatedLinksSection";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { PostCard } from "@/components/public/cards/PostCard";
import { formatDate } from "@/lib/utils/formatters";
import { getAllLocations } from "@/data/locations";
import { CheckCircle2, Clock, ArrowRight, BookOpen, List } from "lucide-react";
import { GENERAL_FAQS } from "@/data/faqs";
import { extractTocItems } from "@/lib/utils/toc";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// React.cache deduplicates calls with the same slug within a single render pass.
// generateMetadata and the page component both call getPost(slug) — only one
// DB round-trip is made per slug.
const getPost = cache(async (slug: string) => {
  return prisma.post.findUnique({ where: { slug }, include: { author: true } });
});

const relatedPostsQuery = (slug: string) =>
  prisma.post.findMany({
    where: { status: "published", NOT: { slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { author: true },
  });

type RelatedPostItem = Awaited<ReturnType<typeof relatedPostsQuery>>[number];

const blogSlugsQuery = () =>
  prisma.post.findMany({ where: { status: "published" }, select: { slug: true } });

type BlogSlugItem = Awaited<ReturnType<typeof blogSlugsQuery>>[number];

export async function generateStaticParams() {
  try {
    const posts: BlogSlugItem[] = await blogSlugsQuery();
    return posts.map((p: BlogSlugItem) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const settings = await getSiteSettings();
  return buildArticleMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    canonical: post.canonicalUrl ?? post.fullPath,
    ogTitle: post.ogTitle ?? undefined,
    ogDescription: post.ogDescription ?? undefined,
    ogImageUrl: post.ogImageUrl ?? undefined,
    noIndex: !post.indexPage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
    siteUrl: settings?.siteUrl,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, settings, relatedPosts, allServices] = await Promise.all([
    getPost(slug),
    getSiteSettings(),
    relatedPostsQuery(slug).catch(() => [] as RelatedPostItem[]),
    getPublishedServices(),
  ]);
  const services: PublishedService[] = allServices.slice(0, 4);

  if (!post || post.status !== "published") notFound();

  const siteUrl =
    settings?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";
  const sections = parseSections(post.sections);

  // Extract per-article FAQs from a faq_list section if present, else fall back to general
  const faqListSection = sections.find((s) => s.type === "faq_list");
  const articleFaqItems =
    faqListSection && faqListSection.type === "faq_list" && faqListSection.items.length > 0
      ? faqListSection.items
      : GENERAL_FAQS.slice(0, 6);

  // Extract TOC from the rich_text body
  const richTextSection = sections.find((s) => s.type === "rich_text");
  const tocItems =
    richTextSection && richTextSection.type === "rich_text"
      ? extractTocItems(richTextSection.content)
      : [];

  const articleSchema = buildArticleSchema({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? "",
    url: post.fullPath,
    imageUrl: post.ogImageUrl ?? post.featuredImageUrl ?? undefined,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
    siteUrl,
    siteName: settings?.siteName ?? "ADU Build LA",
  });

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url: post.fullPath },
    ],
    siteUrl
  );

  // ── Related links for cross-navigation ───────────────────────────────────
  const locations = getAllLocations();
  const relatedLinkItems = [
    ...services.map((s: PublishedService) => ({
      href: s.fullPath,
      typeLabel: "Service",
      title: s.name,
      description: s.shortDescription ?? `ADU ${s.name} service in Los Angeles.`,
    })),
    ...locations.slice(0, 3).map((loc) => ({
      href: loc.fullPath,
      typeLabel: "City Guide",
      title: `ADU Building in ${loc.name}`,
      description: loc.heroTagline,
    })),
  ];

  const faqSchema = buildFaqSchema(articleFaqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── Article Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,53,15,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 pt-8 sm:pt-10 pb-12 sm:pb-16 lg:pb-20">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-stone-500">
              <li>
                <Link href="/" className="hover:text-stone-300 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li>
                <Link href="/blog" className="hover:text-stone-300 transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400 truncate max-w-[200px]">{post.title}</li>
            </ol>
          </nav>

          {/* Eyebrow: primary keyword */}
          {post.primaryKeyword && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              {post.primaryKeyword}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight mb-5 sm:mb-6 max-w-3xl">
            {post.title}
          </h1>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-400">
            <span className="font-medium text-stone-300">By {post.author.name}</span>
            {post.publishedAt && (
              <>
                <span aria-hidden className="text-stone-700">·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
            <span aria-hidden className="text-stone-700">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTimeMinutes} min read
            </span>
            {post.wordCount > 0 && (
              <>
                <span aria-hidden className="text-stone-700">·</span>
                <span>{post.wordCount.toLocaleString()} words</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Article body + sidebar ────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-10 lg:gap-12 items-start">

            {/* ── Main column ─────────────────────────────────────────────── */}
            <div className="min-w-0">
              {/* Featured image */}
              {post.featuredImageUrl && (
                <div className="relative rounded-2xl overflow-hidden mb-10 bg-stone-100" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 640px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Excerpt / intro callout */}
              {post.excerpt && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-5 mb-10">
                  <p className="text-stone-700 text-base leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Article content */}
              <div className="space-y-1">
                {sections.map((section, i) =>
                  section.type === "rich_text" ? (
                    <RichTextSection key={i} section={section} />
                  ) : null
                )}
              </div>

              {/* Mid-article CTA */}
              <div className="mt-12 mb-2 bg-stone-900 rounded-2xl px-5 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                    Free Assessment
                  </div>
                  <p className="text-white font-semibold text-base leading-snug">
                    Ready to build your ADU? Get a free property assessment.
                  </p>
                </div>
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shrink-0 min-h-[48px]"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside className="lg:sticky lg:top-24 space-y-5">
              {/* Table of Contents */}
              {tocItems.length > 2 && (
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                    <List className="w-3.5 h-3.5" />
                    In This Article
                  </div>
                  <ol className="space-y-1.5">
                    {tocItems.map((item, i) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block text-sm text-stone-600 hover:text-amber-600 transition-colors leading-snug ${item.level === 3 ? "pl-3 text-xs text-stone-500" : "font-medium"}`}
                        >
                          <span className="text-stone-400 mr-1.5 text-xs">{i + 1}.</span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Estimate CTA */}
              <div className="bg-stone-900 rounded-2xl p-6">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
                  Free Estimate
                </div>
                <h3 className="text-white font-bold text-base leading-snug mb-3">
                  Get a Free Property Assessment
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed mb-5">
                  Tell us about your property. We&apos;ll confirm what&apos;s buildable, recommend
                  the right ADU type, and provide a fixed-price estimate.
                </p>
                <Link
                  href="/estimate"
                  className="block text-center px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-colors"
                >
                  Request a Free Estimate
                </Link>
                <ul className="mt-4 space-y-2">
                  {[
                    "No cost, no obligation",
                    "Response within 1 business day",
                    "Covers all LA County cities",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-stone-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick links: services */}
              {services.length > 0 && (
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                    Our Services
                  </div>
                  <ul className="space-y-2">
                    {services.map((s: PublishedService) => (
                      <li key={s.id}>
                        <Link
                          href={s.fullPath}
                          className="flex items-center justify-between text-sm text-stone-700 hover:text-amber-600 font-medium transition-colors py-0.5"
                        >
                          <span>{s.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/services"
                    className="block mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    View all services →
                  </Link>
                </div>
              )}

              {/* Quick links: locations */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                  City Guides
                </div>
                <ul className="space-y-2">
                  {getAllLocations().map((loc) => (
                    <li key={loc.slug}>
                      <Link
                        href={loc.fullPath}
                        className="flex items-center justify-between text-sm text-stone-700 hover:text-amber-600 font-medium transition-colors py-0.5"
                      >
                        <span>{loc.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/locations"
                  className="block mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  View all city guides →
                </Link>
              </div>

              {/* ADU Models link */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                  ADU Floor Plans
                </div>
                <p className="text-xs text-stone-500 leading-relaxed mb-3">
                  Studio through 2-bedroom pre-designed models starting from $95,000.
                </p>
                <Link
                  href="/adu-models"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Browse ADU models <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Lead form ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-stone-50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Free Assessment
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Ready to Build Your ADU?
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                Get a free property assessment and all-inclusive cost estimate from the
                ADU Build LA team. We cover design, engineering, permitting, and full
                construction under one contract.
              </p>
              <ul className="space-y-3.5">
                {[
                  "Lot review and ADU feasibility confirmation",
                  "All-inclusive price estimate for your specific property",
                  "Permit timeline based on your city",
                  "Response within 1 business day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-stone-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                Get a Free Property Assessment
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                No cost, no obligation. We respond within 1 business day.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <FaqSection
        items={articleFaqItems}
        eyebrow="ADU Questions"
        heading="Common Questions About ADUs in Los Angeles"
        subheading="Answers to what homeowners ask most before starting an ADU project."
        variant="white"
      />

      {/* ── Related links ─────────────────────────────────────────────────── */}
      <RelatedLinksSection
        items={relatedLinkItems}
        eyebrow="Explore Further"
        heading="Services & City Guides"
        subheading="Relevant services and city-specific ADU guides from ADU Build LA."
        viewAllHref="/services"
        viewAllLabel="View all services"
        variant="stone-50"
      />

      {/* ── Related posts ─────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-2">
                  Keep Reading
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-stone-900">
                  More ADU Guides
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                All articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(relatedPosts as RelatedPostItem[]).map((p: RelatedPostItem) => (
                <PostCard
                  key={p.id}
                  title={p.title}
                  slug={p.slug}
                  fullPath={p.fullPath}
                  excerpt={p.excerpt}
                  featuredImageUrl={p.featuredImageUrl}
                  publishedAt={p.publishedAt}
                  readingTimeMinutes={p.readingTimeMinutes}
                  authorName={p.author.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Configurator CTA ─────────────────────────────────────────────── */}
      <ConfiguratorCta
        heading="Ready to go from reading to planning?"
        sub="Design your ADU step by step with our interactive configurator — choose type, size, finishes, and style. See a matching floor plan and budget estimate in minutes."
      />

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-stone-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
            Ready to Build?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Start Your ADU Project Today
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            Join over 200 Los Angeles homeowners who have added rental income and lasting
            property value with an ADU from ADU Build LA.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors min-h-[52px]"
            >
              Request a Free Estimate
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
            >
              View Our Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
