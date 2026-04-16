import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getPublishedServices } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildFaqSchema } from "@/lib/schema/faq";
import { parseSections } from "@/types/sections";
import { IntroSection } from "@/components/public/sections/IntroSection";
import { CtaSection } from "@/components/public/sections/CtaSection";
import { ConfiguratorCta } from "@/components/public/sections/ConfiguratorCta";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { RelatedLinksSection } from "@/components/public/sections/RelatedLinksSection";
import { ServiceCard } from "@/components/public/cards/ServiceCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { SERVICE_FAQS } from "@/data/faqs";
import { getAllLocations } from "@/data/locations";
import { getModelsForService } from "@/data/aduModels";
import { getProjectsByService } from "@/data/projects";
import {
  CheckCircle2,
  ArrowLeft,
  Star,
  Shield,
  Clock,
  Users,
  Home,
  Hammer,
  FileCheck,
  PenTool,
  Layers,
  Building2,
} from "lucide-react";
import type { ElementType } from "react";

export const revalidate = 3600;

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

const getService = cache(async (slug: string) => {
  return prisma.servicePage.findUnique({ where: { slug } });
});

const serviceIconMap: Record<string, ElementType> = {
  "pencil-ruler": PenTool,
  "file-check": FileCheck,
  "hard-hat": Hammer,
  home: Home,
  layout: Layers,
  building: Building2,
  building2: Building2,
  "pen-tool": PenTool,
  hammer: Hammer,
  layers: Layers,
};

export async function generateStaticParams() {
  try {
    const services = await prisma.servicePage.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  const settings = await getSiteSettings();
  return buildMetadata({
    title: service.seoTitle ?? service.name,
    description: service.seoDescription ?? service.shortDescription ?? undefined,
    canonical: service.canonicalUrl ?? service.fullPath,
    ogTitle: service.ogTitle ?? undefined,
    ogDescription: service.ogDescription ?? undefined,
    ogImageUrl: service.ogImageUrl ?? undefined,
    noIndex: !service.indexPage,
    siteUrl: settings?.siteUrl,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  const [service, settings, allServices] = await Promise.all([
    getService(slug),
    getSiteSettings(),
    getPublishedServices(),
  ]);
  // Exclude current service from the related list (already in cache — no extra query)
  const relatedServices = allServices.filter((s) => s.slug !== slug).slice(0, 3);

  if (!service || service.status !== "published") notFound();

  const siteUrl =
    settings?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";
  const sections = parseSections(service.sections);
  const introSection = sections.find((s) => s.type === "intro");
  const ctaSection = sections.find((s) => s.type === "cta");

  const ServiceIcon = (service.iconName && serviceIconMap[service.iconName]) || Home;

  // ── Related links for cross-navigation ───────────────────────────────────
  const relatedLocations = getAllLocations();
  const relatedModels = getModelsForService(slug, 3);
  const relatedProjects = getProjectsByService(slug);

  const relatedLinkItems = [
    // City guides — always show all 5
    ...relatedLocations.map((loc) => ({
      href: loc.fullPath,
      typeLabel: "City Guide",
      title: `ADU Builder in ${loc.name}`,
      description: loc.heroTagline,
    })),
    // Matched models
    ...relatedModels.map((m) => ({
      href: m.fullPath,
      typeLabel: "ADU Model",
      title: m.name,
      description: m.tagline,
    })),
    // Matched completed projects
    ...relatedProjects.map((p) => ({
      href: p.fullPath,
      typeLabel: "Completed Project",
      title: p.name,
      description: p.heroTagline,
    })),
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: service.name, url: service.fullPath },
    ],
    siteUrl
  );

  const faqSchema = buildFaqSchema(SERVICE_FAQS);

  const whyUs = [
    "ADU-exclusive contractor — 100% focused on accessory dwelling units",
    "In-house design, architecture, and engineering team",
    "Full-service permitting and city approval management",
    "Licensed, bonded, and insured general contractor (CSLB)",
    "1-year workmanship warranty on every completed project",
    "Transparent fixed-price contracts with no hidden change orders",
  ];

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

      {/* ── Service Hero ─────────────────────────────────────────────────── */}
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
                <Link href="/services" className="hover:text-stone-300 transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">{service.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {/* Service category badge with icon */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide mb-7">
              <ServiceIcon className="w-3.5 h-3.5" />
              ADU Service · Los Angeles
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              {service.name}
            </h1>

            {service.shortDescription && (
              <p className="text-base sm:text-lg text-stone-400 leading-relaxed mb-7 sm:mb-9 max-w-2xl">
                {service.shortDescription}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 min-h-[52px]"
              >
                Get a Free Estimate
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Services
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

      {/* ── Intro Content from DB ─────────────────────────────────────────── */}
      {introSection?.type === "intro" && <IntroSection section={introSection} />}

      {/* ── Why ADU Build LA ─────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Why ADU Build LA
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-5">
                ADU-Exclusive Expertise You Can Trust
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                We&apos;re not a general contractor that occasionally builds ADUs. Every project we
                take is an ADU — which means our team has seen every scenario, navigated every
                city, and refined every process around this one type of work.
              </p>
              <ul className="space-y-3.5">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-stone-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats column */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "200+", label: "ADUs Completed", sub: "Across Los Angeles County" },
                {
                  value: "15+",
                  label: "Years Experience",
                  sub: "ADU design & construction",
                },
                { value: "4.9★", label: "Google Rating", sub: "From verified homeowners" },
                { value: "$150K", label: "Starting Price", sub: "Fully inclusive pricing" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm"
                >
                  <div className="text-3xl font-bold text-stone-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-stone-800">{stat.label}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead Form ────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left copy */}
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Free Estimate
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Get a Free Estimate for {service.name}
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                Tell us about your property and your goals. We&apos;ll review your site and provide
                a detailed cost and timeline estimate — at no charge, with no obligation.
              </p>
              <ul className="space-y-3.5 mb-8">
                {[
                  "Property feasibility review at no cost",
                  "Realistic cost range based on your specific lot",
                  "Estimated timeline from design through occupancy",
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
              <p className="text-stone-400 text-sm">
                No spam. No pressure. We serve homeowners across Los Angeles County.
              </p>
            </div>

            {/* Right: form card */}
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
        items={SERVICE_FAQS}
        eyebrow="Common Questions"
        heading={`${service.name} — Frequently Asked Questions`}
        subheading="What Los Angeles homeowners ask most before starting an ADU project."
        variant="stone-50"
      />

      {/* ── Related Services ─────────────────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-2">
                  Also Available
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-stone-900">
                  Other ADU Services
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
              {relatedServices.map((s) => (
                <ServiceCard
                  key={s.id}
                  name={s.name}
                  fullPath={s.fullPath}
                  shortDescription={s.shortDescription}
                  iconName={s.iconName}
                />
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                View all services →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Resources ────────────────────────────────────────────── */}
      <RelatedLinksSection
        items={relatedLinkItems}
        eyebrow="Explore Further"
        heading="Cities, Models & Projects"
        subheading="Discover where we build, which ADU models fit this service, and completed projects from our portfolio."
        viewAllHref="/projects"
        viewAllLabel="View all projects"
        variant="stone-50"
      />

      {/* ── Configurator CTA ─────────────────────────────────────────────── */}
      <ConfiguratorCta
        heading="Want to see what your ADU could look like?"
        sub="Our interactive configurator lets you choose type, size, finishes, and exterior style — and shows you matching floor plans with a live budget estimate."
      />

      {/* ── DB CTA Section ───────────────────────────────────────────────── */}
      {ctaSection?.type === "cta" && <CtaSection section={ctaSection} />}
    </>
  );
}
