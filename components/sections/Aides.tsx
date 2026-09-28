import { ExternalLink, Info } from "lucide-react";
import { aides } from "@/config/aides";
import { anchors } from "@/config/navigation";
import { SHOW_PENDING } from "@/config/validation";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Aides() {
  return (
    <section id={anchors.aides} data-section="aides" aria-labelledby="aides-title" className="bg-white py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading id="aides-title" eyebrow="Aides financières" title={aides.title} intro={aides.intro} />
            <Reveal className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-ink">
              <Info className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
              <p>
                <strong className="font-semibold text-deep">{aides.legalNotice}</strong> Aucune aide n’est acquise d’avance : son obtention dépend de votre situation et des justificatifs fournis.
              </p>
            </Reveal>
            {SHOW_PENDING && <Pending className="mt-4" label="Relecture juridique du bloc « Aides » avant mise en production." note="Formulations prudentes en place ; vérifier la conformité (DGCCRF / réglementation rénovation énergétique)." />}
            <Reveal className="mt-8" delay={100}>
              <JawabotTrigger origin="aides" segment="particulier" preset={{ projet: "ne_sait_pas" }} variant="secondary" size="lg">
                Vérifier ma situation
              </JawabotTrigger>
            </Reveal>
          </div>

          <div className="grid gap-4">
            {aides.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="relative rounded-[var(--radius-card)] border border-line bg-white p-6 pl-7 shadow-[var(--shadow-card)]">
                  <span aria-hidden className="absolute top-6 bottom-6 left-0 w-1 rounded-r-full bg-hdf" />
                  <h3 className="text-lg font-bold text-deep">{p.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{p.text}</p>
                  {i === aides.points.length - 1 && (
                    <a href={aides.officialLink.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block py-2 text-sm font-semibold text-navy underline underline-offset-4 hover:text-hdf">
                      {aides.officialLink.label}
                      <ExternalLink className="ml-1 inline size-3.5 align-[-1px]" aria-hidden />
                      <span className="sr-only">(nouvel onglet)</span>
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
