import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices, type PublishedService } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildFaqSchema } from "@/lib/schema/faq";
import { getAllProjectSlugs, getProjectBySlug, getOtherProjects } from "@/lib/data/projects";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { ConfiguratorCta } from "@/components/public/sections/ConfiguratorCta";
import { TrustSection } from "@/components/public/sections/TrustSection";
import { RelatedLinksSection } from "@/components/public/sections/RelatedLinksSection";
import { getLocationBySlug } from "@/lib/data/locations";
import { getModelBySlug } from "@/lib/data/aduModels";
import { ServiceCard } from "@/components/public/cards/ServiceCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { GENERAL_FAQS } from "@/data/faqs";
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  Shield,
  Clock,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectSlugs();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.seoTitle.replace(" | ADU Build LA", ""),
    description: project.seoDescription,
    canonical: project.fullPath,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";

  const relatedServices: PublishedService[] = (await getPublishedServices()).slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Projects", url: "/projects" },
      { name: project.name, url: project.fullPath },
    ],
    siteUrl
  );

  const faqSchema = buildFaqSchema(GENERAL_FAQS.slice(0, 6));

  const bedsLabel =
    project.beds === "Studio" ? "Studio" : `${project.beds} Bed`;

  // ── Related links for cross-navigation ───────────────────────────────────
  const relatedLocation = project.relatedLocationSlug
    ? await getLocationBySlug(project.relatedLocationSlug)
    : undefined;
  const relatedModel = project.relatedModelSlug
    ? await getModelBySlug(project.relatedModelSlug)
    : undefined;
  const otherProjects = await getOtherProjects(project.slug, 2);

  const exploreItems = [
    ...(relatedLocation
      ? [
          {
            href: relatedLocation.fullPath,
            typeLabel: "City Guide",
            title: `ADU Building in ${relatedLocation.name}`,
            description: relatedLocation.heroTagline,
          },
        ]
      : []),
    ...(relatedModel
      ? [
          {
            href: relatedModel.fullPath,
            typeLabel: "ADU Model",
            title: relatedModel.name,
            description: relatedModel.tagline,
          },
        ]
      : []),
    ...otherProjects.map((p) => ({
      href: p.fullPath,
      typeLabel: "Completed Project",
      title: p.name,
      description: p.heroTagline,
    })),
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
                <Link href="/projects" className="hover:text-stone-300 transition-colors">
                  Projects
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">{project.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end">
            {/* Left: text */}
            <div>
              <div className="flex items-center gap-2.5 mb-6 sm:mb-7 flex-wrap">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
                  <MapPin className="w-3.5 h-3.5" />
                  {project.city}
                </div>
                <span className="px-3 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold">
                  {project.projectType}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold">
                  {project.completedYear}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.0] tracking-tight mb-4 sm:mb-5">
                {project.heroHeading}
              </h1>
              <p className="text-base sm:text-lg text-stone-400 leading-relaxed mb-7 sm:mb-8 max-w-xl">
                {project.heroTagline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 min-h-[52px]"
                >
                  Start a Similar Project
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  All Projects
                </Link>
              </div>
            </div>

            {/* Right: project stats panel */}
            <div className="bg-stone-800/50 border border-stone-700/50 rounded-3xl p-7 backdrop-blur-sm">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">
                Project At a Glance
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: `${project.sqFt} sq ft`, label: "Size" },
                  { value: bedsLabel, label: "Bedrooms" },
                  { value: project.projectCost, label: "Project Cost" },
                  { value: project.totalProjectMonths, label: "Total Timeline" },
                  { value: `${project.totalBuildWeeks} weeks`, label: "Construction" },
                  {
                    value: project.monthlyRent ?? project.useCase,
                    label: project.monthlyRent ? "Monthly Rent" : "Use Case",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="bg-stone-800/60 rounded-xl px-4 py-3">
                    <div className="text-white font-bold text-sm leading-none">{stat.value}</div>
                    <div className="text-stone-500 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                All-inclusive project cost covering design, engineering, permitting, construction, and certificate of occupancy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
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

      {/* ── Challenge / Solution / Result ────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Project Story
            </div>
            <h2 className="text-4xl font-bold text-stone-900 leading-tight">
              Challenge, Solution, and Result
            </h2>
          </div>

          <div className="space-y-16">
            {/* Challenge */}
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-stone-400 leading-none">01</span>
                </div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Challenge
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  {project.challenge.heading}
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  {project.challenge.body}
                </p>
              </div>
            </div>

            <div className="border-t border-stone-100" />

            {/* Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-amber-500 leading-none">02</span>
                </div>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Solution
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  {project.solution.heading}
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  {project.solution.body}
                </p>
              </div>
            </div>

            <div className="border-t border-stone-100" />

            {/* Result */}
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-amber-400 leading-none">03</span>
                </div>
                <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                  Result
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  {project.result.heading}
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  {project.result.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Build Highlights ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Key Details
            </div>
            <h2 className="text-4xl font-bold text-stone-900 leading-tight mb-4">
              Build Highlights
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              The specific decisions, solutions, and features that defined this project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.buildHighlights.map((highlight) => (
              <div
                key={highlight}
                className="bg-white rounded-2xl border border-stone-200 px-6 py-5 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-stone-700 text-sm leading-relaxed">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scope / Phase Timeline ───────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Project Timeline
            </div>
            <h2 className="text-4xl font-bold text-stone-900 leading-tight mb-4">
              Phase-by-Phase Breakdown
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              From initial design through certificate of occupancy — every phase, every duration.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div
              aria-hidden
              className="absolute left-6 top-6 bottom-6 w-px bg-stone-200 hidden lg:block"
            />

            <div className="space-y-6">
              {project.scopeItems.map((item, index) => (
                <div
                  key={item.phase}
                  className="relative grid grid-cols-1 lg:grid-cols-[48px_1fr] gap-6 items-start"
                >
                  {/* Step indicator */}
                  <div className="hidden lg:flex w-12 h-12 rounded-full bg-stone-900 border-4 border-white shadow-sm items-center justify-center shrink-0 z-10">
                    <span className="text-amber-400 font-bold text-sm leading-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-bold text-stone-900 text-base">{item.phase}</h3>
                      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold shrink-0 whitespace-nowrap">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total timeline callout */}
          <div className="mt-10 bg-stone-900 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-white font-bold text-sm">Total Project Timeline</div>
                <div className="text-stone-400 text-xs mt-0.5">Design through occupancy</div>
              </div>
            </div>
            <div className="text-amber-400 font-bold text-xl">{project.totalProjectMonths}</div>
          </div>
        </div>
      </section>

      {/* ── Project Economics ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
                Investment
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                Project Cost:{" "}
                <span className="text-amber-400">{project.projectCost}</span>
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-6">
                All-inclusive — covering architectural design, engineering, permitting, full
                construction, and certificate of occupancy. No surprises, no change order
                culture.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Architectural design and engineering",
                  "All permit fees and city approval management",
                  "Full construction — foundation through finish",
                  "Final inspection and certificate of occupancy",
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
                Get a Custom Price Estimate
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-800/50 border border-stone-700/60 rounded-3xl p-8">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
                  Project Summary
                </div>
                <ul className="space-y-4">
                  {[
                    { Icon: MapPin, label: "Location", value: project.city },
                    { Icon: DollarSign, label: "Project Cost", value: project.projectCost },
                    ...(project.monthlyRent
                      ? [{ Icon: TrendingUp, label: "Monthly Rent", value: project.monthlyRent }]
                      : [{ Icon: Users, label: "Use Case", value: project.useCase }]),
                    { Icon: Calendar, label: "Timeline", value: project.totalProjectMonths },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between border-b border-stone-700/50 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <item.Icon className="w-4 h-4 text-stone-500" />
                        <span className="text-stone-400 text-sm">{item.label}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
                Build Something Like This on Your Property
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                Tell us about your property and goals. We&apos;ll confirm what&apos;s buildable,
                recommend the right ADU type and size, and provide a site-specific
                all-inclusive price estimate — free, no commitment.
              </p>
              <ul className="space-y-3.5">
                {[
                  "Lot and setback review — confirm your ADU options",
                  "ADU type recommendation based on your goals",
                  "All-inclusive price estimate",
                  "Permit timeline for your city and jurisdiction",
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
            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">
                Request Your Free Assessment
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                We respond within 1 business day.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqSection
        items={GENERAL_FAQS.slice(0, 6)}
        eyebrow="Common Questions"
        heading="ADU Project FAQs"
        subheading="Answers to what Los Angeles homeowners ask most before starting a project like this one."
        variant="stone-50"
      />

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <TrustSection
        variant="dark"
        eyebrow="Our Track Record"
        heading="200+ ADU Projects Completed in Los Angeles"
        subheading="From the first consultation to the final inspection — every project follows the same disciplined process and is backed by the same team, warranty, and accountability."
      />

      {/* ── Related Services ─────────────────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-2">
                  How We Did It
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-stone-900">
                  Services Behind This Project
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

      {/* ── Explore Further ──────────────────────────────────────────────── */}
      <RelatedLinksSection
        items={exploreItems}
        eyebrow="Keep Exploring"
        heading="Related City Guide, ADU Model & Projects"
        subheading="Dig deeper into the location, the model used in this build, and other completed projects from our portfolio."
        viewAllHref="/projects"
        viewAllLabel="Browse all projects"
        variant="white"
      />

      {/* ── Configurator CTA ─────────────────────────────────────────────── */}
      <ConfiguratorCta
        heading="Inspired by this project? Design your own ADU."
        sub="Use our interactive configurator to choose type, size, finishes, and style. See matching floor plans and get a budget estimate — before talking to anyone."
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-stone-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
            Ready to Build?
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Start Your ADU Project Today
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            Join over 200 Los Angeles homeowners who have added rental income and lasting
            property value with an ADU from ADU Build LA.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/estimate"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-colors"
            >
              Request a Free Estimate
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
