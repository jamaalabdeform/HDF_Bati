/** Ancres de la landing — une seule définition, utilisée par l'en-tête et le pied de page. */
export const anchors = {
  top: "haut",
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
  { label: "Particuliers", href: `/#${anchors.particuliers}` },
  { label: "Professionnels", href: `/#${anchors.professionnels}` },
  { label: "Collectivités", href: `/#${anchors.collectivites}` },
  { label: "Aides", href: `/#${anchors.aides}` },
  { label: "FAQ", href: `/#${anchors.faq}` },
  { label: "Contact", href: `/#${anchors.contact}` },
] as const;

export const footerNav = {
  offres: [
    { label: "Particuliers", href: `/#${anchors.particuliers}` },
    { label: "Professionnels", href: `/#${anchors.professionnels}` },
    { label: "Collectivités", href: `/#${anchors.collectivites}` },
    { label: "Énergie", href: `/#${anchors.professionnels}` },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;
