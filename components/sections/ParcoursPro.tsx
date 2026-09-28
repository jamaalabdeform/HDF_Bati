import { ArrowRight, Building2, Landmark } from "lucide-react";
import { anchors } from "@/config/navigation";
import { parcoursPro } from "@/config/services";
import { SignatureCurve } from "../brand/SignatureCurve";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Badge } from "../ui/Badge";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function ParcoursPro() {
  return (
    <section id={anchors.professionnels} data-section="parcours_pro" aria-labelledby="parcours-pro-title" className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <SignatureCurve className="absolute -top-6 -left-20 h-40 w-[40rem] text-white/10" strokeWidth={2} />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div id={anchors.collectivites} className="flex scroll-mt-28 flex-wrap gap-2">
              <Badge tone="light">Professionnels</Badge>
              <Badge tone="light">Collectivités</Badge>
            </div>
            <SectionHeading
              id="parcours-pro-title"
              invert
              className="mt-4"
              title="Un accompagnement structuré pour votre énergie"
              intro="Entreprises, commerces, bâtiments tertiaires, communes et établissements publics : nous partons de votre organisation et de vos contrats, pas d’une offre toute faite."
            />
            <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" delay={120}>
              <JawabotTrigger origin="parcours_pro" segment="professionnel" variant="light" size="lg" icon={<Building2 className="size-5 text-navy" aria-hidden />}>
                Parler de mon projet
              </JawabotTrigger>
              <JawabotTrigger origin="parcours_collectivite" segment="collectivite" size="lg" icon={<Landmark className="size-5" aria-hidden />}>
                Optimiser mes contrats
              </JawabotTrigger>
            </Reveal>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/75">
              Aucune promesse d’économie chiffrée avant l’analyse de votre dossier : les pistes identifiées vous sont présentées avec leurs conditions.
            </p>
          </div>

          <ol className="space-y-3">
            {parcoursPro.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80}>
                <div className="group flex gap-4 rounded-[var(--radius-card)] bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.1]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-base font-bold text-navy">{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/80">{step.text}</p>
                  </div>
                  <ArrowRight className="ml-auto hidden size-4 shrink-0 self-center text-white/40 transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
