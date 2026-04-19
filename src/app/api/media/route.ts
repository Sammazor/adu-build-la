import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const media = await prisma.media
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, url: true, altText: true, title: true, originalName: true, width: true, height: true },
    })
    .catch(() => []);

  return NextResponse.json(media);
}
