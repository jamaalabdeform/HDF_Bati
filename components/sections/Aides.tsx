import { ExternalLink, Info } from "lucide-react";
import { aides } from "@/config/aides";
import { anchors } from "@/config/navigation";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { SectionHeading } from "../ui/SectionHeading";

export function Aides() {
  return (
    <section id={anchors.aides} data-section="aides" aria-labelledby="aides-title" className="bg-white py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading id="aides-title" title={aides.title} intro={aides.intro} />
          <p className="mt-6 flex max-w-[60ch] items-start gap-3 border-t border-line pt-5 text-sm leading-relaxed text-ink">
            <Info className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
            <span>
              <strong className="font-semibold text-deep">{aides.legalNotice}</strong> Aucune aide n’est acquise d’avance : son obtention dépend de votre situation et des justificatifs fournis.
            </span>
          </p>
          <Pending className="mt-4" label="Relecture juridique du bloc « Aides » avant mise en production." note="Formulations prudentes en place ; vérifier la conformité (DGCCRF / réglementation rénovation énergétique)." />
          <div className="mt-8">
            <JawabotTrigger origin="aides" segment="particulier" preset={{ projet: "ne_sait_pas" }} variant="secondary" size="lg">
              Vérifier ma situation
            </JawabotTrigger>
          </div>
        </div>

        <dl className="divide-y divide-line border-y border-line self-start">
          {aides.points.map((p, i) => (
            <div key={p.title} className="py-6">
              <dt className="text-lg font-bold text-deep">{p.title}</dt>
              <dd className="mt-1.5 max-w-[60ch] leading-relaxed text-muted">
                {p.text}
                {i === aides.points.length - 1 && (
                  <a href={aides.officialLink.href} target="_blank" rel="noopener noreferrer" className="mt-2 block py-1 text-sm font-semibold text-navy underline hover:text-hdf">
                    {aides.officialLink.label}
                    <ExternalLink className="ml-1 inline size-3.5 align-[-1px]" aria-hidden />
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
