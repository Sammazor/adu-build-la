import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPageOverride } from "@/lib/data/sitePageOverrides";
import { LeadForm } from "@/components/public/forms/LeadForm";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageOverride("contact");
  return buildMetadata({
    title: cms?.seoTitle ?? "Contact ADU Build LA",
    description:
      cms?.seoDescription ??
      "Contact ADU Build LA for ADU design, permitting, and construction services in Los Angeles. Get a free consultation within 1 business day.",
    canonical: cms?.canonicalUrl ?? "/contact",
    ogTitle: cms?.ogTitle ?? undefined,
    ogDescription: cms?.ogDescription ?? undefined,
    ogImageUrl: cms?.ogImageUrl ?? undefined,
    noIndex: cms?.indexPage === false,
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactItems = [
    settings?.businessPhone && {
      icon: Phone,
      label: "Phone",
      value: settings.businessPhone,
      href: `tel:${settings.businessPhone}`,
    },
    settings?.businessEmail && {
      icon: Mail,
      label: "Email",
      value: settings.businessEmail,
      href: `mailto:${settings.businessEmail}`,
    },
    (settings?.businessAddress || settings?.businessCity) && {
      icon: MapPin,
      label: "Location",
      value: settings?.businessAddress
        ? `${settings.businessAddress}, ${settings.businessCity}, ${settings.businessState}`
        : `${settings.businessCity}, ${settings.businessState}`,
      href: null,
    },
    settings?.businessHours && {
      icon: Clock,
      label: "Hours",
      value: settings.businessHours,
      href: null,
    },
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    href: string | null;
  }>;

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
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16 lg:pb-20">
          {/* Breadcrumb */}
          <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-stone-500">
              <li>
                <Link href="/" className="hover:text-stone-300 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-stone-700">›</li>
              <li className="text-stone-400">Contact</li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Response within 1 business day
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 max-w-2xl">
            Contact ADU Build LA
          </h1>
          <p className="text-stone-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Questions about your ADU project? Ready to get started? Reach out — our team
            responds to every inquiry within one business day.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">

            {/* Form */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 order-1">
              <h2 className="text-xl font-bold text-stone-900 mb-1.5">Send Us a Message</h2>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                Fill out the form below and we&apos;ll be in touch within 1 business day.
              </p>
              <LeadForm />
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 space-y-5 order-2">
              {/* Contact info */}
              {contactItems.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                    Get in Touch
                  </h3>
                  <div className="space-y-4">
                    {contactItems.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-stone-400 mb-0.5">
                            {item.label}
                          </div>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm text-stone-800 hover:text-amber-600 font-medium transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <div className="text-sm text-stone-800 font-medium">{item.value}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick estimate prompt */}
              <div className="bg-stone-900 rounded-2xl p-6">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
                  Faster Start
                </p>
                <p className="text-white font-bold text-base mb-2 leading-snug">
                  Ready to get a price?
                </p>
                <p className="text-stone-400 text-sm mb-4 leading-relaxed">
                  Use our estimate form for a detailed all-inclusive cost and timeline specific
                  to your property.
                </p>
                <Link
                  href="/estimate"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Request a Free Estimate <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Service areas */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                  Cities We Serve
                </p>
                <p className="text-stone-600 text-sm leading-relaxed">
                  We serve all of LA County — including Los Angeles, Santa Monica, Pasadena,
                  Glendale, Burbank, Culver City, Long Beach, and surrounding cities.
                </p>
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors mt-3"
                >
                  View all city guides →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
