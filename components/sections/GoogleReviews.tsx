import { ExternalLink, Star } from "lucide-react";
import { anchors } from "@/config/navigation";
import { SHOW_PENDING } from "@/config/validation";
import { getGoogleReviews } from "@/lib/server/google-reviews";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";

const fr = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function Stars({ value, className = "size-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(value) ? "fill-hdf text-hdf" : "fill-line text-line"}`} />
      ))}
    </span>
  );
}

/**
 * Avis Google réels (API Places) : note, nombre d'avis, jusqu'à 5 avis avec auteur.
 * Rien n'est affiché en production tant que la fiche n'est pas reliée.
 */
export async function GoogleReviews() {
  const data = await getGoogleReviews();
  if (!data) {
    if (!SHOW_PENDING) return null;
    return (
      <section aria-label="Avis Google" className="border-t border-line bg-white py-10">
        <Container>
          <Pending label="Avis Google" note="Renseigner GOOGLE_PLACES_API_KEY et GOOGLE_PLACE_ID chez l’hébergeur : la note, le nombre d’avis et 5 avis s’afficheront ici automatiquement (README § Avis Google)." />
        </Container>
      </section>
    );
  }

  return (
    <section id={anchors.avis} data-section="avis" aria-labelledby="avis-title" className="scroll-mt-16 border-t border-line bg-white py-14 sm:py-20">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="avis-title" className="text-[1.85rem] leading-[1.1] font-bold text-deep sm:text-4xl">
              Ce que nos clients en disent
            </h2>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-deep">
              <span className="tabular text-2xl font-bold">{fr(data.rating)}</span>
              <span className="text-muted">/ 5</span>
              <Stars value={data.rating} className="size-5" />
              <span className="text-muted">
                · <span className="tabular">{data.count}</span> avis sur Google
              </span>
              <span className="sr-only">Note moyenne {fr(data.rating)} sur 5, {data.count} avis Google.</span>
            </p>
          </div>
          {data.reviewsUrl && (
            <a
              href={data.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-hdf underline decoration-hdf/40 underline-offset-4 hover:decoration-hdf"
            >
              Voir tous les avis sur Google
              <ExternalLink className="size-4" aria-hidden />
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          )}
        </div>

        {data.reviews.length > 0 && (
          <ul className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {data.reviews.map((r, i) => (
              <li key={`${r.author}-${i}`} className={`flex-col border-t-2 border-deep pt-5 ${i >= 3 ? "hidden md:flex" : "flex"}`}>
                <p className="flex items-center gap-2">
                  <Stars value={r.rating} />
                  <span className="sr-only">{r.rating} sur 5</span>
                </p>
                <blockquote className="mt-3 line-clamp-6 flex-1 text-[0.98rem] leading-relaxed text-ink">{r.text}</blockquote>
                <p className="mt-4 text-sm text-muted">
                  {r.authorUrl ? (
                    <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-deep hover:underline">
                      {r.author}
                    </a>
                  ) : (
                    <span className="font-semibold text-deep">{r.author}</span>
                  )}
                  {r.relativeTime && <> · {r.relativeTime}</>}
                  {r.googleUrl && (
                    <>
                      {" · "}
                      <a href={r.googleUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-deep">
                        sur Google
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 text-xs text-muted">Avis publiés par des clients sur Google, affichés tels quels et mis à jour chaque jour.</p>
      </Container>
    </section>
  );
}
