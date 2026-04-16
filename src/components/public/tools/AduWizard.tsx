"use client";

import { useState, useActionState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Home,
  Building2,
  Warehouse,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Sparkles,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";
import Link from "next/link";
import { submitLead } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AduType = "detached" | "garage-conversion" | "attached" | "jadu" | "not-sure";
type SqFtRange = "under-400" | "400-600" | "600-800" | "800-1000" | "over-1000" | "not-sure";
type BedCount = "studio" | "1" | "2" | "3-plus" | "not-sure";
type BathCount = "1" | "1.5" | "2" | "not-sure";
type Feature = "laundry" | "ev-charger" | "home-office" | "patio" | "solar" | "premium-finishes" | "separate-meters";
type IntendedUse = "rental-income" | "family-member" | "home-office" | "guest" | "personal-use" | "not-sure";
type CitySlug = "los-angeles" | "santa-monica" | "pasadena" | "glendale" | "culver-city" | "other";
type BudgetRange = "under-100k" | "100k-150k" | "150k-200k" | "200k-300k" | "over-300k" | "not-sure";
type Timeline = "asap" | "3-6-months" | "6-12-months" | "over-1-year" | "just-exploring";

interface WizardState {
  aduType: AduType | null;
  sqFt: SqFtRange | null;
  beds: BedCount | null;
  baths: BathCount | null;
  features: Feature[];
  intendedUse: IntendedUse | null;
  city: CitySlug | null;
  budget: BudgetRange | null;
  timeline: Timeline | null;
}

const INITIAL_STATE: WizardState = {
  aduType: null,
  sqFt: null,
  beds: null,
  baths: null,
  features: [],
  intendedUse: null,
  city: null,
  budget: null,
  timeline: null,
};

// ─── Results computation ──────────────────────────────────────────────────────

interface AduResult {
  direction: string;
  directionSub: string;
  sizeRange: string;
  budgetRange: string;
  budgetNote: string;
  recommendedPath: string;
  recommendedPathHref: string;
  secondaryPath?: string;
  secondaryPathHref?: string;
  keyInsights: string[];
  cityNote?: string;
}

function computeResults(w: WizardState): AduResult {
  const isGarage = w.aduType === "garage-conversion";
  const isJadu = w.aduType === "jadu";
  const isRental = w.intendedUse === "rental-income";
  const isFamily = w.intendedUse === "family-member";
  const beds2Plus = w.beds === "2" || w.beds === "3-plus";
  const needsSize = w.sqFt === "800-1000" || w.sqFt === "over-1000";

  // Direction
  let direction: string;
  let directionSub: string;
  let recommendedPath: string;
  let recommendedPathHref: string;
  let secondaryPath: string | undefined;
  let secondaryPathHref: string | undefined;

  if (isGarage) {
    direction = "Garage Conversion ADU";
    directionSub = "Your existing garage is your fastest, most affordable ADU path. A garage conversion leverages your existing structure to cut cost and timeline compared to new construction.";
    recommendedPath = "Garage Conversion 450 Model";
    recommendedPathHref = "/adu-models/garage-conversion-450";
    secondaryPath = "Garage Conversion Service";
    secondaryPathHref = "/services/garage-conversion";
  } else if (isJadu) {
    direction = "Junior ADU (JADU)";
    directionSub = "A JADU is created within your existing home's footprint — up to 500 sq ft. It's the most affordable ADU option and doesn't require a new structure, but shares utilities with the primary residence.";
    recommendedPath = "ADU Consulting Service";
    recommendedPathHref = "/services/adu-consulting";
    secondaryPath = "View All Services";
    secondaryPathHref = "/services";
  } else if (beds2Plus || needsSize) {
    direction = "2-Bedroom Detached ADU";
    directionSub = "Based on your size and bedroom needs, a 2-bedroom detached ADU delivers maximum income potential and the living space you need. It's the top choice for families and investors seeking maximum rental yield.";
    recommendedPath = "2 Bed 750 Model";
    recommendedPathHref = "/adu-models/2-bed-750";
    secondaryPath = "ADU Construction Service";
    secondaryPathHref = "/services/adu-construction";
  } else if (w.beds === "1" || w.sqFt === "600-800") {
    direction = isRental ? "1-Bedroom Detached ADU (Most Popular)" : "1-Bedroom Detached ADU";
    directionSub = isRental
      ? "The 1-bedroom ADU is the most-requested rental unit in LA. It commands meaningfully higher rents than a studio at a modest cost premium and attracts the widest renter pool."
      : "A 1-bedroom detached ADU gives your family member genuine, private living space — a full kitchen, private entry, and bedroom that feels like a real home, not just a room.";
    recommendedPath = w.sqFt === "600-800" ? "1 Bed 650 Model (Most Popular)" : "1 Bed 500 Model";
    recommendedPathHref = w.sqFt === "600-800" ? "/adu-models/1-bed-650" : "/adu-models/1-bed-500";
    secondaryPath = w.sqFt === "600-800" ? "Also consider: 1 Bed 500" : "Also consider: 1 Bed 650";
    secondaryPathHref = w.sqFt === "600-800" ? "/adu-models/1-bed-500" : "/adu-models/1-bed-650";
  } else {
    direction = isRental ? "Studio or 1-Bedroom ADU" : "Studio Detached ADU";
    directionSub = isRental
      ? "A studio or compact 1-bedroom ADU offers the best return on investment for LA lots with limited rear yard space. Strong rental demand, lower construction cost, and faster timeline."
      : "A studio ADU provides a private, self-contained space perfect for a guest, home office, or personal retreat — at the most accessible price point.";
    recommendedPath = "Studio 400 Model";
    recommendedPathHref = "/adu-models/studio-400";
    secondaryPath = "1 Bed 500 Model";
    secondaryPathHref = "/adu-models/1-bed-500";
  }

  // Size range
  let sizeRange: string;
  if (isGarage) {
    sizeRange = "400–500 sq ft (existing garage footprint)";
  } else if (isJadu) {
    sizeRange = "Up to 500 sq ft (within existing home)";
  } else if (w.sqFt === "under-400" || w.beds === "studio") {
    sizeRange = "350–450 sq ft";
  } else if (w.sqFt === "400-600" || w.beds === "1") {
    sizeRange = "450–650 sq ft";
  } else if (w.sqFt === "600-800") {
    sizeRange = "600–800 sq ft";
  } else if (w.sqFt === "800-1000") {
    sizeRange = "750–1,000 sq ft";
  } else if (w.sqFt === "over-1000") {
    sizeRange = "1,000+ sq ft (custom design recommended)";
  } else {
    sizeRange = "400–750 sq ft (confirm after property assessment)";
  }

  // Budget range
  let budgetRange: string;
  let budgetNote: string;
  if (isGarage) {
    budgetRange = "$95,000–$160,000";
    budgetNote = "Garage conversions are the most affordable ADU path — your existing structure eliminates the most expensive construction phases.";
  } else if (isJadu) {
    budgetRange = "$60,000–$120,000";
    budgetNote = "JADUs are created within your existing home and have a lower construction cost than any new detached ADU.";
  } else if (beds2Plus || needsSize) {
    budgetRange = "$230,000–$350,000+";
    budgetNote = "Two-bedroom ADUs require more square footage and systems. The higher starting investment is offset by meaningfully higher rental income.";
  } else if (w.beds === "1" && w.sqFt === "600-800") {
    budgetRange = "$195,000–$260,000";
    budgetNote = "A spacious 1-bedroom in the 600–800 sq ft range commands premium rents and attracts higher-quality, longer-term tenants.";
  } else if (w.beds === "1") {
    budgetRange = "$165,000–$230,000";
    budgetNote = "The 1-bedroom ADU delivers the best balance of construction cost and rental income for most LA lots.";
  } else {
    budgetRange = "$150,000–$200,000";
    budgetNote = "Studio ADUs have the lowest starting price and strongest return on investment per dollar for rental income strategies.";
  }

  // Override if user said their budget is lower
  if (w.budget === "under-100k" && !isGarage && !isJadu) {
    budgetNote = "Based on your budget, a garage conversion (if you have an existing garage) is the most realistic path. Detached new construction starts at $150,000.";
  }

  // Key insights
  const insights: string[] = [];

  if (isRental) insights.push("Rental income focus: your chosen ADU type has strong LA rental demand.");
  if (isFamily) insights.push("Family living: a private entry and full kitchen are included as standard.");
  if (w.features.includes("laundry")) insights.push("In-unit washer/dryer hookups are included standard on all our models.");
  if (w.features.includes("ev-charger")) insights.push("EV charger rough-in is available on all 1- and 2-bedroom models.");
  if (w.features.includes("patio")) insights.push("A covered patio or deck is a popular addition that improves tenant quality and rental income.");
  if (w.features.includes("home-office")) insights.push("A 2-bedroom ADU gives you a dedicated bedroom + home office — or rent both bedrooms.");
  if (w.features.includes("solar")) insights.push("Solar is increasingly popular on LA ADUs — we can integrate it during the design phase.");
  if (w.features.includes("premium-finishes")) insights.push("Premium finishes are available and can meaningfully improve rental rates in higher-demand neighborhoods.");
  if (w.timeline === "asap") insights.push("For the fastest timeline, a garage conversion is often 2–3 months faster than new construction.");
  if (w.timeline === "just-exploring") insights.push("No pressure — we're happy to walk through feasibility and costs with no obligation.");
  if (w.beds === "2" || w.beds === "3-plus") insights.push("Two-bedroom ADUs unlock a meaningfully larger renter pool and command $600–$1,000/month more than 1-bedroom units.");

  // City note
  let cityNote: string | undefined;
  const cityNotes: Partial<Record<CitySlug, string>> = {
    "santa-monica": "Santa Monica has strong ADU support and excellent rental demand — expect rents 20–30% above the LA average.",
    "culver-city": "Culver City is one of the most ADU-friendly jurisdictions in LA with fast permit processing.",
    "pasadena": "Pasadena has robust ADU rules and strong demand from Caltech/JPL commuters and young professionals.",
    "glendale": "Glendale has clear ADU permitting guidelines and strong family-oriented rental demand.",
    "los-angeles": "Los Angeles City has the most permissive ADU rules in the state — most lots qualify for at least one ADU.",
    "other": "We build ADUs across all of LA County — your specific city's zoning rules are assessed during the free property evaluation.",
  };
  if (w.city) cityNote = cityNotes[w.city];

  return {
    direction,
    directionSub,
    sizeRange,
    budgetRange,
    budgetNote,
    recommendedPath,
    recommendedPathHref,
    secondaryPath,
    secondaryPathHref,
    keyInsights: insights.slice(0, 4),
    cityNote,
  };
}

// ─── Option button ────────────────────────────────────────────────────────────

function Option({
  selected,
  onClick,
  icon: Icon,
  label,
  sub,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  label: string;
  sub?: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        selected
          ? "border-amber-500 bg-amber-50 shadow-sm"
          : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
      )}
    >
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5", selected ? "bg-amber-500" : "bg-stone-100")}>
            <Icon className={cn("w-4 h-4", selected ? "text-white" : "text-stone-600")} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className={cn("font-semibold text-sm leading-snug", selected ? "text-stone-900" : "text-stone-800")}>
            {label}
          </div>
          {sub && <div className="text-xs text-stone-500 mt-0.5 leading-snug">{sub}</div>}
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Multi-select chip ────────────────────────────────────────────────────────

function Chip({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
        selected
          ? "border-amber-500 bg-amber-50 text-stone-900"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
      )}
    >
      {selected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
      {label}
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9;

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-semibold text-amber-600">{pct}% complete</span>
      </div>
      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Step nav buttons ─────────────────────────────────────────────────────────

function StepNav({
  onBack,
  onNext,
  canNext,
  nextLabel = "Next",
  isFirst = false,
}: {
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
  isFirst?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-100">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
          isFirst
            ? "text-stone-300 cursor-default"
            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
          canNext
            ? "bg-amber-500 hover:bg-amber-400 text-stone-900 shadow-sm shadow-amber-500/20"
            : "bg-stone-100 text-stone-400 cursor-default"
        )}
      >
        {nextLabel}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Lead capture form ────────────────────────────────────────────────────────

const LEAD_INITIAL: { success: boolean; errors?: Record<string, string[]>; message?: string } = { success: false };

function LeadCaptureStep({
  wizardState,
  result,
  onSkip,
  onSubmitSuccess,
}: {
  wizardState: WizardState;
  result: AduResult;
  onSkip: () => void;
  onSubmitSuccess: () => void;
}) {
  const [state, action, pending] = useActionState(submitLead, LEAD_INITIAL);

  // Show success screen inline, then offer link to results
  if (state.success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">You&apos;re all set!</h3>
        <p className="text-stone-500 text-sm mb-6">
          We&apos;ll review your property details and follow up within 1 business day.
        </p>
        <button
          type="button"
          onClick={onSubmitSuccess}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-colors"
        >
          See My ADU Plan <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const notes = [
    `ADU Type: ${wizardState.aduType ?? "not specified"}`,
    `Size: ${wizardState.sqFt ?? "not specified"}`,
    `Beds: ${wizardState.beds ?? "not specified"}`,
    `Baths: ${wizardState.baths ?? "not specified"}`,
    `Use: ${wizardState.intendedUse ?? "not specified"}`,
    `City: ${wizardState.city ?? "not specified"}`,
    `Budget: ${wizardState.budget ?? "not specified"}`,
    `Timeline: ${wizardState.timeline ?? "not specified"}`,
    `Features: ${wizardState.features.join(", ") || "none"}`,
    `--- Suggested: ${result.direction} | ${result.budgetRange}`,
  ].join("\n");

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Almost Done</div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Get Your Personalized Plan</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Share your contact info and we&apos;ll send you a personalized ADU plan for your property — including feasibility, timeline, and an all-inclusive cost estimate. No pressure, no obligation.
        </p>
      </div>

      <form action={action} className="space-y-3">
        {/* Hidden attribution */}
        <input type="hidden" name="sourcePageUrl" value="/build-your-adu" />
        <input type="hidden" name="landingPage" value="/build-your-adu" />
        <input type="hidden" name="notes" value={notes} />
        <input type="hidden" name="propertyCity" value={wizardState.city ?? ""} />
        <input type="hidden" name="serviceInterest" value="design_build" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">First Name *</label>
            <input
              name="firstName"
              required
              placeholder="Jane"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            {state.errors?.firstName && <p className="text-red-500 text-xs mt-1">{state.errors.firstName[0]}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Last Name *</label>
            <input
              name="lastName"
              required
              placeholder="Smith"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            {state.errors?.lastName && <p className="text-red-500 text-xs mt-1">{state.errors.lastName[0]}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email Address *</label>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          {state.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">Phone (optional)</label>
          <input
            name="phone"
            type="tel"
            placeholder="(310) 555-0100"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 font-bold text-sm transition-all"
          >
            {pending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Get My Personalized Plan
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {state.errors && !state.errors.firstName && !state.errors.lastName && !state.errors.email && (
          <p className="text-red-500 text-xs text-center">Something went wrong. Please try again.</p>
        )}
      </form>

      <button
        type="button"
        onClick={onSkip}
        className="w-full text-center text-xs text-stone-400 hover:text-stone-600 mt-3 transition-colors"
      >
        Skip — just show me the results
      </button>
    </div>
  );
}

// ─── Results view ─────────────────────────────────────────────────────────────

function ResultsView({ result, onRestart }: { result: AduResult; onRestart: () => void }) {
  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-3">
          <Sparkles className="w-3 h-3" />
          Your ADU Plan
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">{result.direction}</h2>
        <p className="text-stone-600 text-sm leading-relaxed">{result.directionSub}</p>
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
          <div className="text-xs text-stone-500 font-medium mb-1">Suggested Size</div>
          <div className="text-base font-bold text-stone-900 leading-tight">{result.sizeRange}</div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="text-xs text-amber-700 font-medium mb-1">Estimated Budget</div>
          <div className="text-base font-bold text-stone-900 leading-tight">{result.budgetRange}</div>
        </div>
      </div>

      {/* Budget note */}
      <p className="text-xs text-stone-500 leading-relaxed mb-5 px-1">{result.budgetNote}</p>

      {/* City note */}
      {result.cityNote && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-600 leading-relaxed">{result.cityNote}</p>
        </div>
      )}

      {/* Insights */}
      {result.keyInsights.length > 0 && (
        <ul className="space-y-2 mb-5">
          {result.keyInsights.map((insight) => (
            <li key={insight} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              {insight}
            </li>
          ))}
        </ul>
      )}

      {/* Recommended paths */}
      <div className="space-y-2.5 mb-6">
        <Link
          href={result.recommendedPathHref}
          className="flex items-center justify-between w-full p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-all group"
        >
          <span>{result.recommendedPath}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        {result.secondaryPath && result.secondaryPathHref && (
          <Link
            href={result.secondaryPathHref}
            className="flex items-center justify-between w-full p-4 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-medium text-sm transition-all group"
          >
            <span>{result.secondaryPath}</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
        <Link
          href="/estimate"
          className="flex items-center justify-between w-full p-4 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-medium text-sm transition-all group"
        >
          <span>Get a Free Property Assessment</span>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="border-t border-stone-100 pt-4 text-center">
        <button
          type="button"
          onClick={onRestart}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

type Phase = "questions" | "lead-capture" | "results";

export function AduWizard() {
  const [step, setStep] = useState(1);
  const [w, setW] = useState<WizardState>(INITIAL_STATE);
  const [phase, setPhase] = useState<Phase>("questions");

  const result = computeResults(w);

  function toggleFeature(f: Feature) {
    setW((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));
  }

  function goNext() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setPhase("lead-capture");
    }
  }

  function goBack() {
    if (phase === "lead-capture") {
      setPhase("questions");
    } else if (phase === "results") {
      setPhase("lead-capture");
    } else if (step > 1) {
      setStep((s) => s - 1);
    }
  }

  function restart() {
    setW(INITIAL_STATE);
    setStep(1);
    setPhase("questions");
  }

  if (phase === "lead-capture") {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8">
        <LeadCaptureStep
          wizardState={w}
          result={result}
          onSkip={() => setPhase("results")}
          onSubmitSuccess={() => setPhase("results")}
        />
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8">
        <ResultsView result={result} onRestart={restart} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8">
      <ProgressBar step={step} />

      {/* ── Step 1: ADU Type ── */}
      {step === 1 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 1</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">What type of ADU interests you?</h2>
          <p className="text-stone-500 text-sm mb-5">Not sure yet? Choose &quot;Not sure&quot; and we&apos;ll recommend the best fit.</p>
          <div className="space-y-2.5">
            <Option selected={w.aduType === "detached"} onClick={() => setW({ ...w, aduType: "detached" })} icon={Building2} label="Detached ADU" sub="A new separate structure in your backyard — the most private option" />
            <Option selected={w.aduType === "garage-conversion"} onClick={() => setW({ ...w, aduType: "garage-conversion" })} icon={Warehouse} label="Garage Conversion" sub="Convert your existing garage into a legal ADU — fastest, most affordable" badge="Best Value" />
            <Option selected={w.aduType === "attached"} onClick={() => setW({ ...w, aduType: "attached" })} icon={Home} label="Attached ADU" sub="An addition connected to your main home — shares a wall" />
            <Option selected={w.aduType === "jadu"} onClick={() => setW({ ...w, aduType: "jadu" })} icon={Home} label="Junior ADU (JADU)" sub="Created inside your existing home — up to 500 sq ft, lowest cost" />
            <Option selected={w.aduType === "not-sure"} onClick={() => setW({ ...w, aduType: "not-sure" })} icon={Sparkles} label="Not sure yet" sub="We&apos;ll help you figure out which type works for your property" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.aduType !== null} isFirst />
        </div>
      )}

      {/* ── Step 2: Sq footage ── */}
      {step === 2 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 2</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">How large would you like the ADU to be?</h2>
          <p className="text-stone-500 text-sm mb-5">This helps us estimate your budget range. Approximate is fine.</p>
          <div className="space-y-2.5">
            <Option selected={w.sqFt === "under-400"} onClick={() => setW({ ...w, sqFt: "under-400" })} label="Under 400 sq ft" sub="Compact studio — maximum affordability" />
            <Option selected={w.sqFt === "400-600"} onClick={() => setW({ ...w, sqFt: "400-600" })} label="400–600 sq ft" sub="Studio to 1-bedroom range — most common ADU size" />
            <Option selected={w.sqFt === "600-800"} onClick={() => setW({ ...w, sqFt: "600-800" })} label="600–800 sq ft" sub="Spacious 1-bedroom or compact 2-bedroom" badge="Most Popular" />
            <Option selected={w.sqFt === "800-1000"} onClick={() => setW({ ...w, sqFt: "800-1000" })} label="800–1,000 sq ft" sub="Full 2-bedroom with generous living space" />
            <Option selected={w.sqFt === "over-1000"} onClick={() => setW({ ...w, sqFt: "over-1000" })} label="Over 1,000 sq ft" sub="Custom design recommended — max rental income" />
            <Option selected={w.sqFt === "not-sure"} onClick={() => setW({ ...w, sqFt: "not-sure" })} label="Not sure yet" sub="We&apos;ll recommend the right size after a property assessment" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.sqFt !== null} />
        </div>
      )}

      {/* ── Step 3: Bedrooms ── */}
      {step === 3 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 3</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">How many bedrooms?</h2>
          <p className="text-stone-500 text-sm mb-5">More bedrooms mean higher rents — but also higher construction cost.</p>
          <div className="space-y-2.5">
            <Option selected={w.beds === "studio"} onClick={() => setW({ ...w, beds: "studio" })} icon={Bed} label="Studio" sub="Open-plan living and sleeping — most affordable" />
            <Option selected={w.beds === "1"} onClick={() => setW({ ...w, beds: "1" })} icon={Bed} label="1 Bedroom" sub="Separate bedroom — widest renter demand in LA" badge="Most Common" />
            <Option selected={w.beds === "2"} onClick={() => setW({ ...w, beds: "2" })} icon={Bed} label="2 Bedrooms" sub="Two separate bedrooms — maximum rental income" />
            <Option selected={w.beds === "3-plus"} onClick={() => setW({ ...w, beds: "3-plus" })} icon={Bed} label="3+ Bedrooms" sub="Larger family unit — custom design required" />
            <Option selected={w.beds === "not-sure"} onClick={() => setW({ ...w, beds: "not-sure" })} label="Not sure yet" sub="We&apos;ll recommend based on your goals and lot" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.beds !== null} />
        </div>
      )}

      {/* ── Step 4: Bathrooms ── */}
      {step === 4 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 4</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">How many bathrooms?</h2>
          <p className="text-stone-500 text-sm mb-5">Most ADUs under 800 sq ft are built with 1 full bath.</p>
          <div className="space-y-2.5">
            <Option selected={w.baths === "1"} onClick={() => setW({ ...w, baths: "1" })} icon={Bath} label="1 Full Bathroom" sub="Standard for studios and 1-bedrooms" />
            <Option selected={w.baths === "1.5"} onClick={() => setW({ ...w, baths: "1.5" })} icon={Bath} label="1.5 Bathrooms" sub="Full bath + powder room — popular in 2-bedroom units" />
            <Option selected={w.baths === "2"} onClick={() => setW({ ...w, baths: "2" })} icon={Bath} label="2 Full Bathrooms" sub="Best for 2-bedroom units targeting high-end rentals" />
            <Option selected={w.baths === "not-sure"} onClick={() => setW({ ...w, baths: "not-sure" })} label="Not sure yet" sub="Recommend after we know the bedroom count and size" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.baths !== null} />
        </div>
      )}

      {/* ── Step 5: Features ── */}
      {step === 5 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 5</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">Any features you want to include?</h2>
          <p className="text-stone-500 text-sm mb-5">Select all that apply — or skip if you&apos;re not sure yet.</p>
          <div className="flex flex-wrap gap-2.5 mb-2">
            {[
              { value: "laundry" as Feature, label: "In-unit laundry" },
              { value: "ev-charger" as Feature, label: "EV charger" },
              { value: "home-office" as Feature, label: "Home office nook" },
              { value: "patio" as Feature, label: "Covered patio" },
              { value: "solar" as Feature, label: "Solar ready" },
              { value: "premium-finishes" as Feature, label: "Premium finishes" },
              { value: "separate-meters" as Feature, label: "Separate utility meters" },
            ].map((f) => (
              <Chip key={f.value} selected={w.features.includes(f.value)} onClick={() => toggleFeature(f.value)} label={f.label} />
            ))}
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={true} nextLabel="Continue" />
        </div>
      )}

      {/* ── Step 6: Intended Use ── */}
      {step === 6 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 6</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">How do you plan to use the ADU?</h2>
          <p className="text-stone-500 text-sm mb-5">This helps us prioritize the right design features and layout.</p>
          <div className="space-y-2.5">
            <Option selected={w.intendedUse === "rental-income"} onClick={() => setW({ ...w, intendedUse: "rental-income" })} icon={DollarSign} label="Rental income" sub="Long-term or short-term tenant — maximize monthly rent" />
            <Option selected={w.intendedUse === "family-member"} onClick={() => setW({ ...w, intendedUse: "family-member" })} icon={Users} label="Family member" sub="Parents, adult child, or in-law — private but close" />
            <Option selected={w.intendedUse === "home-office"} onClick={() => setW({ ...w, intendedUse: "home-office" })} icon={Building2} label="Home office / studio" sub="Dedicated workspace away from the main house" />
            <Option selected={w.intendedUse === "guest"} onClick={() => setW({ ...w, intendedUse: "guest" })} icon={Home} label="Guest suite" sub="Private accommodations for visitors" />
            <Option selected={w.intendedUse === "personal-use"} onClick={() => setW({ ...w, intendedUse: "personal-use" })} icon={Home} label="Personal use / future flexibility" sub="Not sure how I&apos;ll use it yet — want options" />
            <Option selected={w.intendedUse === "not-sure"} onClick={() => setW({ ...w, intendedUse: "not-sure" })} label="Not sure yet" sub="Still deciding — want to understand all the options" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.intendedUse !== null} />
        </div>
      )}

      {/* ── Step 7: City ── */}
      {step === 7 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 7</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">Where is your property?</h2>
          <p className="text-stone-500 text-sm mb-5">ADU rules vary by city. This helps us give you accurate permitting information.</p>
          <div className="space-y-2.5">
            <Option selected={w.city === "los-angeles"} onClick={() => setW({ ...w, city: "los-angeles" })} icon={MapPin} label="Los Angeles (City of LA)" sub="Includes neighborhoods like Silver Lake, Echo Park, Koreatown, Van Nuys" />
            <Option selected={w.city === "santa-monica"} onClick={() => setW({ ...w, city: "santa-monica" })} icon={MapPin} label="Santa Monica" sub="Premium rental market — strong ADU permitting support" />
            <Option selected={w.city === "culver-city"} onClick={() => setW({ ...w, city: "culver-city" })} icon={MapPin} label="Culver City" sub="Fast permitting, strong tech/media rental demand" />
            <Option selected={w.city === "pasadena"} onClick={() => setW({ ...w, city: "pasadena" })} icon={MapPin} label="Pasadena" sub="Strong family and professional rental market" />
            <Option selected={w.city === "glendale"} onClick={() => setW({ ...w, city: "glendale" })} icon={MapPin} label="Glendale" sub="Clear ADU guidelines, family-oriented rental demand" />
            <Option selected={w.city === "other"} onClick={() => setW({ ...w, city: "other" })} icon={MapPin} label="Other LA County city" sub="We build throughout LA County — enter your city at checkout" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.city !== null} />
        </div>
      )}

      {/* ── Step 8: Budget ── */}
      {step === 8 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 8</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">What&apos;s your approximate budget?</h2>
          <p className="text-stone-500 text-sm mb-5">All-inclusive of design, permits, and construction. Be honest — we&apos;ll tell you what&apos;s realistic.</p>
          <div className="space-y-2.5">
            <Option selected={w.budget === "under-100k"} onClick={() => setW({ ...w, budget: "under-100k" })} icon={DollarSign} label="Under $100,000" sub="Garage conversion may be the only realistic path at this range" />
            <Option selected={w.budget === "100k-150k"} onClick={() => setW({ ...w, budget: "100k-150k" })} icon={DollarSign} label="$100,000 – $150,000" sub="Garage conversion or compact studio ADU" />
            <Option selected={w.budget === "150k-200k"} onClick={() => setW({ ...w, budget: "150k-200k" })} icon={DollarSign} label="$150,000 – $200,000" sub="Studio or 1-bedroom detached ADU — most popular range" badge="Most Common" />
            <Option selected={w.budget === "200k-300k"} onClick={() => setW({ ...w, budget: "200k-300k" })} icon={DollarSign} label="$200,000 – $300,000" sub="Spacious 1-bedroom or 2-bedroom ADU" />
            <Option selected={w.budget === "over-300k"} onClick={() => setW({ ...w, budget: "over-300k" })} icon={DollarSign} label="Over $300,000" sub="Large 2-bedroom, two-story, or custom design" />
            <Option selected={w.budget === "not-sure"} onClick={() => setW({ ...w, budget: "not-sure" })} label="Not sure — need guidance" sub="We&apos;ll walk you through realistic cost ranges for your goals" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.budget !== null} />
        </div>
      )}

      {/* ── Step 9: Timeline ── */}
      {step === 9 && (
        <div>
          <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1.5">Step 9</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1.5">When are you hoping to get started?</h2>
          <p className="text-stone-500 text-sm mb-5">ADU projects typically take 9–14 months from design to move-in. Planning ahead gets you the best results.</p>
          <div className="space-y-2.5">
            <Option selected={w.timeline === "asap"} onClick={() => setW({ ...w, timeline: "asap" })} icon={Calendar} label="As soon as possible" sub="Ready to move forward — want the fastest path" />
            <Option selected={w.timeline === "3-6-months"} onClick={() => setW({ ...w, timeline: "3-6-months" })} icon={Calendar} label="In the next 3–6 months" sub="Actively planning and researching" />
            <Option selected={w.timeline === "6-12-months"} onClick={() => setW({ ...w, timeline: "6-12-months" })} icon={Calendar} label="In the next 6–12 months" sub="Considering it seriously but not in a rush" />
            <Option selected={w.timeline === "over-1-year"} onClick={() => setW({ ...w, timeline: "over-1-year" })} icon={Calendar} label="More than 1 year out" sub="Long-range planning — gathering information now" />
            <Option selected={w.timeline === "just-exploring"} onClick={() => setW({ ...w, timeline: "just-exploring" })} icon={Calendar} label="Just exploring options" sub="Curious — not ready to commit to anything yet" />
          </div>
          <StepNav onBack={goBack} onNext={goNext} canNext={w.timeline !== null} nextLabel="See My Results" />
        </div>
      )}
    </div>
  );
}
