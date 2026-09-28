import type { Segment } from "@/config/services";
import type { Answers } from "@/config/jawabot";

/**
 * Scoring des leads (partagé client + serveur).
 *
 * TODO_HDF_VALIDATION — status: "pending_validation"
 * Pondérations provisoires construites à partir des critères cités par Farid
 * (maison individuelle, chauffage gaz, adresse / zone, délai). À recalibrer avec
 * Farid puis sur les ventes réelles (CRM).
 */

export type LeadTemperature = "chaud" | "tiede" | "froid";

export interface LeadScore {
  score: number;
  temperature: LeadTemperature;
  reasons: string[];
}

/** Départements Hauts-de-France : Aisne, Nord, Oise, Pas-de-Calais, Somme. */
const HDF_DEPARTMENTS = ["02", "59", "60", "62", "80"];

export function isHautsDeFrance(postalCode?: string): boolean {
  if (!postalCode || !/^\d{5}$/.test(postalCode)) return false;
  return HDF_DEPARTMENTS.includes(postalCode.slice(0, 2));
}

type Rule = { when: (a: Answers) => boolean; points: number; reason: string };

const common: Rule[] = [
  { when: (a) => isHautsDeFrance(a.code_postal), points: 15, reason: "Zone Hauts-de-France" },
  { when: (a) => !!a.code_postal && !isHautsDeFrance(a.code_postal), points: 5, reason: "Hors Hauts-de-France" },
  { when: (a) => !!a.phone, points: 10, reason: "Téléphone fourni" },
  { when: (a) => !!a.email, points: 5, reason: "E-mail fourni" },
  { when: (a) => a.contact_preference === "rdv", points: 10, reason: "Souhaite un rendez-vous" },
];

const rules: Record<Segment, Rule[]> = {
  particulier: [
    { when: (a) => a.logement === "maison", points: 20, reason: "Maison individuelle" },
    { when: (a) => a.logement === "appartement", points: -25, reason: "Appartement (hors cible PAC)" },
    { when: (a) => a.statut === "proprietaire_occupant", points: 15, reason: "Propriétaire occupant" },
    { when: (a) => a.statut === "proprietaire_bailleur", points: 10, reason: "Propriétaire bailleur" },
    { when: (a) => a.chauffage === "gaz" || a.chauffage === "fioul", points: 15, reason: "Chauffage gaz / fioul" },
    { when: (a) => a.chauffage === "electrique", points: 8, reason: "Chauffage électrique" },
    { when: (a) => a.projet === "pac" || a.projet === "photovoltaique", points: 5, reason: "Projet identifié" },
    { when: (a) => a.delai === "moins_3_mois", points: 20, reason: "Projet < 3 mois" },
    { when: (a) => a.delai === "3_6_mois", points: 12, reason: "Projet 3–6 mois" },
    { when: (a) => a.delai === "plus_6_mois", points: 4, reason: "Projet > 6 mois" },
  ],
  professionnel: [
    { when: (a) => a.interlocuteur === "dirigeant", points: 15, reason: "Décisionnaire" },
    { when: (a) => a.interlocuteur === "responsable" || a.interlocuteur === "finance", points: 10, reason: "Responsable identifié" },
    { when: (a) => a.echeance === "moins_3_mois", points: 20, reason: "Échéance < 3 mois" },
    { when: (a) => a.echeance === "3_6_mois", points: 15, reason: "Échéance 3–6 mois" },
    { when: (a) => a.echeance === "6_12_mois", points: 8, reason: "Échéance 6–12 mois" },
    { when: (a) => a.batiment === "500_2000" || a.batiment === "plus_2000" || a.batiment === "plusieurs_sites", points: 10, reason: "Surface significative" },
    { when: (a) => !!a.societe, points: 5, reason: "Société renseignée" },
  ],
  collectivite: [
    { when: (a) => a.echeance === "moins_6_mois", points: 20, reason: "Échéance < 6 mois" },
    { when: (a) => a.echeance === "6_12_mois", points: 12, reason: "Échéance 6–12 mois" },
    { when: (a) => !!a.volumes, points: 10, reason: "Volumes communiqués" },
    { when: (a) => !!a.nom_structure, points: 10, reason: "Structure identifiée" },
    { when: (a) => !!a.role, points: 5, reason: "Fonction renseignée" },
  ],
};

export function scoreLead(segment: Segment, answers: Answers): LeadScore {
  const applied = [...common, ...rules[segment]].filter((r) => r.when(answers));
  const raw = 20 + applied.reduce((sum, r) => sum + r.points, 0);
  const score = Math.max(0, Math.min(100, raw));
  const temperature: LeadTemperature = score >= 70 ? "chaud" : score >= 45 ? "tiede" : "froid";
  return { score, temperature, reasons: applied.map((r) => `${r.points > 0 ? "+" : ""}${r.points} ${r.reason}`) };
}
