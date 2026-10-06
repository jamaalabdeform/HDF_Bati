/**
 * Aides financières — formulations prudentes imposées.
 * INTERDIT : « PAC à 1 € », « 100 % financé », « gratuit », aide garantie ou montant d'aide.
 * TODO_HDF_VALIDATION : relecture juridique de ce bloc avant la mise en production.
 */
export const aides = {
  title: "Aides financières : un accompagnement, pas une promesse",
  intro:
    "Selon votre situation et votre projet, certains dispositifs d’aide peuvent être mobilisables. HDF Bâti vous aide à identifier les dispositifs applicables.",
  points: [
    {
      title: "Chaque situation est différente",
      text: "Les aides dépendent notamment du logement, des travaux envisagés et de la situation du foyer. Elles ne sont jamais automatiques.",
    },
    {
      title: "Un accompagnement complet, sans avance de frais",
      text: "Lors de l’étude, nous identifions les dispositifs potentiellement applicables et nous vous accompagnons dans toutes les démarches, en vous indiquant les justificatifs à fournir. Vous n’avez pas à avancer les frais des aides.",
    },
    {
      title: "Des informations officielles",
      text: "Le service public France Rénov’ vous informe gratuitement et de manière indépendante sur les aides à la rénovation.",
    },
  ],
  legalNotice: "Selon conditions d’éligibilité et réglementation en vigueur.",
  officialLink: {
    label: "France Rénov’ — service public de la rénovation de l’habitat",
    href: "https://france-renov.gouv.fr",
  },
} as const;
