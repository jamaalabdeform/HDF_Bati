import { pending } from "./validation";

/**
 * Les deux différences de HDF Bâti (PRODUCT.md, confirmées par Farid le 28/09/2026).
 * Formulations prudentes validées pour affichage immédiat ; versions précises
 * (délai chiffré, mécanisme des aides) en attente de validation. TODO_HDF_VALIDATION
 */
export const positioning = {
  reactivite: {
    short: "Un conseiller vous rappelle rapidement",
    title: "Vous êtes rappelé rapidement",
    heroText: "Par l’équipe HDF Bâti elle-même, pas par un centre d’appels.",
    text: "Vous laissez vos coordonnées, l’équipe HDF Bâti vous rappelle elle-même, rapidement. Pas de centre d’appels.",
    precise: pending<string>("Délai de rappel chiffré à annoncer (Farid : « dans la minute » pour un prospect chaud)"),
  },
  aides: {
    short: "Les démarches d’aides, nous nous en occupons avec vous",
    title: "Les démarches d’aides, avec vous",
    heroText: "Nous identifions les dispositifs applicables et nous nous en occupons avec vous. Selon conditions d’éligibilité.",
    text: "Nous identifions les dispositifs applicables à votre projet et nous nous occupons des démarches avec vous. Selon conditions d’éligibilité.",
    precise: pending<string>(
      "Mécanisme exact à valider juridiquement (HDF Bâti perçoit l’aide et règle le sous-traitant ; impact pour le client : démarches, avance de frais)",
    ),
  },
} as const;
