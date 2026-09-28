import { Container } from "../ui/Container";

type Steps = readonly { title: string; text: string }[];

function StepList({ steps, id, title }: { steps: Steps; id: string; title: string }) {
  return (
    <div>
      <h2 id={id} className="text-[1.6rem] leading-tight font-bold text-deep sm:text-3xl">
        {title}
      </h2>
      <ol className="mt-6 border-t-2 border-deep">
        {steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-4 sm:grid-cols-[3rem_1fr]">
            <span className="tabular text-2xl leading-none font-bold text-hdf sm:text-[1.75rem]">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-lg leading-snug font-bold text-deep">{s.title}</h3>
              <p className="mt-1 max-w-[60ch] text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Sommaire du dossier : les étapes, lues comme la table des matières de l'étude. */
export function Sommaire({ steps, title, intro }: { steps: Steps; title: string; intro?: string }) {
  return (
    <section data-section="sommaire" aria-labelledby="sommaire-title" className="bg-white py-14 sm:py-20">
      <Container width="text">
        {intro && <p className="mb-3 text-sm font-semibold text-hdf">{intro}</p>}
        <StepList steps={steps} id="sommaire-title" title={title} />
      </Container>
    </section>
  );
}

/** Accueil : les deux méthodes côte à côte (particulier / professionnels et collectivités). */
export function DoubleSommaire({ a, b }: { a: { title: string; steps: Steps; id: string }; b: { title: string; steps: Steps; id: string } }) {
  return (
    <section data-section="sommaires" aria-label="Comment se déroule l’étude" className="bg-surface py-14 sm:py-20">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div id={a.id} className="scroll-mt-24">
          <StepList steps={a.steps} id={`${a.id}-title`} title={a.title} />
        </div>
        <div id={b.id} className="scroll-mt-24">
          <StepList steps={b.steps} id={`${b.id}-title`} title={b.title} />
        </div>
      </Container>
    </section>
  );
}
