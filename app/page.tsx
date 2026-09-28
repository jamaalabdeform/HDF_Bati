import { DossierEntries } from "@/components/etude/DossierEntries";
import { DossierHero } from "@/components/etude/DossierHero";
import { Callback } from "@/components/sections/Callback";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { WhyHdf } from "@/components/sections/WhyHdf";
import { faqJsonLd, jsonLd } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd())} />
      <DossierHero />
      <DossierEntries />
      <WhyHdf withoutPromises />
      <Faq />
      <Callback />
      <Contact />
    </>
  );
}
