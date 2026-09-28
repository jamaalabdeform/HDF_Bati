import { ArrowRight, Check } from "lucide-react";
import { anchors } from "@/config/navigation";
import { projectCards } from "@/config/services";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Badge } from "../ui/Badge";
import { Container } from "../ui/Container";
import { MediaImage } from "../ui/MediaImage";
import { SectionHeading } from "../ui/SectionHeading";
import { cn } from "../ui/cn";

const rule = { green: "bg-hdf", navy: "bg-navy", orange: "bg-action" } as const;
const checkTone = { green: "text-hdf", navy: "text-navy", orange: "text-[#b35b0c]" } as const;
const cta = { green: "", navy: "bg-navy hover:bg-[#052c4b]", orange: "bg-deep hover:bg-[#0a4a38]" } as const;

export function ProjectCards() {
  return (
    <section id={anchors.projets} data-section="votre_projet" aria-labelledby="projets-title" className="bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="projets-title"
          title="Votre projet, votre parcours"
          intro="Choisissez votre situation : chaque demande suit un parcours adapté, avec les bonnes questions dès le départ."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectCards.map((card) => (
            <article
              key={card.id}
              id={card.anchor}
              className="group flex scroll-mt-28 flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-colors duration-200 hover:border-deep/30"
            >
              <div className="relative">
                <MediaImage asset={card.image} sizes="(min-width: 1024px) 24rem, (min-width: 768px) 50vw, 100vw" className="aspect-[16/9] sm:aspect-[16/10]" />
                <Badge tone={card.tone === "orange" ? "orange" : card.tone} className="absolute bottom-3 left-3">
                  {card.badge}
                </Badge>
              </div>
              <span aria-hidden className={cn("h-1", rule[card.tone])} />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-xl leading-snug font-bold text-deep sm:text-[1.35rem]">{card.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">{card.text}</p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm font-medium text-ink">
                      <Check className={cn("mt-0.5 size-4 shrink-0", checkTone[card.tone])} aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <JawabotTrigger
                    origin={`card_${card.id}`}
                    segment={card.segment}
                    preset={card.presetNeed ? { besoin: card.presetNeed } : undefined}
                    variant={card.tone === "green" ? "primary" : "secondary"}
                    className={cn("w-full", cta[card.tone])}
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
