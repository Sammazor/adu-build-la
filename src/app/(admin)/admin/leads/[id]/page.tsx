import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { LeadStatusBadge } from "@/components/admin/ui/LeadStatusBadge";
import { formatDate, formatRelativeTime } from "@/lib/utils/formatters";
import { updateLeadStatus, toggleLeadSpam } from "@/lib/actions/leads";
import { ArrowLeft } from "lucide-react";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_OPTIONS = [
  "new", "contacted", "qualified", "proposal", "won", "lost", "nurture", "disqualified",
] as const;

const SERVICE_LABELS: Record<string, string> = {
  design: "ADU Design Only",
  build: "ADU Construction Only",
  design_build: "Full Design + Build",
  consulting: "Consulting / Feasibility",
  unknown: "Not Sure Yet",
};

const BUDGET_LABELS: Record<string, string> = {
  under_150k: "Under $150,000",
  range_150_200k: "$150,000 – $200,000",
  range_200_300k: "$200,000 – $300,000",
  over_300k: "Over $300,000",
  unknown: "Not specified",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  three_months: "Within 3 months",
  six_months: "Within 6 months",
  one_year: "Within 1 year",
  exploring: "Just exploring",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
        {label}
      </dt>
      <dd className="text-sm text-gray-900">{value || "—"}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
        {title}
      </h2>
      <dl className="grid grid-cols-2 gap-4">{children}</dl>
    </div>
  );
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { source: true },
  });

  if (!lead) notFound();

  async function changeStatus(formData: FormData) {
    "use server";
    await updateLeadStatus({ success: false }, formData);
  }
  async function toggleSpam() {
    "use server";
    // lead is guaranteed non-null here: notFound() throws above if null
    await toggleLeadSpam(lead!.id, !lead!.isSpam);
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Leads
        </Link>
      </div>

      <AdminHeader
        title={`${lead.firstName} ${lead.lastName}`}
        description={`Lead · Submitted ${formatRelativeTime(lead.createdAt)}`}
        action={
          <div className="flex items-center gap-3">
            <LeadStatusBadge status={lead.status} />
            {lead.isSpam && (
              <span className="text-xs text-red-500 font-medium">Flagged as spam</span>
            )}
          </div>
        }
      />

      <div className="space-y-4">
        {/* Status actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Pipeline Status</h2>
          <form action={changeStatus} className="flex items-center gap-3 flex-wrap">
            <input type="hidden" name="leadId" value={lead.id} />
            <select
              name="status"
              defaultValue={lead.status}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Update Status
            </button>
          </form>
        </div>

        {/* Contact info */}
        <Section title="Contact Information">
          <Field label="First Name" value={lead.firstName} />
          <Field label="Last Name" value={lead.lastName} />
          <Field label="Email" value={lead.email} />
          <Field label="Phone" value={lead.phone} />
          <Field label="Preferred Contact" value={lead.preferredContactMethod} />
        </Section>

        {/* Property & Project */}
        <Section title="Property & Project">
          <Field label="Property City" value={lead.propertyCity} />
          <Field label="ZIP Code" value={lead.propertyZip} />
          <Field label="Property Address" value={lead.propertyAddress} />
          <Field
            label="Service Interest"
            value={lead.serviceInterest ? SERVICE_LABELS[lead.serviceInterest] ?? lead.serviceInterest : null}
          />
          <Field label="ADU Type Interest" value={lead.aduTypeInterest} />
          <Field
            label="Timeline"
            value={lead.timeline ? TIMELINE_LABELS[lead.timeline] ?? lead.timeline : null}
          />
          <Field
            label="Budget Range"
            value={lead.budgetRange ? BUDGET_LABELS[lead.budgetRange] ?? lead.budgetRange : null}
          />
        </Section>

        {/* Notes */}
        {lead.notes && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Notes</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
          </div>
        )}

        {/* Attribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Attribution
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Source" value={lead.source?.name} />
            <Field label="Source Page" value={lead.sourcePageUrl} />
            <Field label="Landing Page" value={lead.landingPage} />
            <Field label="Referrer" value={lead.referrerUrl} />
            <Field label="UTM Source" value={lead.utmSource} />
            <Field label="UTM Medium" value={lead.utmMedium} />
            <Field label="UTM Campaign" value={lead.utmCampaign} />
            <Field label="UTM Term" value={lead.utmTerm} />
            <Field label="GCLID" value={lead.gclid} />
            <Field label="FBCLID" value={lead.fbclid} />
            <Field label="Device" value={lead.deviceType} />
          </dl>
        </div>

        {/* Admin metadata + spam toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Admin
          </h2>
          <dl className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Priority" value={lead.priority} />
            <Field label="Submitted" value={formatDate(lead.createdAt)} />
            <Field label="Last Updated" value={formatDate(lead.updatedAt)} />
          </dl>
          <form action={toggleSpam}>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                lead.isSpam
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              {lead.isSpam ? "Unmark as Spam" : "Mark as Spam"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
