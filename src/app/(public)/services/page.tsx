import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/public/cards/ServiceCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { CheckCircle2, ArrowRight, Star, Shield, Users, Clock } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "ADU Services in Los Angeles",
    description:
      "Full-service ADU design, permitting, and construction in Los Angeles. Explore our services and get a free estimate. ADUs starting from $150,000.",
    canonical: "/services",
  });
}

export default async function ServicesPage() {
  const services = await prisma.servicePage
    .findMany({
      where: { status: "published" },
      orderBy: { createdAt: "asc" },
    })
    .catch(() => []);

  const trustItems = [
    { Icon: Star, label: "4.9 / 5 Rating", sub: "Google Reviews" },
    { Icon: Shield, label: "Licensed & Insured", sub: "CA General Contractor" },
    { Icon: Users, label: "200+ ADUs Built", sub: "Across LA County" },
    { Icon: Clock, label: "15+ Years", sub: "In Business" },
  ];

  const approach = [
    {
      number: "01",
      title: "Design & Architecture",
      description:
        "Our in-house team creates custom plans for your property, handling every zoning and code requirement.",
    },
    {
      number: "02",
      title: "Permitting & Approvals",
      description:
        "We file, track, and respond to all plan check submissions — your project stays on schedule.",
    },
    {
      number: "03",
      title: "Construction & Delivery",
      description:
        "A dedicated project manager oversees your build from groundbreak to final inspection.",
    },
  ];

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
              <li className="text-stone-400">Services</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
              Full-Service ADU Company
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              ADU Services in Los Angeles
            </h1>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
              We handle every aspect of your ADU project — design, permitting, and construction —
              under one roof. Starting from $150,000.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors min-h-[52px]"
              >
                Get a Free Estimate <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
              >
                Talk to a Specialist
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

      {/* ── Services Grid ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Everything Under One Roof
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              Our ADU Services
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              From architectural design through final inspection — we manage every phase.
              Each service page explains exactly what&apos;s included and what to expect.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
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
        </div>
      </section>

      {/* ── Our Approach ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              Our Approach
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              ADU-Exclusive. Start to Finish.
            </h2>
            <p className="text-stone-500 text-lg">
              We don&apos;t build kitchens or remodel bathrooms. ADUs are all we do — which means
              deeper expertise and better results for every homeowner we work with.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approach.map((step) => (
              <div
                key={step.number}
                className="bg-stone-50 rounded-2xl p-7 border border-stone-200"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>
                <h3 className="font-bold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Form ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: copy */}
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Not Sure Where to Start?
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Tell Us About Your Property
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                Every ADU project starts with a property assessment. Share your goals and we&apos;ll
                recommend the right service, walk you through feasibility, and give you a
                realistic cost range — no pressure, no obligation.
              </p>
              <ul className="space-y-3.5">
                {[
                  "Free site assessment and ADU feasibility review",
                  "Transparent cost and timeline estimate",
                  "Personalized service recommendation for your lot",
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

            {/* Right: form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                Get a Free Consultation
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                We&apos;ll review your property and provide a detailed estimate within 1 business day.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
