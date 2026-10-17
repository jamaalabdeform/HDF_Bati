import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, fullAddress, mailHref, mapsHref, telHref } from "@/config/company";
import { footerNav } from "@/config/navigation";
import { segmentTone } from "@/config/services";
import { cn } from "../ui/cn";
import { hasAnyTracker } from "@/config/tracking";
import { Logo } from "../brand/Logo";
import { Container } from "../ui/Container";
import { ConsentLink } from "./ConsentLink";

type IconProps = { className?: string };

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.69 4.54-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const socialNetworks = {
  facebook: { label: "Facebook", icon: FacebookIcon, home: "https://www.facebook.com/" },
  instagram: { label: "Instagram", icon: InstagramIcon, home: "https://www.instagram.com/" },
  linkedin: { label: "LinkedIn", icon: LinkedinIcon, home: "https://www.linkedin.com/" },
} as const;

export function Footer() {
  const socials = (Object.keys(socialNetworks) as (keyof typeof socialNetworks)[]).map((k) => ({ key: k, ...socialNetworks[k], data: company.social[k] }));

  return (
    <footer data-section="footer" className="on-deep border-t border-white/15 bg-deep pb-24 text-white sm:pb-0">
      <Container className="grid gap-8 py-12 sm:gap-10 sm:py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr] lg:gap-12">
        <div>
          <Logo variant="full-inverse" height={96} className="h-auto w-[280px] max-w-full" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">
            Pompes à chaleur, rénovation énergétique et optimisation des contrats d’énergie — pour les particuliers, les professionnels et les collectivités.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white/60">HDF Bâti</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1">
            {footerNav.offres.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center gap-2.5 text-sm text-white/85 hover:text-white hover:underline">
                  {"segment" in l && <span aria-hidden className={cn("h-4 w-1 rounded-[1px] ring-1 ring-white/35", segmentTone(l.segment).mark)} />}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white/60">Suivez-nous</p>
          <ul className="mt-4 flex gap-3">
            {socials.map((s) => {
              const Icon = s.icon;
              const live = s.data.status === "confirmed" && s.data.value;
              return (
                <li key={s.key}>
                  <a
                    href={live ? s.data.value! : s.home}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`HDF Bâti sur ${s.label} (nouvel onglet)`}
                    title={s.label}
                    data-track="social"
                    data-track-location={s.key}
                    className="inline-flex size-11 items-center justify-center rounded-md bg-white/10 text-white/85 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

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
                <span className="tabular">{company.phone.display}</span>
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
