import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, fullAddress, mailHref, mapsHref, telHref } from "@/config/company";
import { footerNav } from "@/config/navigation";
import { hasAnyTracker } from "@/config/tracking";
import { SHOW_PENDING } from "@/config/validation";
import { Logo } from "../brand/Logo";
import { Container } from "../ui/Container";
import { Pending } from "../ui/Pending";
import { ConsentLink } from "./ConsentLink";

const socialLabels = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn" } as const;

export function Footer() {
  const socials = (Object.keys(socialLabels) as (keyof typeof socialLabels)[]).map((k) => ({ key: k, label: socialLabels[k], data: company.social[k] }));
  const liveSocials = socials.filter((s) => s.data.status === "confirmed" && s.data.value);

  return (
    <footer data-section="footer" className="bg-deep pb-24 text-white sm:pb-0">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr] lg:gap-12">
        <div>
          <Logo variant="full-inverse" height={96} className="h-auto w-[280px] max-w-full" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">
            Pompes à chaleur, rénovation énergétique et optimisation des contrats d’énergie — pour les particuliers, les professionnels et les collectivités.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white/60">HDF Bâti</p>
          <ul className="mt-4 space-y-1">
            {footerNav.offres.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center text-sm text-white/85 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {(liveSocials.length > 0 || SHOW_PENDING) && (
        <div>
          <p className="text-sm font-semibold text-white/60">Suivez-nous</p>
          <ul className="mt-4 space-y-1">
            {liveSocials.map((s) => (
              <li key={s.key}>
                <a href={s.data.value!} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-sm text-white/85 hover:text-white hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
            {SHOW_PENDING &&
              socials
                .filter((s) => s.data.status !== "confirmed")
                .map((s) => (
                  <li key={s.key} className="py-1">
                    <Pending inline label={`Lien ${s.label}`} />
                  </li>
                ))}
          </ul>
        </div>
        )}

        <address className="not-italic">
          <p className="text-sm font-semibold text-white/60">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 text-white/85 hover:text-white">
                <MapPin className="mt-0.5 size-4 shrink-0 text-energy" aria-hidden />
                <span>
                  {company.name}
                  <br />
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}
                </span>
              </a>
            </li>
            <li>
              <a href={telHref} data-track="phone" data-track-location="footer" className="inline-flex min-h-10 items-center gap-2.5 font-semibold text-white hover:underline">
                <Phone className="size-4 shrink-0 text-energy" aria-hidden />
                {company.phone.display}
              </a>
            </li>
            <li>
              <a href={mailHref} className="inline-flex min-h-10 items-center gap-2.5 text-white/85 hover:text-white hover:underline">
                <Mail className="size-4 shrink-0 text-energy" aria-hidden />
                {company.email}
              </a>
            </li>
          </ul>
        </address>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legal.denomination.value} — {company.legal.form.value?.split(" —")[0]} — SIREN {company.legal.siren.value} — {fullAddress}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {footerNav.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            {hasAnyTracker && (
              <li>
                <ConsentLink className="inline-flex min-h-10 items-center hover:text-white hover:underline" />
              </li>
            )}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
