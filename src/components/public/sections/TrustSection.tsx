import {
  Shield,
  Users,
  Clock,
  DollarSign,
  FileCheck,
  Layers,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrustItem {
  /**
   * Maps to a Lucide icon name. Supported values:
   * "shield" | "users" | "clock" | "dollar-sign" | "file-check" | "layers"
   * Future CMS: store as a string field; map to icon at render time.
   */
  iconName: string;
  title: string;
  body: string;
}

interface TrustSectionProps {
  items?: TrustItem[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  /**
   * "light" → stone-50 background, dark text.
   * "dark"  → stone-950 background, light text.
   * @default "light"
   */
  variant?: "light" | "dark";
}

// ─── Default trust items ──────────────────────────────────────────────────────
// CMS-migration note: replace this array with a Prisma query on a TrustItem
// model filtered by `isActive: true`, ordered by `sortOrder`.

export const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  {
    iconName: "shield",
    title: "Licensed & Insured General Contractor",
    body: "ADU Build LA holds an active California General Contractor (B) license with CSLB and carries full general liability and workers' compensation insurance. Every subcontractor on your project is licensed, insured, and verified before they set foot on your property.",
  },
  {
    iconName: "users",
    title: "200+ ADUs Built Across LA County",
    body: "We've completed over 200 ADU projects — garage conversions, detached new construction, Junior ADUs, and attached units — across every major LA-area city. That depth of experience means we've seen every site condition, every permit challenge, and every construction scenario.",
  },
  {
    iconName: "clock",
    title: "15+ Years of ADU Experience",
    body: "Since before the 2020 ADU law reforms, we've been building accessory dwelling units in Los Angeles. We've navigated every iteration of state ADU law, local zoning changes, and city permit process updates — institutional knowledge that directly accelerates your project.",
  },
  {
    iconName: "dollar-sign",
    title: "Transparent, Fixed-Price Contracts",
    body: "We don't use time-and-materials billing or open-ended design fees. Every project starts with a detailed all-inclusive fixed price covering design, engineering, permitting, and construction. What we quote is what you pay — no surprise change orders, no scope creep billing.",
  },
  {
    iconName: "file-check",
    title: "In-House Permit Management",
    body: "Our team has submitted hundreds of permit applications across LADBS, Santa Monica, Pasadena, Glendale, Culver City, and other LA-area jurisdictions. We know each city's plan check process, common correction triggers, and expedite options — reducing wait time and managing every step for you.",
  },
  {
    iconName: "layers",
    title: "Single-Contract Design-Build",
    body: "Under one contract, our in-house team handles every phase — design, engineering, permitting, and construction. You won't need to coordinate between a separate architect and a separate builder. One point of contact, one schedule, full accountability from first sketch to final inspection.",
  },
];

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  shield: Shield,
  users: Users,
  clock: Clock,
  "dollar-sign": DollarSign,
  "file-check": FileCheck,
  layers: Layers,
};

function TrustIcon({ name, dark }: { name: string; dark: boolean }) {
  const Icon = ICON_MAP[name] ?? Shield;
  if (dark) {
    return (
      <div className="w-11 h-11 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-amber-400" />
      </div>
    );
  }
  return (
    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-amber-600" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrustSection({
  items = DEFAULT_TRUST_ITEMS,
  eyebrow = "Why ADU Build LA",
  heading = "The ADU Specialists Los Angeles Homeowners Trust",
  subheading,
  variant = "light",
}: TrustSectionProps) {
  const dark = variant === "dark";

  return (
    <section className={`py-24 ${dark ? "bg-stone-950" : "bg-stone-50"}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          {eyebrow && (
            <div
              className={`text-xs font-semibold tracking-widest uppercase mb-3 ${
                dark ? "text-amber-400" : "text-amber-600"
              }`}
            >
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2
              className={`text-3xl lg:text-4xl font-bold leading-tight mb-4 ${
                dark ? "text-white" : "text-stone-900"
              }`}
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className={`text-lg leading-relaxed ${
                dark ? "text-stone-400" : "text-stone-500"
              }`}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl p-6 border flex flex-col gap-4 ${
                dark
                  ? "bg-stone-900/60 border-stone-800"
                  : "bg-white border-stone-200"
              }`}
            >
              <TrustIcon name={item.iconName} dark={dark} />
              <div>
                <h3
                  className={`font-bold text-base mb-2 leading-snug ${
                    dark ? "text-white" : "text-stone-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    dark ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
