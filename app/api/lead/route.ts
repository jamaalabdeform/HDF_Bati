import { NextResponse, type NextRequest } from "next/server";
import { segments, type Segment } from "@/config/services";
import {
  computeLead,
  isValidEmail,
  isValidPostalCode,
  normalizeFrenchPhone,
  type LeadInput,
} from "@/lib/lead";
import { dispatchLead } from "@/lib/server/integrations";

export const runtime = "nodejs";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Limitation simple par IP (mémoire de l'instance) — suffisant pour une landing. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

function validate(body: unknown): { input?: LeadInput; error?: string } {
  if (!body || typeof body !== "object") return { error: "invalid_body" };
  const b = body as Record<string, unknown>;
  const segment = str(b.segment) as Segment;
  if (!(segment in segments)) return { error: "invalid_segment" };
  const source = b.source === "callback_form" ? "callback_form" : b.source === "jawabot" ? "jawabot" : null;
  if (!source) return { error: "invalid_source" };

  const c = (b.contact ?? {}) as Record<string, unknown>;
  const name = str(c.name, 120);
  const phone = normalizeFrenchPhone(str(c.phone, 30));
  const email = str(c.email, 160);
  const postalCode = str(c.postalCode, 5);
  if (name.length < 2) return { error: "invalid_name" };
  if (!phone) return { error: "invalid_phone" };
  if (email && !isValidEmail(email)) return { error: "invalid_email" };
  if (postalCode && !isValidPostalCode(postalCode)) return { error: "invalid_postal_code" };

  const consent = (b.consent ?? {}) as Record<string, unknown>;
  if (consent.accepted !== true) return { error: "consent_required" };

  const answersIn = (b.answers ?? {}) as Record<string, unknown>;
  const answers: Record<string, string> = {};
  for (const [k, v] of Object.entries(answersIn).slice(0, 30)) {
    if (/^[a-z_]{1,40}$/.test(k)) answers[k] = str(v, 200);
  }
  if (answers.code_postal && !isValidPostalCode(answers.code_postal)) delete answers.code_postal;

  const attr = (b.attribution ?? {}) as LeadInput["attribution"];
  const clean = (o: unknown) =>
    Object.fromEntries(Object.entries((o ?? {}) as Record<string, unknown>).slice(0, 20).map(([k, v]) => [k.slice(0, 40), str(v, 300)]));

  return {
    input: {
      source,
      segment,
      answers,
      contact: { name, phone, email: email || undefined, role: str(c.role, 120) || undefined, postalCode: postalCode || undefined, bestTime: str(c.bestTime, 40) || undefined },
      consent: { accepted: true, text: str(consent.text, 600), version: str(consent.version, 40), at: new Date().toISOString() },
      attribution: { session: clean(attr?.session), firstTouch: attr?.firstTouch ? clean(attr.firstTouch) : null },
      page: str(b.page, 300),
      eventId: str(b.eventId, 80),
      website: str(b.website, 100),
    },
  };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "too_many_requests" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const { input, error } = validate(body);
  if (!input) return NextResponse.json({ error }, { status: 400 });

  // Piège anti-robots : on répond OK sans rien transmettre.
  if (input.website) return NextResponse.json({ ok: true });

  const lead = computeLead(input);
  const consentMarketing = (body as { consentMarketing?: boolean }).consentMarketing === true;
  const result = await dispatchLead(lead, { ip, ua: req.headers.get("user-agent") ?? undefined, consentMarketing });

  // Transmis dès qu'une destination au moins l'a reçu (CRM, webhook Make/n8n ou WhatsApp direct).
  const channels = [result.crm, result.notify, result.whatsapp];
  const delivered = channels.some((c) => c === true);
  const configured = channels.some((c) => c !== "not_configured");

  if (!configured) {
    // Aucun connecteur : acceptable en développement / préproduction, jamais en production.
    if (process.env.NEXT_PUBLIC_SITE_ENV === "production") {
      console.error("[lead] AUCUN CONNECTEUR CONFIGURÉ — lead non transmis", lead.id);
      return NextResponse.json({ error: "lead_backend_not_configured" }, { status: 503 });
    }
    console.info("[lead] (préproduction) lead reçu, non transmis :\n" + lead.summary);
    return NextResponse.json({ ok: true, leadId: lead.id, temperature: lead.score.temperature, preview: true });
  }

  if (!delivered) {
    // Journal complet : le lead reste récupérable dans les logs de l'hébergeur.
    console.error("[lead] échec de transmission", lead.id, result, "\n" + lead.summary, lead.contact.name, lead.contact.phone);
    return NextResponse.json({ error: "lead_delivery_failed" }, { status: 502 });
  }

  if (result.whatsapp === false) console.error("[lead] alerte WhatsApp non remise (lead transmis ailleurs)", lead.id);
  console.info("[lead] transmis", lead.id, { crm: result.crm, notify: result.notify, whatsapp: result.whatsapp });
  return NextResponse.json({ ok: true, leadId: lead.id, temperature: lead.score.temperature });
}
