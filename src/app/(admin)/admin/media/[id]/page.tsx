import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { MediaForm } from "@/components/admin/media/MediaForm";
import { MediaDeleteButton } from "@/components/admin/media/MediaDeleteButton";
import { formatBytes, formatDateShort } from "@/lib/utils/formatters";
import { ArrowLeft, ExternalLink, Copy } from "lucide-react";

interface MediaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { id } = await params;

  const media = await prisma.media.findUnique({
    where: { id },
    include: { uploadedBy: { select: { name: true } } },
  });

  if (!media) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/media"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Media Library
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-stone-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open original
          </a>
          <MediaDeleteButton mediaId={media.id} />
        </div>
      </div>

      <AdminHeader
        title={media.title || media.originalName}
        description={`${media.mimeType ?? "image"} · ${formatBytes(media.sizeBytes ?? 0)}${media.width && media.height ? ` · ${media.width}×${media.height}px` : ""}`}
      />

      <div className="grid lg:grid-cols-[340px_1fr] gap-6 mt-6">
        {/* ── Left: preview + file info ───────────────────────────────── */}
        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative aspect-square bg-gray-50">
              <Image
                src={media.url}
                alt={media.altText || media.originalName}
                fill
                className="object-contain"
                sizes="340px"
              />
            </div>
          </div>

          {/* File info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">File Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">Original name</dt>
                <dd className="text-gray-700 truncate max-w-[180px] text-right">{media.originalName}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">File size</dt>
                <dd className="text-gray-700">{formatBytes(media.sizeBytes ?? 0)}</dd>
              </div>
              {media.width && media.height && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-400">Dimensions</dt>
                  <dd className="text-gray-700">{media.width} × {media.height}px</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">Type</dt>
                <dd className="text-gray-700">{media.mimeType ?? "unknown"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">Uploaded</dt>
                <dd className="text-gray-700">{formatDateShort(media.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-400">By</dt>
                <dd className="text-gray-700">{media.uploadedBy.name}</dd>
              </div>
            </dl>
          </div>

          {/* URL copy */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">URL</h3>
            <div className="flex items-start gap-2">
              <code className="text-[11px] text-gray-600 break-all flex-1 leading-relaxed">
                {media.url}
              </code>
              <button
                type="button"
                onClick={undefined}
                title="Copy URL"
                className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: metadata form ─────────────────────────────────────── */}
        <div>
          <MediaForm media={media} />
        </div>
      </div>
    </div>
  );
}
