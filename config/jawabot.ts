import type { Segment } from "./services";

/**
 * Arbre conversationnel Jawabot HDF Bâti.
 *
 * Les questions sont de la configuration pure : le moteur (lib/jawabot/engine.ts)
 * et l'interface (components/jawabot) ne contiennent aucune question en dur.
 * Pour ajouter / retirer une question : modifier ce fichier uniquement.
 *
 * TODO_HDF_VALIDATION : arbre à relire avec Farid (questions des 3 premières minutes
 * d'appel, ton, vouvoiement, escalade humaine).
 */

export interface ChoiceOption {
  value: string;
  label: string;
  /** Message affiché par Jawabot après ce choix (information, pas de promesse). */
  reply?: string;
}

interface BaseStep {
  id: string;
  question: string;
  help?: string;
  /** La question n'est posée que si la condition est vraie. */
  when?: (answers: Answers) => boolean;
  /** Libellé court utilisé dans le récapitulatif et le résumé Farid. */
  summaryLabel: string;
}

export interface ChoiceStep extends BaseStep {
  type: "choice";
  options: ChoiceOption[];
}

export interface TextStep extends BaseStep {
  type: "text";
  placeholder?: string;
  optional?: boolean;
  maxLength?: number;
  autoComplete?: string;
}

export interface PostalStep extends BaseStep {
  type: "postal";
}

export interface ContactStep extends BaseStep {
  type: "contact";
  /** Demander la fonction (B2B). */
  askRole?: boolean;
  /** Demander le nom de la structure s'il n'a pas déjà été saisi. */
  emailRequired?: boolean;
}

export type Step = ChoiceStep | TextStep | PostalStep | ContactStep;
export type Answers = Record<string, string>;

export const jawabotCopy = {
  name: "Jawabot",
  title: "HDF Bâti • Assistant",
  launcher: "Parlez-nous de votre projet",
  greeting: "Bonjour,",
  intro: "Je vais vous poser quelques questions pour mieux comprendre votre besoin.",
  segmentQuestion: "Votre demande concerne :",
  humanNote: "Un conseiller HDF Bâti reprend ensuite personnellement votre demande.",
  disclaimer:
    "Jawabot prépare votre demande : il ne remplace ni une étude technique, ni un devis, et ne confirme aucune aide.",
  successTitle: "Merci, votre demande est bien transmise.",
  successText:
    "HDF Bâti a reçu le résumé de votre projet et revient vers vous pour en parler.",
  errorText:
    "Votre demande n’a pas pu être envoyée. Vous pouvez nous appeler directement ou réessayer dans un instant.",
} as const;

export const segmentChoices: { value: Segment; label: string }[] = [
  { value: "particulier", label: "Mon logement" },
  { value: "professionnel", label: "Mon entreprise" },
  { value: "collectivite", label: "Une collectivité" },
];

const contactPreference: ChoiceStep = {
  id: "contact_preference",
  type: "choice",
  summaryLabel: "Souhait",
  question: "Pour la suite, vous préférez :",
  options: [
    { value: "rappel", label: "Être rappelé" },
    { value: "rdv", label: "Convenir d’un rendez-vous" },
    { value: "whatsapp", label: "Échanger sur WhatsApp" },
  ],
};

const flows: Record<Segment, Step[]> = {
  particulier: [
    {
      id: "projet",
      type: "choice",
      summaryLabel: "Projet",
      question: "Quel est votre projet ?",
      options: [
        { value: "pac", label: "Pompe à chaleur" },
        { value: "photovoltaique", label: "Panneaux photovoltaïques" },
        { value: "renovation", label: "Rénovation énergétique" },
        { value: "ne_sait_pas", label: "Je ne sais pas encore" },
      ],
    },
    {
      id: "logement",
      type: "choice",
      summaryLabel: "Logement",
      question: "Quel type de logement ?",
      options: [
        { value: "maison", label: "Maison individuelle" },
        {
          value: "appartement",
          label: "Appartement",
          reply:
            "Nos projets de pompe à chaleur concernent aujourd’hui les maisons individuelles. Continuons : nous vous dirons honnêtement si nous pouvons vous aider.",
        },
        { value: "autre", label: "Autre" },
      ],
    },
    {
      id: "statut",
      type: "choice",
      summaryLabel: "Statut",
      question: "Vous êtes :",
      options: [
        { value: "proprietaire_occupant", label: "Propriétaire occupant" },
        { value: "proprietaire_bailleur", label: "Propriétaire bailleur" },
        { value: "locataire", label: "Locataire" },
      ],
    },
    {
      id: "code_postal",
      type: "postal",
      summaryLabel: "Code postal",
      question: "Où se situe le logement ?",
      help: "Le code postal suffit.",
    },
    {
      id: "chauffage",
      type: "choice",
      summaryLabel: "Chauffage actuel",
      question: "Comment le logement est-il chauffé aujourd’hui ?",
      options: [
        { value: "gaz", label: "Gaz" },
        { value: "fioul", label: "Fioul" },
        { value: "electrique", label: "Électrique" },
        { value: "bois", label: "Bois / granulés" },
        { value: "pac", label: "Pompe à chaleur" },
        { value: "autre", label: "Autre / je ne sais pas" },
      ],
    },
    {
      id: "besoin",
      type: "choice",
      summaryLabel: "Besoin principal",
      question: "Qu’attendez-vous en priorité ?",
      options: [
        { value: "factures", label: "Réduire mes dépenses d’énergie" },
        { value: "remplacement", label: "Remplacer un équipement ancien" },
        { value: "confort", label: "Gagner en confort" },
        { value: "aides", label: "Savoir à quelles aides je peux prétendre" },
      ],
    },
    {
      id: "delai",
      type: "choice",
      summaryLabel: "Délai",
      question: "Quand souhaitez-vous réaliser le projet ?",
      options: [
        { value: "moins_3_mois", label: "Dans les 3 mois" },
        { value: "3_6_mois", label: "D’ici 3 à 6 mois" },
        { value: "plus_6_mois", label: "Dans plus de 6 mois" },
        { value: "renseigne", label: "Je me renseigne" },
      ],
    },
    contactPreference,
    {
      id: "contact",
      type: "contact",
      summaryLabel: "Coordonnées",
      question: "Dernière étape : comment pouvons-nous vous joindre ?",
    },
  ],

  professionnel: [
    {
      id: "besoin",
      type: "choice",
      summaryLabel: "Besoin",
      question: "Quel est votre besoin principal ?",
      options: [
        { value: "contrats", label: "Mes contrats d’énergie" },
        { value: "pac", label: "Pompe à chaleur / chauffage" },
        { value: "photovoltaique", label: "Photovoltaïque" },
        { value: "performance", label: "Performance du bâtiment" },
        { value: "plusieurs", label: "Plusieurs de ces sujets" },
      ],
    },
    {
      id: "societe",
      type: "text",
      summaryLabel: "Société",
      question: "Quel est le nom de votre société ?",
      placeholder: "Nom de l’entreprise",
      autoComplete: "organization",
      maxLength: 120,
    },
    {
      id: "secteur",
      type: "choice",
      summaryLabel: "Secteur",
      question: "Dans quel secteur ?",
      options: [
        { value: "commerce", label: "Commerce / restauration" },
        { value: "tertiaire", label: "Bureaux / services" },
        { value: "industrie", label: "Industrie / artisanat" },
        { value: "agricole", label: "Agricole" },
        { value: "sante_social", label: "Santé / médico-social" },
        { value: "autre", label: "Autre" },
      ],
    },
    {
      id: "batiment",
      type: "choice",
      summaryLabel: "Bâtiment",
      question: "Quelle surface de bâtiment est concernée ?",
      options: [
        { value: "moins_500", label: "Moins de 500 m²" },
        { value: "500_2000", label: "500 à 2 000 m²" },
        { value: "plus_2000", label: "Plus de 2 000 m²" },
        { value: "plusieurs_sites", label: "Plusieurs sites" },
        { value: "ne_sait_pas", label: "Je ne sais pas" },
      ],
    },
    {
      id: "energie",
      type: "choice",
      summaryLabel: "Énergies",
      question: "Quelles énergies utilisez-vous ?",
      options: [
        { value: "electricite", label: "Électricité" },
        { value: "gaz", label: "Gaz" },
        { value: "les_deux", label: "Électricité et gaz" },
        { value: "autre", label: "Autre / je ne sais pas" },
      ],
    },
    {
      id: "echeance",
      type: "choice",
      summaryLabel: "Échéance",
      question: "Quelle est votre échéance (fin de contrat ou projet) ?",
      options: [
        { value: "moins_3_mois", label: "Moins de 3 mois" },
        { value: "3_6_mois", label: "3 à 6 mois" },
        { value: "6_12_mois", label: "6 à 12 mois" },
        { value: "plus_12_mois", label: "Plus de 12 mois" },
        { value: "inconnue", label: "Je ne sais pas" },
      ],
    },
    {
      id: "interlocuteur",
      type: "choice",
      summaryLabel: "Interlocuteur",
      question: "Vous êtes :",
      options: [
        { value: "dirigeant", label: "Dirigeant(e)" },
        { value: "responsable", label: "Responsable technique / services généraux" },
        { value: "finance", label: "Responsable administratif / financier" },
        { value: "autre", label: "Autre" },
      ],
    },
    {
      id: "code_postal",
      type: "postal",
      summaryLabel: "Code postal",
      question: "Où se situe le site concerné ?",
      help: "Code postal du site principal.",
    },
    contactPreference,
    {
      id: "contact",
      type: "contact",
      summaryLabel: "Coordonnées",
      question: "Comment pouvons-nous vous joindre ?",
      askRole: true,
    },
  ],

  collectivite: [
    {
      id: "structure",
      type: "choice",
      summaryLabel: "Structure",
      question: "Quel type de structure ?",
      options: [
        { value: "commune", label: "Commune" },
        { value: "intercommunalite", label: "Intercommunalité" },
        { value: "etablissement_public", label: "Établissement public" },
        { value: "bailleur", label: "Bailleur social" },
        { value: "association", label: "Association" },
        { value: "autre", label: "Autre" },
      ],
    },
    {
      id: "nom_structure",
      type: "text",
      summaryLabel: "Nom de la structure",
      question: "Quel est le nom de votre structure ?",
      placeholder: "Ex. : Mairie de…",
      autoComplete: "organization",
      maxLength: 120,
    },
    {
      id: "besoin",
      type: "choice",
      summaryLabel: "Besoin",
      question: "Sur quel sujet souhaitez-vous être accompagné ?",
      options: [
        { value: "contrats", label: "Contrats d’énergie" },
        { value: "pac", label: "Chauffage / pompe à chaleur" },
        { value: "photovoltaique", label: "Photovoltaïque" },
        { value: "global", label: "Accompagnement global" },
      ],
    },
    {
      id: "contrats",
      type: "choice",
      summaryLabel: "Contrats",
      question: "Quels contrats sont concernés ?",
      options: [
        { value: "electricite", label: "Électricité" },
        { value: "gaz", label: "Gaz" },
        { value: "les_deux", label: "Électricité et gaz" },
        { value: "ne_sait_pas", label: "Je ne sais pas" },
      ],
    },
    {
      id: "echeance",
      type: "choice",
      summaryLabel: "Échéance",
      question: "Quelle est la prochaine échéance ?",
      options: [
        { value: "moins_6_mois", label: "Moins de 6 mois" },
        { value: "6_12_mois", label: "6 à 12 mois" },
        { value: "plus_12_mois", label: "Plus de 12 mois" },
        { value: "inconnue", label: "Je ne sais pas" },
      ],
    },
    {
      id: "volumes",
      type: "text",
      summaryLabel: "Volumes",
      question: "Si vous les connaissez : nombre de sites ou consommation annuelle ?",
      help: "Facultatif — une estimation suffit.",
      placeholder: "Ex. : 12 bâtiments, environ 400 MWh/an",
      optional: true,
      maxLength: 200,
    },
    {
      id: "code_postal",
      type: "postal",
      summaryLabel: "Code postal",
      question: "Code postal de la structure ?",
    },
    contactPreference,
    {
      id: "contact",
      type: "contact",
      summaryLabel: "Interlocuteur",
      question: "Qui est l’interlocuteur pour ce dossier ?",
      askRole: true,
    },
  ],
};

export function getFlow(segment: Segment): Step[] {
  return flows[segment];
}

/** Libellé lisible d'une réponse (pour le récapitulatif et le résumé Farid). */
export function answerLabel(step: Step, value: string | undefined): string {
  if (!value) return "—";
  if (step.type === "choice") return step.options.find((o) => o.value === value)?.label ?? value;
  return value;
}
