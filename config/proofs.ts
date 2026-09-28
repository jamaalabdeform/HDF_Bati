import { company } from "./company";
import { positioning } from "./positioning";
import { confirmed, pending, type Validated } from "./validation";

/**
 * Section « Pourquoi HDF Bâti ? ».
 * Engagements = formulations de méthode (pas de chiffres, pas de labels).
 * Preuves chiffrées / labels = uniquement après validation (masqués en production sinon).
 */

export const commitments = [
  { title: positioning.reactivite.title, text: positioning.reactivite.text },
  { title: positioning.aides.title, text: positioning.aides.text },
  {
    title: "On étudie avant de proposer",
    text: "Votre logement, votre bâtiment ou vos contrats sont analysés avant toute proposition. Nous expliquons les étapes avant que vous vous engagiez.",
  },
  {
    title: "Des réponses honnêtes",
    text: "Pas de promesse d’aide garantie ni d’économie chiffrée à l’aveugle : nous vous disons ce qui est possible pour votre situation.",
  },
] as const;

export interface ProofItem {
  id: string;
  label: string;
  data: Validated<string>;
}

/** Preuves à obtenir de Farid — rendues uniquement lorsqu'elles sont confirmées. */
export const proofs: ProofItem[] = [
  {
    id: "avis",
    label: "Avis clients Google",
    data: pending(
      "Nombre d'avis et note moyenne vérifiables (14 avis déclarés au 27/09/2026, note non communiquée) + lien vers la fiche",
    ),
  },
  {
    id: "qualifications",
    label: "Qualifications des installations",
    data: pending(
      "Farid indique que les travaux sont réalisés par une société partenaire qualifiée RGE (QualiPAC, QualiPV, Qualisol, Qualibois). Wording exact, nom du partenaire, certificats et périmètres à valider juridiquement avant tout affichage. HDF Bâti ne doit pas être présentée comme titulaire de ces qualifications.",
    ),
  },
  {
    id: "assurance",
    label: "Assurances",
    data: pending("Assurance décennale / RC Pro : assureur, activités couvertes, attestation"),
  },
  {
    id: "chantiers",
    label: "Chantiers réalisés",
    data: pending("4 à 5 vrais chantiers documentés (photos avant/pendant/après, commune, équipement) avec autorisation"),
  },
  {
    id: "garanties",
    label: "Garanties et SAV",
    data: pending("Garanties proposées (matériel, main-d'œuvre) et organisation du SAV"),
  },
  {
    id: "marques",
    label: "Marques installées",
    data: pending("Marques / gammes de PAC et panneaux réellement posées"),
  },
];

export const legalCreation = confirmed(
  `Société immatriculée au ${company.legal.rcs.value} — SIREN ${company.legal.siren.value}`,
  "Fiche légale publique",
);
