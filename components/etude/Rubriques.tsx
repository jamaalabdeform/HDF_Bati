import type { Dossier, Rubrique } from "@/config/dossiers";
import { SHOW_PENDING } from "@/config/validation";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";

const letters = ["A", "B", "C", "D"] as const;

function Block({ r, letter }: { r: Rubrique; letter: string }) {
  const id = `rubrique-${letter.toLowerCase()}`;
  return (
    <section aria-labelledby={id} className="border-t-2 border-deep pt-5">
      <div className="flex items-baseline gap-3">
        <span aria-hidden className="grid size-8 shrink-0 translate-y-1 place-items-center rounded-[3px] border-2 border-hdf text-sm font-bold text-hdf">
          {letter}
        </span>
        <h3 id={id} className="text-xl leading-snug font-bold text-deep sm:text-[1.4rem]">
          {r.title}
        </h3>
      </div>
      <ul className="mt-4 space-y-3 pl-11">
        {r.items.map((it) => (
          <li key={it} className="relative text-[0.98rem] leading-relaxed text-ink">
            <span aria-hidden className="absolute top-[0.55em] -left-6 size-2.5 rounded-[1px] bg-hdf" />
            {it}
          </li>
        ))}
      </ul>
      {SHOW_PENDING && r.precise && r.precise.status !== "confirmed" && <Pending className="mt-4 ml-11" label={r.title} note={r.precise.note} />}
    </section>
  );
}

/** Les quatre rubriques du dossier, de ce que nous étudions à ce que vous recevez. */
export function Rubriques({ d }: { d: Dossier }) {
  const blocks = [d.etudions, d.preparez, d.rappel, d.recevez];
  return (
    <section data-section="rubriques" aria-labelledby="rubriques-title" className="bg-surface py-14 sm:py-20">
      <Container>
        <h2 id="rubriques-title" className="max-w-2xl text-[1.85rem] leading-[1.1] font-bold text-deep sm:text-4xl">
          Votre dossier, avant et après la fiche
        </h2>
        <div className="mt-10 grid gap-x-14 gap-y-12 md:grid-cols-2">
          {blocks.map((r, i) => (
            <Block key={r.title} r={r} letter={letters[i]} />
          ))}
        </div>
      </Container>
    </section>
  );
}
