import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings, getPublishedServices, type PublishedService } from "@/lib/data/settings";
import { getPageOverride } from "@/lib/data/sitePageOverrides";
import { HeroSection } from "@/components/public/sections/HeroSection";
import { ServiceCard } from "@/components/public/cards/ServiceCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildFaqSchema } from "@/lib/schema/faq";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { TrustSection } from "@/components/public/sections/TrustSection";
import { SocialProofSection } from "@/components/public/sections/SocialProofSection";
import { ServedAreasSection } from "@/components/public/sections/ServedAreasSection";
import { FeaturedProjectCard } from "@/components/public/cards/FeaturedProjectCard";
import { ConfiguratorCta } from "@/components/public/sections/ConfiguratorCta";
import { GENERAL_FAQS } from "@/data/faqs";
import { getFeaturedProjects } from "@/lib/data/projects";
import {
  CheckCircle2,
  Star,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Phone,
  Home,
  DollarSign,
  FileText,
  MapPin,
  Wrench,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, cms] = await Promise.all([getSiteSettings(), getPageOverride("homepage")]);
  return buildMetadata({
    title: cms?.seoTitle ?? "ADU Design & Build Specialists in Los Angeles",
    description:
      cms?.seoDescription ??
      "Los Angeles ADU contractors. Full-service ADU design, permitting, and construction starting from $150,000. Licensed, insured, 200+ ADUs built across LA County. Free property assessment.",
    canonical: cms?.canonicalUrl ?? "/",
    ogTitle: cms?.ogTitle ?? undefined,
    ogDescription: cms?.ogDescription ?? undefined,
    ogImageUrl: cms?.ogImageUrl ?? undefined,
    noIndex: cms?.indexPage === false,
    siteUrl: settings?.siteUrl,
  });
}

export default async function HomePage() {
  const [services, settings, cms]: [PublishedService[], Awaited<ReturnType<typeof getSiteSettings>>, Awaited<ReturnType<typeof getPageOverride>>] = await Promise.all([
    getPublishedServices(),
    getSiteSettings(),
    getPageOverride("homepage"),
  ]);

  const featuredProjects = await getFeaturedProjects(3);

  const trustItems = [
    { Icon: Shield, label: "Licensed & Insured", sub: "CA General Contractor (B)" },
    { Icon: Star, label: "4.9 / 5 Rating", sub: "94+ Verified Reviews" },
    { Icon: Users, label: "200+ ADUs Built", sub: "Across LA County" },
    { Icon: Clock, label: "15+ Years", sub: "ADU-exclusive since 2009" },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Free Property Assessment",
      description:
        "We review your lot, confirm ADU eligibility, identify the best ADU type for your goals, and give you a realistic all-inclusive price range. No commitment required.",
    },
    {
      number: "02",
      title: "Design & Architecture",
      description:
        "Our in-house design team creates full architectural plans. You'll review 3D renderings and refine the design until it's exactly right — before anything goes to the city.",
    },
    {
      number: "03",
      title: "Permitting & Approvals",
      description:
        "We manage all city submissions, plan check responses, and approvals. We've permitted hundreds of ADUs across LA County — we know every office and every timeline.",
    },
    {
      number: "04",
      title: "Construction & Delivery",
      description:
        "Your dedicated project manager oversees every phase of the build. We deliver a fully inspected, certificate-of-occupancy-ready ADU — on time and on budget.",
    },
  ];

  const pricingItems = [
    {
      type: "Detached ADU",
      range: "$150K – $280K",
      description: "New construction in your rear or side yard",
      href: "/services/adu-construction",
    },
    {
      type: "Garage Conversion",
      range: "$95K – $165K",
      description: "Convert your existing garage into full living space",
      href: "/services/garage-conversion",
    },
    {
      type: "Attached ADU",
      range: "$120K – $220K",
      description: "An addition connected to your primary residence",
      href: "/services/adu-construction",
    },
    {
      type: "Junior ADU (JADU)",
      range: "$60K – $100K",
      description: "Interior conversion, up to 500 sq ft",
      href: "/services/junior-adu",
    },
  ];

  const whatToKnow = [
    {
      Icon: Home,
      title: "Most LA properties can build an ADU",
      body: "Since 2020, California has eliminated most restrictions that previously blocked ADU construction. Minimum lot sizes, owner-occupancy requirements, and overly restrictive setbacks have been removed. If you own a single-family or duplex property in LA County, there's a strong chance you're eligible.",
    },
    {
      Icon: DollarSign,
      title: "ADUs are the highest-ROI home improvement in LA",
      body: "A $150,000–$200,000 ADU investment in Los Angeles typically generates $2,000–$4,200/month in rental income — representing a 15–25% annual gross yield. Beyond rental income, ADUs add more dollar-for-dollar appraised value than almost any other home improvement.",
    },
    {
      Icon: FileText,
      title: "Permitting takes 8–20 weeks — not years",
      body: "LA County has streamlined ADU permitting dramatically since 2020. Most straightforward projects receive permits in 8–16 weeks. Projects in historic districts, coastal zones, or with complex site conditions may take longer — but we've navigated all of them.",
    },
    {
      Icon: MapPin,
      title: "Your city's rules matter as much as state law",
      body: "California sets the baseline, but your city can add requirements. LADBS, Santa Monica, Pasadena, Glendale, and Culver City each have their own plan check processes, design guidelines, and timelines. We've built in all of them — and know exactly what each office expects.",
    },
    {
      Icon: Wrench,
      title: "Design-build is the faster, lower-risk path",
      body: "Hiring a separate architect and then a separate contractor is the most common source of ADU project delays and cost overruns. When one team handles design, permitting, and construction under a single contract, handoffs are eliminated, accountability is clear, and your project moves faster.",
    },
    {
      Icon: Shield,
      title: "Not all ADU contractors are ADU specialists",
      body: "Many general contractors offer ADUs as one of dozens of project types. We've built nothing but ADUs for 15+ years. That specialization means faster permit approvals, fewer surprises during construction, and a team that has solved every ADU challenge you're likely to face.",
    },
  ];

  const faqSchema = buildFaqSchema(GENERAL_FAQS);

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection
        heading={cms?.heroHeading ?? "Los Angeles ADU Design, Permitting & Construction"}
        subheading={cms?.heroSubheading ?? "We're an ADU-only contractor — every project we take is an accessory dwelling unit. Full-service design, permitting, and construction under one contract, starting from $150,000."}
        ctaPrimaryLabel={cms?.heroCtaPrimaryLabel ?? "Get a Free Property Assessment"}
        ctaPrimaryUrl={cms?.heroCtaPrimaryUrl ?? "/estimate"}
        ctaSecondaryLabel={cms?.heroCtaSecondaryLabel ?? "See Completed Projects"}
        ctaSecondaryUrl={cms?.heroCtaSecondaryUrl ?? "/projects"}
        microProof={[
          "No obligation, no pressure",
          "Response within 1 business day",
          "Licensed CA General Contractor",
        ]}
        heroMediaType={(settings?.heroMediaType as "none" | "image" | "video") ?? "none"}
        heroMediaUrl={settings?.heroMediaUrl}
      />

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100" aria-label="Trust indicators">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 sm:py-6">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-x-10 sm:gap-y-4">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <item.Icon className="w-4 h-4 text-amber-600" aria-hidden />
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

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50" aria-labelledby="services-heading">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              What We Do
            </div>
            <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              Full-Service ADU Solutions for LA Homeowners
            </h2>
            <p className="text-stone-500 text-base sm:text-lg leading-relaxed">
              From the first feasibility check to the final inspection — we manage every phase
              of your ADU project in-house. One team, one contract, one point of contact.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {services.map((service: PublishedService) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  fullPath={service.fullPath}
                  shortDescription={service.shortDescription}
                  iconName={service.iconName}
                />
              ))}
            </div>
          ) : (
            <p className="text-stone-500">Services coming soon.</p>
          )}

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-900 transition-colors"
            >
              View all services <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/adu-models"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Browse pre-designed floor plans <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Social Proof ─────────────────────────────────────────────────── */}
      <SocialProofSection />

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-t border-stone-100" aria-labelledby="projects-heading">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 sm:mb-14">
              <div className="max-w-xl">
                <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                  Recent Work
                </div>
                <h2 id="projects-heading" className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
                  ADU Projects We&apos;ve Built Across LA
                </h2>
                <p className="text-stone-500 text-base sm:text-lg leading-relaxed">
                  Every project here was designed, permitted, and built by our team — from garage conversions
                  in Santa Monica to two-story detached units in Culver City.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-stone-900 text-sm font-semibold transition-colors shrink-0 min-h-[44px]"
              >
                View all projects <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featuredProjects.map((project) => (
                <FeaturedProjectCard key={project.slug} project={project} />
              ))}
            </div>

            {/* Mid-page CTA */}
            <div className="mt-10 sm:mt-12 p-6 sm:p-8 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
                  Start your project
                </p>
                <h3 className="text-xl font-bold text-stone-900 leading-snug">
                  Ready to see what&apos;s possible on your property?
                </h3>
                <p className="text-stone-500 text-sm mt-1.5 leading-relaxed max-w-md">
                  Get a free property assessment — we&apos;ll confirm your ADU options and give you
                  a real cost estimate within 1 business day.
                </p>
              </div>
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-sm shadow-amber-500/20 min-h-[48px] shrink-0"
              >
                Get Free Estimate
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Why Us — TrustSection ─────────────────────────────────────────── */}
      <TrustSection
        eyebrow="Why ADU Build LA"
        heading="The ADU Specialists Los Angeles Homeowners Trust"
        subheading="We've built nothing but ADUs for 15+ years. That depth of focus means faster permits, fewer surprises, and better outcomes for your project."
        variant="light"
      />

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-stone-100" aria-labelledby="process-heading">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              How It Works
            </div>
            <h2 id="process-heading" className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              From Property Assessment to Move-In — In 4 Phases
            </h2>
            <p className="text-stone-500 text-base sm:text-lg leading-relaxed">
              A clear, proven process that takes your ADU from idea to fully built, inspected,
              and ready to rent or occupy. No surprises, no hand-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {processSteps.map((step, i) => (
              <div
                key={step.number}
                className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 flex flex-col relative overflow-hidden"
              >
                {/* Step connector line (decorative) */}
                {i < processSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-[2.375rem] -right-3 w-6 h-px bg-stone-300 z-10"
                    aria-hidden
                  />
                )}
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mb-4 shrink-0">
                  <span className="text-stone-900 font-bold text-sm leading-none">{step.number}</span>
                </div>
                <h3 className="font-bold text-stone-900 mb-2 leading-snug text-base">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/estimate"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-sm shadow-amber-500/20 min-h-[52px]"
            >
              Start with a Free Assessment
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── What LA Homeowners Should Know ───────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50 border-t border-stone-100" aria-labelledby="education-heading">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Before You Build
            </div>
            <h2 id="education-heading" className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              What Los Angeles Homeowners Should Know About ADUs
            </h2>
            <p className="text-stone-500 text-base sm:text-lg leading-relaxed">
              ADU rules in California have changed significantly since 2020. Here&apos;s what
              matters most before you start planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {whatToKnow.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <item.Icon className="w-5 h-5 text-amber-600" aria-hidden />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 mb-2 text-base leading-snug">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-900 transition-colors"
            >
              Read our ADU guides <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <span className="hidden sm:block text-stone-300" aria-hidden>·</span>
            <Link
              href="/build-your-custom-adu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Try the ADU configurator <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Configurator CTA ─────────────────────────────────────────────── */}
      <ConfiguratorCta
        heading="Design your ADU before you commit to anything"
        sub="Step through type, size, finishes, and style. See matching floor plans and a live budget estimate in under 5 minutes — free, no obligation."
      />

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-900" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div>
              <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
                Transparent Pricing
              </div>
              <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 sm:mb-5">
                ADU Construction Starting From{" "}
                <span className="text-amber-400">$95,000</span>
              </h2>
              <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
                Every project is custom-priced based on your site, scope, and design. These ranges
                reflect current LA-area construction costs — all-inclusive of design, permitting,
                and full construction. No surprises, no hidden fees.
              </p>
              <ul className="space-y-2.5 mb-7 sm:mb-8">
                {[
                  "Design, architecture, and engineering included",
                  "All permitting and city approval management included",
                  "Full construction, site work, and utilities included",
                  "Final inspection and certificate of occupancy included",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-stone-400">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors min-h-[52px]"
                >
                  Get a Custom Price Estimate <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
                <Link
                  href="/adu-models"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
                >
                  Browse Floor Plans
                </Link>
              </div>
            </div>

            {/* Right: pricing table */}
            <div className="space-y-3">
              {pricingItems.map((item) => (
                <Link
                  key={item.type}
                  href={item.href}
                  className="group bg-stone-800/50 border border-stone-700/60 hover:border-stone-600 rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm group-hover:text-amber-300 transition-colors">
                      {item.type}
                    </div>
                    <div className="text-stone-500 text-xs mt-0.5 truncate">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-amber-400 font-bold text-sm whitespace-nowrap">
                      {item.range}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 transition-colors" aria-hidden />
                  </div>
                </Link>
              ))}
              <p className="text-stone-600 text-xs pt-1 px-1">
                * Pricing includes design, engineering, permitting, and full construction. Final
                cost depends on scope, site conditions, and finish selections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us + Lead Form ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-stone-100" aria-labelledby="estimate-heading">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Benefits */}
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Free, No Obligation
              </div>
              <h2 id="estimate-heading" className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4 sm:mb-5">
                Get Your Free Property Assessment
              </h2>
              <p className="text-stone-500 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
                Tell us about your property and your goals. We&apos;ll confirm what&apos;s buildable,
                recommend the right ADU type, and give you an all-inclusive cost estimate — with no
                pressure and no obligation.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Lot and setback review — confirm your ADU options",
                  "ADU type recommendation based on your goals and budget",
                  "All-inclusive price estimate for design, permitting, and construction",
                  "Permit timeline for your specific city and jurisdiction",
                  "Response within 1 business day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" aria-hidden />
                    </div>
                    <span className="text-stone-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              {/* Trust line */}
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex shrink-0" aria-label="4.9 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden />
                  ))}
                </div>
                <p className="text-sm text-stone-600">
                  <strong className="font-semibold">4.9 / 5</strong> from 94+ verified reviews
                  across Google, Yelp, and Facebook.
                </p>
              </div>
            </div>

            {/* Lead form card */}
            <div className="bg-stone-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <LeadForm variant="estimate" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Served Areas ─────────────────────────────────────────────────── */}
      <ServedAreasSection />

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqSection
        items={GENERAL_FAQS}
        eyebrow="ADU Questions"
        heading="Frequently Asked Questions"
        subheading="Common questions from Los Angeles homeowners considering an ADU project."
        variant="white"
      />

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-950 text-white" aria-labelledby="final-cta-heading">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          {/* Star row */}
          <div className="flex justify-center mb-5" aria-label="5 stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" aria-hidden />
            ))}
          </div>
          <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">
            Ready to Start?
          </div>
          <h2 id="final-cta-heading" className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Your ADU Starts With a Free Conversation
          </h2>
          <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8 max-w-2xl mx-auto">
            Over 200 Los Angeles homeowners have added rental income and lasting property value
            with an ADU from ADU Build LA. The first step is a free, no-pressure property
            assessment — we&apos;ll tell you exactly what&apos;s possible on your lot and what it will cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              href="/estimate"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 min-h-[52px] flex items-center justify-center gap-2"
            >
              Request a Free Property Assessment
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
            >
              <Phone className="w-4 h-4" aria-hidden />
              Talk to an ADU Specialist
            </Link>
          </div>
          <p className="text-sm text-stone-500">
            Not sure where to start?{" "}
            <Link
              href="/build-your-custom-adu"
              className="text-stone-400 hover:text-white underline underline-offset-2 transition-colors font-medium"
            >
              Try the interactive ADU configurator →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
