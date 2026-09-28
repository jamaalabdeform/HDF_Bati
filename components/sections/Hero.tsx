import { FileCheck2, PhoneCall, PhoneIncoming } from "lucide-react";
import { company } from "@/config/company";
import { media } from "@/config/media";
import { anchors } from "@/config/navigation";
import { positioning } from "@/config/positioning";
import { segments } from "@/config/services";
import { SignatureCurve } from "../brand/SignatureCurve";
import { Badge } from "../ui/Badge";
import { Container } from "../ui/Container";
import { MediaImage } from "../ui/MediaImage";
import { SegmentChooser } from "./SegmentChooser";

const promises = [
  { icon: PhoneIncoming, ...positioning.reactivite },
  { icon: FileCheck2, ...positioning.aides },
];

/** Trois visuels, un par profil : le premier écran parle aux trois publics à égalité. */
const mosaic = [
  { asset: media.hero, badge: segments.particulier.badge, tone: segments.particulier.tone, priority: true },
  { asset: media.professionnels, badge: segments.professionnel.badge, tone: segments.professionnel.tone, priority: false },
  { asset: media.energie, badge: segments.collectivite.badge, tone: segments.collectivite.tone, priority: false },
];

export function Hero() {
  return (
    <section id={anchors.top} data-section="hero" aria-labelledby="hero-title" className="relative overflow-hidden bg-surface">
      <SignatureCurve className="absolute -right-24 -bottom-10 hidden h-64 w-[46rem] text-energy/35 lg:block" strokeWidth={2} />

      <Container className="relative grid items-center gap-8 pt-8 pb-10 sm:pt-12 sm:pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pt-14 lg:pb-20">
        <div className="max-w-xl">
          <h1 id="hero-title" className="text-[2.45rem] leading-[1.02] font-bold tracking-[-0.035em] text-deep sm:text-5xl lg:text-[3.6rem]">
            Votre énergie, <span className="whitespace-nowrap text-hdf">mieux maîtrisée.</span>
          </h1>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-ink sm:text-xl">
            Pompes à chaleur, photovoltaïque, rénovation énergétique et contrats d’énergie, pour les particuliers, les professionnels et les collectivités.
          </p>
          <p className="mt-2 text-[0.95rem] text-muted">
            {company.name}, entreprise d’{company.address.city} ({company.address.department}).
          </p>

          <dl className="mt-6 grid gap-x-6 border-t-2 border-deep sm:grid-cols-2">
            {promises.map((p) => (
              <div key={p.title} className="flex gap-3 border-b border-line py-4 sm:border-b-0">
                <p.icon className="mt-0.5 size-6 shrink-0 text-hdf" aria-hidden />
                <div>
                  <dt className="font-bold text-deep sm:text-[1.05rem]">{p.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{p.heroText}</dd>
                </div>
              </div>
            ))}
          </dl>

          <SegmentChooser />

          <a
            href={`/#${anchors.rappel}`}
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-deep underline decoration-deep/30 hover:text-hdf hover:decoration-hdf"
          >
            <PhoneCall className="size-[1.1rem] text-hdf" aria-hidden />
            Vous préférez être rappelé ?
          </a>
        </div>

        <div className="hero-unveil grid grid-cols-3 gap-2 sm:grid-cols-2 sm:grid-rows-2 sm:gap-3">
          {mosaic.map((m, i) => (
            <div key={m.badge} className={i === 0 ? "relative flex flex-col sm:row-span-2" : "relative flex flex-col"}>
              <MediaImage
                asset={m.asset}
                priority={m.priority}
                quality={60}
                sizes={i === 0 ? "(min-width: 1024px) 17rem, (min-width: 640px) 45vw, 33vw" : "(min-width: 1024px) 17rem, (min-width: 640px) 45vw, 33vw"}
                className={i === 0 ? "aspect-[3/4] h-full rounded-2xl sm:aspect-auto sm:rounded-[1.5rem]" : "aspect-[3/4] h-full rounded-2xl sm:aspect-[4/3] sm:rounded-[1.5rem]"}
              />
              <span className="absolute bottom-3 left-3 hidden sm:block">
                <Badge tone={m.tone}>{m.badge}</Badge>
              </span>
              {/* Mobile : vignettes trop étroites pour un badge, le profil passe en légende. */}
              <p className="mt-1.5 text-center text-xs font-semibold text-deep sm:hidden">{m.badge}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
