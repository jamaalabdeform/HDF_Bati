import { Clock, Phone } from "lucide-react";
import { company, telHref } from "@/config/company";
import { anchors } from "@/config/navigation";
import { CallbackForm } from "../forms/CallbackForm";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { SectionHeading } from "../ui/SectionHeading";

export function Callback() {
  return (
    <section id={anchors.rappel} data-section="rappel" aria-labelledby="rappel-title" className="relative overflow-hidden bg-deep py-20 text-white sm:py-24">
      <div aria-hidden className="absolute -top-40 -right-40 size-[28rem] rounded-full bg-hdf/25 blur-3xl" />
      <Container className="relative grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading id="rappel-title" invert eyebrow="Formulaire express" title="Vous préférez être rappelé ?" intro="Laissez vos coordonnées : HDF Bâti vous rappelle au moment qui vous arrange pour parler de votre projet." />
          <ul className="mt-8 space-y-4 text-white/85">
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white/10"><Phone className="size-5 text-energy" aria-hidden /></span>
              <span>
                Ou appelez directement le{" "}
                <a href={telHref} data-track="phone" data-track-location="callback_section" className="inline-flex min-h-11 items-center font-bold whitespace-nowrap text-white underline-offset-4 hover:underline">
                  {company.phone.display}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white/10"><Clock className="size-5 text-energy" aria-hidden /></span>
              <span>Un échange simple, sans engagement.</span>
            </li>
          </ul>
          {company.openingHours.status !== "confirmed" && <Pending className="mt-6" label="Horaires et délai de rappel à annoncer" note={company.responseTime.note} />}
        </div>
        <CallbackForm />
      </Container>
    </section>
  );
}
