import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildFaqSchema } from "@/lib/schema/faq";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { parseSections } from "@/types/sections";
import { RichTextSection } from "@/components/public/sections/RichTextSection";
import { IntroSection } from "@/components/public/sections/IntroSection";
import { CtaSection } from "@/components/public/sections/CtaSection";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { HeroSection } from "@/components/public/sections/HeroSection";
import { ChevronRight } from "lucide-react";

export const revalidate = 3600;

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

const getPage = cache(async (slug: string) => {
  return prisma.page.findUnique({ where: { slug } });
});

// ── Static params for published pages ────────────────────────────────────────

const slugsQuery = () =>
  prisma.page.findMany({ where: { status: "published" }, select: { slug: true } });

type PageSlug = Awaited<ReturnType<typeof slugsQuery>>[number];

export async function generateStaticParams() {
  try {
    const pages: PageSlug[] = await slugsQuery();
    return pages.map((p: PageSlug) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== "published") return {};

  const settings = await getSiteSettings();
  return buildMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? undefined,
    canonical: page.canonicalUrl ?? `/${page.slug}`,
    ogTitle: page.ogTitle ?? undefined,
    ogDescription: page.ogDescription ?? undefined,
    ogImageUrl: page.ogImageUrl ?? undefined,
    noIndex: !page.indexPage,
    siteUrl: settings?.siteUrl,
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params;

  const page = await getPage(slug);

  // Only render published pages publicly
  if (!page || page.status !== "published") notFound();

  const settings = await getSiteSettings();
  const siteUrl = settings?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";

  const sections = parseSections(page.sections);

  // Extract FAQ sections for JSON-LD
  const faqSections = sections.filter((s) => s.type === "faq_list");
  const allFaqItems = faqSections.flatMap((s) =>
    s.type === "faq_list" ? s.items.map((item) => ({ q: item.q, a: item.a })) : []
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: page.title, url: `${siteUrl}/${page.slug}` },
  ], siteUrl);

  const hasHero =
    page.heroHeading ||
    page.heroSubheading ||
    page.heroCtaPrimaryLabel ||
    page.heroImageUrl;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {allFaqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildFaqSchema(allFaqItems)),
          }}
        />
      )}

      {/* Hero */}
      {hasHero ? (
        <HeroSection
          heading={page.heroHeading ?? page.title}
          subheading={page.heroSubheading ?? undefined}
          ctaPrimaryLabel={page.heroCtaPrimaryLabel ?? undefined}
          ctaPrimaryUrl={page.heroCtaPrimaryUrl ?? undefined}
          ctaSecondaryLabel={page.heroCtaSecondaryLabel ?? undefined}
          ctaSecondaryUrl={page.heroCtaSecondaryUrl ?? undefined}
        />
      ) : (
        /* Minimal title banner when no hero configured */
        <div className="bg-stone-950 text-white py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
              <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-stone-300">{page.title}</span>
            </nav>
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">{page.title}</h1>
            {page.seoDescription && (
              <p className="mt-4 text-stone-400 text-lg max-w-2xl">{page.seoDescription}</p>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      {sections.map((section, index) => {
        if (section.type === "rich_text") {
          return (
            <section key={index} className="py-16 lg:py-20 bg-white">
              <div className="max-w-3xl mx-auto px-6">
                <RichTextSection section={section} />
              </div>
            </section>
          );
        }
        if (section.type === "intro") {
          return <IntroSection key={index} section={section} />;
        }
        if (section.type === "cta") {
          return <CtaSection key={index} section={section} />;
        }
        if (section.type === "faq_list") {
          return (
            <FaqSection
              key={index}
              items={section.items.map((item) => ({ q: item.q, a: item.a }))}
              heading="Frequently Asked Questions"
              contactPrompt={null}
            />
          );
        }
        return null;
      })}

      {/* Empty state for pages with no sections */}
      {sections.length === 0 && !hasHero && (
        <div className="py-20 text-center text-stone-400 text-sm">
          This page has no content yet.
        </div>
      )}
    </>
  );
}
