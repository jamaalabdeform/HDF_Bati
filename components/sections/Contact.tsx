import { MessageCircle } from "lucide-react";
import { company, fullAddress, mailHref, mapsHref, telHref, whatsappHref } from "@/config/company";
import { anchors } from "@/config/navigation";
import { genericWhatsappMessage } from "@/lib/lead";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { SectionHeading } from "../ui/SectionHeading";

export function Contact() {
  const items = [
    { label: "Téléphone", value: company.phone.display, href: telHref, track: "phone", tabular: true },
    { label: "E-mail", value: company.email, href: mailHref },
    { label: "Adresse", value: fullAddress, href: mapsHref, external: true },
  ];
  return (
    <section id={anchors.contact} data-section="contact" aria-labelledby="contact-title" className="bg-white py-14 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading id="contact-title" title={`Contacter ${company.name}`} intro={`Entreprise basée à ${company.address.city}, dans le ${company.address.department}. Nous intervenons dans les Hauts-de-France et, selon le projet, partout en France.`} />
          <div className="mt-8 max-w-[60ch] border-t border-line pt-6">
            <p className="font-bold text-deep">Une question rapide ?</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">Écrivez-nous sur WhatsApp. Pour un projet, décrivez-le d’abord à notre assistant en ligne : nous vous répondrons avec tous les éléments en main.</p>
            <a
              href={whatsappHref(genericWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp"
              data-track-location="contact"
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-hdf px-5 font-semibold text-hdf transition-colors hover:bg-hdf hover:text-white"
            >
              <MessageCircle className="size-5" aria-hidden />
              Échanger avec HDF Bâti
            </a>
            {company.whatsapp.number.status !== "confirmed" && <Pending className="mt-4" label="Numéro WhatsApp Business définitif" note={company.whatsapp.number.note} />}
          </div>
        </div>

        <address className="not-italic lg:pt-2">
          <dl className="divide-y divide-line border-y border-line">
            {items.map((it) => (
              <div key={it.label} className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:items-baseline">
                <dt className="text-sm text-muted">{it.label}</dt>
                <dd>
                  <a
                    href={it.href}
                    {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    {...(it.track ? { "data-track": it.track, "data-track-location": "contact" } : {})}
                    className={`inline-flex min-h-11 items-center text-lg font-semibold break-words text-deep hover:text-hdf hover:underline ${it.tabular ? "tabular" : ""}`}
                  >
                    {it.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          {company.address.publicDisplay.status !== "confirmed" && <Pending className="mt-4" label="Adresse publique" note={company.address.publicDisplay.note} />}
        </address>
      </Container>
    </section>
  );
}
