import { confirmed, pending, type Validated } from "./validation";

/**
 * Source unique de vérité pour l'identité et les coordonnées HDF Bâti (NAP).
 * Ne jamais recopier ces informations ailleurs dans le code : importer `company`.
 */

const SRC_BRIEF = "Brief landing HDF Bâti + carte de visite Farid (UI Kit V2)";
const SRC_LEGAL = "Fiche légale publique — questionnaire Farid V3 prérempli (27/09/2026)";
const SRC_FARID = "Réponses de Farid — questionnaire V3 (RDV du 27/09/2026)";

export const company = {
  name: "HDF Bâti",
  /** Graphie du logo, en capitales. Le mot BÂTI ne comporte aucun espace. */
  brandUpper: "HDF BÂTI",
  tagline: "Votre expert en rénovation énergétique",

  legal: {
    denomination: confirmed("HDF BATI", SRC_LEGAL),
    form: confirmed("SAS — Société par actions simplifiée", SRC_LEGAL),
    capital: confirmed("500 €", SRC_LEGAL),
    siren: confirmed("925 387 680", SRC_LEGAL),
    siret: confirmed("925 387 680 00018", SRC_LEGAL),
    rcs: confirmed("RCS Valenciennes", SRC_LEGAL),
    ape: confirmed("4399C", SRC_LEGAL),
    president: confirmed("Kaled OMAYR", SRC_LEGAL),
    directeurGeneral: confirmed("Farid MEDJAHED", SRC_LEGAL),
    vat: pending<string>("N° TVA intracommunautaire à confirmer sur document fiscal", "FR63 925387680"),
    publicationDirector: pending<string>("Directeur de la publication du site (Président ou DG ?)"),
    host: pending<string>("Hébergeur définitif (nom, adresse, téléphone) — dépend du choix Vercel / autre"),
  },

  address: {
    street: "209 avenue Anatole France",
    postalCode: "59410",
    city: "Anzin",
    region: "Hauts-de-France",
    department: "Nord",
    country: "FR",
    /** L'adresse du siège est confirmée ; son affichage public reste à valider. */
    publicDisplay: pending<boolean>(
      "Farid doit confirmer que le siège est bien l'adresse à afficher sur le site et Google",
      true,
    ),
  },

  phone: {
    display: "06 01 45 11 10",
    e164: "+33601451110",
    source: SRC_BRIEF,
  },

  email: "HDF.bati@gmail.com",

  /** Numéro WhatsApp qui reçoit les prospects (Farid + associé selon le questionnaire). */
  whatsapp: {
    number: pending<string>(
      "Numéro WhatsApp Business définitif (même numéro que le mobile ?) — surchargeable via NEXT_PUBLIC_WHATSAPP_NUMBER",
      "33601451110",
    ),
  },


  serviceArea: confirmed(
    "Hauts-de-France, et partout en France selon le projet",
    `${SRC_FARID} — « HDF et toute la France »`,
  ),

  openingHours: pending<string>("Horaires de disponibilité à annoncer (rappel, WhatsApp)"),
  responseTime: pending<string>(
    "Délai de rappel annoncé publiquement (Farid indique « dans la minute » pour un prospect chaud — à formaliser)",
  ),

  geo: pending<{ lat: number; lng: number }>("Coordonnées GPS exactes de la fiche Google Business"),

  googleBusiness: {
    url: pending<string>("Lien public de la fiche Google Business Profile (Farid a les accès)"),
    reviewsCount: pending<number>(
      "14 avis déclarés au 27/09/2026 ; note moyenne non communiquée. Afficher uniquement via widget/lien vérifiable.",
      14,
    ),
  },

  social: {
    facebook: pending<string>("URL de la page Facebook HDF Bâti"),
    instagram: pending<string>("URL du compte Instagram HDF Bâti"),
    linkedin: pending<string>("URL de la page LinkedIn HDF Bâti"),
  } satisfies Record<string, Validated<string>>,

  foundingDate: confirmed("2024-04-05", SRC_LEGAL),
} as const;

export const fullAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;

export const telHref = `tel:${company.phone.e164}`;
export const mailHref = `mailto:${company.email}`;

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${company.name} ${fullAddress}`,
)}`;

/** Numéro WhatsApp effectif (variable d'environnement prioritaire). */
export function whatsappNumber(): string {
  const env = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  return env || company.whatsapp.number.value || company.phone.e164.replace(/\D/g, "");
}

export function whatsappHref(message: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}
