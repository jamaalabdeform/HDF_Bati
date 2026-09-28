/**
 * Consentement cookies (CNIL) — aucun traceur tiers n'est chargé avant accord.
 * « Accepter » et « Refuser » ont le même poids visuel dans la bannière.
 */

export interface ConsentState {
  /** Mesure d'audience (GA4 via GTM ou gtag). */
  analytics: boolean;
  /** Publicité / Meta Pixel. */
  marketing: boolean;
  /** ISO date du choix. */
  decidedAt: string;
  version: number;
}

export const CONSENT_VERSION = 1;
const KEY = "hdf_consent";
const EVENT = "hdf:consent";

export function readConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: Pick<ConsentState, "analytics" | "marketing">) {
  const state: ConsentState = { ...choice, decidedAt: new Date().toISOString(), version: CONSENT_VERSION };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* stockage indisponible : le choix vaut pour la page courante */
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(EVENT, { detail: state }));
}

export function onConsentChange(cb: (s: ConsentState) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<ConsentState>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

/** Rouvre la bannière (lien « Gérer les cookies »). */
export function openConsentManager() {
  window.dispatchEvent(new CustomEvent("hdf:consent-open"));
}
