import { confirmed, pending, type Validated } from "./validation";

/**
 * Source unique de vérité pour l'identité et les coordonnées HDF Bâti (NAP).
 * Ne jamais recopier ces informations ailleurs dans le code : importer `company`.
 */

const SRC_BRIEF = "Brief landing HDF Bâti + carte de visite Farid (UI Kit V2)";
const SRC_LEGAL = "Fiche légale publique — questionnaire Farid V3 prérempli (27/09/2026)";
function socialUrl(url: string, note: string): Validated<string> {
  return url ? confirmed(url, "Compte créé par l’équipe HDF Bâti") : pending<string>(note);
}

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
    /** Affichage public du siège confirmé par Farid le 15/10/2026. */
    publicDisplay: confirmed(true, "Farid, 15/10/2026"),
  },

  phone: {
    display: "06 01 45 11 10",
    e164: "+33601451110",
    source: SRC_BRIEF,
  },

  // Adresse sur le domaine hdf-bati.fr (remplace l’ancienne adresse Gmail, 17/10/2026).
  email: "contact@hdf-bati.fr",

  /** Numéro WhatsApp qui reçoit les prospects (Farid + associé selon le questionnaire). */
  whatsapp: {
    number: confirmed("33601451110", "Farid, 15/10/2026 — même numéro que le mobile (surchargeable via NEXT_PUBLIC_WHATSAPP_NUMBER)"),
  },


  serviceArea: confirmed(
    "Hauts-de-France, et partout en France selon le projet",
    `${SRC_FARID} — « HDF et toute la France »`,
  ),

  openingHours: confirmed("7 jours sur 7, y compris le soir et le week-end", "Farid, 15/10/2026"),
  responseTime: confirmed("Réponse dans l’heure", "Farid, 06/10/2026"),

  geo: pending<{ lat: number; lng: number }>("Coordonnées GPS exactes de la fiche Google Business"),

  googleBusiness: {
    url: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL
      ? confirmed(process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL, "Variable NEXT_PUBLIC_GOOGLE_BUSINESS_URL")
      : confirmed("https://maps.app.goo.gl/xBE36dihMVkMGd6NA", "Farid, 15/10/2026 — lien de partage Google Maps"),
    reviewsCount: pending<number>(
      "14 avis déclarés au 27/09/2026 ; note moyenne non communiquée. Afficher uniquement via widget/lien vérifiable.",
      14,
    ),
  },

  /**
   * Réseaux sociaux : coller l'URL du compte ici (à la place de "") ou dans la variable
   * d'environnement indiquée. Tant qu'une URL manque, l'icône renvoie vers l'accueil du réseau.
   */
  social: {
    facebook: socialUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL || "", "URL de la page Facebook HDF Bâti"),
    instagram: socialUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL || "", "URL du compte Instagram HDF Bâti"),
    linkedin: socialUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL || "", "URL de la page LinkedIn HDF Bâti"),
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
