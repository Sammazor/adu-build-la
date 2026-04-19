import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildFaqSchema } from "@/lib/schema/faq";
import {
  getServiceLocationPage,
  getAllServiceLocationParams,
} from "@/lib/data/serviceLocationPages";
import { getLocationBySlug } from "@/lib/data/locations";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { TrustSection } from "@/components/public/sections/TrustSection";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { ArrowLeft, CheckCircle2, Star, Shield, Clock, Users } from "lucide-react";

export const revalidate = 3600;

interface ServiceLocationPageProps {
  params: Promise<{ slug: string; serviceSlug: string }>;
}

export async function generateStaticParams() {
  const params = await getAllServiceLocationParams();
  return params.map((p) => ({
    slug: p.locationSlug,
    serviceSlug: p.serviceSlug,
  }));
}

export async function generateMetadata({ params }: ServiceLocationPageProps): Promise<Metadata> {
  const { slug, serviceSlug } = await params;
  const page = await getServiceLocationPage(slug, serviceSlug);
  if (!page) return {};
  return buildMetadata({
    title: page.seoTitle.replace(" | ADU Build LA", ""),
    description: page.seoDescription,
    canonical: page.fullPath,
  });
}

export default async function ServiceLocationPage({ params }: ServiceLocationPageProps) {
  const { slug, serviceSlug } = await params;
  const page = await getServiceLocationPage(slug, serviceSlug);
  if (!page) notFound();

  const location = await getLocationBySlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Locations", url: "/locations" },
      { name: page.locationName, url: page.relatedLocationPath },
      { name: page.serviceName, url: page.fullPath },
    ],
    siteUrl
  );

  const faqSchema = buildFaqSchema(page.faqs);

  const trustItems = [
    { Icon: Star, label: "4.9 / 5 Rating", sub: "Google Reviews" },
    { Icon: Shield, label: "Licensed & Insured", sub: "CA General Contractor" },
    { Icon: Users, label: "200+ ADUs Built", sub: "Across LA County" },
    { Icon: Clock, label: "15+ Years", sub: "In Business" },
  ];

  return (
    <>
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

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-24 lg:pb-32">
          {/* Breadcrumb */}
          <nav className="mb-8 sm:mb-10" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <li>
                <Link href="/" className="hover:text-stone-300 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li>
                <Link href="/locations" className="hover:text-stone-300 transition-colors">
                  Locations
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li>
                <Link
                  href={page.relatedLocationPath}
                  className="hover:text-stone-300 transition-colors"
                >
                  {page.locationName}
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">{page.serviceName}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {/* Service + city badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              {page.heroTagline}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              {page.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-stone-400 leading-relaxed mb-7 sm:mb-9 max-w-2xl">
              {page.heroSubheading}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 min-h-[52px]"
              >
                Get a Free Estimate
              </Link>
              <Link
                href={page.relatedLocationPath}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to {page.locationName}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <item.Icon className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900 leading-none">
                    {item.label}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why This Service in This City ────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Why It Matters
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-8">
              {page.whyHeading}
            </h2>
            <div className="space-y-5">
              {page.whyParagraphs.map((para, i) => (
                <p key={i} className="text-stone-500 text-lg leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── City-Specific Considerations ─────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
            {page.locationName} Details
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-3">
            {page.considerationsHeading}
          </h2>
          <p className="text-stone-500 text-lg mb-10 max-w-2xl">
            Key factors that shape how we approach {page.serviceName.toLowerCase()} in{" "}
            {page.locationName}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {page.considerations.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2 text-sm leading-snug">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
                Pricing in {page.locationName}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                {page.pricingHeading}
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-6">{page.pricingIntro}</p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Design, architecture & engineering included",
                  "Permitting and city approval management included",
                  "Full construction and site work included",
                  "Final inspection and certificate of occupancy included",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-stone-400">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/estimate"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-colors"
              >
                Get a Custom Estimate
              </Link>
            </div>

            {/* Right: pricing table */}
            <div className="space-y-3">
              {page.pricingRanges.map((item) => (
                <div
                  key={item.type}
                  className="bg-stone-800/50 border border-stone-700/60 rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-semibold text-white text-sm">{item.type}</div>
                    <div className="text-stone-500 text-xs mt-0.5">{item.note}</div>
                  </div>
                  <div className="text-amber-400 font-bold text-sm whitespace-nowrap shrink-0">
                    {item.range}
                  </div>
                </div>
              ))}
              <p className="text-stone-600 text-xs pt-1 px-1">
                * All-inclusive pricing. Final cost depends on scope and site conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead Form ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Free Estimate
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Get a Free {page.serviceName} Estimate in {page.locationName}
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                We&apos;ll review your property, assess your {page.locationName} zoning and permit
                requirements, and give you a detailed cost and timeline estimate — at no charge,
                with no obligation.
              </p>
              <ul className="space-y-3.5 mb-6">
                {[
                  `${page.locationName}-specific feasibility review for your lot`,
                  `Realistic cost range for your ${page.serviceName.toLowerCase()} project`,
                  "Timeline from design through certificate of occupancy",
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

              {/* Related navigation */}
              <div className="pt-5 border-t border-stone-100 space-y-2">
                <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wide">
                  Related pages
                </p>
                <Link
                  href={page.relatedLocationPath}
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors group"
                >
                  <span className="text-amber-500 group-hover:text-amber-600 transition-colors">→</span>
                  All ADU services in {page.locationName}
                </Link>
                <Link
                  href={page.relatedServicePath}
                  className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors group"
                >
                  <span className="text-amber-500 group-hover:text-amber-600 transition-colors">→</span>
                  {page.serviceName} across all locations
                </Link>
                {page.relatedPaths?.map((rp) => (
                  <Link
                    key={rp.href}
                    href={rp.href}
                    className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors group"
                  >
                    <span className="text-amber-500 group-hover:text-amber-600 transition-colors">→</span>
                    {rp.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">
                Request Your Free Estimate
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                We&apos;ll be in touch within 1 business day.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqSection
        items={page.faqs}
        eyebrow="Common Questions"
        heading={`${page.serviceName} in ${page.locationName}: FAQ`}
        variant="stone-50"
      />

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <TrustSection
        variant="dark"
        eyebrow="Why ADU Build LA"
        heading="ADU Expertise You Can Count On"
        subheading={`We specialize in ${page.serviceName.toLowerCase()} across ${page.locationName} and the surrounding area — navigating local zoning, permit processes, and site conditions that generalist contractors don't know.`}
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
            Ready to Start?
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            {page.serviceName} in {page.locationName}
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            Join over 200 Los Angeles homeowners who have added rental income and lasting property
            value with an ADU from ADU Build LA. Your free estimate is the first step.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/estimate"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-colors"
            >
              Request a Free Estimate
            </Link>
            <Link
              href={page.relatedLocationPath}
              className="px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors"
            >
              Back to {page.locationName}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
