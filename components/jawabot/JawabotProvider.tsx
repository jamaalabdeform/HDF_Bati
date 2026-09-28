"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Answers } from "@/config/jawabot";
import { segments, type Segment } from "@/config/services";
import { track } from "@/lib/analytics";
import { initialState, reducer, type JawabotAction, type JawabotState } from "@/lib/jawabot/engine";

/** Le panneau n'est chargé qu'à la première ouverture (JS initial minimal). */
const JawabotPanel = dynamic(() => import("./JawabotPanel").then((m) => m.JawabotPanel), { ssr: false });

export interface OpenOptions {
  segment?: Segment;
  preset?: Answers;
  /** Emplacement du CTA (analytics). */
  origin: string;
}

interface Ctx {
  isOpen: boolean;
  open: (opts: OpenOptions) => void;
  close: () => void;
  state: JawabotState;
  dispatch: React.Dispatch<JawabotAction>;
  /** Segment choisi par le visiteur (hero, carte, URL ?profil=). */
  preferredSegment: Segment | null;
  setPreferredSegment: (s: Segment, origin: string) => void;
}

const JawabotContext = createContext<Ctx | null>(null);

export function JawabotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [preferredSegment, setPreferred] = useState<Segment | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Campagnes : ?profil=particulier|professionnel|collectivite
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("profil");
    // Paramètre d'URL lu après hydratation (la page reste statique).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p && p in segments) setPreferred(p as Segment);
  }, []);

  const setPreferredSegment = useCallback((s: Segment, origin: string) => {
    setPreferred(s);
    track("select_segment", { segment: s, origin });
  }, []);

  const open = useCallback((opts: OpenOptions) => {
    opener.current = document.activeElement as HTMLElement | null;
    const s = stateRef.current;
    const isNew = !s.started || (opts.segment && opts.segment !== s.segment) || s.status === "done";
    if (isNew) {
      if (s.status === "done" && !opts.segment) dispatch({ type: "restart" });
      else dispatch({ type: "start", segment: opts.segment, preset: opts.preset });
      track("start_jawabot", { origin: opts.origin, segment: opts.segment });
    }
    setMounted(true);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => opener.current?.focus?.());
  }, []);

  const value = useMemo<Ctx>(
    () => ({ isOpen, open, close, state, dispatch, preferredSegment, setPreferredSegment }),
    [isOpen, open, close, state, preferredSegment, setPreferredSegment],
  );

  return (
    <JawabotContext.Provider value={value}>
      {children}
      {mounted && <JawabotPanel />}
    </JawabotContext.Provider>
  );
}

export function useJawabot(): Ctx {
  const ctx = useContext(JawabotContext);
  if (!ctx) throw new Error("useJawabot doit être utilisé dans <JawabotProvider>");
  return ctx;
}
