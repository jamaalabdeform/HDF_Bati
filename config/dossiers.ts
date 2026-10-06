import { parcoursParticulier, parcoursPro, type Segment } from "./services";
import { positioning } from "./positioning";
import { pending, type Validated } from "./validation";

/**
 * Contenu des pages profil, composées comme une fiche d'étude :
 * sommaire (les étapes) puis quatre rubriques A → D.
 *
 * Sources : Questionnaire Farid (RDV du 27/09/2026) pour le particulier ;
 * les précisions pro / collectivité sont en attente de validation. TODO_HDF_VALIDATION
 */

export interface Rubrique {
  title: string;
  items: string[];
  /** Précision non encore confirmée (masquée en production). */
  precise?: Validated<string>;
}

export interface Dossier {
  segment: Segment;
  slug: string;
  /** Titre de page (H1). */
  title: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  sommaireTitle: string;
  sommaire: readonly { title: string; text: string }[];
  etudions: Rubrique;
  preparez: Rubrique;
  rappel: Rubrique;
  recevez: Rubrique;
}

const rappel: Rubrique = {
  title: "Qui vous rappelle, et quand",
  items: [
    "Un responsable de HDF Bâti reprend lui-même votre fiche : pas de centre d’appels.",
    "Il vous répond dans l’heure, ou vous rappelle au moment que vous avez indiqué, avec vos réponses sous les yeux.",
    "Vous n’avez pas à tout réexpliquer : l’échange porte directement sur votre situation.",
  ],
  precise: positioning.reactivite.precise,
};

export const dossiers: Record<Segment, Dossier> = {
  particulier: {
    segment: "particulier",
    slug: "particuliers",
    title: "Pompe à chaleur et rénovation énergétique de votre maison",
    lead: "Décrivez votre maison et votre chauffage actuel : HDF Bâti étudie si le projet est adapté, et quelles aides pourraient s’appliquer, avant de vous proposer quoi que ce soit.",
    metaTitle: "Particuliers : pompe à chaleur et rénovation énergétique",
    metaDescription:
      "Pompe à chaleur, photovoltaïque et rénovation énergétique de votre maison dans les Hauts-de-France. HDF Bâti étudie votre projet et les aides applicables avant toute proposition.",
    sommaireTitle: "Les 5 étapes de votre projet",
    sommaire: parcoursParticulier,
    etudions: {
      title: "Ce que nous étudions",
      items: [
        "Une étude complète de votre maison : dimensionnement de l’installation et choix du matériel installé.",
        "Votre maison : nos projets de pompe à chaleur concernent les maisons individuelles.",
        "Votre chauffage actuel (gaz, fioul, électrique…) et ce qu’une pompe à chaleur, des panneaux ou des travaux de rénovation changeraient.",
        "Les aides qui pourraient s’appliquer à votre foyer, selon conditions d’éligibilité.",
      ],
    },
    preparez: {
      title: "Ce que vous préparez",
      items: [
        "L’adresse du logement concerné.",
        "Le mode de chauffage actuel, et si possible son âge.",
        "Votre dernier avis d’imposition : il permet de vérifier l’éligibilité aux aides. Nous vous indiquons comment nous l’envoyer par e-mail.",
      ],
    },
    rappel,
    recevez: {
      title: "Ce que vous recevez",
      items: [
        "Une réponse claire : le projet est-il adapté à votre maison ?",
        "Si c’est le cas, une proposition établie à partir de cette étude, avec le matériel choisi et les étapes expliquées avant tout engagement.",
        "Un accompagnement complet dans les démarches d’aides, sans avance de frais de votre part. Selon conditions d’éligibilité.",
      ],
      precise: positioning.aides.precise,
    },
  },
  professionnel: {
    segment: "professionnel",
    slug: "professionnels",
    title: "Les besoins énergétiques de votre activité, étudiés sur place",
    lead: "Bâtiments, chauffage, production d’énergie ou contrats d’électricité et de gaz : HDF Bâti part de votre activité réelle pour identifier les pistes utiles.",
    metaTitle: "Professionnels : pompe à chaleur, photovoltaïque et contrats d’énergie",
    metaDescription:
      "Entreprises, commerces, bâtiments tertiaires et agricoles : HDF Bâti étudie vos bâtiments et vos contrats d’énergie pour identifier les pistes d’optimisation.",
    sommaireTitle: "Les 5 étapes de l’étude",
    sommaire: parcoursPro,
    etudions: {
      title: "Ce que nous étudions",
      items: [
        "Vos bâtiments et leur usage : surface, nombre de sites, activité.",
        "Vos contrats d’électricité et de gaz et leurs échéances.",
        "Les pistes possibles : pompe à chaleur, photovoltaïque, performance du bâtiment.",
      ],
    },
    preparez: {
      title: "Ce que vous préparez",
      items: ["Rien d’obligatoire pour un premier échange : les informations que vous avez sous la main suffisent."],
      precise: pending("Pièces utiles pour l’étude d’un professionnel (factures d’énergie, contrats en cours…) — à confirmer avec Farid"),
    },
    rappel,
    recevez: {
      title: "Ce que vous recevez",
      items: [
        "Une lecture de votre situation et les pistes identifiées, avec leurs conditions et leurs limites.",
        "Pas d’économie chiffrée avant l’étude de votre dossier.",
        "Un interlocuteur unique pour la mise en œuvre et le suivi.",
      ],
    },
  },
  collectivite: {
    segment: "collectivite",
    slug: "collectivites",
    title: "Les contrats d’énergie de votre collectivité, relus et optimisés",
    lead: "Communes, intercommunalités, établissements publics et bailleurs : HDF Bâti analyse vos contrats d’électricité et de gaz, vos échéances et vos bâtiments.",
    metaTitle: "Collectivités : optimisation des contrats d’énergie",
    metaDescription:
      "Communes, intercommunalités, établissements publics : analyse de vos contrats d’électricité et de gaz, de leurs échéances et accompagnement de vos projets de bâtiments.",
    sommaireTitle: "Les 5 étapes de l’étude",
    sommaire: parcoursPro,
    etudions: {
      title: "Ce que nous étudions",
      items: [
        "Vos contrats d’électricité et de gaz, et leurs échéances de renouvellement.",
        "Le nombre de sites et les consommations, quand vous les connaissez.",
        "Les projets de vos bâtiments publics : chauffage, photovoltaïque.",
      ],
    },
    preparez: {
      title: "Ce que vous préparez",
      items: ["Rien d’obligatoire pour un premier échange : une estimation du nombre de sites et la date de fin des contrats suffisent."],
      precise: pending("Pièces utiles pour l’étude d’une collectivité (contrats, historiques de consommation, contraintes de marché public) — à confirmer avec Farid"),
    },
    rappel,
    recevez: {
      title: "Ce que vous recevez",
      items: [
        "Une lecture de vos contrats et des pistes identifiées, avec leurs conditions et leurs limites.",
        "Pas d’économie chiffrée avant l’étude de votre dossier.",
        "Un interlocuteur unique pour la suite.",
      ],
    },
  },
};

export const dossierHref = (s: Segment) => `/${dossiers[s].slug}`;
