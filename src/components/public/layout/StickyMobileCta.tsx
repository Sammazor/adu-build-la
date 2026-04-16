"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

interface StickyMobileCtaProps {
  phone: string | null;
}

export function StickyMobileCta({ phone }: StickyMobileCtaProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        // Show when scrolling up or near top; hide when scrolling down past 120px
        if (currentY < 120) {
          setVisible(true);
        } else if (currentY > lastScrollY.current + 4) {
          setVisible(false);
        } else if (currentY < lastScrollY.current - 4) {
          setVisible(true);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        lg:hidden
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Quick actions"
    >
      {/* Subtle top border + frosted background */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-stone-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex gap-2.5 px-4 py-3">
          {/* Primary: Get Free Estimate */}
          <Link
            href="/estimate"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 text-sm font-bold transition-colors shadow-sm shadow-amber-500/20 min-h-[48px]"
          >
            Get Free Estimate
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          {/* Secondary: Call Now — only if phone exists */}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-700 text-sm font-semibold transition-colors min-h-[48px] shrink-0"
              aria-label={`Call ${phone}`}
            >
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap">Call Now</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
