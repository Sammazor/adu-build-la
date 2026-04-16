"use client";

import dynamic from "next/dynamic";

// ssr: false is only valid inside Client Components.
// This wrapper exists solely to host that constraint while keeping
// the public layout a Server Component.
const PopupLeadForm = dynamic(
  () => import("./PopupLeadForm").then((m) => m.PopupLeadForm),
  { ssr: false }
);

export function LazyPopupLeadForm() {
  return <PopupLeadForm />;
}
