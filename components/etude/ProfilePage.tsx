import { Aides } from "../sections/Aides";
import { Callback } from "../sections/Callback";
import { Faq } from "../sections/Faq";
import { dossiers } from "@/config/dossiers";
import type { Segment } from "@/config/services";
import { faqJsonLd, jsonLd } from "@/lib/schema";
import { DossierHero } from "./DossierHero";
import { Rubriques } from "./Rubriques";
import { Sommaire } from "./Sommaire";

/** Page profil : la fiche, le sommaire de l'étude, les rubriques A → D, puis la clôture. */
export function ProfilePage({ segment }: { segment: Segment }) {
  const d = dossiers[segment];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd(segment))} />
      <DossierHero segment={segment} />
      <Sommaire steps={d.sommaire} title={d.sommaireTitle} />
      <Rubriques d={d} />
      {segment === "particulier" && <Aides />}
      <Faq segment={segment} />
      <Callback segment={segment} />
    </>
  );
}
