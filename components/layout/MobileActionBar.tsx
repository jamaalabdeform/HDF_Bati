"use client";

import { MessageCircle, Phone } from "lucide-react";
import { telHref } from "@/config/company";
import { jawabotCopy } from "@/config/jawabot";
import { useJawabot } from "../jawabot/JawabotProvider";

/** Barre d'action mobile : téléphone + Jawabot toujours accessibles au pouce. */
export function MobileActionBar() {
  const { open, isOpen, preferredSegment } = useJawabot();
  if (isOpen) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <a href={telHref} data-track="phone" data-track-location="mobile_bar" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-deep/15 px-3.5 text-sm font-semibold whitespace-nowrap text-deep">
          <Phone className="size-4" aria-hidden />
          Appeler
        </a>
        <button type="button" aria-haspopup="dialog" onClick={() => open({ origin: "mobile_bar", segment: preferredSegment ?? undefined })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-action px-3 text-sm font-semibold whitespace-nowrap text-ink">
          <MessageCircle className="size-4 shrink-0 max-[380px]:hidden" aria-hidden />
          {jawabotCopy.launcher}
        </button>
      </div>
    </div>
  );
}
