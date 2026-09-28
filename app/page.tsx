import { Aides } from "@/components/sections/Aides";
import { Callback } from "@/components/sections/Callback";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { ParcoursParticulier } from "@/components/sections/ParcoursParticulier";
import { ParcoursPro } from "@/components/sections/ParcoursPro";
import { ProjectCards } from "@/components/sections/ProjectCards";
import { WhyHdf } from "@/components/sections/WhyHdf";
import { faqJsonLd, jsonLd } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd())} />
      <Hero />
      <ProjectCards />
      <ParcoursParticulier />
      <ParcoursPro />
      <Aides />
      <WhyHdf />
      <Callback />
      <Faq />
      <Contact />
    </>
  );
}
