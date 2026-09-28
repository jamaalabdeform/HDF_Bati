"use client";

import { openConsentManager } from "@/lib/consent";

export function ConsentLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentManager} className={className}>
      Gérer les cookies
    </button>
  );
}
