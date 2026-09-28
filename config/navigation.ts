/** Ancres de la landing — une seule définition, utilisée par l'en-tête et le pied de page. */
export const anchors = {
  top: "haut",
  /** La fiche d'étude (premier écran de l'accueil et des pages profil). */
  etude: "etude",
  projets: "votre-projet",
  particuliers: "particuliers",
  professionnels: "professionnels",
  collectivites: "collectivites",
  energie: "energie",
  aides: "aides",
  pourquoi: "pourquoi-hdf-bati",
  faq: "questions-frequentes",
  rappel: "etre-rappele",
  contact: "contact",
} as const;

export const mainNav = [
  { label: "Particuliers", href: "/particuliers" },
  { label: "Professionnels", href: "/professionnels" },
  { label: "Collectivités", href: "/collectivites" },
  { label: "Aides", href: `/particuliers#${anchors.aides}` },
  { label: "FAQ", href: `/#${anchors.faq}` },
  { label: "Contact", href: `/#${anchors.contact}` },
] as const;

export const footerNav = {
  offres: [
    { label: "Particuliers", href: "/particuliers" },
    { label: "Professionnels", href: "/professionnels" },
    { label: "Collectivités", href: "/collectivites" },
    { label: "Aides financières", href: `/particuliers#${anchors.aides}` },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;
