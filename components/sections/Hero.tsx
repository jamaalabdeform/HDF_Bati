import { ArrowRight, MapPin, PhoneCall } from "lucide-react";
import { company } from "@/config/company";
import { media } from "@/config/media";
import { anchors } from "@/config/navigation";
import { SignatureCurve } from "../brand/SignatureCurve";
import { JawabotTrigger } from "../jawabot/JawabotTrigger";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { MediaImage } from "../ui/MediaImage";
import { SegmentChooser } from "./SegmentChooser";

export function Hero() {
  return (
    <section id={anchors.top} data-section="hero" aria-labelledby="hero-title" className="relative overflow-hidden bg-surface">
      {/* Motif signature, très discret */}
      <SignatureCurve className="absolute -right-24 -bottom-10 hidden h-64 w-[46rem] text-energy/35 lg:block" strokeWidth={2} />

      <Container className="relative grid items-center gap-10 pt-6 pb-14 sm:pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-14 lg:pb-20">
        <div className="max-w-xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold tracking-[0.18em] text-hdf uppercase">
            <span>{company.brandUpper}</span>
            <span aria-hidden className="h-3 w-px bg-hdf/30" />
            <span className="inline-flex items-center gap-1 font-semibold tracking-[0.08em] text-muted normal-case">
              <MapPin className="size-3.5" aria-hidden />
              {company.address.city}, {company.address.region}
            </span>
          </p>

          <h1 id="hero-title" className="mt-4 text-[2.3rem] leading-[1.04] font-bold tracking-[-0.03em] text-deep sm:text-5xl lg:text-[3.6rem]">
            Votre énergie, <span className="relative whitespace-nowrap text-hdf">mieux maîtrisée.</span>
          </h1>

          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/85 sm:mt-5 sm:text-xl">
            Pompes à chaleur, rénovation énergétique et optimisation de vos contrats d’énergie.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            Pour les particuliers, les professionnels et les collectivités — avec un interlocuteur qui étudie votre situation avant de vous proposer une solution.
          </p>

          <SegmentChooser />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <JawabotTrigger origin="hero_primary" usePreferred size="lg" iconEnd={<ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden />}>
              Étudier mon projet
            </JawabotTrigger>
            <ButtonLink href={`/#${anchors.rappel}`} variant="outline" size="lg" icon={<PhoneCall className="size-[1.1rem]" aria-hidden />}>
              Être rappelé
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <MediaImage
            asset={media.hero}
            priority
            quality={60}
            sizes="(min-width: 1024px) 34rem, (min-width: 640px) 28rem, 100vw"
            className="aspect-[4/3] rounded-[1.75rem] shadow-[var(--shadow-lift)] sm:aspect-[4/5] lg:aspect-[5/6]"
          />
          {/* Carte flottante : ce que fait HDF Bâti */}
          <div className="absolute -bottom-5 left-3 right-3 rounded-2xl bg-white/95 p-4 shadow-[var(--shadow-lift)] ring-1 ring-deep/5 backdrop-blur sm:left-auto sm:-left-6 sm:right-auto sm:w-72 lg:-left-10">
            <p className="text-[0.7rem] font-bold tracking-[0.14em] text-muted uppercase">HDF Bâti vous accompagne</p>
            <ul className="mt-2 space-y-1.5 text-sm font-semibold text-deep">
              <li className="flex items-center gap-2"><span aria-hidden className="size-2 rounded-full bg-hdf" />Pompe à chaleur & rénovation</li>
              <li className="flex items-center gap-2"><span aria-hidden className="size-2 rounded-full bg-navy" />Bâtiments professionnels</li>
              <li className="flex items-center gap-2"><span aria-hidden className="size-2 rounded-full bg-action" />Contrats d’énergie</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
