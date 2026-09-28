import "server-only";
import { bestTimeOptions, type LeadRecord } from "@/lib/lead";
import { segments } from "@/config/services";

/**
 * Alerte WhatsApp directe à Farid via l'API officielle WhatsApp Business Cloud (Meta).
 *
 *  WHATSAPP_TOKEN            jeton d'accès permanent (utilisateur système Meta Business)
 *  WHATSAPP_PHONE_NUMBER_ID  identifiant du numéro EXPÉDITEUR (numéro WhatsApp Business de HDF Bâti)
 *  WHATSAPP_NOTIFY_TO        destinataire(s), format international sans « + » : 33601451110[,33…]
 *  WHATSAPP_TEMPLATE_NAME    modèle approuvé par Meta (ex. nouveau_lead_hdf) — requis pour écrire
 *                            à Farid à tout moment ; sans modèle, envoi en texte libre, qui n'est
 *                            accepté que dans les 24 h suivant un message de Farid au numéro expéditeur.
 *  WHATSAPP_TEMPLATE_LANG    langue du modèle (défaut : fr)
 *
 * Texte du modèle à soumettre (catégorie « Utilité », 6 variables) : voir README § Leads → WhatsApp.
 */

// Surchargeable pour les tests locaux (serveur factice) ; ne pas renseigner en production.
const GRAPH = process.env.WHATSAPP_API_BASE || "https://graph.facebook.com/v21.0";

export function whatsappConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_NOTIFY_TO);
}

/** Destinataires : chiffres uniquement (33601451110), 0X… converti en 33X…. */
export function recipients(raw = process.env.WHATSAPP_NOTIFY_TO ?? ""): string[] {
  return raw
    .split(/[,;]+/)
    .map((n) => n.replace(/\D/g, ""))
    .map((n) => (/^0[1-9]\d{8}$/.test(n) ? `33${n.slice(1)}` : n.replace(/^0033/, "33")))
    .filter((n) => /^\d{8,15}$/.test(n));
}

/** Les variables de modèle WhatsApp refusent sauts de ligne, tabulations et plus de 4 espaces. */
const param = (v: string, max = 900) =>
  v.replace(/[\r\n\t]+/g, " · ").replace(/ {4,}/g, " ").trim().slice(0, max) || "—";

export function nextAction(lead: LeadRecord): string {
  const p = lead.answers.contact_preference;
  const label = bestTimeOptions.find((o) => o.value === lead.contact.bestTime)?.label;
  const best = label ? ` — ${label.toLowerCase()}` : "";
  if (p === "rdv") return "Proposer un rendez-vous";
  if (p === "whatsapp") return "Répondre sur WhatsApp";
  return `Rappeler${best}`;
}

/** Variables du modèle, dans l'ordre {{1}}…{{6}}. */
export function templateParams(lead: LeadRecord): string[] {
  const s = lead.attribution.session;
  const source = `Source : ${s.utm_source ?? "direct"}${s.utm_campaign ? ` / ${s.utm_campaign}` : ""}`;
  const details = [...lead.summary.split("\n").slice(1), source].join("\n"); // la 1re ligne répète le profil
  return [
    segments[lead.segment].label,
    lead.contact.name,
    lead.contact.phone.replace(/^\+33/, "0").replace(/(\d{2})(?=\d)/g, "$1 "),
    details,
    nextAction(lead),
    lead.id,
  ].map((v) => param(v));
}

async function send(to: string, body: Record<string, unknown>): Promise<{ ok: boolean; status: number; error?: string }> {
  const url = `${GRAPH}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const payload = JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, ...body });
  // Une seconde tentative en cas d'erreur réseau ou 5xx (jamais sur 4xx : message refusé).
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: payload,
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return { ok: true, status: res.status };
      const err = (await res.json().catch(() => ({}))) as { error?: { message?: string; code?: number } };
      const error = `${err.error?.code ?? ""} ${err.error?.message ?? ""}`.trim();
      if (res.status < 500) return { ok: false, status: res.status, error };
      if (attempt === 1) return { ok: false, status: res.status, error };
    } catch (e) {
      if (attempt === 1) return { ok: false, status: 0, error: String(e) };
    }
  }
  return { ok: false, status: 0 };
}

/** Envoie l'alerte à chaque destinataire. Réussi si au moins un destinataire l'a reçue. */
export async function sendWhatsappLead(lead: LeadRecord, text: string): Promise<boolean> {
  const to = recipients();
  if (!to.length) {
    console.error("[lead] WHATSAPP_NOTIFY_TO vide ou invalide");
    return false;
  }
  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  const body = template
    ? {
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "fr" },
          components: [{ type: "body", parameters: templateParams(lead).map((t) => ({ type: "text", text: t })) }],
        },
      }
    : { type: "text", text: { preview_url: false, body: text.slice(0, 4000) } };

  const results = await Promise.all(to.map((n) => send(n, body)));
  results.forEach((r, i) => {
    if (!r.ok) console.error(`[lead] WhatsApp refusé pour …${to[i].slice(-4)} (HTTP ${r.status}) ${r.error ?? ""}`, lead.id);
  });
  return results.some((r) => r.ok);
}
