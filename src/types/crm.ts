// src/types/crm.ts
import type { Lead, LeadSource } from "@prisma/client";

export type LeadWithSource = Lead & { source: LeadSource | null };

export interface LeadRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  propertyCity: string | null;
  serviceInterest: string | null;
  budgetRange: string | null;
  status: string;
  priority: string;
  isSpam: boolean;
  createdAt: Date;
  source: { name: string } | null;
}

// Form submission shape (from the public lead form)
export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  propertyCity?: string;
  serviceInterest?: string;
  notes?: string;
  // Hidden attribution fields
  sourcePageUrl?: string;
  landingPage?: string;
  referrerUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
}

export type { Lead, LeadSource };
