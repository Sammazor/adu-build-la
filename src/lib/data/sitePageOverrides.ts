import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { SitePageOverride } from "@/types/prisma-app";

export type { SitePageOverride };

export const getPageOverride = cache(
  async (pageKey: string): Promise<SitePageOverride | null> => {
    return prisma.sitePageOverride
      .findUnique({ where: { pageKey } })
      .catch(() => null);
  }
);
