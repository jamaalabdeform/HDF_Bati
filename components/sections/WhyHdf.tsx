import { anchors } from "@/config/navigation";
import { proofs } from "@/config/proofs";
import { SHOW_PENDING } from "@/config/validation";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Preuves vérifiables (avis, qualifications, chantiers…). Rien n'est rendu en production
 * tant qu'aucune preuve n'est confirmée ; en préproduction, la liste de ce qui manque.
 */
export function WhyHdf() {
  const confirmedProofs = proofs.filter((p) => p.data.status === "confirmed" && p.data.value);
  const pendingProofs = proofs.filter((p) => p.data.status !== "confirmed");
  if (confirmedProofs.length === 0 && !SHOW_PENDING) return null;

  return (
    <section id={anchors.pourquoi} data-section="pourquoi" aria-labelledby="pourquoi-title" className="bg-surface py-14 sm:py-20">
      <Container>
        <SectionHeading id="pourquoi-title" title="Pourquoi HDF Bâti ?" />

        {confirmedProofs.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {confirmedProofs.map((p) => (
              <li key={p.id} className="border-t-2 border-deep pt-4">
                <p className="text-sm text-muted">{p.label}</p>
                <p className="mt-1 text-lg font-bold text-deep">{p.data.value}</p>
              </li>
            ))}
          </ul>
        )}


        {SHOW_PENDING && pendingProofs.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Preuves à valider">
            {pendingProofs.map((p) => (
              <Pending key={p.id} label={p.label} note={p.data.note} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
