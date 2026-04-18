import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  // Supabase Transaction mode pooler (port 6543): each query borrows a server
  // connection for the duration of the transaction then immediately releases it.
  // This is correct for Vercel serverless — many concurrent function instances,
  // each holding a connection only while a query runs.
  //
  // max:1 — each serverless function instance needs at most one connection at a
  // time. The pooler multiplexes across the real Postgres connection limit.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Always assign the singleton — this deduplicates within a single worker
// process across hot reloads (dev) and multiple module imports (build/runtime).
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
