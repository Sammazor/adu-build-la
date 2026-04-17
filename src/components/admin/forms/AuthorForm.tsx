"use client";

import { useActionState } from "react";
import { createAuthor, updateAuthor, type AuthorActionState } from "@/lib/actions/authors";
import { Loader2, CheckCircle2, User } from "lucide-react";
import type { Author } from "@/types/prisma-app";

const initialState: AuthorActionState = { success: false };

function Field({
  id, label, name, type = "text", defaultValue, placeholder, note, error, rows,
}: {
  id: string; label: string; name: string; type?: string;
  defaultValue?: string | null; placeholder?: string; note?: string; error?: string; rows?: number;
}) {
  const base = "w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition";
  const border = error ? "border-red-400" : "border-gray-200";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {note && <p className="text-xs text-gray-400 mb-1">{note}</p>}
      {rows ? (
        <textarea id={id} name={name} rows={rows} defaultValue={defaultValue ?? ""} placeholder={placeholder}
          className={`${base} ${border} resize-none`} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder}
          className={`${base} ${border}`} />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function AuthorForm({ author }: { author?: Author }) {
  const action = author ? updateAuthor : createAuthor;
  const [state, formAction, isPending] = useActionState(action, initialState);

  function fe(field: string) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl mt-6">
      {author && <input type="hidden" name="authorId" value={author.id} />}

      {state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Profile */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100">
          Author Profile
        </h2>

        <Field id="name" label="Full Name*" name="name" defaultValue={author?.name}
          placeholder="Jane Smith" error={fe("name")} />

        <Field id="title" label="Title / Role" name="title" defaultValue={author?.title}
          placeholder="ADU Design Specialist" note="Shown publicly below the author's name on posts."
          error={fe("title")} />

        {!author && (
          <Field id="slug" label="Slug" name="slug" defaultValue=""
            placeholder="jane-smith" note="URL-safe identifier. Auto-generated from name if left blank."
            error={fe("slug")} />
        )}
        {author && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="px-3.5 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-500 font-mono">
              {author.slug}
            </div>
            <p className="text-xs text-gray-400 mt-1">Slug is locked after creation.</p>
          </div>
        )}

        <Field id="bio" label="Bio" name="bio" defaultValue={author?.bio} rows={4}
          placeholder="Brief author bio shown on blog posts…"
          note="Appears on individual blog posts. Keep it concise — 2–4 sentences."
          error={fe("bio")} />
      </section>

      {/* Avatar */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          Avatar
        </h2>
        <Field id="avatarUrl" label="Avatar Image URL" name="avatarUrl" defaultValue={author?.avatarUrl}
          placeholder="https://…"
          note="Paste a URL from the Media Library or any hosted image. Recommended: 200×200px square."
          error={fe("avatarUrl")} />
        {author?.avatarUrl && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={author.avatarUrl} alt={author.name} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
            <p className="text-xs text-gray-400">Current avatar</p>
          </div>
        )}
      </section>

      <button type="submit" disabled={isPending}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors disabled:opacity-60">
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? "Saving…" : author ? "Save Author" : "Create Author"}
      </button>
    </form>
  );
}
