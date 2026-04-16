"use client";

import { useReducer, useState, useActionState, useEffect } from "react";
import { submitLead } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";
import {
  STEPS,
  FLOOR_PLANS,
  INITIAL_CONFIG,
  getMatchingFloorPlans,
  computeResult,
  SUMMARY_LABELS,
  type ConfigState,
  type ConfigStep,
  type ConfigChoice,
  type FloorPlanPreset,
} from "./configurator-data";
import { FloorPlanSvg } from "./FloorPlanSvg";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "questions" | "lead-capture" | "results";

type ConfigAction =
  | { type: "SET"; key: keyof ConfigState; value: string }
  | { type: "RESET" };

function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  if (action.type === "RESET") return INITIAL_CONFIG;
  return { ...state, [action.key]: action.value };
}

const LEAD_INITIAL: {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
} = { success: false };

// ─── Choice card ──────────────────────────────────────────────────────────────

function ChoiceCard({
  choice,
  selected,
  visual,
  onClick,
}: {
  choice: ConfigChoice;
  selected: boolean;
  visual?: boolean;
  onClick: () => void;
}) {
  if (visual && choice.preview) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative w-full text-left rounded-2xl overflow-hidden border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
          selected
            ? "border-amber-400 ring-1 ring-amber-400 shadow-lg shadow-amber-100"
            : "border-stone-200 hover:border-stone-300 hover:shadow-md"
        )}
      >
        {/* Swatch */}
        <div
          className="h-16 w-full relative"
          style={{ background: choice.preview }}
        >
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
          )}
        </div>

        {/* Text */}
        <div
          className={cn(
            "px-3.5 py-3 transition-colors",
            selected ? "bg-amber-50" : "bg-white"
          )}
        >
          <div className="flex items-start justify-between gap-1.5 mb-0.5">
            <span
              className={cn(
                "text-sm font-semibold leading-snug",
                selected ? "text-amber-900" : "text-stone-900"
              )}
            >
              {choice.label}
            </span>
            {choice.badge && !selected && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded-full whitespace-nowrap">
                {choice.badge}
              </span>
            )}
          </div>
          {choice.sub && (
            <p
              className={cn(
                "text-xs leading-snug",
                selected ? "text-amber-700/80" : "text-stone-400"
              )}
            >
              {choice.sub}
            </p>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        selected
          ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400 shadow-md shadow-amber-100"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span
              className={cn(
                "text-sm font-semibold",
                selected ? "text-amber-900" : "text-stone-900"
              )}
            >
              {choice.label}
            </span>
            {choice.badge && (
              <span
                className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                  selected
                    ? "bg-amber-200 text-amber-800"
                    : "bg-stone-100 text-stone-500"
                )}
              >
                {choice.badge}
              </span>
            )}
          </div>
          {choice.sub && (
            <p
              className={cn(
                "text-xs leading-snug",
                selected ? "text-amber-700/80" : "text-stone-400"
              )}
            >
              {choice.sub}
            </p>
          )}
        </div>

        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
            selected
              ? "border-amber-500 bg-amber-500"
              : "border-stone-300 bg-white"
          )}
        >
          {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}

// ─── City chip ────────────────────────────────────────────────────────────────

function CityChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        selected
          ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-200"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
      )}
    >
      {label}
    </button>
  );
}

// ─── Step progress ────────────────────────────────────────────────────────────

function StepProgress({
  step,
  total,
  label,
}: {
  step: number;
  total: number;
  label: string;
}) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-bold">{step}</span>
          </div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            {label}
          </span>
        </div>
        <span className="text-xs text-stone-400 tabular-nums">
          {step} / {total}
        </span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < step ? "bg-amber-500" : "bg-stone-100"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Summary panel ────────────────────────────────────────────────────────────

function SummaryPanel({ config }: { config: ConfigState }) {
  const entries = (
    Object.entries(config) as [keyof ConfigState, string | null][]
  ).filter(([, v]) => v !== null);

  if (entries.length === 0) {
    return (
      <p className="text-xs text-stone-400 italic leading-relaxed">
        Your selections will appear here as you go.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map(([key, val]) => {
        const fmt = SUMMARY_LABELS[key];
        const label = fmt && val ? fmt(val) : val;
        return (
          <li key={key} className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5 text-amber-600" strokeWidth={3} />
            </div>
            <span className="text-xs text-stone-600 leading-snug">{label}</span>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Floor plan panel ─────────────────────────────────────────────────────────

function FloorPlanPanel({
  plans,
  activePlan,
  onSelect,
}: {
  plans: FloorPlanPreset[];
  activePlan: FloorPlanPreset;
  onSelect: (plan: FloorPlanPreset) => void;
}) {
  return (
    <div>
      {/* Plan selector tabs */}
      {plans.length > 1 && (
        <div className="flex gap-1 mb-3 flex-wrap">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150",
                activePlan.id === plan.id
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
              )}
            >
              {plan.name}
            </button>
          ))}
        </div>
      )}

      {/* SVG frame */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
        {/* Top label bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-3 py-1.5 bg-white/80 backdrop-blur-sm border-b border-stone-100 z-10">
          <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
            Floor Plan
          </span>
          <span className="text-[10px] text-stone-400">
            {activePlan.sqFt} sq ft
          </span>
        </div>

        <div className="pt-8 pb-2 px-2 aspect-[4/3] flex items-center justify-center">
          <FloorPlanSvg svgKey={activePlan.svgKey} />
        </div>
      </div>

      {/* Plan meta */}
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 items-start">
        <div>
          <p className="text-sm font-bold text-stone-900 leading-tight">
            {activePlan.name}
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            {activePlan.beds} · {activePlan.baths} Bath · {activePlan.sqFt} sq ft
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-stone-400 uppercase tracking-wide">From</p>
          <p className="text-sm font-bold text-stone-800">{activePlan.startingFrom}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Lead capture ─────────────────────────────────────────────────────────────

function LeadCaptureStep({
  config,
  onBack,
}: {
  config: ConfigState;
  onBack: () => void;
}) {
  const [state, action, isPending] = useActionState(submitLead, LEAD_INITIAL);

  const configSummary = (
    Object.entries(config) as [keyof ConfigState, string | null][]
  )
    .filter(([, v]) => v !== null)
    .map(([key, val]) => {
      const fmt = SUMMARY_LABELS[key];
      return `${key}: ${fmt && val ? fmt(val) : val}`;
    })
    .join(" | ");

  const notes = `Configurator selections: ${configSummary}`;

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-amber-500" />
        </div>
        <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">
          Configuration received
        </p>
        <h3 className="text-2xl font-bold text-stone-900 mb-3">
          We&apos;ll be in touch shortly
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
          Our team will review your selections and reach out within 1 business
          day with a personalized recommendation and pricing.
        </p>
      </div>
    );
  }

  const inputBase =
    "w-full px-4 py-3 rounded-xl border bg-white text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow";

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
          Almost done
        </p>
        <h3 className="text-2xl font-bold text-stone-900 leading-tight mb-2">
          Get your personalized plan
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed">
          Your configuration is complete. Enter your details and we&apos;ll
          prepare a tailored breakdown — ADU recommendation, floor plan, budget
          range, and timeline.
        </p>
      </div>

      <form action={action} className="space-y-3.5">
        <input type="hidden" name="notes" value={notes} />
        <input
          type="hidden"
          name="sourcePageUrl"
          value={typeof window !== "undefined" ? window.location.href : ""}
        />
        <input
          type="hidden"
          name="landingPage"
          value="/build-your-custom-adu"
        />
        <input type="hidden" name="serviceInterest" value="design_build" />
        <input
          type="hidden"
          name="propertyCity"
          value={
            config.city
              ? (SUMMARY_LABELS.city?.(config.city) ?? config.city)
              : ""
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              First name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              placeholder="Sam"
              className={cn(
                inputBase,
                state.errors?.firstName ? "border-red-300" : "border-stone-200"
              )}
            />
            {state.errors?.firstName && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.firstName[0]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Last name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
              placeholder="Smith"
              className={cn(
                inputBase,
                state.errors?.lastName ? "border-red-300" : "border-stone-200"
              )}
            />
            {state.errors?.lastName && (
              <p className="text-xs text-red-500 mt-1">
                {state.errors.lastName[0]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">
            Email address <span className="text-amber-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="sam@example.com"
            className={cn(
              inputBase,
              state.errors?.email ? "border-red-300" : "border-stone-200"
            )}
          />
          {state.errors?.email && (
            <p className="text-xs text-red-500 mt-1">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">
            Phone{" "}
            <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(310) 555-0100"
            className={cn(inputBase, "border-stone-200")}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-white text-sm font-bold hover:bg-stone-800 disabled:opacity-60 transition-colors mt-1 shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send My Configuration
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-stone-400 pt-0.5">
          No spam. Used only to follow up on your ADU project.
        </p>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-5 flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Back to configuration
      </button>
    </div>
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({
  config,
  onRestart,
}: {
  config: ConfigState;
  onRestart: () => void;
}) {
  const result = computeResult(config);
  const matchingPlans = getMatchingFloorPlans(config);
  const [activePlan, setActivePlan] = useState<FloorPlanPreset>(
    matchingPlans[0]
  );

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-0 min-h-[600px]">
      {/* ── Left: results ──────────────────────────────────────────────── */}
      <div className="p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-stone-100 flex flex-col gap-7">
        {/* Header block */}
        <div>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">
            Your ADU Configuration
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold text-stone-900 leading-tight mb-2">
            {result.headline}
          </h3>
          {result.subline && (
            <p className="text-stone-500 text-sm leading-relaxed">
              {result.subline}
            </p>
          )}
        </div>

        {/* Budget + timeline */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
              Estimated Range
            </p>
            <p className="text-xl font-bold text-stone-900 leading-none mb-2">
              {result.estimatedRange}
            </p>
            <p className="text-xs text-stone-500 leading-snug">
              {result.rangeNote}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Timeline
            </p>
            <p className="text-sm font-bold text-stone-900 leading-snug mb-1">
              {result.timeline}
            </p>
            <p className="text-xs text-stone-400">Design to move-in</p>
          </div>
        </div>

        {/* Highlights */}
        {result.topHighlights.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
              Configuration highlights
            </p>
            <ul className="space-y-2.5">
              {result.topHighlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check
                      className="w-3 h-3 text-amber-600"
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-sm text-stone-700 leading-snug">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* City insight */}
        {result.cityInsight && (
          <div className="rounded-xl bg-stone-50 border border-stone-200 px-4 py-3.5">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
              Local insight
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              {result.cityInsight}
            </p>
          </div>
        )}

        {/* Recommended model */}
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">
            Recommended model
          </p>
          <a
            href={result.recommendedModelHref}
            className="group flex items-center justify-between gap-4 p-4 rounded-2xl border-2 border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50 transition-all duration-200"
          >
            <div>
              <p className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                {result.recommendedModel}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                View full specs, photos, and pricing
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-amber-500 flex items-center justify-center shrink-0 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-white transition-colors" />
            </div>
          </a>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5 pt-1 mt-auto">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs text-amber-700 mb-3 leading-snug">
              <span className="font-semibold">Ready to move forward?</span>{" "}
              Get a firm quote based on your actual lot — free, no obligation.
            </p>
            <a
              href="/estimate"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 text-sm font-bold transition-colors shadow-sm shadow-amber-400/30"
            >
              Get My Free Estimate
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 hover:text-stone-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reconfigure from scratch
          </button>
        </div>
      </div>

      {/* ── Right: floor plans ──────────────────────────────────────────── */}
      <div className="bg-stone-50 p-6 lg:p-8 flex flex-col gap-6">
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
            Matching floor plans
          </p>
          <FloorPlanPanel
            plans={matchingPlans}
            activePlan={activePlan}
            onSelect={setActivePlan}
          />
        </div>

        {/* Summary recap */}
        <div className="border-t border-stone-200 pt-5">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
            Your selections
          </p>
          <SummaryPanel config={config} />
        </div>
      </div>
    </div>
  );
}

// ─── Main configurator ────────────────────────────────────────────────────────

export function AduConfigurator() {
  const [config, dispatch] = useReducer(configReducer, INITIAL_CONFIG);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("questions");
  const [activePlan, setActivePlan] = useState<FloorPlanPreset>(FLOOR_PLANS[0]);

  const totalSteps = STEPS.length;
  const currentStep: ConfigStep = STEPS[stepIndex];
  const currentValue = config[currentStep.key as keyof ConfigState];
  const matchingPlans = getMatchingFloorPlans(config);

  // Keep sidebar floor plan synced with selections
  useEffect(() => {
    if (
      matchingPlans.length > 0 &&
      !matchingPlans.find((p) => p.id === activePlan.id)
    ) {
      setActivePlan(matchingPlans[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.sqFt, config.beds, config.aduType]);

  function handleSelect(value: string) {
    dispatch({ type: "SET", key: currentStep.key as keyof ConfigState, value });
  }

  function handleNext() {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setPhase("lead-capture");
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function handleRestart() {
    dispatch({ type: "RESET" });
    setStepIndex(0);
    setPhase("questions");
    setActivePlan(FLOOR_PLANS[0]);
  }

  const canAdvance = currentValue !== null || currentStep.optional;
  const sidebarPlans =
    matchingPlans.length > 0 ? matchingPlans : FLOOR_PLANS.slice(0, 3);

  // ── Lead capture ────────────────────────────────────────────────────────────
  if (phase === "lead-capture") {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_320px] min-h-[580px]">
          <div className="p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-stone-100">
            <LeadCaptureStep
              config={config}
              onBack={() => setPhase("questions")}
            />
          </div>
          <div className="p-6 lg:p-8 bg-stone-50 flex flex-col gap-6">
            {/* Floor plan recap */}
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">
                Your floor plan
              </p>
              <FloorPlanPanel
                plans={sidebarPlans}
                activePlan={activePlan}
                onSelect={setActivePlan}
              />
            </div>
            <div className="border-t border-stone-200 pt-5">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                Your selections
              </p>
              <SummaryPanel config={config} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ─────────────────────────────────────────────────────────────────
  if (phase === "results") {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <ResultScreen config={config} onRestart={handleRestart} />
      </div>
    );
  }

  // ── Questions ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_300px] min-h-[600px]">

        {/* ── Left: question area ─────────────────────────────────────── */}
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-stone-100">

          {/* Progress header — full-width stripe */}
          <div className="px-6 lg:px-8 pt-6 pb-5 border-b border-stone-100 bg-stone-50/60">
            <StepProgress
              step={stepIndex + 1}
              total={totalSteps}
              label={currentStep.title}
            />
          </div>

          {/* Question content */}
          <div className="flex-1 flex flex-col px-6 lg:px-8 py-6">
            {/* Question header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900 leading-snug mb-1.5">
                {currentStep.title}
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Choices */}
            <div className="flex-1">
              {currentStep.type === "chips" ? (
                <div className="flex flex-wrap gap-2.5">
                  {currentStep.choices.map((choice) => (
                    <CityChip
                      key={choice.id}
                      label={choice.label}
                      selected={currentValue === choice.id}
                      onClick={() => handleSelect(choice.id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-2.5",
                    currentStep.type === "cards-visual"
                      ? "grid-cols-1 sm:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2"
                  )}
                >
                  {currentStep.choices.map((choice) => (
                    <ChoiceCard
                      key={choice.id}
                      choice={choice}
                      selected={currentValue === choice.id}
                      visual={currentStep.type === "cards-visual"}
                      onClick={() => handleSelect(choice.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Inline nudge — shown after step 3 */}
            {stepIndex >= 3 && (
              <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-xs text-amber-800 leading-snug">
                  <span className="font-semibold">Looking good.</span>{" "}
                  Finish the last {totalSteps - stepIndex} step{totalSteps - stepIndex !== 1 ? "s" : ""} to get your real price range and floor plan.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-7 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={stepIndex === 0}
                className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors min-h-[44px] px-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-150 min-h-[44px]",
                  canAdvance
                    ? "bg-stone-900 text-white hover:bg-stone-800 shadow-sm"
                    : "bg-stone-100 text-stone-300 cursor-not-allowed"
                )}
              >
                {stepIndex === totalSteps - 1 ? (
                  <>
                    See My Results
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: sidebar ──────────────────────────────────────────── */}
        <div className="bg-stone-50/80 flex flex-col">
          {/* Floor plan preview */}
          <div className="p-5 border-b border-stone-100">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3.5">
              Matching floor plan
            </p>
            <FloorPlanPanel
              plans={sidebarPlans}
              activePlan={activePlan}
              onSelect={setActivePlan}
            />
          </div>

          {/* Live summary */}
          <div className="p-5 flex-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3.5">
              Your selections
            </p>
            <SummaryPanel config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}
