"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, X, CheckCircle2 } from "lucide-react";

export function ImageUploader() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ name: string; ok: boolean; msg?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFiles(incoming: FileList | null) {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...valid]);
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    const newResults: typeof results = [];

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/media/upload", { method: "POST", body: fd });
        if (res.ok) {
          newResults.push({ name: file.name, ok: true });
        } else {
          const json = await res.json().catch(() => ({}));
          newResults.push({ name: file.name, ok: false, msg: json.error ?? "Upload failed" });
        }
      } catch {
        newResults.push({ name: file.name, ok: false, msg: "Network error" });
      }
    }

    setResults(newResults);
    setFiles([]);
    setUploading(false);
    router.refresh();
  }

  function reset() {
    setFiles([]);
    setResults([]);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
      >
        <Upload className="w-4 h-4" />
        Upload Images
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Upload Images</h2>
          <button type="button" onClick={reset} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {results.length > 0 ? (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${r.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">{r.name}</span>
                    {r.msg && <span className="text-xs opacity-70">— {r.msg}</span>}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={reset}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
            </>
          ) : (
            <>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  dragging ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Drop images here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF, SVG · Max 5 MB each</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* Queued files */}
              {files.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                      <span className="truncate text-gray-700">{f.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={files.length === 0 || uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
                >
                  {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : `Upload ${files.length > 0 ? `${files.length} ` : ""}Image${files.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
