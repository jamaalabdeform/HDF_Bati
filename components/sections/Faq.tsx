import { Minus, Plus } from "lucide-react";
import { company, telHref } from "@/config/company";
import { faqFor } from "@/config/faq";
import type { Segment } from "@/config/services";
import { anchors } from "@/config/navigation";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

/** FAQ en <details> natif : accessible au clavier, zéro JavaScript. */
export function Faq({ segment }: { segment?: Segment }) {
  return (
    <section id={anchors.faq} data-section="faq" aria-labelledby="faq-title" className="border-t border-line bg-white py-14 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id="faq-title" title="Les questions que l’on nous pose le plus" intro={
            <>
              Une autre question ? Posez-la directement à HDF Bâti au{" "}
              <a href={telHref} data-track="phone" data-track-location="faq" className="tabular font-semibold whitespace-nowrap text-deep underline hover:text-hdf">
                {company.phone.display}
              </a>
              .
            </>
          } />
          <div className="divide-y divide-line border-y-2 border-y-deep bg-white">
            {faqFor(segment).map((item) => (
              <details key={item.q} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold text-deep">
                  {item.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-[3px] border-2 border-hdf/60 text-hdf">
                    <Plus className="size-4 group-open:hidden" aria-hidden />
                    <Minus className="hidden size-4 group-open:block" aria-hidden />
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-5 leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
      </Container>
    </section>
  );
}
