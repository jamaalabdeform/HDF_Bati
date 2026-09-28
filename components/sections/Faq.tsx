import { Plus } from "lucide-react";
import { faq } from "@/config/faq";
import { anchors } from "@/config/navigation";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

/** FAQ en <details> natif : accessible au clavier, zéro JavaScript. */
export function Faq() {
  return (
    <section id={anchors.faq} data-section="faq" aria-labelledby="faq-title" className="bg-white py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id="faq-title" eyebrow="Questions fréquentes" title="Les réponses aux questions que l’on nous pose le plus" intro="Une autre question ? Posez-la directement à HDF Bâti : nous vous répondons simplement." />
        <Reveal>
          <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
            {faq.map((item) => (
              <details key={item.q} className="group px-5 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold text-deep">
                  {item.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-hdf transition-transform duration-300 group-open:rotate-45">
                    <Plus className="size-4" aria-hidden />
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
