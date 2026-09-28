"use client";

import { usePathname } from "next/navigation";
import { anchors } from "@/config/navigation";
import { ctaForPath } from "./ctaForPath";
import { useSectionInView } from "./useSectionInView";

/**
 * Barre d'action mobile : ramène à la fiche d'étude. Le téléphone reste dans l'en-tête
 * (un seul accès persistant). Masquée quand la fiche ou le rappel sont à l'écran.
 */
export function MobileActionBar() {
  const cta = ctaForPath(usePathname());
  const onSheet = useSectionInView(anchors.etude);
  const onCallback = useSectionInView(anchors.rappel);
  if (onSheet || onCallback) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden">
      <a href={cta.href} className="flex min-h-12 items-center justify-center rounded-md bg-action px-3 text-sm font-semibold text-ink">
        {cta.label}
      </a>
    </div>
  );
}
