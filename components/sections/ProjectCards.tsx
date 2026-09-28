import { ArrowRight, Check } from "lucide-react";
import { anchors } from "@/config/navigation";
import { projectCards, segments } from "@/config/services";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { cn } from "../ui/cn";

const rule = { green: "bg-hdf", navy: "bg-navy", deep: "bg-deep" } as const;
const ink = { green: "text-hdf", navy: "text-navy", deep: "text-deep" } as const;

export function ProjectCards() {
  return (
    <section id={anchors.projets} data-section="votre_projet" aria-labelledby="projets-title" className="bg-white py-14 sm:py-24">
      <Container>
        <SectionHeading
          id="projets-title"
          title="Particulier, professionnel ou collectivité : votre parcours"
          intro="Choisissez votre profil : chaque demande suit un parcours adapté, avec les bonnes questions dès le départ."
        />

        <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectCards.map((card) => (
            <article
              key={card.id}
              id={card.anchor}
              className="group flex scroll-mt-28 flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-colors duration-200 hover:border-deep/30"
            >
              <span aria-hidden className={cn("h-1.5", rule[card.tone])} />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className={cn("text-2xl font-bold", ink[card.tone])}>{segments[card.segment].label}s</h3>
                <p className="mt-2 text-lg leading-snug font-semibold text-deep">{card.title}</p>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{card.text}</p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm font-medium text-ink">
                      <Check className={cn("mt-0.5 size-4 shrink-0", ink[card.tone])} aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <JawabotTrigger
                    origin={`card_${card.id}`}
                    segment={card.segment}
                    preset={card.presetNeed ? { besoin: card.presetNeed } : undefined}
                    className="w-full"
                    iconEnd={<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
                  >
                    {card.cta}
                  </JawabotTrigger>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
