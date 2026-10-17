import type { Dossier as DossierData, Rubrique } from "@/config/dossiers";
import { segments, segmentTone, type toneClasses, type SegmentTone } from "@/config/services";
import { cn } from "../ui/cn";
import { SHOW_PENDING } from "@/config/validation";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";

const letters = ["A", "B", "C", "D"] as const;

function Block({ r, letter, t }: { r: Rubrique; letter: string; t: (typeof toneClasses)[SegmentTone] }) {
  const id = `rubrique-${letter.toLowerCase()}`;
  return (
    <section aria-labelledby={id} className="border-t border-line pt-5">
      <div className="flex items-baseline gap-3">
        <span aria-hidden className={cn("grid size-8 shrink-0 translate-y-1 place-items-center rounded-[3px] border-2 text-sm font-bold", t.rule, t.text)}>
          {letter}
        </span>
        <h3 id={id} className="text-xl leading-snug font-bold text-deep">
          {r.title}
        </h3>
      </div>
      <ul className="mt-4 space-y-3 pl-11">
        {r.items.map((it) => (
          <li key={it} className="relative text-[0.98rem] leading-relaxed text-ink">
            <span aria-hidden className={cn("absolute top-[0.55em] -left-6 size-2.5 rounded-[1px]", t.mark)} />
            {it}
          </li>
        ))}
      </ul>
      {SHOW_PENDING && r.precise && r.precise.status !== "confirmed" && <Pending className="mt-4 ml-11" label={r.title} note={r.precise.note} />}
    </section>
  );
}

/**
 * Le dossier d'étude du profil, présenté comme une seconde feuille :
 * le sommaire (les 5 étapes) en marge, les rubriques A → D dans le corps.
 */
export function Dossier({ d }: { d: DossierData }) {
  const blocks = [d.etudions, d.preparez, d.rappel, d.recevez];
  const t = segmentTone(d.segment);
  return (
    <section data-section="dossier" aria-labelledby="dossier-title" className="bg-surface py-14 sm:py-20">
      <Container>
        <div className="rounded-md border border-line bg-white">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-5 py-4 sm:px-8">
            <span className={cn("rounded-[3px] px-2.5 py-1 text-xs font-bold", t.chip)}>{segments[d.segment].label}s</span>
            <p className="text-sm font-bold text-deep">Votre projet, étape par étape</p>
          </div>
          <div className="grid gap-x-12 gap-y-10 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <nav aria-labelledby="sommaire-title" className="lg:sticky lg:top-24 lg:self-start">
              <h2 id="sommaire-title" className="text-sm font-bold text-deep">
                {d.sommaireTitle}
              </h2>
              <ol className={cn("mt-3 border-t-2", t.rule)}>
                {d.sommaire.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[4.25rem_1fr] gap-x-2 border-b border-line py-3">
                    <span className={cn("text-sm font-semibold", t.text)}>Étape {i + 1}</span>
                    <span className="text-[0.95rem] leading-snug font-semibold text-deep">{s.title}</span>
                  </li>
                ))}
              </ol>
            </nav>
            <div>
              <h2 id="dossier-title" className="max-w-2xl text-[1.75rem] leading-[1.15] font-bold text-deep sm:text-3xl">
                Avant et après votre fiche
              </h2>
              <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
                {blocks.map((r, i) => (
                  <Block key={r.title} r={r} letter={letters[i]} t={t} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
