import { ArrowRight, PhoneCall } from "lucide-react";
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
      <SignatureCurve className="absolute -right-24 -bottom-10 hidden h-64 w-[46rem] text-energy/35 lg:block" strokeWidth={2} />

      <Container className="relative grid items-center gap-10 pt-8 pb-14 sm:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-16 lg:pb-20">
        <div className="max-w-xl">
          <h1 id="hero-title" className="text-[2.45rem] leading-[1.02] font-bold tracking-[-0.035em] text-deep sm:text-5xl lg:text-[3.75rem]">
            Votre énergie, <span className="whitespace-nowrap text-hdf">mieux maîtrisée.</span>
          </h1>

          <p className="mt-5 text-[1.05rem] leading-relaxed text-ink sm:text-xl">
            Pompes à chaleur, rénovation énergétique et optimisation de vos contrats d’énergie.
          </p>
          <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-muted sm:text-base">
            {company.name} est une entreprise d’{company.address.city} ({company.address.department}). Particuliers, professionnels et collectivités : nous étudions votre situation avant de vous proposer une solution.
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
            className="hero-unveil aspect-[4/3] rounded-[1.75rem] sm:aspect-[4/5] lg:aspect-[5/6]"
          />
          {/* Ce que fait HDF Bâti — posé sur la photo */}
          <div className="absolute -bottom-5 left-3 right-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-float)] sm:right-auto sm:-left-6 sm:w-72 lg:-left-10">
            <p className="text-sm font-semibold text-deep">HDF Bâti vous accompagne pour</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink">
              <li className="flex items-center gap-2.5"><span aria-hidden className="size-2 rounded-full bg-hdf" />la pompe à chaleur et la rénovation</li>
              <li className="flex items-center gap-2.5"><span aria-hidden className="size-2 rounded-full bg-navy" />les bâtiments professionnels</li>
              <li className="flex items-center gap-2.5"><span aria-hidden className="size-2 rounded-full bg-action" />les contrats d’énergie</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
