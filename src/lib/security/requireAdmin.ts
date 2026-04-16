/**
 * requireAdmin — call at the top of every admin server action.
 * Throws a generic error (not redirect) if the caller is not an authenticated admin/editor/super_admin.
 * Returns the session user so actions can record who performed the change.
 */
import { auth } from "@/lib/auth";

const ALLOWED_ROLES = new Set(["super_admin", "admin", "editor"]);

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function requireAdmin(): Promise<{ id: string; role: string }> {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  const role = (session.user as { role?: string }).role ?? "";
  if (!ALLOWED_ROLES.has(role)) {
    throw new UnauthorizedError();
  }

  const id = (session.user as { id?: string }).id ?? "";
  if (!id) {
    throw new UnauthorizedError();
  }

  return { id, role };
}
