"use client";

import { useEffect, useState, useActionState } from "react";
import { submitLead } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

const serviceOptions = [
  { value: "", label: "What are you interested in?" },
  { value: "design_build", label: "Full ADU Design + Build" },
  { value: "design", label: "ADU Design & Architecture Only" },
  { value: "build", label: "ADU Construction Only" },
  { value: "garage_conversion", label: "Garage Conversion" },
  { value: "junior_adu", label: "Junior ADU (JADU)" },
  { value: "consulting", label: "Feasibility Study / Consulting" },
  { value: "unknown", label: "Not sure yet — just exploring" },
];

interface LeadFormProps {
  variant?: "default" | "estimate" | "popup";
  className?: string;
}

const initialState = { success: false, errors: undefined, message: undefined };

interface Attribution {
  sourcePageUrl: string;
  landingPage: string;
  referrerUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  fbclid: string;
}

const emptyAttribution: Attribution = {
  sourcePageUrl: "",
  landingPage: "",
  referrerUrl: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  gclid: "",
  fbclid: "",
};

const inputBase =
  "w-full px-3.5 py-2.5 rounded-lg border text-sm text-stone-900 placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition";

export function LeadForm({ variant = "default", className }: LeadFormProps) {
  const [state, action, isPending] = useActionState(submitLead, initialState);
  const [attribution, setAttribution] = useState<Attribution>(emptyAttribution);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = sessionStorage.getItem("adu_landing");
    const landing = stored ?? window.location.href;
    if (!stored) sessionStorage.setItem("adu_landing", landing);

    setAttribution({
      sourcePageUrl: window.location.href,
      landingPage: landing,
      referrerUrl: document.referrer,
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      utmTerm: params.get("utm_term") ?? "",
      utmContent: params.get("utm_content") ?? "",
      gclid: params.get("gclid") ?? "",
      fbclid: params.get("fbclid") ?? "",
    });
  }, []);

  if (state.success) {
    return (
      <div className={cn("text-center py-10 px-4", className)}>
        <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-2">Request Received</h3>
        <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
          {state.message ??
            "Thank you — we'll review your property details and be in touch within 1 business day."}
        </p>
      </div>
    );
  }

  // Popup variant: compact — name (single field), email, phone only
  if (variant === "popup") {
    return (
      <form action={action} className={cn("space-y-3", className)} noValidate>
        <input type="hidden" name="sourcePageUrl" value={attribution.sourcePageUrl} />
        <input type="hidden" name="landingPage" value={attribution.landingPage} />
        <input type="hidden" name="referrerUrl" value={attribution.referrerUrl} />
        <input type="hidden" name="utmSource" value={attribution.utmSource} />
        <input type="hidden" name="utmMedium" value={attribution.utmMedium} />
        <input type="hidden" name="utmCampaign" value={attribution.utmCampaign} />
        <input type="hidden" name="utmTerm" value={attribution.utmTerm} />
        <input type="hidden" name="utmContent" value={attribution.utmContent} />
        <input type="hidden" name="gclid" value={attribution.gclid} />
        <input type="hidden" name="fbclid" value={attribution.fbclid} />
        {/* firstName maps to full name in popup; lastName sent as empty string */}
        <input type="hidden" name="lastName" value="—" />

        <div>
          <label htmlFor="pf-name" className="block text-xs font-medium text-stone-600 mb-1">
            Your name <span className="text-red-400">*</span>
          </label>
          <input
            id="pf-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={cn(inputBase, fieldError("firstName") ? "border-red-400" : "border-stone-200")}
            placeholder="Jane Smith"
          />
          {fieldError("firstName") && (
            <p className="text-xs text-red-500 mt-1">{fieldError("firstName")}</p>
          )}
        </div>

        <div>
          <label htmlFor="pf-email" className="block text-xs font-medium text-stone-600 mb-1">
            Email address <span className="text-red-400">*</span>
          </label>
          <input
            id="pf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={cn(inputBase, fieldError("email") ? "border-red-400" : "border-stone-200")}
            placeholder="jane@example.com"
          />
          {fieldError("email") && (
            <p className="text-xs text-red-500 mt-1">{fieldError("email")}</p>
          )}
        </div>

        <div>
          <label htmlFor="pf-phone" className="block text-xs font-medium text-stone-600 mb-1">
            Phone <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            id="pf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={cn(inputBase, "border-stone-200")}
            placeholder="(310) 555-0100"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-amber-500/20 min-h-[48px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Get My Estimate
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-xs text-stone-400 text-center">
          No spam. We respond within 1 business day.
        </p>
      </form>
    );
  }

  function fieldError(field: string) {
    return state.errors?.[field]?.[0] ?? null;
  }

  return (
    <form action={action} className={cn("space-y-4", className)} noValidate>
      {/* Hidden attribution fields */}
      <input type="hidden" name="sourcePageUrl" value={attribution.sourcePageUrl} />
      <input type="hidden" name="landingPage" value={attribution.landingPage} />
      <input type="hidden" name="referrerUrl" value={attribution.referrerUrl} />
      <input type="hidden" name="utmSource" value={attribution.utmSource} />
      <input type="hidden" name="utmMedium" value={attribution.utmMedium} />
      <input type="hidden" name="utmCampaign" value={attribution.utmCampaign} />
      <input type="hidden" name="utmTerm" value={attribution.utmTerm} />
      <input type="hidden" name="utmContent" value={attribution.utmContent} />
      <input type="hidden" name="gclid" value={attribution.gclid} />
      <input type="hidden" name="fbclid" value={attribution.fbclid} />

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="lf-firstName" className="block text-sm font-medium text-stone-700 mb-1">
            First name <span className="text-red-400">*</span>
          </label>
          <input
            id="lf-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={cn(inputBase, fieldError("firstName") ? "border-red-400" : "border-stone-200")}
            placeholder="Jane"
          />
          {fieldError("firstName") && (
            <p className="text-xs text-red-500 mt-1">{fieldError("firstName")}</p>
          )}
        </div>
        <div>
          <label htmlFor="lf-lastName" className="block text-sm font-medium text-stone-700 mb-1">
            Last name <span className="text-red-400">*</span>
          </label>
          <input
            id="lf-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className={cn(inputBase, fieldError("lastName") ? "border-red-400" : "border-stone-200")}
            placeholder="Smith"
          />
          {fieldError("lastName") && (
            <p className="text-xs text-red-500 mt-1">{fieldError("lastName")}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="lf-email" className="block text-sm font-medium text-stone-700 mb-1">
          Email address <span className="text-red-400">*</span>
        </label>
        <input
          id="lf-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={cn(inputBase, fieldError("email") ? "border-red-400" : "border-stone-200")}
          placeholder="jane@example.com"
        />
        {fieldError("email") && (
          <p className="text-xs text-red-500 mt-1">{fieldError("email")}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="lf-phone" className="block text-sm font-medium text-stone-700 mb-1">
          Phone number
          <span className="text-stone-400 font-normal ml-1">(optional)</span>
        </label>
        <input
          id="lf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={cn(inputBase, "border-stone-200")}
          placeholder="(310) 555-0100"
        />
      </div>

      {/* City */}
      <div>
        <label htmlFor="lf-city" className="block text-sm font-medium text-stone-700 mb-1">
          Property city
          <span className="text-stone-400 font-normal ml-1">(optional)</span>
        </label>
        <input
          id="lf-city"
          name="propertyCity"
          type="text"
          className={cn(inputBase, "border-stone-200")}
          placeholder="e.g. Santa Monica, Silver Lake, Burbank…"
        />
      </div>

      {/* Service interest */}
      <div>
        <label htmlFor="lf-service" className="block text-sm font-medium text-stone-700 mb-1">
          Service interest
        </label>
        <select
          id="lf-service"
          name="serviceInterest"
          className={cn(inputBase, "border-stone-200 bg-white")}
        >
          {serviceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="lf-notes" className="block text-sm font-medium text-stone-700 mb-1">
          {variant === "estimate" ? "Tell us about your project" : "Notes"}
          <span className="text-stone-400 font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="lf-notes"
          name="notes"
          rows={3}
          className={cn(inputBase, "border-stone-200 resize-none")}
          placeholder={
            variant === "estimate"
              ? "Property type, ADU goals, questions you have…"
              : "Any details that would help us understand your project…"
          }
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-amber-500/20"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            {variant === "estimate" ? "Request My Free Estimate" : "Get a Free Consultation"}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-stone-400 text-center">
        No spam, ever. We respond within 1 business day.
      </p>
    </form>
  );
}
