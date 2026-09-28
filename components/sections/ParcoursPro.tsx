import { Building2, Landmark } from "lucide-react";
import { anchors } from "@/config/navigation";
import { parcoursPro } from "@/config/services";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const audiences = [
  {
    id: anchors.professionnels + "-bloc",
    icon: Building2,
    title: "Professionnels",
    text: "Entreprises, commerces, bureaux, bâtiments agricoles : chauffage, photovoltaïque, performance du bâtiment et contrats d’énergie.",
    cta: "Parler de mon projet",
    segment: "professionnel" as const,
  },
  {
    id: anchors.collectivites,
    icon: Landmark,
    title: "Collectivités",
    text: "Communes, intercommunalités, établissements publics, bailleurs : vos contrats d’électricité et de gaz, leurs échéances, et vos projets de bâtiments.",
    cta: "Optimiser mes contrats",
    segment: "collectivite" as const,
  },
];

export function ParcoursPro() {
  return (
    <section id={anchors.professionnels} data-section="parcours_pro" aria-labelledby="parcours-pro-title" className="bg-navy py-14 text-white sm:py-24">
      <Container>
        <SectionHeading
          id="parcours-pro-title"
          invert
          title="Professionnels et collectivités"
          intro="Deux publics, une même méthode : nous partons de votre organisation et de vos contrats, pas d’une offre toute faite."
        />

        <div className="mt-10 grid gap-x-12 border-t border-white/15 md:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.id} id={a.id} className="scroll-mt-28 border-b border-white/15 py-7 md:border-b-0">
              <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                <a.icon className="size-6 text-energy" aria-hidden />
                {a.title}
              </h3>
              <p className="mt-2 max-w-[48ch] leading-relaxed text-white/80">{a.text}</p>
              <div className="mt-5">
                <JawabotTrigger origin={`parcours_${a.segment}`} segment={a.segment} size="lg">
                  {a.cta}
                </JawabotTrigger>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
          <div>
            <h3 className="text-lg font-bold text-white">Notre méthode, en 5 étapes</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
              Aucune promesse d’économie chiffrée avant l’analyse de votre dossier : les pistes identifiées vous sont présentées avec leurs conditions.
            </p>
          </div>
          <ol className="divide-y divide-white/15 border-y border-white/15">
            {parcoursPro.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-4 sm:py-5">
                <span className="tabular pt-0.5 text-2xl leading-none font-bold text-energy">{i + 1}</span>
                <div>
                  <h4 className="font-bold text-white">{step.title}</h4>
                  <p className="mt-1 hidden text-[0.95rem] leading-relaxed text-white/80 sm:block">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
