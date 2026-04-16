import Link from "next/link";
import { Building2, Phone, SlidersHorizontal } from "lucide-react";
import { MobileMenuButton } from "./MobileMenuButton";
import { getSiteSettings } from "@/lib/data/settings";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/adu-models", label: "ADU Models" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export async function Header() {
  const settings = await getSiteSettings();
  const phone = settings?.businessPhone ?? null;
  const siteName = settings?.siteName ?? "ADU Build LA";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200/80 shadow-sm shadow-stone-900/[0.03]">
      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-bold text-stone-900 text-base tracking-tight">{siteName}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 rounded-lg text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              {phone}
            </a>
          )}
          <Link
            href="/build-your-custom-adu"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-amber-700 hover:text-amber-800 hover:bg-amber-50 font-semibold transition-colors border border-amber-200 hover:border-amber-300"
            title="Interactive ADU Configurator"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Configurator
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/estimate"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-bold transition-colors shadow-sm shadow-amber-500/20"
          >
            Free Estimate
          </Link>
        </div>

        {/* Mobile hamburger */}
        <MobileMenuButton />
      </div>
    </header>
  );
}
