"use client";

import { Building2, ChevronRight, Home, Landmark } from "lucide-react";
import { segmentOrder, segments, type Segment } from "@/config/services";
import { useJawabot } from "../jawabot/JawabotProvider";
import { cn } from "../ui/cn";

const icons: Record<Segment, typeof Home> = { particulier: Home, professionnel: Building2, collectivite: Landmark };
const toneRing: Record<Segment, string> = {
  particulier: "group-hover:border-hdf data-[active=true]:border-hdf",
  professionnel: "group-hover:border-navy data-[active=true]:border-navy",
  collectivite: "group-hover:border-action data-[active=true]:border-action",
};
const toneIcon: Record<Segment, string> = {
  particulier: "bg-hdf/10 text-hdf",
  professionnel: "bg-navy/10 text-navy",
  collectivite: "bg-action/15 text-[#8a4309]",
};

/** Choix immédiat du profil : ouvre Jawabot directement sur le bon parcours. */
export function SegmentChooser() {
  const { open, preferredSegment, setPreferredSegment } = useJawabot();
  return (
    <fieldset className="mt-7">
      <legend className="mb-3 text-sm font-semibold text-deep">Vous êtes :</legend>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {segmentOrder.map((id) => {
          const s = segments[id];
          const Icon = icons[id];
          return (
            <button
              key={id}
              type="button"
              aria-haspopup="dialog"
              data-active={preferredSegment === id}
              onClick={() => {
                setPreferredSegment(id, "hero_chooser");
                open({ segment: id, origin: "hero_chooser" });
              }}
              className={cn(
                "group relative flex min-h-[5.5rem] flex-col items-start justify-between gap-2 rounded-2xl border-2 border-deep/10 bg-white p-3 text-left shadow-[var(--shadow-card)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:p-4",
                toneRing[id],
              )}
            >
              <span className="flex flex-col gap-2.5">
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", toneIcon[id])}>
                  <Icon className="size-[1.15rem]" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.82rem] leading-tight font-bold text-deep sm:text-[0.95rem]">{s.chooserLabel}</span>
                  <span className="mt-0.5 hidden text-xs text-muted sm:block">{s.chooserHint}</span>
                </span>
              </span>
              <ChevronRight className="absolute top-3 right-2.5 size-4 text-deep/35 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
