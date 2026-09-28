import { FileCheck2, PhoneCall, PhoneIncoming } from "lucide-react";
import { company } from "@/config/company";
import { media } from "@/config/media";
import { anchors } from "@/config/navigation";
import { positioning } from "@/config/positioning";
import { SignatureCurve } from "../brand/SignatureCurve";
import { Container } from "../ui/Container";
import { MediaImage } from "../ui/MediaImage";
import { SegmentChooser } from "./SegmentChooser";

export function Hero() {
  return (
    <section id={anchors.top} data-section="hero" aria-labelledby="hero-title" className="relative overflow-hidden bg-surface">
      <SignatureCurve className="absolute -right-24 -bottom-10 hidden h-64 w-[46rem] text-energy/35 lg:block" strokeWidth={2} />

      <Container className="relative grid items-center gap-10 pt-8 pb-10 sm:pt-12 sm:pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-16 lg:pb-20">
        <div className="max-w-xl">
          <h1 id="hero-title" className="text-[2.45rem] leading-[1.02] font-bold tracking-[-0.035em] text-deep sm:text-5xl lg:text-[3.75rem]">
            Votre énergie, <span className="whitespace-nowrap text-hdf">mieux maîtrisée.</span>
          </h1>

          <p className="mt-5 text-[1.05rem] leading-relaxed text-ink sm:text-xl">
            Pompes à chaleur, rénovation énergétique et optimisation de vos contrats d’énergie.
          </p>
          <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-muted sm:text-base">
            {company.name}, entreprise d’{company.address.city} ({company.address.department}), accompagne les particuliers, les professionnels et les collectivités.
          </p>
          <ul className="mt-5 grid gap-2.5 text-[0.95rem] font-semibold text-deep sm:text-base">
            <li className="flex items-start gap-3">
              <PhoneIncoming className="mt-0.5 size-5 shrink-0 text-hdf" aria-hidden />
              {positioning.reactivite.short}
            </li>
            <li className="flex items-start gap-3">
              <FileCheck2 className="mt-0.5 size-5 shrink-0 text-hdf" aria-hidden />
              {positioning.aides.short}
            </li>
          </ul>

          <SegmentChooser />

          <a
            href={`/#${anchors.rappel}`}
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-deep underline decoration-deep/30 hover:text-hdf hover:decoration-hdf"
          >
            <PhoneCall className="size-[1.1rem] text-hdf" aria-hidden />
            Vous préférez être rappelé ?
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <MediaImage
            asset={media.hero}
            priority
            quality={60}
            sizes="(min-width: 1024px) 34rem, (min-width: 640px) 28rem, 100vw"
            className="hero-unveil aspect-[16/10] rounded-[1.75rem] sm:aspect-[4/5] lg:aspect-[5/6]"
          />
          {/* Ce que fait HDF Bâti — posé sur la photo */}
          <div className="absolute -bottom-5 -left-6 hidden w-72 rounded-2xl bg-white p-4 shadow-[var(--shadow-float)] sm:block lg:-left-10">
            <p className="text-sm font-semibold text-deep">Pompe à chaleur, photovoltaïque, rénovation</p>
            <p className="mt-1 text-sm text-muted">et contrats d’énergie pour les professionnels et les collectivités.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
