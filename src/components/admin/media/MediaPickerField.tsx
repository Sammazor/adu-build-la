"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, ImageIcon, Check, Loader2, ExternalLink, Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  altText: string;
  title: string | null;
  originalName: string;
  width: number | null;
  height: number | null;
}

interface MediaPickerFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (url: string) => void;
  note?: string;
}

export function MediaPickerField({ label, name, value, onChange, note }: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Upload state
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ name: string; ok: boolean; url?: string; msg?: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) setMedia(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  function openPicker() {
    setOpen(true);
    setTab("library");
    setSearch("");
    setFiles([]);
    setUploadResults([]);
    fetchMedia();
  }

  function close() {
    setOpen(false);
  }

  function pick(url: string) {
    onChange(url);
    close();
  }

  function remove() {
    onChange("");
  }

  // Upload
  function handleFiles(incoming: FileList | null) {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (f) => f.type.startsWith("image/") && f.size <= 8 * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...valid]);
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    const results: typeof uploadResults = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/media/upload", { method: "POST", body: fd });
        if (res.ok) {
          const json = await res.json().catch(() => ({}));
          results.push({ name: file.name, ok: true, url: json.url });
        } else {
          const json = await res.json().catch(() => ({}));
          results.push({ name: file.name, ok: false, msg: json.error ?? "Upload failed" });
        }
      } catch {
        results.push({ name: file.name, ok: false, msg: "Network error" });
      }
    }
    setUploadResults(results);
    setFiles([]);
    setUploading(false);
    // Switch to library and refresh so newly uploaded images appear
    await fetchMedia();
    setTab("library");
    // Auto-pick the last successful upload
    const lastOk = [...results].reverse().find((r) => r.ok && r.url);
    if (lastOk?.url) pick(lastOk.url);
  }

  const filtered = search.trim()
    ? media.filter(
        (m) =>
          m.altText?.toLowerCase().includes(search.toLowerCase()) ||
          m.title?.toLowerCase().includes(search.toLowerCase()) ||
          m.originalName.toLowerCase().includes(search.toLowerCase())
      )
    : media;

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />

      {value ? (
        <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
          {/* Preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Selected image"
            className="w-28 h-20 object-cover rounded-lg border border-gray-200 shrink-0 bg-gray-100"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs text-gray-500 font-mono truncate">{value}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-stone-400 hover:text-stone-800 transition-colors"
              >
                Replace
              </button>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1.5 text-gray-400 hover:text-stone-700 transition-colors inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={remove}
                className="text-xs px-2 py-1.5 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 hover:border-stone-400 hover:text-stone-600 transition-colors"
        >
          <ImageIcon className="w-4 h-4 shrink-0" />
          Choose from Media Library or upload…
        </button>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-semibold text-gray-900">Select Image</h2>
              <button type="button" onClick={close} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 shrink-0 px-6">
              {(["library", "upload"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    tab === t
                      ? "border-stone-900 text-stone-900"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {t === "library" ? "Media Library" : "Upload New"}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {tab === "library" && (
                <div className="p-5 space-y-4">
                  {/* Search */}
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by filename, title, or alt text…"
                    className={inputCls}
                  />

                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                      <ImageIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">
                        {search ? "No images match your search." : "No images uploaded yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {filtered.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => pick(m.url)}
                          className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all hover:border-amber-400 hover:shadow-md ${
                            value === m.url ? "border-amber-500 ring-2 ring-amber-200" : "border-gray-200"
                          }`}
                          title={m.altText || m.originalName}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.url}
                            alt={m.altText || ""}
                            className="w-full h-full object-cover"
                          />
                          {value === m.url && (
                            <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                              <Check className="w-6 h-6 text-amber-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "upload" && (
                <div className="p-5 space-y-4">
                  {uploadResults.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        {uploadResults.map((r, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                              r.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                            }`}
                          >
                            {r.ok ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                            <span className="truncate">{r.name}</span>
                            {!r.ok && r.msg && <span className="text-xs opacity-70 ml-auto shrink-0">— {r.msg}</span>}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">Switching to library…</p>
                    </>
                  ) : (
                    <>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                        onClick={() => inputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                          dragging ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Drop images here or click to browse</p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP · Max 8 MB each</p>
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFiles(e.target.files)}
                        />
                      </div>

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
                          onClick={close}
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
                          {uploading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                          ) : (
                            `Upload${files.length > 0 ? ` ${files.length}` : ""} Image${files.length !== 1 ? "s" : ""}`
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
