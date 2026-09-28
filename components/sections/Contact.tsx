import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company, fullAddress, mailHref, mapsHref, telHref, whatsappHref } from "@/config/company";
import { anchors } from "@/config/navigation";
import { genericWhatsappMessage } from "@/lib/lead";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Contact() {
  const items = [
    { icon: Phone, label: "Téléphone", value: company.phone.display, href: telHref, track: "phone" },
    { icon: Mail, label: "E-mail", value: company.email, href: mailHref },
    { icon: MapPin, label: "Adresse", value: fullAddress, href: mapsHref, external: true },
  ];
  return (
    <section id={anchors.contact} data-section="contact" aria-labelledby="contact-title" className="bg-white py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading id="contact-title" eyebrow="Contact" title={`${company.name}, à ${company.address.city}`} intro={`Entreprise basée dans le ${company.address.department}, HDF Bâti intervient dans les Hauts-de-France et, selon le projet, partout en France.`} />
            <Reveal className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6" delay={80}>
              <p className="font-bold text-deep">Échanger avec HDF Bâti</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">Une question rapide ? Écrivez-nous sur WhatsApp. Pour un projet, décrivez-le d’abord à Jawabot : nous vous répondrons avec tous les éléments en main.</p>
              <a
                href={whatsappHref(genericWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-track-location="contact"
                className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-hdf px-5 font-semibold text-hdf transition hover:bg-hdf hover:text-white"
              >
                <MessageCircle className="size-5" aria-hidden />
                Échanger avec HDF Bâti
              </a>
              {company.whatsapp.number.status !== "confirmed" && <Pending className="mt-4" label="Numéro WhatsApp Business définitif" note={company.whatsapp.number.note} />}
            </Reveal>
          </div>

          <address className="grid gap-4 not-italic">
            {items.map((it, i) => (
              <Reveal key={it.label} delay={i * 80}>
                <a
                  href={it.href}
                  {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(it.track ? { "data-track": it.track, "data-track-location": "contact" } : {})}
                  className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-hdf/10 text-hdf transition-colors group-hover:bg-hdf group-hover:text-white">
                    <it.icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold tracking-[0.12em] text-muted uppercase">{it.label}</span>
                    <span className="mt-0.5 block font-semibold break-words text-deep">{it.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
            {company.address.publicDisplay.status !== "confirmed" && <Pending label="Adresse publique" note={company.address.publicDisplay.note} />}
          </address>
        </div>
      </Container>
    </section>
  );
}
