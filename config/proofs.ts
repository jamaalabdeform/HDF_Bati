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
  /** Détail affiché sous le texte une fois confirmé. */
  items?: string[];
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
    label: "Installation par un professionnel RGE",
    // Décision du 16/10/2026 : le nom du partenaire et ses certificats ne sont pas publiés.
    // HDF Bâti n'est jamais présentée comme titulaire de la qualification.
    data: confirmed(
      "Les installations sont réalisées par une entreprise partenaire qualifiée RGE, condition pour bénéficier des aides de l’État à la rénovation énergétique.",
      "Farid (questionnaire 27/09/2026) ; décision du 16/10/2026 : partenaire non nommé",
    ),
  },
  {
    id: "chantiers",
    label: "Chantiers réalisés",
    data: pending("4 à 5 vrais chantiers documentés (photos avant/pendant/après, commune, équipement) avec autorisation"),
  },
  {
    id: "garanties",
    label: "Garanties",
    // Garanties légales et usuelles du métier (décision du 16/10/2026), sans durée commerciale inventée.
    data: confirmed("Vos travaux et votre matériel sont couverts.", "Garanties légales (Code civil) et garanties constructeur ; décision du 16/10/2026"),
    items: [
      "Garanties légales des travaux : parfait achèvement (1 an), bon fonctionnement des équipements (2 ans) et décennale (10 ans), selon la nature de l’installation.",
      "Garantie constructeur sur le matériel, selon la marque et le modèle, précisée sur votre devis.",
      "Un interlocuteur HDF Bâti pour le suivi après l’installation.",
    ],
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
