import "server-only";
import { createHash } from "node:crypto";
import type { LeadRecord } from "@/lib/lead";
import { segments } from "@/config/services";

/**
 * Connecteurs backend — tous optionnels et pilotés par variables d'environnement.
 *
 *  CRM_WEBHOOK_URL            → POST JSON du lead complet (CRM, Make, n8n, Zapier, HubSpot…)
 *  LEAD_NOTIFY_WEBHOOK_URL    → POST JSON { text, lead } pour l'alerte WhatsApp Farid
 *                               (WhatsApp Business Cloud API via Make/n8n, ou autre)
 *  LEAD_WEBHOOK_SECRET        → envoyé dans l'en-tête X-HDF-Signature (HMAC simple)
 *  META_PIXEL_ID + META_CAPI_TOKEN → Meta Conversions API (événement Lead dédupliqué)
 */

async function postJson(url: string, body: unknown): Promise<boolean> {
  const payload = JSON.stringify(body);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  if (secret) headers["X-HDF-Signature"] = createHash("sha256").update(secret + payload).digest("hex");
  try {
    const res = await fetch(url, { method: "POST", headers, body: payload, signal: AbortSignal.timeout(8000) });
    return res.ok;
  } catch (e) {
    console.error("[lead] webhook error", url.split("?")[0], e);
    return false;
  }
}

/** Message WhatsApp destiné à Farid (format UI Kit : court, actionnable). */
export function faridMessage(lead: LeadRecord): string {
  const seg = segments[lead.segment].label;
  const next =
    lead.answers.contact_preference === "rdv"
      ? "proposer un rendez-vous"
      : lead.answers.contact_preference === "whatsapp"
        ? "répondre sur WhatsApp"
        : "rappeler";
  return [
    `NOUVEAU LEAD HDF BÂTI — ${seg}`,
    `Réf. ${lead.id}`,
    lead.summary,
    `Contact : ${lead.contact.name} — ${lead.contact.phone}${lead.contact.email ? ` — ${lead.contact.email}` : ""}`,
    `Source : ${lead.attribution.session.utm_source ?? "direct"}${lead.attribution.session.utm_campaign ? ` / ${lead.attribution.session.utm_campaign}` : ""}`,
    `Action : ${next}`,
  ].join("\n");
}

const sha = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

async function sendMetaLead(lead: LeadRecord, ip?: string, ua?: string): Promise<boolean> {
  const pixel = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) return false;
  const [firstName, ...rest] = lead.contact.name.split(" ");
  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.parse(lead.receivedAt) / 1000),
        event_id: lead.eventId,
        action_source: "website",
        event_source_url: lead.page,
        user_data: {
          ph: [sha(lead.contact.phone.replace(/\D/g, ""))],
          em: lead.contact.email ? [sha(lead.contact.email)] : undefined,
          fn: firstName ? [sha(firstName)] : undefined,
          ln: rest.length ? [sha(rest.join(" "))] : undefined,
          zp: lead.answers.code_postal ? [sha(lead.answers.code_postal)] : undefined,
          country: [sha("fr")],
          client_ip_address: ip,
          client_user_agent: ua,
          fbp: lead.attribution.session.fbp,
          fbc: lead.attribution.session.fbc,
        },
        custom_data: { lead_segment: lead.segment, lead_score: lead.score.score, lead_source: lead.source },
      },
    ],
    test_event_code: process.env.META_CAPI_TEST_CODE || undefined,
  };
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch (e) {
    console.error("[lead] Meta CAPI error", e);
    return false;
  }
}

export interface DispatchResult {
  crm: boolean | "not_configured";
  notify: boolean | "not_configured";
  meta: boolean | "not_configured";
}

export async function dispatchLead(lead: LeadRecord, ctx: { ip?: string; ua?: string; consentMarketing: boolean }): Promise<DispatchResult> {
  const crmUrl = process.env.CRM_WEBHOOK_URL;
  const notifyUrl = process.env.LEAD_NOTIFY_WEBHOOK_URL;
  const metaReady = !!(process.env.META_CAPI_TOKEN && (process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID));

  const [crm, notify, meta] = await Promise.all([
    crmUrl ? postJson(crmUrl, { type: "hdf_lead", pipelineStage: "nouveau", lead }) : Promise.resolve("not_configured" as const),
    notifyUrl ? postJson(notifyUrl, { text: faridMessage(lead), leadId: lead.id, temperature: lead.score.temperature, lead }) : Promise.resolve("not_configured" as const),
    metaReady && ctx.consentMarketing ? sendMetaLead(lead, ctx.ip, ctx.ua) : Promise.resolve("not_configured" as const),
  ]);
  return { crm, notify, meta };
}
