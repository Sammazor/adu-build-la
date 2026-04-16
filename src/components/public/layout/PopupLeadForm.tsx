"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { LeadForm } from "@/components/public/forms/LeadForm";

const SESSION_KEY = "adu_popup_shown";
const DELAY_MS = 32_000; // 32 seconds

export function PopupLeadForm() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownRef = useRef(false);

  // Track if already shown this session
  function hasShown(): boolean {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  }

  function markShown() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
  }

  function show() {
    if (shownRef.current || hasShown()) return;
    shownRef.current = true;
    markShown();
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  useEffect(() => {
    setMounted(true);

    // Don't set up triggers if already shown this session
    if (hasShown()) return;

    // --- Trigger 1: time delay ---
    timerRef.current = setTimeout(show, DELAY_MS);

    // --- Trigger 2: exit intent (desktop only) ---
    function handleMouseLeave(e: MouseEvent) {
      // Only fire when cursor leaves through the top of the viewport
      if (e.clientY <= 0) {
        show();
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    }
    // Exit intent only on desktop
    if (!("ontouchstart" in window)) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted) return null;

  const modal = open ? (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-[2px] z-[9990] transition-opacity duration-200"
        onClick={close}
        aria-hidden
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal
        aria-label="Get a free ADU estimate"
        className="fixed z-[9991] inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md bg-white rounded-2xl shadow-2xl shadow-stone-900/20 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-stone-100">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
              Free · No Obligation
            </p>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">
              Get a Free ADU Estimate
            </h2>
            <p className="text-sm text-stone-500 mt-1 leading-snug">
              Tell us about your property and get a personalized estimate.
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0 mt-0.5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          <LeadForm variant="popup" />
        </div>
      </div>
    </>
  ) : null;

  return createPortal(modal, document.body);
}
