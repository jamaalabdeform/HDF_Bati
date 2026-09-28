import { answerLabel, getFlow, type Answers } from "@/config/jawabot";
import { segments, type Segment } from "@/config/services";
import { scoreLead, type LeadScore } from "./scoring";
import type { Attribution } from "./utm";

/**
 * Modèle de lead unique (Jawabot + formulaire de rappel), partagé client / serveur.
 * Chaîne cible : lead → scoring → CRM → WhatsApp Farid.
 */

export const CONSENT_TEXT_VERSION = "2026-09-v1";
export const CONSENT_TEXT =
  "J’accepte que HDF Bâti utilise ces informations pour me recontacter au sujet de ma demande (téléphone, e-mail ou WhatsApp). Je peux retirer mon accord à tout moment.";

export type LeadSource = "jawabot" | "callback_form";

export interface LeadInput {
  source: LeadSource;
  segment: Segment;
  answers: Answers;
  contact: {
    name: string;
    phone: string;
    email?: string;
    role?: string;
    postalCode?: string;
    bestTime?: string;
  };
  consent: { accepted: true; text: string; version: string; at: string };
  attribution: { session: Attribution; firstTouch: Attribution | null };
  page: string;
  eventId: string;
  /** Consentement cookies marketing (Meta CAPI uniquement si true). */
  consentMarketing?: boolean;
  /** Piège anti-robots (doit rester vide). */
  website?: string;
}

export interface LeadRecord extends LeadInput {
  id: string;
  receivedAt: string;
  score: LeadScore;
  summary: string;
}

export const bestTimeOptions = [
  { value: "matin", label: "Le matin (9h–12h)" },
  { value: "midi", label: "Le midi (12h–14h)" },
  { value: "apres_midi", label: "L’après-midi (14h–17h)" },
  { value: "fin_journee", label: "En fin de journée (17h–19h)" },
  { value: "indifferent", label: "Peu importe" },
] as const;

export const callbackProjectOptions = [
  { value: "pac", label: "Pompe à chaleur", segment: "particulier" },
  { value: "photovoltaique", label: "Panneaux photovoltaïques", segment: "particulier" },
  { value: "renovation", label: "Rénovation énergétique", segment: "particulier" },
  { value: "pro", label: "Projet professionnel", segment: "professionnel" },
  { value: "contrats", label: "Contrats d’énergie (pro / collectivité)", segment: "professionnel" },
  { value: "collectivite", label: "Projet de collectivité", segment: "collectivite" },
] as const satisfies readonly { value: string; label: string; segment: Segment }[];

/** Normalise un numéro français en +33XXXXXXXXX. Retourne null si invalide. */
export function normalizeFrenchPhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  let national: string | null = null;
  if (/^0[1-9]\d{8}$/.test(digits)) national = digits.slice(1);
  else if (/^\+33[1-9]\d{8}$/.test(digits)) national = digits.slice(3);
  else if (/^0033[1-9]\d{8}$/.test(digits)) national = digits.slice(4);
  return national ? `+33${national}` : null;
}

export const isValidPostalCode = (v: string) => /^\d{5}$/.test(v.trim());
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function makeLeadId(date = new Date()): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HDF-${d}-${rnd}`;
}

/** Résumé court, exploitable par Farid (WhatsApp / CRM). */
export function buildSummary(input: Pick<LeadInput, "segment" | "answers" | "contact" | "source">, score: LeadScore): string {
  const seg = segments[input.segment].label;
  const lines: string[] = [`${seg} — ${input.source === "jawabot" ? "Jawabot" : "Demande de rappel"}`];
  if (input.source === "jawabot") {
    for (const step of getFlow(input.segment)) {
      if (step.type === "contact") continue;
      const v = input.answers[step.id];
      if (v) lines.push(`${step.summaryLabel} : ${answerLabel(step, v)}`);
    }
    const best = bestTimeOptions.find((o) => o.value === input.contact.bestTime)?.label;
    if (best) lines.push(`Rappel souhaité : ${best}`);
  } else {
    const project = callbackProjectOptions.find((o) => o.value === input.answers.projet)?.label;
    if (project) lines.push(`Projet : ${project}`);
    if (input.contact.postalCode) lines.push(`Code postal : ${input.contact.postalCode}`);
    const best = bestTimeOptions.find((o) => o.value === input.contact.bestTime)?.label;
    if (best) lines.push(`Rappel souhaité : ${best}`);
  }
  lines.push(`Score : ${score.score}/100 (${score.temperature})`);
  return lines.join("\n");
}

export function computeLead(input: LeadInput, now = new Date()): LeadRecord {
  const answers: Answers = { ...input.answers, phone: input.contact.phone, email: input.contact.email ?? "", role: input.contact.role ?? "" };
  if (!answers.code_postal && input.contact.postalCode) answers.code_postal = input.contact.postalCode;
  const score = scoreLead(input.segment, answers);
  return {
    ...input,
    id: makeLeadId(now),
    receivedAt: now.toISOString(),
    score,
    summary: buildSummary(input, score),
  };
}

/** Message WhatsApp pré-rempli envoyé PAR le prospect, après qualification. */
export function whatsappMessageForLead(leadId: string | undefined, segment: Segment): string {
  const ref = leadId ? ` (réf. ${leadId})` : "";
  const intro =
    segment === "particulier"
      ? "Bonjour HDF Bâti, je viens de décrire mon projet sur votre site"
      : "Bonjour HDF Bâti, je viens de vous transmettre ma demande sur votre site";
  return `${intro}${ref}. Je souhaite échanger avec vous.`;
}

export const genericWhatsappMessage = "Bonjour HDF Bâti, je souhaite échanger au sujet de mon projet.";

export interface SubmitResult {
  ok: boolean;
  leadId?: string;
  temperature?: LeadScore["temperature"];
  error?: string;
}

/** Envoi client → API interne (/api/lead). */
export async function submitLead(input: LeadInput): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => ({}))) as SubmitResult;
    return res.ok ? { ...data, ok: true } : { ok: false, error: data.error ?? `HTTP ${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}
