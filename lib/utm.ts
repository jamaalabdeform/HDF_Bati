/**
 * Capture et conservation de l'attribution marketing.
 *
 * - `session`   : paramètres de la visite en cours (sessionStorage) — rattachés au lead.
 * - `firstTouch`: toute première source connue (localStorage) — utile pour l'attribution.
 *
 * Objectif : publicité → lead → RDV → devis → vente (via le CRM).
 */

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];

export interface Attribution extends Partial<Record<AttributionKey, string>> {
  landing_page?: string;
  referrer?: string;
  captured_at?: string;
  /** Cookies Meta (Conversions API) si présents. */
  fbp?: string;
  fbc?: string;
}

const SESSION_KEY = "hdf_attribution";
const FIRST_KEY = "hdf_first_touch";

function safeGet(storage: () => Storage, key: string): Attribution | null {
  try {
    const raw = storage().getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function safeSet(storage: () => Storage, key: string, value: Attribution) {
  try {
    storage().setItem(key, JSON.stringify(value));
  } catch {
    /* navigation privée / stockage bloqué : l'attribution reste en mémoire */
  }
}

let memory: Attribution | null = null;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/** À appeler une fois au chargement de la page. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const v = params.get(key);
    if (v) fromUrl[key] = v.slice(0, 200);
  }
  const hasCampaign = Object.keys(fromUrl).length > 0;
  const existing = safeGet(() => window.sessionStorage, SESSION_KEY) ?? memory;

  // Une nouvelle campagne dans l'URL remplace la précédente ; sinon on conserve la session.
  const session: Attribution =
    hasCampaign || !existing
      ? {
          ...fromUrl,
          landing_page: window.location.pathname + window.location.search,
          referrer: document.referrer || undefined,
          captured_at: new Date().toISOString(),
        }
      : existing;

  memory = session;
  safeSet(() => window.sessionStorage, SESSION_KEY, session);
  if (!safeGet(() => window.localStorage, FIRST_KEY)) safeSet(() => window.localStorage, FIRST_KEY, session);
  return session;
}

/** Attribution à joindre au lead / aux événements. */
export function getAttribution(): { session: Attribution; firstTouch: Attribution | null } {
  if (typeof window === "undefined") return { session: {}, firstTouch: null };
  const session = safeGet(() => window.sessionStorage, SESSION_KEY) ?? memory ?? captureAttribution();
  return {
    session: { ...session, fbp: readCookie("_fbp"), fbc: readCookie("_fbc") },
    firstTouch: safeGet(() => window.localStorage, FIRST_KEY),
  };
}

/** Paramètres de campagne « plats » pour les événements analytics. */
export function campaignParams(): Partial<Record<AttributionKey, string>> {
  const { session } = getAttribution();
  const out: Partial<Record<AttributionKey, string>> = {};
  for (const key of ATTRIBUTION_KEYS) if (session[key]) out[key] = session[key];
  return out;
}
