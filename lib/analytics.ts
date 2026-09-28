import { campaignParams } from "./utm";

/**
 * Couche analytics unique. Les composants n'appellent JAMAIS gtag / fbq / dataLayer
 * directement : ils appellent `track()`.
 *
 * - dataLayer (GTM) : reçoit tous les événements (GTM applique ensuite le consentement).
 * - gtag (GA4 direct, si pas de GTM) : envoyé uniquement si le script est chargé (consentement).
 * - Meta Pixel : mapping vers les événements standard, uniquement si fbq est chargé.
 * - `event_id` partagé pour dédupliquer Pixel ↔ Conversions API (côté serveur).
 */

export type AnalyticsEvent =
  | "view_landing"
  | "select_segment"
  | "start_jawabot"
  | "jawabot_step"
  | "qualified_lead"
  | "submit_callback"
  | "click_whatsapp"
  | "click_phone"
  | "appointment_request";

export type EventParams = Record<string, string | number | boolean | undefined>;

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & { loaded?: boolean };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

/** Mapping vers les événements standard Meta (null = événement personnalisé). */
const META_STANDARD: Partial<Record<AnalyticsEvent, string>> = {
  qualified_lead: "Lead",
  submit_callback: "Lead",
  click_whatsapp: "Contact",
  click_phone: "Contact",
  appointment_request: "Schedule",
};

/** Événements de conversion GA4 recommandés, envoyés en complément. */
const GA4_RECOMMENDED: Partial<Record<AnalyticsEvent, string>> = {
  qualified_lead: "generate_lead",
  submit_callback: "generate_lead",
};

const debug = () => process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

export function newEventId(prefix = "evt"): string {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rnd}`;
}

export function track(event: AnalyticsEvent, params: EventParams = {}, eventId?: string): void {
  if (typeof window === "undefined") return;
  const payload: EventParams = { ...campaignParams(), ...params, event_id: eventId };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });

  // GA4 direct (uniquement si gtag est chargé et qu'aucun GTM ne gère déjà l'envoi).
  if (window.gtag && !process.env.NEXT_PUBLIC_GTM_ID) {
    window.gtag("event", event, payload);
    const recommended = GA4_RECOMMENDED[event];
    if (recommended) window.gtag("event", recommended, payload);
  }

  // Meta Pixel.
  if (window.fbq) {
    const std = META_STANDARD[event];
    const opts = eventId ? { eventID: eventId } : undefined;
    if (std) window.fbq("track", std, { content_name: event, ...payload }, opts);
    else if (event !== "view_landing") window.fbq("trackCustom", event, payload, opts);
  }

  if (debug()) console.info("[analytics]", event, payload);
}
