/**
 * Next.js Edge Middleware
 *
 * Responsibilities:
 * 1. Enforce authentication on /admin routes (redirect to /login if no session cookie)
 * 2. Apply HTTP security headers to every response
 *
 * Edge-safe: does NOT import Prisma or bcrypt.
 * Auth is validated via the NextAuth JWT session cookie (stateless).
 * The admin layout server component performs a full DB-backed session check.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Security headers ──────────────────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-XSS-Protection": "1; mode=block",
  "Content-Security-Policy": [
    "default-src 'self'",
    // unsafe-inline required by Next.js (hydration scripts + Tailwind inline styles)
    // unsafe-eval required in development; acceptable for admin-only tool
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "media-src 'self' https:",
    "connect-src 'self' https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

// ── Auth cookie detection ─────────────────────────────────────────────────────

/**
 * Detect a NextAuth session cookie.
 * NextAuth v5 uses "__Secure-authjs.session-token" in production (HTTPS)
 * and "authjs.session-token" in development (HTTP).
 * We check both to support both environments.
 */
function hasSessionCookie(req: NextRequest): boolean {
  return (
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token") ||
    // NextAuth v4 compat names (just in case)
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token")
  );
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Enforce auth on /admin routes
  if (pathname.startsWith("/admin")) {
    if (!hasSessionCookie(req)) {
      const loginUrl = new URL("/login", req.url);

      // Only carry same-origin relative paths as callbackUrl (open redirect prevention)
      if (pathname.startsWith("/") && !pathname.startsWith("//")) {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }

      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // Allow request through — attach security headers
  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - Static file extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
