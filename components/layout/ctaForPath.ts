import { dossiers } from "@/config/dossiers";
import { anchors } from "@/config/navigation";
import { segmentOrder, segments } from "@/config/services";

/** Le bouton principal suit la page : libellé du profil et fiche de la page courante. */
export function ctaForPath(pathname: string): { href: string; label: string; onSheetPage: boolean } {
  const seg = segmentOrder.find((s) => pathname === `/${dossiers[s].slug}`);
  if (seg) return { href: `#${anchors.etude}`, label: segments[seg].cta, onSheetPage: true };
  if (pathname === "/") return { href: `#${anchors.etude}`, label: segments.particulier.cta, onSheetPage: true };
  return { href: `/#${anchors.etude}`, label: segments.particulier.cta, onSheetPage: false };
}
