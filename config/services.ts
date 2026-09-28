import { anchors } from "./navigation";
import type { MediaAsset } from "./media";
import { media } from "./media";

/**
 * Les 3 parcours commerciaux HDF Bâti. Un même univers, trois portes d'entrée
 * distinctes (cf. Brand Book : « une marque, quatre portes d'entrée, pas quatre logos »).
 */
export type Segment = "particulier" | "professionnel" | "collectivite";

export interface SegmentDef {
  id: Segment;
  label: string;
  /** Libellé court du choix dans le hero. */
  chooserLabel: string;
  chooserHint: string;
  /** Badge d'activité (Brand Book). */
  badge: string;
  /** Couleur de segment (tokens UI : particulier=vert, pro=bleu, énergie/collectivité=orange). */
  tone: "green" | "navy" | "orange";
  cta: string;
}

export const segments: Record<Segment, SegmentDef> = {
  particulier: {
    id: "particulier",
    label: "Particulier",
    chooserLabel: "Particulier",
    chooserHint: "Mon logement",
    badge: "Habitat",
    tone: "green",
    cta: "Étudier mon projet",
  },
  professionnel: {
    id: "professionnel",
    label: "Professionnel",
    chooserLabel: "Professionnel",
    chooserHint: "Mon entreprise",
    badge: "Pro",
    tone: "navy",
    cta: "Parler de mon projet",
  },
  collectivite: {
    id: "collectivite",
    label: "Collectivité",
    chooserLabel: "Collectivité",
    chooserHint: "Ma structure publique",
    badge: "Collectivités",
    tone: "orange",
    cta: "Optimiser mes contrats",
  },
};

export const segmentOrder: Segment[] = ["particulier", "professionnel", "collectivite"];

/** Section « Votre projet » — 3 grandes cartes. */
export interface ProjectCard {
  id: string;
  anchor: string;
  eyebrow: string;
  badge: string;
  tone: SegmentDef["tone"];
  title: string;
  text: string;
  points: string[];
  cta: string;
  /** Segment ouvert dans Jawabot au clic. */
  segment: Segment;
  /** Sous-besoin pré-sélectionné dans Jawabot (optionnel). */
  presetNeed?: string;
  image: MediaAsset;
}

export const projectCards: ProjectCard[] = [
  {
    id: "particuliers",
    anchor: anchors.particuliers + "-carte",
    eyebrow: "Particuliers",
    badge: "Habitat",
    tone: "green",
    title: "Améliorez le confort de votre logement",
    text: "Pompe à chaleur et solutions de rénovation énergétique adaptées à votre maison et à votre projet.",
    points: ["Pompe à chaleur", "Photovoltaïque", "Rénovation énergétique"],
    cta: "Étudier mon projet",
    segment: "particulier",
    image: media.particuliers,
  },
  {
    id: "professionnels",
    anchor: anchors.professionnels + "-carte",
    eyebrow: "Professionnels",
    badge: "Pro",
    tone: "navy",
    title: "Maîtrisez les besoins énergétiques de votre activité",
    text: "Des solutions adaptées à vos bâtiments et à vos contraintes professionnelles.",
    points: ["Pompe à chaleur", "Performance du bâtiment", "Photovoltaïque"],
    cta: "Parler à HDF Bâti",
    segment: "professionnel",
    image: media.professionnels,
  },
  {
    id: "energie",
    anchor: anchors.energie,
    eyebrow: "Énergie",
    badge: "Énergie",
    tone: "orange",
    title: "Reprenez le contrôle de vos contrats d’énergie",
    text: "Nous accompagnons les professionnels et les collectivités dans l’analyse et l’optimisation de leurs contrats.",
    points: ["Électricité et gaz", "Échéances et renouvellements", "Professionnels et collectivités"],
    cta: "Étudier mes contrats",
    segment: "professionnel",
    presetNeed: "contrats",
    image: media.energie,
  },
];

/** Parcours pédagogique particulier. */
export const parcoursParticulier = [
  {
    title: "Je décris mon projet",
    text: "En quelques questions, en ligne ou par téléphone : votre maison, votre chauffage actuel, vos attentes.",
  },
  {
    title: "HDF Bâti analyse ma situation",
    text: "Nous regardons si le projet est adapté à votre logement et quels dispositifs d’aide pourraient s’appliquer.",
  },
  {
    title: "Nous échangeons sur les solutions adaptées",
    text: "Un interlocuteur vous explique les options, les étapes et ce qu’il faut prévoir — avant tout engagement.",
  },
  {
    title: "Proposition / étude",
    text: "Vous recevez une proposition claire, établie à partir de votre situation réelle.",
  },
  {
    title: "Réalisation et suivi selon le projet",
    text: "Organisation des travaux, réalisation et suivi, selon la nature de votre projet.",
  },
] as const;

/** Parcours professionnel / énergie — distinct du parcours particulier. */
export const parcoursPro = [
  {
    title: "Compréhension de votre structure",
    text: "Activité, bâtiments, sites, organisation : nous partons de votre réalité.",
  },
  {
    title: "Analyse du besoin",
    text: "Chauffage, performance du bâtiment, production d’énergie ou contrats : nous clarifions les priorités.",
  },
  {
    title: "Analyse des contrats et consommations",
    text: "Lorsque c’est pertinent : lecture de vos contrats, échéances et historiques de consommation.",
  },
  {
    title: "Identification des pistes d’optimisation",
    text: "Nous vous présentons les options identifiées, leurs conditions et leurs limites.",
  },
  {
    title: "Accompagnement HDF Bâti",
    text: "Un interlocuteur unique pour la mise en œuvre et le suivi des décisions prises.",
  },
] as const;
