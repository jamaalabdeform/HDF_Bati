import { ArrowRight } from "lucide-react";
import { anchors } from "@/config/navigation";
import { parcoursParticulier } from "@/config/services";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Badge } from "../ui/Badge";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function ParcoursParticulier() {
  return (
    <section id={anchors.particuliers} data-section="parcours_particulier" aria-labelledby="parcours-part-title" className="bg-surface py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge tone="green" className="mb-4">Particuliers</Badge>
            <SectionHeading
              id="parcours-part-title"
              title="Votre projet, étape par étape"
              intro="Pas de jargon, pas de précipitation : vous savez à chaque étape ce qui se passe et ce qui vient ensuite."
            />
          </div>
          <Reveal className="shrink-0">
            <JawabotTrigger origin="parcours_particulier" segment="particulier" size="lg" iconEnd={<ArrowRight className="size-5" aria-hidden />}>
              Étudier mon projet
            </JawabotTrigger>
          </Reveal>
        </div>

        <ol className="relative mt-12 grid gap-4 lg:grid-cols-5 lg:gap-5">
          {/* Ligne de progression (desktop) */}
          <span aria-hidden className="absolute top-7 right-[10%] left-[10%] hidden h-0.5 bg-gradient-to-r from-hdf via-hdf/40 to-energy lg:block" />
          {parcoursParticulier.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80} className="relative h-full">
              <div className="flex h-full gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] lg:flex-col lg:gap-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-4 border-surface bg-hdf text-lg font-bold text-white shadow-[0_6px_16px_-8px_rgb(11_122_59_/_0.9)] lg:mx-auto">
                  {i + 1}
                </span>
                <div className="lg:mt-4 lg:flex-1 lg:rounded-[var(--radius-card)] lg:bg-white lg:p-5 lg:text-center lg:shadow-[var(--shadow-card)]">
                  <h3 className="text-base leading-snug font-bold text-deep">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
