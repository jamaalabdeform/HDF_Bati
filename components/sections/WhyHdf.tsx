import { anchors } from "@/config/navigation";
import { positioning } from "@/config/positioning";
import { commitments, proofs } from "@/config/proofs";
import { SHOW_PENDING } from "@/config/validation";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { SectionHeading } from "../ui/SectionHeading";

export function WhyHdf() {
  const confirmedProofs = proofs.filter((p) => p.data.status === "confirmed" && p.data.value);
  const pendingProofs = proofs.filter((p) => p.data.status !== "confirmed");

  return (
    <section id={anchors.pourquoi} data-section="pourquoi" aria-labelledby="pourquoi-title" className="bg-surface py-14 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading id="pourquoi-title" title="Pourquoi HDF Bâti ?" intro="Un rappel rapide, des démarches d’aides faites avec vous, et une étude sérieuse avant toute proposition." />

          <dl className="grid gap-x-10 sm:grid-cols-2">
            {commitments.map((c) => (
              <div key={c.title} className="border-t-2 border-deep py-6">
                <dt className="text-lg leading-snug font-bold text-deep">{c.title}</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        {confirmedProofs.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {confirmedProofs.map((p) => (
              <li key={p.id} className="border-t border-line pt-4">
                <p className="text-sm text-muted">{p.label}</p>
                <p className="mt-1 text-lg font-bold text-deep">{p.data.value}</p>
              </li>
            ))}
          </ul>
        )}

        {SHOW_PENDING && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Pending label="Réactivité — version chiffrée" note={positioning.reactivite.precise.note} />
            <Pending label="Aides — mécanisme précis" note={positioning.aides.precise.note} />
          </div>
        )}

        {SHOW_PENDING && pendingProofs.length > 0 && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Preuves à valider">
            {pendingProofs.map((p) => (
              <Pending key={p.id} label={p.label} note={p.data.note} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
