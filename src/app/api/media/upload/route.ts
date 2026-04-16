import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadLimiter } from "@/lib/security/rateLimit";

// ── Allowed types — SVG removed: too easy to embed JS ────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Map MIME type to expected file magic bytes (first N bytes)
// This prevents spoofed Content-Type headers
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/gif": [[0x47, 0x49, 0x46, 0x38]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header (webp)
};

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

/** Verify that the file's first bytes match expected magic bytes for its MIME type. */
async function verifyMagicBytes(file: File, mimeType: string): Promise<boolean> {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return signatures.some((sig) => sig.every((byte, i) => bytes[i] === byte));
}

export async function POST(req: NextRequest) {
  // Auth guard — only authenticated admin users
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit per user ID
  const limit = uploadLimiter.check(userId);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Upload limit reached. Please wait before uploading more files." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Check file type against allowlist
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Please upload JPEG, PNG, WebP, or GIF." },
      { status: 400 }
    );
  }

  // Check file size
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 8 MB." },
      { status: 400 }
    );
  }

  // Verify magic bytes — prevents file type spoofing
  const validMagic = await verifyMagicBytes(file, file.type);
  if (!validMagic) {
    return NextResponse.json(
      { error: "File content does not match declared type." },
      { status: 400 }
    );
  }

  // Sanitize filename — extract safe base name and use declared extension only
  const declaredExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = declaredExt[file.type] ?? "jpg";
  const timestamp = Date.now();
  const safe = file.name
    .replace(/\.[^/.]+$/, "")           // strip extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")        // only safe chars
    .replace(/^-+|-+$/g, "")            // trim hyphens
    .slice(0, 50) || "upload";           // max 50 chars, fallback
  const filename = `media/${safe}-${timestamp}.${ext}`;

  // Upload to Vercel Blob
  let blob: { url: string };
  try {
    blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  // Persist to media table
  try {
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name.slice(0, 255), // truncate just in case
        url: blob.url,
        altText: "",
        mimeType: file.type,
        sizeBytes: file.size,
        uploadedById: userId,
      },
    });

    return NextResponse.json({
      id: media.id,
      url: media.url,
      filename: media.filename,
      originalName: media.originalName,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save file record." }, { status: 500 });
  }
}
