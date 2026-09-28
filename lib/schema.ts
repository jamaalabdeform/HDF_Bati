import { company } from "@/config/company";
import { faqFor } from "@/config/faq";
import type { Segment } from "@/config/services";
import { seo, siteUrl } from "@/config/site";
import { publicValue } from "@/config/validation";

/**
 * Données structurées schema.org.
 * - HomeAndConstructionBusiness (sous-type de LocalBusiness) : l'entreprise dispose d'une
 *   adresse réelle. TODO_HDF_VALIDATION : confirmer que le siège est l'adresse publique.
 * - Aucune note / aucun avis n'est déclaré tant qu'ils ne sont pas vérifiables.
 */
export function businessJsonLd() {
  const geo = publicValue(company.geo);
  const sameAs = Object.values(company.social).map(publicValue).filter(Boolean);
  const gbp = publicValue(company.googleBusiness.url);
  if (gbp) sameAs.push(gbp);
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#entreprise`,
    name: company.name,
    legalName: company.legal.denomination.value,
    description: seo.description,
    slogan: company.tagline,
    url: siteUrl,
    logo: `${siteUrl}/brand/hdf-bati-logo.svg`,
    image: `${siteUrl}${seo.ogImage}`,
    telephone: company.phone.e164,
    email: company.email,
    foundingDate: publicValue(company.foundingDate) ?? undefined,
    identifier: { "@type": "PropertyValue", propertyID: "SIREN", value: company.legal.siren.value },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    ...(geo ? { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng } } : {}),
    areaServed: [
      { "@type": "AdministrativeArea", name: "Hauts-de-France" },
      { "@type": "Country", name: "France" },
    ],
    knowsAbout: ["Pompe à chaleur", "Rénovation énergétique", "Photovoltaïque", "Courtage en énergie"],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function faqJsonLd(segment?: Segment) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqFor(segment).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#site`,
    url: siteUrl,
    name: company.name,
    inLanguage: "fr-FR",
    publisher: { "@id": `${siteUrl}/#entreprise` },
  };
}

/** Sérialisation sûre pour <script type="application/ld+json">. */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
