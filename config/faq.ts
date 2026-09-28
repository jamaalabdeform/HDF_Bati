import { company } from "./company";

/**
 * FAQ — contenu volontairement prudent, réutilisé pour le schema FAQPage.
 * Toute réponse touchant aux aides ou à la réglementation est marquée `legalReview`
 * (TODO_HDF_VALIDATION : relecture juridique avant production).
 */
export interface FaqItem {
  q: string;
  a: string;
  legalReview?: boolean;
}

export const faq: FaqItem[] = [
  {
    q: "Une pompe à chaleur convient-elle à tous les logements ?",
    a: "Pas forcément. La pertinence d’une pompe à chaleur dépend du logement, de son isolation, du système de chauffage existant et de vos usages. C’est précisément l’objet de l’étude : vérifier que la solution est adaptée avant de vous proposer quoi que ce soit.",
  },
  {
    q: "Intervenez-vous en appartement ?",
    a: "Nos projets de pompe à chaleur concernent aujourd’hui les maisons individuelles. Si vous habitez en appartement, décrivez-nous tout de même votre situation : nous vous dirons honnêtement si nous pouvons vous aider.",
  },
  {
    q: "Quelles aides financières peuvent s’appliquer à mon projet ?",
    a: "Selon votre situation et votre projet, certains dispositifs d’aide peuvent être mobilisables. HDF Bâti vous aide à identifier les dispositifs applicables. Aucune aide n’est automatique : elles dépendent de conditions d’éligibilité et de la réglementation en vigueur. Le service public France Rénov’ informe également gratuitement sur les aides.",
    legalReview: true,
  },
  {
    q: "Dans quelle zone intervenez-vous ?",
    a: `HDF Bâti est basée à ${company.address.city} (${company.address.department}). Nous intervenons dans les Hauts-de-France et, selon la nature du projet, partout en France.`,
  },
  {
    q: "En quoi consiste l’accompagnement sur les contrats d’énergie ?",
    a: "Pour les professionnels et les collectivités, nous analysons vos contrats d’électricité et de gaz, vos échéances et, lorsque c’est pertinent, vos consommations. Nous vous présentons ensuite les pistes identifiées, leurs conditions et leurs limites. Nous ne promettons pas d’économie chiffrée avant d’avoir étudié votre dossier.",
    legalReview: true,
  },
  {
    q: "Décrire mon projet m’engage-t-il à quelque chose ?",
    a: "Non. Décrire votre projet ou demander un rappel ne vous engage à rien. Vos informations servent uniquement à préparer l’échange avec HDF Bâti.",
  },
];
