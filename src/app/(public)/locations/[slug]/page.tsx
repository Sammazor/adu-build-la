import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices, type PublishedService } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildFaqSchema } from "@/lib/schema/faq";
import { getAllLocationSlugs, getLocationBySlug } from "@/lib/data/locations";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { ConfiguratorCta } from "@/components/public/sections/ConfiguratorCta";
import { TrustSection } from "@/components/public/sections/TrustSection";
import { RelatedLinksSection } from "@/components/public/sections/RelatedLinksSection";
import { getProjectsByLocation } from "@/lib/data/projects";
import { ServiceCard } from "@/components/public/cards/ServiceCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Star,
  Shield,
  Clock,
  Users,
} from "lucide-react";

export const revalidate = 3600;

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLocationSlugs();
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) return {};
  return buildMetadata({
    title: location.seoTitle.replace(" | ADU Build LA", ""),
    description: location.seoDescription,
    canonical: location.fullPath,
  });
}

export default async function LocationDetailPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";

  const relatedServices: PublishedService[] = (await getPublishedServices()).slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Locations", url: "/locations" },
      { name: location.name, url: location.fullPath },
    ],
    siteUrl
  );

  const faqSchema = buildFaqSchema(location.faqs);

  // ── Related links for cross-navigation ───────────────────────────────────
  const locationProjects = await getProjectsByLocation(location.slug);
  const locationProjectItems = locationProjects.map((p) => ({
    href: p.fullPath,
    typeLabel: "Completed Project",
    title: p.name,
    description: p.heroTagline,
  }));

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
            <ol className="flex items-center gap-2 text-xs text-stone-500">
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
              <li className="text-stone-400">{location.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              {location.heroTagline}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              {location.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-stone-400 leading-relaxed mb-7 sm:mb-9 max-w-2xl">
              {location.heroSubheading}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 min-h-[52px]"
              >
                Get a Free Estimate
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Locations
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

      {/* ── Why Build an ADU Here ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: intro + benefits */}
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Why {location.name}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-6">
                {location.introHeading}
              </h2>
              <div className="space-y-4 mb-8">
                {location.introParagraphs.map((para, i) => (
                  <p key={i} className="text-stone-500 text-lg leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
              <ul className="space-y-3.5">
                {location.benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-stone-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: city-specific stats */}
            <div className="grid grid-cols-2 gap-4">
              {location.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-stone-50 rounded-2xl p-6 border border-stone-200 text-center"
                >
                  <div className="text-2xl font-bold text-stone-900 mb-1.5 leading-none">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-stone-700 leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Permit & Zoning Notes ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Permits & Zoning
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-3">
              {location.permitHeading}
            </h2>
            <p className="text-stone-500 text-lg mb-10">
              What {location.name} homeowners need to know before starting an ADU project.
            </p>

            <div className="space-y-3">
              {location.permitNotes.map((note) => (
                <details
                  key={note.title}
                  className="group bg-white border border-stone-200 rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-semibold text-stone-900 hover:bg-stone-50 transition-colors select-none text-sm">
                    <span>{note.title}</span>
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 ml-4 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-5 pt-1 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                    {note.body}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Expectations ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
                Pricing in {location.name}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                ADUs Starting From{" "}
                <span className="text-amber-400">$150,000</span>
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-6">
                {location.pricingIntro}
              </p>
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
              {location.pricingRanges.map((item) => (
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
                Get a Free Estimate for Your {location.name} Property
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                We&apos;ll assess your property, review your {location.name} zoning, and provide a
                detailed cost and timeline estimate — at no charge, with no obligation.
              </p>
              <ul className="space-y-3.5 mb-6">
                {[
                  `${location.name}-specific feasibility review for your lot`,
                  "Realistic all-inclusive cost range for your ADU type",
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
              {location.nearbyAreas.length > 0 && (
                <div className="pt-5 border-t border-stone-100">
                  <p className="text-xs text-stone-400 mb-2 font-medium uppercase tracking-wide">
                    Also serving nearby
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {location.nearbyAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
        items={location.faqs}
        eyebrow="Common Questions"
        heading={`ADU Questions for ${location.name} Homeowners`}
        variant="stone-50"
      />

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <TrustSection
        variant="dark"
        eyebrow="Why ADU Build LA"
        heading="ADU Expertise You Can Count On"
        subheading={`We've built ADUs across ${location.name} and the surrounding area — navigating local zoning, permit processes, and site conditions that generalist contractors don't know.`}
      />

      {/* ── Related Services ─────────────────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-2">
                  Our Services
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-stone-900">
                  ADU Services Available in {location.name}
                </h2>
              </div>
              <Link
                href="/services"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                View all services →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServices.map((s: PublishedService) => (
                <ServiceCard
                  key={s.id}
                  name={s.name}
                  fullPath={s.fullPath}
                  shortDescription={s.shortDescription}
                  iconName={s.iconName}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Projects ─────────────────────────────────────────────── */}
      <RelatedLinksSection
        items={locationProjectItems}
        eyebrow="From Our Portfolio"
        heading={`ADU Projects in ${location.name}`}
        subheading={`Real completed projects from our team in ${location.name} — see the challenge, solution, and results.`}
        viewAllHref="/projects"
        viewAllLabel="Browse all projects"
        variant="white"
      />

      {/* ── Configurator CTA ─────────────────────────────────────────────── */}
      <ConfiguratorCta
        heading={`Planning an ADU in ${location.name}?`}
        sub="Design your ADU in our interactive configurator — choose type, size, style, and finishes. Get a matching floor plan and budget estimate before you talk to anyone."
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-stone-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
            Ready to Start?
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Build Your ADU in {location.name}
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            Join over 200 Los Angeles homeowners who have added rental income and lasting
            property value with an ADU from ADU Build LA. Your free estimate is the first step.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/estimate"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-colors"
            >
              Request a Free Estimate
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
