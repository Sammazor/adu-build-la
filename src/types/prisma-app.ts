/**
 * App-layer types derived from the Prisma client instance.
 * Never import model/enum/namespace types directly from "@prisma/client" in app
 * code — the adapter-based setup does not reliably export them for type-checking.
 * Derive everything here from the actual prisma client methods instead.
 */
import { prisma } from "@/lib/prisma";

// ── SiteSettings ─────────────────────────────────────────────────────────────
const _siteSettingsQuery = () => prisma.siteSettings.findFirst();
export type SiteSettings = NonNullable<Awaited<ReturnType<typeof _siteSettingsQuery>>>;

// ── Author ────────────────────────────────────────────────────────────────────
const _authorQuery = () => prisma.author.findFirst();
export type Author = NonNullable<Awaited<ReturnType<typeof _authorQuery>>>;

// ── Post ──────────────────────────────────────────────────────────────────────
const _postQuery = () => prisma.post.findFirst({ include: { author: true } });
export type Post = NonNullable<Awaited<ReturnType<typeof _postQuery>>>;
// Plain post without relations (for form editing)
const _postPlainQuery = () => prisma.post.findFirst();
export type PostPlain = NonNullable<Awaited<ReturnType<typeof _postPlainQuery>>>;

// ── ServicePage ───────────────────────────────────────────────────────────────
const _servicePageQuery = () => prisma.servicePage.findFirst();
export type ServicePage = NonNullable<Awaited<ReturnType<typeof _servicePageQuery>>>;

// ── Page ──────────────────────────────────────────────────────────────────────
const _pageQuery = () => prisma.page.findFirst();
export type Page = NonNullable<Awaited<ReturnType<typeof _pageQuery>>>;

// ── Media ─────────────────────────────────────────────────────────────────────
const _mediaQuery = () => prisma.media.findFirst({ include: { uploadedBy: { select: { name: true } } } });
export type Media = NonNullable<Awaited<ReturnType<typeof _mediaQuery>>>;

// ── Lead ──────────────────────────────────────────────────────────────────────
const _leadQuery = () => prisma.lead.findFirst({ include: { source: true } });
export type Lead = NonNullable<Awaited<ReturnType<typeof _leadQuery>>>;

// ── LeadSource ────────────────────────────────────────────────────────────────
const _leadSourceQuery = () => prisma.leadSource.findFirst();
export type LeadSource = NonNullable<Awaited<ReturnType<typeof _leadSourceQuery>>>;

// ── SitePageOverride ──────────────────────────────────────────────────────────
const _sitePageOverrideQuery = () => prisma.sitePageOverride.findFirst();
export type SitePageOverride = NonNullable<Awaited<ReturnType<typeof _sitePageOverrideQuery>>>;
