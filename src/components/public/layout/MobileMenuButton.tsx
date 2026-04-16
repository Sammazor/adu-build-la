"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

const navSections = [
  {
    heading: "Services & Work",
    links: [
      { href: "/services", label: "All Services" },
      { href: "/services/adu-design", label: "ADU Design & Architecture" },
      { href: "/services/adu-construction", label: "ADU Construction" },
      { href: "/services/garage-conversion", label: "Garage Conversion" },
      { href: "/services/junior-adu", label: "Junior ADU (JADU)" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { href: "/locations", label: "City Guides" },
      { href: "/adu-models", label: "ADU Models & Floor Plans" },
      { href: "/projects", label: "Completed Projects" },
      { href: "/blog", label: "Blog & Guides" },
      { href: "/build-your-adu", label: "ADU Planner Tool" },
      { href: "/build-your-custom-adu", label: "Custom ADU Configurator" },
    ],
  },
  {
    heading: "Get Started",
    links: [
      { href: "/estimate", label: "Get a Free Estimate" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait for client mount before rendering portal
  useEffect(() => { setMounted(true); }, []);

  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const drawer = (
    <>
      {/* Backdrop — rendered at body level, always above everything */}
      <div
        className={`fixed inset-0 bg-stone-950/50 backdrop-blur-[2px] lg:hidden transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 9998 }}
        onClick={close}
        aria-hidden
      />

      {/* Slide-in drawer — rendered at body level */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white lg:hidden transform transition-transform duration-250 ease-out overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
        aria-modal
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-stone-100 sticky top-0 bg-white z-10">
          <Link
            href="/"
            onClick={close}
            className="font-bold text-stone-900 text-base tracking-tight"
          >
            ADU Build LA
          </Link>
          <button
            onClick={close}
            className="p-2.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="px-4 py-5 space-y-5">
          {navSections.map((section) => (
            <div key={section.heading}>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-3">
                {section.heading}
              </p>
              <ul className="space-y-0.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="flex items-center justify-between px-3 py-3 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-50 active:bg-stone-100 font-medium text-sm transition-colors group"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Drawer CTAs */}
        <div className="px-4 pb-10 space-y-2.5 border-t border-stone-100 pt-5 sticky bottom-0 bg-white shadow-[0_-1px_0_0_#f5f5f4]">
          <Link
            href="/estimate"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 text-sm font-bold transition-colors"
          >
            Get a Free Estimate
          </Link>
          <Link
            href="/contact"
            onClick={close}
            className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl border border-stone-200 hover:border-stone-300 active:bg-stone-50 text-stone-700 text-sm font-semibold transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="lg:hidden p-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 active:bg-stone-200 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Portal: renders at document.body, escaping all stacking contexts */}
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
