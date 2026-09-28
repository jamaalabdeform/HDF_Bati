/**
 * Système de validation du contenu HDF Bâti.
 *
 * Toute donnée non confirmée par Farid (ou par une source officielle) est
 * déclarée avec `status: "pending_validation"`. Elle est :
 * - visible sous la forme « [À CONFIRMER AVEC FARID] » en développement / préproduction ;
 * - masquée automatiquement en production (NEXT_PUBLIC_SITE_ENV=production),
 *   pour ne jamais afficher une fausse information commerciale.
 *
 * Recherche rapide de tout ce qui reste à valider :
 *   npm run check:content   (ou grep -rn "pending_validation\|TODO_HDF_VALIDATION")
 * Liste consolidée : HDF_CONTENT_TO_VALIDATE.md à la racine du projet.
 */

export type ValidationStatus =
  /** Confirmé (source indiquée dans `source`). */
  | "confirmed"
  /** À confirmer avec Farid avant d'être affiché en production. */
  | "pending_validation";

export interface Validated<T> {
  value: T | null;
  status: ValidationStatus;
  /** D'où vient l'information (fiche légale, questionnaire Farid du 27/09/2026…). */
  source?: string;
  /** Ce qu'il faut demander / vérifier. */
  note?: string;
}

export const PENDING_LABEL = "[À CONFIRMER AVEC FARID]";

export const confirmed = <T>(value: T, source: string): Validated<T> => ({
  value,
  status: "confirmed",
  source,
});

/** TODO_HDF_VALIDATION — marqueur de recherche volontairement présent ici. */
export const pending = <T>(note: string, draftValue: T | null = null): Validated<T> => ({
  value: draftValue,
  status: "pending_validation",
  note,
});

export const SITE_ENV = (process.env.NEXT_PUBLIC_SITE_ENV ?? "preview") as
  | "production"
  | "preview"
  | "development";

/** Les placeholders ne sont jamais rendus en production. */
export const SHOW_PENDING = SITE_ENV !== "production";

/** Valeur affichable : confirmée uniquement. */
export const publicValue = <T>(v: Validated<T>): T | null => (v.status === "confirmed" ? v.value : null);
