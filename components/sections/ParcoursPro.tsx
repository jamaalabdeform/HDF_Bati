import { Building2, Landmark } from "lucide-react";
import { anchors } from "@/config/navigation";
import { parcoursPro } from "@/config/services";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function ParcoursPro() {
  return (
    <section id={anchors.professionnels} data-section="parcours_pro" aria-labelledby="parcours-pro-title" className="bg-navy py-20 text-white sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div id={anchors.collectivites} className="scroll-mt-28">
            <SectionHeading
              id="parcours-pro-title"
              invert
              title="Professionnels et collectivités : un accompagnement structuré"
              intro="Entreprises, commerces, bâtiments tertiaires, communes et établissements publics : nous partons de votre organisation et de vos contrats, pas d’une offre toute faite."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <JawabotTrigger origin="parcours_pro" segment="professionnel" variant="light" size="lg" icon={<Building2 className="size-5 text-navy" aria-hidden />}>
                Parler de mon projet
              </JawabotTrigger>
              <JawabotTrigger origin="parcours_collectivite" segment="collectivite" size="lg" icon={<Landmark className="size-5" aria-hidden />}>
                Optimiser mes contrats
              </JawabotTrigger>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/75">
              Aucune promesse d’économie chiffrée avant l’analyse de votre dossier : les pistes identifiées vous sont présentées avec leurs conditions.
            </p>
          </div>

          <ol className="divide-y divide-white/15 border-y border-white/15">
            {parcoursPro.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-5">
                <span className="tabular pt-0.5 text-2xl leading-none font-bold text-energy">{i + 1}</span>
                <div>
                  <h3 className="font-bold text-white">{step.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-white/80">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
