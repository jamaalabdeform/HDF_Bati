import { submitLead, type LeadInput, type SubmitResult } from "@/lib/lead";

/**
 * Point d'extension backend de Jawabot.
 *
 * V1 : l'arbre de qualification est déterministe (config/jawabot.ts) et le lead est
 * envoyé à /api/lead (→ scoring → CRM → alerte WhatsApp Farid).
 *
 * V2 (prévu) : brancher ici une Knowledge Base HDF / un modèle conversationnel,
 * sans toucher à l'interface — il suffit de fournir un autre adaptateur.
 */
export interface JawabotBackend {
  submit(lead: LeadInput): Promise<SubmitResult>;
  /** Réponse libre à une question (Knowledge Base) — non utilisé en V1. */
  ask?(question: string, context: { segment?: string }): Promise<string>;
}

export const httpBackend: JawabotBackend = {
  submit: submitLead,
};
