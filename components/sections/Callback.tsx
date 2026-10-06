import { Clock, Phone } from "lucide-react";
import { company, telHref } from "@/config/company";
import type { Segment } from "@/config/services";
import { anchors } from "@/config/navigation";
import { CallbackForm } from "../forms/CallbackForm";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { SectionHeading } from "../ui/SectionHeading";

export function Callback({ segment }: { segment?: Segment }) {
  return (
    <section id={anchors.rappel} data-section="rappel" aria-labelledby="rappel-title" className="on-deep bg-deep py-14 text-white sm:py-20">
      <Container className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading id="rappel-title" invert title="Vous préférez être rappelé ?" intro="Laissez vos coordonnées : HDF Bâti vous rappelle au moment qui vous arrange pour parler de votre projet." />
          <ul className="mt-8 space-y-4 text-white/85">
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-white/10"><Phone className="size-5 text-energy" aria-hidden /></span>
              <span>
                Ou appelez directement le{" "}
                <a href={telHref} data-track="phone" data-track-location="callback_section" className="inline-flex min-h-11 items-center font-bold whitespace-nowrap text-white underline-offset-4 hover:underline">
                  <span className="tabular">{company.phone.display}</span>
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-white/10"><Clock className="size-5 text-energy" aria-hidden /></span>
              <span>Un échange simple, sans engagement.</span>
            </li>
          </ul>
          {company.openingHours.status !== "confirmed" && <Pending className="mt-6" label="Horaires de disponibilité à annoncer" note={company.openingHours.note} />}
        </div>
        <CallbackForm defaultSegment={segment} />
      </Container>
    </section>
  );
}
