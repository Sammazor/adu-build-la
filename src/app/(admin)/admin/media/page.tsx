import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { ImageUploader } from "@/components/admin/media/ImageUploader";
import { formatBytes, formatDateShort } from "@/lib/utils/formatters";
import { Plus, ImageIcon, MapPin, AlertCircle } from "lucide-react";

export default async function MediaLibraryPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { uploadedBy: { select: { name: true } } },
  });

  const totalBytes = media.reduce((sum, m) => sum + (m.sizeBytes ?? 0), 0);
  const missingAlt = media.filter((m) => !m.altText || m.altText === "").length;

  return (
    <div>
      <AdminHeader
        title="Media Library"
        description={`${media.length} file${media.length !== 1 ? "s" : ""} · ${formatBytes(totalBytes)}${missingAlt > 0 ? ` · ${missingAlt} missing alt text` : ""}`}
        action={<ImageUploader />}
      />

      {/* SEO warning */}
      {missingAlt > 0 && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <span>
            <strong>{missingAlt} image{missingAlt !== 1 ? "s" : ""}</strong> missing alt text. Alt text is required for accessibility and image SEO.{" "}
            <Link href="/admin/media?filter=no-alt" className="underline hover:text-amber-900">
              Filter to fix
            </Link>
          </span>
        </div>
      )}

      {media.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">No images uploaded yet.</p>
          <p className="text-gray-400 text-xs">Use the upload button above to add images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {media.map((m) => {
            const hasAlt = m.altText && m.altText !== "";
            const hasGeo = m.locationCity || m.latitude;
            return (
              <Link
                key={m.id}
                href={`/admin/media/${m.id}`}
                className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-stone-400 hover:shadow-md transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {m.mimeType?.startsWith("image/") ? (
                    <Image
                      src={m.url}
                      alt={m.altText || m.originalName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="200px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                    {!hasAlt && (
                      <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                        No alt
                      </span>
                    )}
                    {hasGeo && (
                      <span className="px-1.5 py-0.5 bg-stone-800/80 text-white text-[10px] rounded flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        Geo
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-800 truncate leading-snug">
                    {m.title || m.originalName}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {m.width && m.height ? `${m.width}×${m.height} · ` : ""}
                    {formatBytes(m.sizeBytes ?? 0)}
                  </p>
                  <p className="text-[10px] text-gray-300 mt-0.5">{formatDateShort(m.createdAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
