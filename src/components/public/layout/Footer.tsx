import Link from "next/link";
import { Building2, Phone, MapPin, Mail, ArrowRight, Shield, Clock, Star } from "lucide-react";
import type { SiteSettings } from "@/types/prisma-app";

interface FooterProps {
  settings?: SiteSettings | null;
}

const services = [
  { name: "ADU Design & Architecture", href: "/services/adu-design" },
  { name: "ADU Construction", href: "/services/adu-construction" },
  { name: "ADU Permitting", href: "/services/adu-permitting" },
  { name: "Garage Conversion", href: "/services/garage-conversion" },
  { name: "Junior ADU (JADU)", href: "/services/junior-adu" },
];

const explore = [
  { name: "City Guides", href: "/locations" },
  { name: "ADU Models & Floor Plans", href: "/adu-models" },
  { name: "Completed Projects", href: "/projects" },
  { name: "Blog & Guides", href: "/blog" },
  { name: "ADU Configurator", href: "/build-your-custom-adu" },
  { name: "ADU Planner Tool", href: "/build-your-adu" },
];

const getStarted = [
  { name: "Get a Free Estimate", href: "/estimate" },
  { name: "Contact Us", href: "/contact" },
];

const cities = [
  { name: "Los Angeles", href: "/locations/los-angeles" },
  { name: "Santa Monica", href: "/locations/santa-monica" },
  { name: "Pasadena", href: "/locations/pasadena" },
  { name: "Glendale", href: "/locations/glendale" },
  { name: "Burbank", href: "/locations/burbank" },
];

// Social links — update hrefs when real profiles exist
const social = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/adubuildla",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.225 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.856.601 3.698 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.856-.085 3.698-.601 5.038-1.942 1.341-1.34 1.857-3.182 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.667-.072-4.947c-.085-1.856-.601-3.698-1.942-5.038C20.646.673 18.804.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/adubuildla",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Houzz",
    href: "https://www.houzz.com/professionals/adubuildla",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M0 21.347V0l8.873 4.26v4.225L24 12.39v9.03l-8.873-4.02v-4.31L8.873 10.9v10.447z" />
      </svg>
    ),
  },
];

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const siteName = settings?.siteName ?? "ADU Build LA";
  const phone = settings?.businessPhone;
  const email = settings?.businessEmail;
  const address = settings?.businessAddress;
  const city = settings?.businessCity ?? "Los Angeles";
  const state = settings?.businessState ?? "CA";
  const zip = settings?.businessZip;

  const fullAddress = [
    address,
    [city, state, zip].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="bg-stone-950 text-stone-300">
      {/* Footer CTA strip */}
      <div className="border-b border-stone-800/70">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold text-amber-500 tracking-widest uppercase mb-1">
              Ready to start?
            </p>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
              Let&apos;s talk about your ADU project
            </h3>
            <p className="text-stone-400 text-sm mt-1">
              Free property assessment · No obligation · Response within 1 business day
            </p>
          </div>
          <Link
            href="/estimate"
            className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm transition-colors shrink-0 min-h-[52px]"
          >
            Get a Free Estimate <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">

          {/* Brand / contact column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-bold text-white">{siteName}</span>
            </Link>

            <p className="text-sm leading-relaxed text-stone-300 mb-5 max-w-xs">
              ADU design and construction specialists serving Los Angeles County.
              Licensed general contractor. Custom ADUs starting from $150,000.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 mb-5">
              {/* Stars */}
              <div className="flex items-center gap-2">
                <div className="flex" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden />
                  ))}
                </div>
                <span className="text-xs text-stone-300 font-medium">4.9 / 5 · 94+ verified reviews</span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-stone-300">
                  <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  CSLB Licensed &amp; Insured
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  15+ Years in Business
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-2.5 mb-5">
              {phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="text-stone-300 hover:text-white transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-stone-300 hover:text-white transition-colors"
                  >
                    {email}
                  </a>
                </div>
              )}
              {(address || city) && (
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                  <span className="text-stone-300">
                    {fullAddress || `${city}, ${state}`}
                  </span>
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm text-stone-300 hover:text-white transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started + Cities */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Get Started
            </h3>
            <ul className="space-y-2.5 mb-6">
              {getStarted.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-3 mt-6">
              Cities Served
            </h3>
            <ul className="space-y-2">
              {cities.map((loc) => (
                <li key={loc.href}>
                  <Link
                    href={loc.href}
                    className="text-sm text-stone-300 hover:text-white transition-colors"
                  >
                    {loc.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/locations"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  View all cities →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500 text-center sm:text-left">
          <span>© {year} {siteName}. All rights reserved.</span>
          <span className="hidden sm:inline text-stone-500">
            Licensed General Contractor · Los Angeles, CA · CSLB Licensed &amp; Bonded
          </span>
        </div>
      </div>
    </footer>
  );
}
