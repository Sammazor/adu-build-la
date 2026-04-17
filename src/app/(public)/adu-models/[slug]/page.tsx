import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices, type PublishedService } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildFaqSchema } from "@/lib/schema/faq";
import { getAllModelSlugs, getModelBySlug } from "@/data/aduModels";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { ConfiguratorCta } from "@/components/public/sections/ConfiguratorCta";
import { TrustSection } from "@/components/public/sections/TrustSection";
import { RelatedLinksSection } from "@/components/public/sections/RelatedLinksSection";
import { getProjectsByModel } from "@/data/projects";
import { ServiceCard } from "@/components/public/cards/ServiceCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  Shield,
  Clock,
  Users,
  Maximize2,
} from "lucide-react";

export const revalidate = 3600;

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllModelSlugs();
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) return {};
  return buildMetadata({
    title: model.seoTitle.replace(" | ADU Build LA", ""),
    description: model.seoDescription,
    canonical: model.fullPath,
  });
}

export default async function AduModelDetailPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";

  const relatedServices: PublishedService[] = (await getPublishedServices()).slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "ADU Models", url: "/adu-models" },
      { name: model.name, url: model.fullPath },
    ],
    siteUrl
  );

  const faqSchema = buildFaqSchema(model.faqs);

  const bedsLabel = model.specs.beds === "Studio" ? "Studio" : `${model.specs.beds} Bed`;
  const bathsLabel = `${model.specs.baths} Bath`;

  // ── Related links for cross-navigation ───────────────────────────────────
  const modelProjects = getProjectsByModel(model.slug);
  const modelProjectItems = modelProjects.map((p) => ({
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
                <Link href="/adu-models" className="hover:text-stone-300 transition-colors">
                  ADU Models
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">{model.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end">
            {/* Left: text */}
            <div>
              <div className="flex items-center gap-2.5 mb-6 sm:mb-7 flex-wrap">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
                  <Maximize2 className="w-3.5 h-3.5" />
                  {model.modelType === "garage-conversion" ? "Garage Conversion" : "Detached ADU"}
                </div>
                {model.badge && (
                  <span className="px-3 py-1.5 rounded-full bg-amber-500 text-stone-900 text-xs font-bold">
                    {model.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.0] tracking-tight mb-4 sm:mb-5">
                {model.heroHeading}
              </h1>
              <p className="text-base sm:text-lg text-stone-400 leading-relaxed mb-7 sm:mb-8 max-w-xl">
                {model.heroSubheading}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 min-h-[52px]"
                >
                  Get a Free Estimate
                </Link>
                <Link
                  href="/adu-models"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  All Models
                </Link>
              </div>
            </div>

            {/* Right: specs panel */}
            <div className="bg-stone-800/50 border border-stone-700/50 rounded-3xl p-7 backdrop-blur-sm">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">
                Model Specifications
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: `${model.specs.sqFt} sq ft`, label: "Total Area" },
                  { value: bedsLabel, label: "Sleeping" },
                  { value: bathsLabel, label: "Bathroom" },
                  { value: `${model.specs.floors} Floor${model.specs.floors > 1 ? "s" : ""}`, label: "Structure" },
                  { value: model.specs.ceilingHeight, label: "Ceiling Height" },
                  { value: model.startingFrom, label: "Starting From" },
                ].map((spec) => (
                  <div key={spec.label} className="bg-stone-800/60 rounded-xl px-4 py-3">
                    <div className="text-white font-bold text-sm leading-none">{spec.value}</div>
                    <div className="text-stone-500 text-xs mt-1">{spec.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                {model.startingFromNote}
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

      {/* ── Ideal Use Cases ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Designed For
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-5">
                {model.idealForHeading}
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                {model.idealForBody}
              </p>
              <ul className="space-y-3.5">
                {model.idealForItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-stone-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  value: `${model.specs.sqFt} sq ft`,
                  label: "Livable Area",
                  sub: "Thoughtfully planned",
                },
                {
                  value: bedsLabel,
                  label: "Sleeping Space",
                  sub: model.specs.beds === "Studio" ? "Open plan" : "Private bedroom",
                },
                {
                  value: bathsLabel,
                  label: "Bathroom",
                  sub: "Full bath included",
                },
                {
                  value: model.startingFrom,
                  label: "Starting Price",
                  sub: "All-inclusive",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-stone-50 rounded-2xl p-6 border border-stone-200"
                >
                  <div className="text-2xl font-bold text-stone-900 mb-1 leading-none">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-stone-800">{stat.label}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features & Inclusions ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              What&apos;s Included
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-4">
              Complete Inclusions — Design Through Delivery
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              Every {model.name} includes design, engineering, permitting, and full
              construction. Here&apos;s exactly what&apos;s in scope.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {model.featureGroups.map((group) => (
              <div
                key={group.category}
                className="bg-white rounded-2xl border border-stone-200 p-6"
              >
                <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide mb-4 pb-3 border-b border-stone-100">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-stone-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
                Pricing
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                {model.name} Starting From{" "}
                <span className="text-amber-400">{model.startingFrom}</span>
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-6">
                {model.startingFromNote}
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

            <div className="bg-stone-800/50 border border-stone-700/60 rounded-3xl p-8">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
                What Affects Your Final Price
              </div>
              <ul className="space-y-4">
                {[
                  {
                    factor: "Site Conditions",
                    note: "Soil type, slope, and access affect foundation and site work costs.",
                  },
                  {
                    factor: "Finish Tier",
                    note: "Standard, Premium, and Luxury finish tiers are available at each model level.",
                  },
                  {
                    factor: "Optional Upgrades",
                    note: "Covered patio, solar rough-in, EV charger, upgraded appliances, and more.",
                  },
                  {
                    factor: "City Permit Fees",
                    note: "Permit fees vary by jurisdiction — LADBS, Santa Monica, Pasadena, and others differ.",
                  },
                ].map((item) => (
                  <li key={item.factor} className="border-b border-stone-700/50 pb-4 last:border-0 last:pb-0">
                    <div className="font-semibold text-white text-sm mb-1">{item.factor}</div>
                    <div className="text-stone-500 text-xs leading-relaxed">{item.note}</div>
                  </li>
                ))}
              </ul>
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
                Get a Free Estimate for the {model.name}
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                Tell us about your property. We&apos;ll confirm whether the {model.name} works
                on your lot, provide a site-specific price estimate, and walk you through
                next steps — at no charge, no commitment.
              </p>
              <ul className="space-y-3.5">
                {[
                  `Confirm ${model.name} buildability on your lot`,
                  "Site-specific all-inclusive price estimate",
                  "Permit timeline based on your city and jurisdiction",
                  "Finish tier options and upgrade pricing",
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
        items={model.faqs}
        eyebrow="Common Questions"
        heading={`${model.name} — Frequently Asked Questions`}
        contactPrompt="Have more questions about the model?"
        variant="stone-50"
      />

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <TrustSection
        variant="dark"
        eyebrow="Why ADU Build LA"
        heading="Built by an ADU-Exclusive Team"
        subheading="Every project we take is an ADU — which means our team has refined every process, navigated every city permit office, and resolved every site challenge around this one type of work."
      />

      {/* ── Related Services ─────────────────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-2">
                  Next Steps
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-stone-900">
                  Services Included With Every {model.name}
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
        items={modelProjectItems}
        eyebrow="From Our Portfolio"
        heading={`Projects Built Using the ${model.name}`}
        subheading="See how this model performs in real Los Angeles builds — real costs, real timelines, real outcomes."
        viewAllHref="/projects"
        viewAllLabel="Browse all projects"
        variant="white"
      />

      {/* ── Configurator CTA ─────────────────────────────────────────────── */}
      <ConfiguratorCta
        heading="Want to customize beyond this model?"
        sub="Our interactive configurator lets you adjust size, finishes, exterior style, and more — then shows you matching floor plans and a live budget estimate."
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-stone-950">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
            Ready to Build?
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Start Your {model.name} Project
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
              href="/adu-models"
              className="px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors"
            >
              Compare Other Models
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
