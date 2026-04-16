/**
 * auth.config.ts — Edge-safe NextAuth configuration.
 * Used only by middleware (runs in Edge runtime, cannot use Prisma/pg).
 * Does NOT include the Credentials authorize callback (which needs Prisma).
 *
 * The full auth config (with Prisma DB access) lives in auth.ts.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // filled in by auth.ts; not needed for Edge JWT verification
};
