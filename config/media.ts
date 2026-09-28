/**
 * Visuels de la landing. Pour remplacer une image : déposer le fichier dans
 * public/images/ puis modifier `src` / `alt` / `status` ici. Aucun composant à toucher.
 *
 * status :
 * - "provisional_ai" : image extraite des vidéos publicitaires générées fournies
 *   (sans logo ni texte inventé). À REMPLACER par de vraies photos HDF avant ou
 *   rapidement après la mise en ligne. TODO_HDF_VALIDATION
 * - "hdf_real" : vraie photo HDF Bâti (chantier, équipe) avec autorisation d'usage.
 */
export type MediaStatus = "provisional_ai" | "hdf_real";

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  status: MediaStatus;
  /** Point focal CSS (object-position). */
  focus?: string;
}

export const media = {
  hero: {
    src: "/images/provisoire-maison-nord.jpg",
    alt: "Maison individuelle typique du Nord de la France, en fin de journée d'automne",
    width: 1080,
    height: 1350,
    status: "provisional_ai",
    focus: "50% 45%",
  },
  professionnels: {
    src: "/images/provisoire-pac-hydraulique.jpg",
    alt: "Technicien raccordant l'hydraulique d'une unité de pompe à chaleur",
    width: 720,
    height: 840,
    status: "provisional_ai",
    focus: "55% 40%",
  },
  energie: {
    src: "/images/provisoire-mairie.jpg",
    alt: "Façade d'une mairie française avec drapeaux tricolores",
    width: 720,
    height: 760,
    status: "provisional_ai",
    focus: "50% 40%",
  },
} satisfies Record<string, MediaAsset>;
