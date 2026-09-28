import { ArrowRight, Check } from "lucide-react";
import { anchors } from "@/config/navigation";
import { projectCards } from "@/config/services";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { Badge } from "../ui/Badge";
import { Container } from "../ui/Container";
import { MediaImage } from "../ui/MediaImage";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { cn } from "../ui/cn";

const accent = { green: "bg-hdf", navy: "bg-navy", orange: "bg-action" } as const;
const checkTone = { green: "text-hdf", navy: "text-navy", orange: "text-[#b35b0c]" } as const;

export function ProjectCards() {
  return (
    <section id={anchors.projets} data-section="votre_projet" aria-labelledby="projets-title" className="bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="projets-title"
          eyebrow="Votre projet"
          title="Une même exigence, trois façons de vous accompagner"
          intro="Choisissez votre situation : chaque demande suit un parcours adapté, avec les bonnes questions dès le départ."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectCards.map((card, i) => (
            <Reveal key={card.id} as="article" delay={i * 90} className="h-full">
              <div id={card.anchor} className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <div className="relative">
                  <MediaImage asset={card.image} sizes="(min-width: 1024px) 24rem, (min-width: 768px) 50vw, 100vw" className="aspect-[16/9] sm:aspect-[16/10]" imgClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
                  <Badge tone={card.tone === "orange" ? "orange" : card.tone} className="absolute bottom-3 left-3 shadow-sm">
                    {card.badge}
                  </Badge>
                </div>
                <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                  <span aria-hidden className={cn("absolute top-0 left-6 h-1 w-12 -translate-y-1/2 rounded-full", accent[card.tone])} />
                  <p className="text-xs font-bold tracking-[0.14em] text-muted uppercase">{card.eyebrow}</p>
                  <h3 className="mt-2 text-xl leading-snug font-bold text-deep sm:text-[1.35rem]">{card.title}</h3>
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
                      className={cn("w-full", card.tone === "navy" && "bg-navy hover:bg-[#052c4b]", card.tone === "orange" && "bg-deep hover:bg-[#0a4a38]")}
                      iconEnd={<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
                    >
                      {card.cta}
                    </JawabotTrigger>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
