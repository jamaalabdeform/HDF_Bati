import { DossierEntries } from "@/components/etude/DossierEntries";
import { DossierHero } from "@/components/etude/DossierHero";
import { Callback } from "@/components/sections/Callback";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { GoogleReviews } from "@/components/sections/GoogleReviews";
import { WhyHdf } from "@/components/sections/WhyHdf";
import { faqJsonLd, jsonLd } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd())} />
      <DossierHero />
      <DossierEntries />
      <GoogleReviews />
      <WhyHdf />
      <Faq />
      <Callback />
      <Contact />
    </>
  );
}
