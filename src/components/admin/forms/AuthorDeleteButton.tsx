"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAuthor } from "@/lib/actions/authors";
import { Trash2, Loader2 } from "lucide-react";

export function AuthorDeleteButton({ authorId, postCount }: { authorId: string; postCount: number }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const result = await deleteAuthor(authorId);
    if (result.success) {
      router.push("/admin/authors");
    } else {
      setError(result.error ?? "Delete failed");
      setLoading(false);
      setConfirming(false);
    }
  }

  if (postCount > 0 && !confirming) {
    return (
      <span className="text-xs text-gray-400 italic">
        Reassign {postCount} post{postCount !== 1 ? "s" : ""} to delete
      </span>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-500">{error}</span>}
        <span className="text-xs text-gray-500">Delete this author?</span>
        <button type="button" onClick={handleDelete} disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60 transition-colors">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Yes, delete
        </button>
        <button type="button" onClick={() => setConfirming(false)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors">
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  );
}
