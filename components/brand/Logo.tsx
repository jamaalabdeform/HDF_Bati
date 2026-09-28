import { cn } from "../ui/cn";

/**
 * Logo officiel HDF BÂTI — fichiers vectorisés issus du master corrigé
 * (scripts/build-logo.py). Ne jamais recomposer le logo en texte HTML :
 * toujours utiliser ce composant.
 *
 * Tailles minimales (Brand Book) : logo complet ≥ 180 px de large, sinon version compacte.
 */
const VARIANTS = {
  full: { src: "/brand/hdf-bati-logo.svg", ratio: 694.7 / 241 },
  "full-inverse": { src: "/brand/hdf-bati-logo-inverse.svg", ratio: 694.7 / 241 },
  compact: { src: "/brand/hdf-bati-logo-compact.svg", ratio: 687.5 / 241 },
  "compact-inverse": { src: "/brand/hdf-bati-logo-compact-inverse.svg", ratio: 687.5 / 241 },
} as const;

export type LogoVariant = keyof typeof VARIANTS;

export function Logo({ variant = "full", height = 48, className, priority = false }: { variant?: LogoVariant; height?: number; className?: string; priority?: boolean }) {
  const v = VARIANTS[variant];
  const width = Math.round(height * v.ratio);
  const withTagline = variant.startsWith("full");
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG vectoriel, pas d'optimisation nécessaire
    <img
      src={v.src}
      width={width}
      height={height}
      alt={withTagline ? "HDF BÂTI — Votre expert en rénovation énergétique" : "HDF BÂTI"}
      className={cn("block h-auto max-w-full select-none", className)}
      style={{ aspectRatio: `${v.ratio}` }}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
    />
  );
}
