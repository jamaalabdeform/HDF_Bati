import { DossierEntries } from "@/components/etude/DossierEntries";
import { DossierHero } from "@/components/etude/DossierHero";
import { DoubleSommaire } from "@/components/etude/Sommaire";
import { Callback } from "@/components/sections/Callback";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { WhyHdf } from "@/components/sections/WhyHdf";
import { anchors } from "@/config/navigation";
import { parcoursParticulier, parcoursPro } from "@/config/services";
import { faqJsonLd, jsonLd } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd())} />
      <DossierHero />
      <DossierEntries />
      <DoubleSommaire
        a={{ id: anchors.particuliers, title: "Particuliers : les 5 étapes de votre projet", steps: parcoursParticulier }}
        b={{ id: anchors.professionnels, title: "Professionnels et collectivités : les 5 étapes de l’étude", steps: parcoursPro }}
      />
      <WhyHdf withoutPromises />
      <Faq />
      <Callback />
      <Contact />
    </>
  );
}
