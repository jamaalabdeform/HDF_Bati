/**
 * Identifiants de mesure — tous via variables d'environnement (voir .env.example).
 * Aucun script n'est chargé sans identifiant ET sans consentement.
 */
export const tracking = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  searchConsoleVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
};

export const hasAnyTracker = Boolean(tracking.gtmId || tracking.ga4Id || tracking.metaPixelId);
