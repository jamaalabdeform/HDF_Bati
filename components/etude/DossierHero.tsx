import { PhoneCall } from "lucide-react";
import { company, telHref } from "@/config/company";
import { dossiers } from "@/config/dossiers";
import { anchors } from "@/config/navigation";
import { positioning } from "@/config/positioning";
import type { Segment } from "@/config/services";
import { Container } from "../ui/Container";
import { StudySheet } from "./StudySheet";

const promises = [positioning.reactivite, positioning.aides];

/**
 * Premier écran : le champ vert profond porte le titre et la fiche d'étude.
 * Accueil (sans profil) : titre du brief, la fiche commence par le choix du profil.
 * Page profil : titre du dossier, la fiche est déjà ouverte au bon parcours.
 */
export function DossierHero({ segment }: { segment?: Segment }) {
  const d = segment ? dossiers[segment] : null;
  return (
    <section id={anchors.top} data-section="hero" aria-labelledby="hero-title" className="on-deep bg-deep text-white">
      <Container className="grid gap-x-14 gap-y-8 pt-7 pb-12 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_33rem] lg:pt-14 lg:pb-20">
        {/* Colonne de gauche : groupée et collante sur grand écran ; sur mobile, ses deux blocs encadrent la fiche. */}
        <div className="contents lg:sticky lg:top-24 lg:col-start-1 lg:row-start-1 lg:block lg:self-start">
          <div className="order-1 max-w-xl">
            {d ? (
              <h1 id="hero-title" className="text-[2rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[2.6rem] lg:text-[3rem]">
                {d.title}
              </h1>
            ) : (
              <h1 id="hero-title" className="text-[2.45rem] leading-[1.02] font-bold tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem]">
                Votre énergie, <span className="whitespace-nowrap text-energy">mieux maîtrisée.</span>
              </h1>
            )}
            <p className="mt-4 text-[1.05rem] leading-relaxed text-white/85 sm:text-lg">
              {d
                ? d.lead
                : "Pompes à chaleur, photovoltaïque, rénovation énergétique et contrats d’énergie, pour les particuliers, les professionnels et les collectivités. Remplissez la fiche : nous étudions avant de proposer."}
            </p>
          </div>

          <div className="order-3 max-w-xl lg:mt-8">
            <dl className="grid gap-x-8 border-t border-white/20 sm:grid-cols-2">
              {promises.map((p) => (
                <div key={p.title} className="border-b border-white/15 py-4 sm:border-b-0">
                  <dt className="font-bold">{p.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-white/75">{p.heroText}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <a href={`#${anchors.rappel}`} className="inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-energy">
                <PhoneCall className="size-4 text-energy" aria-hidden />
                Vous préférez être rappelé ?
              </a>
              <a href={telHref} data-track="phone" data-track-location="hero" className="tabular inline-flex min-h-11 items-center font-semibold text-white/85 hover:text-white">
                {company.phone.display}
              </a>
            </p>
            <p className="mt-1 text-sm text-white/65">
              {company.name}, entreprise d’{company.address.city} ({company.address.department}).
            </p>
          </div>
        </div>

        <div id={anchors.etude} className="order-2 scroll-mt-20 lg:col-start-2 lg:row-start-1">
          <StudySheet segment={segment} origin={d ? `fiche_${d.slug}` : "fiche_accueil"} />
        </div>
      </Container>
    </section>
  );
}
