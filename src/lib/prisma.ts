import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  // During `next build`, Next.js spawns multiple worker processes for parallel
  // static page generation. Each worker has its own Node.js module cache and
  // its own globalThis — the singleton below prevents duplicate clients within
  // a single worker, but cannot prevent one pool per worker process.
  //
  // The DATABASE_URL points to Supabase's PgBouncer pooler in Session mode.
  // Session mode holds a dedicated server connection per client connection for
  // the lifetime of that connection. With pg.Pool's default max=10 and
  // Next.js spawning 4–8 workers, this creates 40–80 session connections —
  // far exceeding the pooler's limit.
  //
  // Fix: cap pool max at 2 per worker process. This keeps total connections
  // well within limits even with many parallel workers (8 workers × 2 = 16).
  // At runtime (deployed) only one process runs, so this has no runtime cost.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
    idleTimeoutMillis: 10_000,
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
