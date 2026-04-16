import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAllProjects } from "@/data/projects";
import { ProjectCard } from "@/components/public/cards/ProjectCard";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { CheckCircle2, ArrowRight, Star, Shield, Clock, Users } from "lucide-react";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "ADU Projects — Portfolio of Completed ADUs",
    description:
      "Browse completed ADU projects by ADU Build LA — garage conversions, detached ADUs, Junior ADUs across Los Angeles, Santa Monica, Pasadena, Glendale, and Culver City.",
    canonical: "/projects",
  });
}

export default function ProjectsPage() {
  const projects = getAllProjects();

  const trustItems = [
    { Icon: Star, label: "4.9 / 5 Rating", sub: "Google Reviews" },
    { Icon: Shield, label: "Licensed & Insured", sub: "CA General Contractor" },
    { Icon: Users, label: "200+ ADUs Built", sub: "Across LA County" },
    { Icon: Clock, label: "15+ Years", sub: "In Business" },
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
              <li className="text-stone-400">Projects</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
              Portfolio
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-5">
              Real ADU Projects Across Los Angeles
            </h1>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8">
              Every project here was designed, permitted, and built by our team. Browse
              completed garage conversions, detached ADUs, and Junior ADUs — see the
              challenge, our solution, and the result.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors min-h-[52px]"
              >
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/adu-models"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-semibold text-sm transition-colors min-h-[52px]"
              >
                View ADU Models
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

      {/* ── Projects Grid ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
              {projects.length} Completed Projects
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              From Permit to Certificate of Occupancy
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              Each project case study walks through the unique challenge, how we solved it,
              and what the homeowner gained — rental income, multigenerational space, or
              long-term property value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio Stats ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Track Record
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                15+ Years Building ADUs in LA
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">
                We&apos;ve built every ADU type — garage conversions, detached new construction,
                Junior ADUs, and attached units — across every major LA-area jurisdiction.
                Our team handles the full process: design, engineering, permitting, and
                construction. One contract, one point of contact, no subcontractor hand-offs.
              </p>
              <ul className="space-y-3.5">
                {[
                  "Every project includes all permit fees and city approval management",
                  "In-house architectural team — no outsourced design coordination",
                  "All projects are pull-permit builds — fully documented and city-inspected",
                  "Post-occupancy support for the first 12 months",
                  "All workmanship warrantied for 2 years from certificate of occupancy",
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

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "200+", label: "ADUs Completed", sub: "Across LA County" },
                { value: "4.9 / 5", label: "Google Rating", sub: "From verified clients" },
                { value: "$150K+", label: "Starting Price", sub: "All-inclusive" },
                { value: "100%", label: "Pull-Permit", sub: "Fully city-inspected" },
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

      {/* ── Lead Form ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-stone-50 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-3">
                Free Assessment
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-5">
                Start Your ADU Project
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-7">
                Tell us about your property and your goals. We&apos;ll review your lot,
                confirm what&apos;s buildable under your city&apos;s zoning rules, recommend the
                right ADU type, and give you an all-inclusive price estimate — free, with no
                pressure and no obligation.
              </p>
              <ul className="space-y-3.5">
                {[
                  "Lot and setback review — confirm your ADU options",
                  "ADU type and size recommendation based on your goals",
                  "All-inclusive price estimate",
                  "Permit timeline for your specific city and jurisdiction",
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
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-1.5">
                Get a Free Property Assessment
              </h3>
              <p className="text-stone-500 text-sm mb-6">
                We respond within 1 business day.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
