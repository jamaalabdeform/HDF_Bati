/**
 * Architecture des pages locales (SEO local) — volontairement vide au lancement.
 *
 * Règle : une page locale n'est publiée QUE si elle s'appuie sur du contenu réel
 * (chantiers réalisés dans la commune, photos, témoignages). Pas de pages générées
 * en masse. Chaque entrée publiée apparaît automatiquement dans le sitemap.
 *
 * URL : /interventions/[slug]  (ex. /interventions/valenciennes)
 */
export interface LocalPage {
  slug: string;
  city: string;
  postalCode: string;
  published: boolean;
  title: string;
  description: string;
  intro: string;
  /** Chantiers réels documentés dans la zone (obligatoire pour publier). */
  realisations: { title: string; text: string; image?: string }[];
}

export const localPages: LocalPage[] = [
  // Exemple de structure — NON publiée (TODO_HDF_VALIDATION : fournir de vrais chantiers).
  {
    slug: "valenciennes",
    city: "Valenciennes",
    postalCode: "59300",
    published: false,
    title: "Pompe à chaleur et rénovation énergétique à Valenciennes",
    description: "HDF Bâti, entreprise basée à Anzin, accompagne les projets de pompe à chaleur et de rénovation énergétique à Valenciennes.",
    intro: "À quelques minutes de notre siège d’Anzin, nous accompagnons les propriétaires du Valenciennois dans leurs projets.",
    realisations: [],
  },
];

export const publishedLocalPages = () => localPages.filter((p) => p.published && p.realisations.length > 0);
