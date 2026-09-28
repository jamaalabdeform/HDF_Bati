import { pending } from "./validation";

/**
 * Paramètres du site. L'URL publique vient de NEXT_PUBLIC_SITE_URL
 * (canonical, sitemap, OpenGraph, schema.org).
 */
export const siteDomain = pending<string>(
  "Nom de domaine définitif (ex. hdf-bati.fr) — à réserver / confirmer",
);

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const seo = {
  title: "HDF Bâti — Pompe à chaleur, rénovation énergétique et courtage en énergie | Anzin (Nord)",
  titleTemplate: "%s | HDF Bâti",
  description:
    "HDF Bâti, basée à Anzin (Nord) : pompes à chaleur et rénovation énergétique pour les particuliers, solutions énergétiques pour les professionnels et optimisation des contrats d'énergie pour les entreprises et collectivités.",
  ogImage: "/og-hdf-bati.jpg",
  locale: "fr_FR",
  themeColor: "#083D2E",
} as const;
