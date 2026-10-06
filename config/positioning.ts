import { confirmed } from "./validation";

/**
 * Les deux différences de HDF Bâti (PRODUCT.md).
 * Précisions confirmées par Farid le 06/10/2026 : « Réponse dans l’heure »,
 * « Aucune avance de frais », « Accompagnement complet dans les démarches ».
 * Le bloc Aides reste soumis à relecture juridique (HDF_CONTENT_TO_VALIDATE.md § 1, point 7).
 */
export const positioning = {
  reactivite: {
    short: "Réponse dans l’heure",
    title: "Une réponse dans l’heure",
    heroText: "Par l’équipe HDF Bâti elle-même, pas par un centre d’appels.",
    text: "Vous laissez vos coordonnées : l’équipe HDF Bâti vous répond elle-même, dans l’heure. Pas de centre d’appels.",
    precise: confirmed("Réponse dans l’heure", "Farid, 06/10/2026"),
  },
  aides: {
    short: "Aucune avance de frais, démarches d’aides prises en charge",
    title: "Aucune avance de frais",
    heroText: "Nous vous accompagnons dans toutes les démarches d’aides, sans avance de frais de votre part. Selon conditions d’éligibilité.",
    text: "Nous identifions les dispositifs applicables à votre projet et vous accompagnons dans toutes les démarches, sans avance de frais de votre part. Selon conditions d’éligibilité.",
    precise: confirmed("Aucune avance de frais · accompagnement complet dans les démarches", "Farid, 06/10/2026"),
  },
} as const;
