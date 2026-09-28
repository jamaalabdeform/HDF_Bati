import { cn } from "../ui/cn";

/**
 * Motif signature du Brand Book : courbe douce inspirée du flux énergétique / de la toiture.
 * Utilisé avec parcimonie (séparateur, accent). Jamais de feuilles décoratives multiples.
 */
export function SignatureCurve({ className, color = "currentColor", strokeWidth = 3 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 240 60" fill="none" aria-hidden="true" className={cn("pointer-events-none", className)} preserveAspectRatio="none">
      <path d="M2 56 C 60 8, 150 -6, 238 30" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
