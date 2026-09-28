"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { jawabotCopy } from "@/config/jawabot";
import { cn } from "../ui/cn";
import { useJawabot } from "./JawabotProvider";

/** Bouton flottant (≥ 640 px). Sur mobile, Jawabot est dans la barre d'action basse. */
export function JawabotLauncher() {
  const { open, isOpen, preferredSegment } = useJawabot();
  const [visible, setVisible] = useState(false);

  // Apparition discrète après un premier défilement ou 4 s.
  useEffect(() => {
    const show = () => setVisible(true);
    const t = setTimeout(show, 4000);
    const onScroll = () => window.scrollY > 240 && show();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => open({ origin: "launcher", segment: preferredSegment ?? undefined })}
      className={cn(
        "fixed right-5 bottom-5 z-50 hidden items-center gap-2.5 rounded-full bg-deep py-2 pr-5 pl-2 text-sm font-semibold text-white shadow-[var(--shadow-lift)] ring-1 ring-white/10 transition-[opacity,transform,background-color] duration-500 ease-[var(--ease-out-soft)] hover:bg-[#0a4a38] sm:inline-flex",
        visible && !isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      tabIndex={visible && !isOpen ? 0 : -1}
    >
      <span className="relative grid size-9 place-items-center rounded-full bg-hdf">
        <MessageCircle className="size-[1.1rem]" aria-hidden />
        <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-energy ring-2 ring-deep" aria-hidden />
      </span>
      {jawabotCopy.launcher}
    </button>
  );
}
