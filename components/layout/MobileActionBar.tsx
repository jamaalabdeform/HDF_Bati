"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { telHref } from "@/config/company";
import { anchors } from "@/config/navigation";
import { ctaForPath } from "./ctaForPath";
import { useSectionInView } from "./useSectionInView";

/** Barre d'action mobile : téléphone + fiche d'étude toujours accessibles au pouce. */
export function MobileActionBar() {
  const cta = ctaForPath(usePathname());
  // Masquée quand la fiche ou le formulaire de rappel sont à l'écran : elle recouvrirait leurs champs.
  const onSheet = useSectionInView(anchors.etude);
  const onCallback = useSectionInView(anchors.rappel);
  if (onSheet || onCallback) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <a href={telHref} data-track="phone" data-track-location="mobile_bar" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-deep/15 px-3.5 text-sm font-semibold whitespace-nowrap text-deep">
          <Phone className="size-4" aria-hidden />
          Appeler
        </a>
        <a href={cta.href} className="inline-flex min-h-12 items-center justify-center rounded-md bg-action px-3 text-sm font-semibold whitespace-nowrap text-ink">
          {cta.label}
        </a>
      </div>
    </div>
  );
}
