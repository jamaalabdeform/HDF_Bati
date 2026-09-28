import { MessageCircle } from "lucide-react";
import { company, fullAddress, mailHref, mapsHref, telHref, whatsappHref } from "@/config/company";
import { anchors } from "@/config/navigation";
import { genericWhatsappMessage } from "@/lib/lead";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";

/** Coordonnées en bandeau : trois entrées côte à côte et WhatsApp pour une question rapide. */
export function Contact() {
  const items = [
    { label: "Téléphone", value: company.phone.display, href: telHref, track: "phone", tabular: true },
    { label: "E-mail", value: company.email, href: mailHref },
    { label: "Adresse", value: fullAddress, href: mapsHref, external: true },
  ];
  return (
    <section id={anchors.contact} data-section="contact" aria-labelledby="contact-title" className="bg-white py-14 sm:py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="contact-title" className="text-[1.85rem] leading-[1.1] font-bold text-deep sm:text-4xl">
              Contacter {company.name}
            </h2>
            <p className="mt-3 max-w-[60ch] text-muted">
              Entreprise basée à {company.address.city}, dans le {company.address.department}. Nous intervenons dans les Hauts-de-France et, selon le projet, partout en France.
            </p>
          </div>
          <a
            href={whatsappHref(genericWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp"
            data-track-location="contact"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-md border-2 border-hdf px-5 font-semibold text-hdf transition-colors hover:bg-hdf hover:text-white sm:self-auto"
          >
            <MessageCircle className="size-5" aria-hidden />
            Échanger avec HDF Bâti
          </a>
        </div>

        <address className="mt-8 not-italic">
          <dl className="grid border-t-2 border-deep md:grid-cols-3">
            {items.map((it) => (
              <div key={it.label} className="border-b border-line py-5 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
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
        </address>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {company.whatsapp.number.status !== "confirmed" && <Pending label="Numéro WhatsApp Business définitif" note={company.whatsapp.number.note} />}
          {company.address.publicDisplay.status !== "confirmed" && <Pending label="Adresse publique" note={company.address.publicDisplay.note} />}
        </div>
      </Container>
    </section>
  );
}
