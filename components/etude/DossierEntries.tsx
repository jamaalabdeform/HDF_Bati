import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dossierHref } from "@/config/dossiers";
import { anchors } from "@/config/navigation";
import { projectCards, segments } from "@/config/services";
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
            return (
              <li key={c.id} id={c.anchor} className="flex scroll-mt-24 flex-col">
                <span className="w-fit rounded-t-md bg-deep px-4 py-2 text-sm font-semibold text-white">{s.label}s</span>
                <div className="flex flex-1 flex-col border-t-2 border-deep pt-5">
                  <h3 className="text-xl leading-snug font-bold text-deep">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
                  <ul className="mt-4 flex-1 border-t border-line">
                    {c.points.map((p) => (
                      <li key={p} className="border-b border-dotted border-deep/30 py-2.5 text-[0.95rem] font-semibold text-deep">
                        {p}
                      </li>
                    ))}
                  </ul>
                  {/* Lien secondaire : la fiche du premier écran reste la seule action orange de l'accueil. */}
                  <Link href={dossierHref(c.segment)} className="group mt-5 inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-hdf underline decoration-hdf/40 underline-offset-4 hover:decoration-hdf">
                    Voir le dossier {s.label.toLowerCase()}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
