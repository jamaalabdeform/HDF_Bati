import { ClipboardCheck, MapPin, Scale, UserRound } from "lucide-react";
import { anchors } from "@/config/navigation";
import { commitments, proofs } from "@/config/proofs";
import { SHOW_PENDING } from "@/config/validation";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const icons = { "user-round": UserRound, "clipboard-check": ClipboardCheck, "map-pin": MapPin, scale: Scale } as const;

export function WhyHdf() {
  const confirmedProofs = proofs.filter((p) => p.data.status === "confirmed" && p.data.value);
  const pendingProofs = proofs.filter((p) => p.data.status !== "confirmed");

  return (
    <section id={anchors.pourquoi} data-section="pourquoi" aria-labelledby="pourquoi-title" className="bg-surface py-20 sm:py-24">
      <Container>
        <SectionHeading id="pourquoi-title" eyebrow="Pourquoi HDF Bâti ?" title="Une entreprise qui prend le temps de bien faire" align="center" intro="Notre façon de travailler tient en quelques principes simples, appliqués à chaque demande." />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((c, i) => {
            const Icon = icons[c.icon];
            return (
              <Reveal key={c.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-0.5">
                  <span className="grid size-12 place-items-center rounded-2xl bg-hdf/10 text-hdf">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg leading-snug font-bold text-deep">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {confirmedProofs.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {confirmedProofs.map((p) => (
              <li key={p.id} className="rounded-2xl bg-white p-5 text-center shadow-[var(--shadow-card)]">
                <p className="text-sm text-muted">{p.label}</p>
                <p className="mt-1 text-lg font-bold text-deep">{p.data.value}</p>
              </li>
            ))}
          </ul>
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
