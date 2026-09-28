import { ArrowRight } from "lucide-react";
import { anchors } from "@/config/navigation";
import { parcoursParticulier } from "@/config/services";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function ParcoursParticulier() {
  return (
    <section id={anchors.particuliers} data-section="parcours_particulier" aria-labelledby="parcours-part-title" className="bg-surface py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="parcours-part-title"
            title={<>Particuliers : votre projet, <span className="text-hdf">étape par étape</span></>}
            intro="Pas de jargon, pas de précipitation : vous savez à chaque étape ce qui se passe et ce qui vient ensuite."
          />
          <div className="shrink-0">
            <JawabotTrigger origin="parcours_particulier" segment="particulier" size="lg" iconEnd={<ArrowRight className="size-5" aria-hidden />}>
              Étudier mon projet
            </JawabotTrigger>
          </div>
        </div>

        <ol className="mt-14 grid border-l-2 border-hdf/25 lg:grid-cols-5 lg:border-t-2 lg:border-l-0">
          {parcoursParticulier.map((step, i) => (
            <li key={step.title} className="relative pb-8 pl-7 last:pb-0 lg:pt-7 lg:pr-6 lg:pb-0 lg:pl-0">
              <span aria-hidden className="absolute top-1.5 -left-[7px] size-3 rounded-full border-2 border-surface bg-hdf lg:-top-[7px] lg:left-0" />
              <p className="tabular text-sm font-bold text-hdf">Étape {i + 1}</p>
              <h3 className="mt-1 text-lg leading-snug font-bold text-deep">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
