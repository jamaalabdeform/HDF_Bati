"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { company, telHref } from "@/config/company";
import { mainNav } from "@/config/navigation";
import { Logo } from "../brand/Logo";
import { buttonClasses } from "../ui/Button";
import { cn } from "../ui/cn";
import { ctaForPath } from "./ctaForPath";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const cta = ctaForPath(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      data-section="header"
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-colors duration-300",
        scrolled || menuOpen ? "border-line bg-white" : "bg-white",
      )}
    >
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[76rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="-my-1 shrink-0 rounded-lg py-1" aria-label="HDF BÂTI — accueil">
          <Logo variant="compact" height={44} priority className="h-10 w-[114px] max-w-none sm:h-11 sm:w-[126px]" />
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="rounded-md px-2.5 py-2 text-[0.92rem] font-medium whitespace-nowrap text-deep/85 transition-colors hover:bg-deep/5 hover:text-deep aria-[current=page]:text-hdf aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8 xl:px-3">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <a
            href={telHref}
            data-track="phone"
            data-track-location="header"
            className="hidden min-h-11 items-center gap-2 rounded-md px-3 text-[0.92rem] font-semibold whitespace-nowrap text-deep transition-colors hover:text-hdf md:inline-flex lg:hidden xl:inline-flex"
          >
            <Phone className="size-4 text-hdf" aria-hidden />
            <span className="tabular">{company.phone.display}</span>
          </a>
          <div className="hidden sm:block">
            <a href={cta.href} className={buttonClasses({ size: "sm" })}>
              <span>{cta.label}</span>
            </a>
          </div>
          <a
            href={telHref}
            data-track="phone"
            data-track-location="header_mobile"
            aria-label={`Appeler HDF Bâti au ${company.phone.display}`}
            className="grid size-11 shrink-0 place-items-center rounded-md bg-hdf text-white md:hidden lg:grid xl:hidden"
          >
            <Phone className="size-[1.1rem]" aria-hidden />
          </a>
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-md text-deep ring-1 ring-deep/15 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <nav id="menu-mobile" aria-label="Navigation mobile" hidden={!menuOpen} className="border-t border-line bg-white lg:hidden">
        <ul className="mx-auto grid max-w-[76rem] gap-1 px-4 py-3 sm:px-6">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-md px-3 text-base font-semibold text-deep hover:bg-surface">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
