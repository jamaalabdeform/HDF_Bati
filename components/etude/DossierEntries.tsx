import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dossierHref } from "@/config/dossiers";
import { anchors } from "@/config/navigation";
import { commitments } from "@/config/proofs";
import { projectCards, segments, segmentTone } from "@/config/services";
import { cn } from "../ui/cn";
import { Container } from "../ui/Container";

/** Accueil : trois fiches, une par profil, chacune menant à sa page. */
export function DossierEntries() {
  return (
    <section id={anchors.projets} data-section="projets" aria-labelledby="projets-title" className="bg-white py-14 sm:py-20">
      <Container>
        <h2 id="projets-title" className="max-w-2xl text-[1.85rem] leading-[1.1] font-bold text-deep sm:text-4xl">
          Trois dossiers, trois façons d’étudier
        </h2>
        <ul className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-3">
          {projectCards.map((c) => {
            const s = segments[c.segment];
            const t = segmentTone(c.segment);
            return (
              <li key={c.id} id={c.anchor} className="flex scroll-mt-24 flex-col">
                <span className={cn("w-fit rounded-t-md px-4 py-2 text-sm font-semibold", t.chip)}>{s.label}s</span>
                <div className={cn("flex flex-1 flex-col border-t-2 pt-5", t.rule)}>
                  <h3 className="text-xl leading-snug font-bold text-deep">{c.title}</h3>
                  <p className="mt-2 hidden text-[0.95rem] leading-relaxed text-muted sm:block">{c.text}</p>
                  <ul className="mt-4 hidden flex-1 border-t border-line sm:block">
                    {c.points.map((p) => (
                      <li key={p} className="border-b border-dotted border-deep/30 py-2.5 text-[0.95rem] font-semibold text-deep">
                        {p}
                      </li>
                    ))}
                  </ul>
                  {/* Lien secondaire : la fiche du premier écran reste la seule action orange de l'accueil. */}
                  <Link href={dossierHref(c.segment)} className={cn("group mt-5 inline-flex min-h-11 w-fit items-center gap-2 font-semibold underline underline-offset-4", t.link)}>
                    Voir le dossier {s.label.toLowerCase()}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        {/* La même méthode pour les trois dossiers (les deux premiers engagements sont déjà au premier écran). */}
        <dl className="mt-12 grid gap-x-10 border-t-2 border-deep sm:grid-cols-2">
          {commitments.slice(2).map((c) => (
            <div key={c.title} className="border-b border-line py-5 sm:border-b-0">
              <dt className="font-bold text-deep">{c.title}</dt>
              <dd className="mt-1.5 max-w-[60ch] text-[0.95rem] leading-relaxed text-muted">{c.text}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
