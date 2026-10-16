import { company } from "@/config/company";
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
  // Les avis Google sont gérés par la section GoogleReviews dès que la fiche est reliée.
  const reviewsLinked = company.googleBusiness.url.status === "confirmed" || Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID);
  const pendingProofs = proofs.filter((p) => p.data.status !== "confirmed" && !(reviewsLinked && p.id === "avis"));
  if (confirmedProofs.length === 0 && !SHOW_PENDING) return null;

  return (
    <section id={anchors.pourquoi} data-section="pourquoi" aria-labelledby="pourquoi-title" className="bg-surface py-14 sm:py-20">
      <Container>
        <SectionHeading id="pourquoi-title" title="Pourquoi HDF Bâti ?" />

        {confirmedProofs.length > 0 && (
          <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {confirmedProofs.map((p) => (
              <li key={p.id} className="border-t-2 border-deep pt-5">
                <h3 className="text-lg font-bold text-deep">{p.label}</h3>
                <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-relaxed text-muted">{p.data.value}</p>
                {p.items && (
                  <ul className="mt-3 space-y-2.5">
                    {p.items.map((it) => (
                      <li key={it} className="relative max-w-[60ch] pl-5 text-[0.95rem] leading-relaxed text-ink">
                        <span aria-hidden className="absolute top-[0.55em] left-0 size-2 rounded-[1px] bg-hdf" />
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
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
