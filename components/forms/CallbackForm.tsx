"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { company, telHref } from "@/config/company";
import { newEventId, track } from "@/lib/analytics";
import { readConsent } from "@/lib/consent";
import { bestTimeOptions, CONSENT_TEXT, CONSENT_TEXT_VERSION, normalizeFrenchPhone, submitLead } from "@/lib/lead";
import { getAttribution } from "@/lib/utm";
import { segmentOrder, segments, type Segment } from "@/config/services";
import { cn } from "../ui/cn";
import { ConsentField, SelectField, TextField } from "./Field";

type Values = { segment: Segment | ""; name: string; phone: string; bestTime: string };

/** Réponses déjà données dans la fiche d'étude (sessionStorage, réponses au projet seulement). */
function readFiche(defaultSegment?: Segment): { segment: Segment; answers: Record<string, string> } | null {
  try {
    const keys = defaultSegment ? [`hdf-fiche:${defaultSegment}`] : ["hdf-fiche:accueil", ...segmentOrder.map((s) => `hdf-fiche:${s}`)];
    for (const k of keys) {
      const raw = sessionStorage.getItem(k);
      if (!raw) continue;
      const saved = JSON.parse(raw) as { segment: Segment | null; answers: Record<string, string> };
      if (saved.segment && saved.segment in segments && (!defaultSegment || saved.segment === defaultSegment)) return { segment: saved.segment, answers: saved.answers ?? {} };
    }
  } catch {
    /* stockage indisponible */
  }
  return null;
}

/**
 * « Vous préférez être rappelé ? » : version courte (profil, nom, téléphone, moment, accord).
 * Si la fiche d'étude a déjà été commencée, ses réponses sont jointes à la demande.
 */
export function CallbackForm({ defaultSegment }: { defaultSegment?: Segment }) {
  const [v, setV] = useState<Values>({ segment: defaultSegment ?? "", name: "", phone: "", bestTime: "" });
  const [ficheData, setFiche] = useState<{ segment: Segment; answers: Record<string, string> } | null>(null);
  // Les réponses de la fiche ne sont jointes que si elles concernent le même profil.
  const fiche = ficheData && (!v.segment || ficheData.segment === v.segment) ? ficheData.answers : null;
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "consent", string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [leadId, setLeadId] = useState<string>();

  // La fiche peut être remplie sur la même page juste avant : on relit ses réponses
  // quand le formulaire arrive à l'écran ou reçoit le focus (sessionStorage, après hydratation).
  const formRef = useRef<HTMLFormElement>(null);
  const refreshFromFiche = useCallback(() => {
    const f = readFiche(defaultSegment);
    if (!f) return;
    setFiche(f);
    setV((s) => (s.segment ? s : { ...s, segment: f.segment }));
  }, [defaultSegment]);
  useEffect(() => {
    const el = formRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && refreshFromFiche());
    io.observe(el);
    return () => io.disconnect();
  }, [refreshFromFiche]);

  const segmentKnown = Boolean(defaultSegment) || Boolean(fiche && v.segment);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    setErrors((s) => ({ ...s, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!v.segment) next.segment = "Indiquez qui vous êtes.";
    if (v.name.trim().length < 2) next.name = "Indiquez votre nom.";
    if (!normalizeFrenchPhone(v.phone)) next.phone = "Numéro français à 10 chiffres (ex. : 06 12 34 56 78).";
    if (!v.bestTime) next.bestTime = "Choisissez un moment.";
    if (!consent) next.consent = "Votre accord est nécessaire pour être rappelé.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById("callback-form")?.querySelector<HTMLElement>(next.segment ? "input[name=cb-segment]" : "[aria-invalid=true]")?.focus();
      return;
    }
    setStatus("sending");
    const segment = v.segment as Segment;
    const eventId = newEventId("callback");
    const answers = { ...(fiche ?? {}) };
    const res = await submitLead({
      source: "callback_form",
      segment,
      answers,
      contact: { name: v.name.trim(), phone: v.phone, postalCode: answers.code_postal, bestTime: v.bestTime },
      consent: { accepted: true, text: CONSENT_TEXT, version: CONSENT_TEXT_VERSION, at: new Date().toISOString() },
      attribution: getAttribution(),
      page: window.location.href,
      eventId,
      consentMarketing: readConsent()?.marketing === true,
      website,
    });
    if (res.ok) {
      setStatus("done");
      setLeadId(res.leadId);
      track("submit_callback", { segment, best_time: v.bestTime, lead_id: res.leadId }, eventId);
    } else {
      setStatus("error");
    }
  };

  if (status === "done") {
    const best = bestTimeOptions.find((o) => o.value === v.bestTime)?.label;
    return (
      <div className="rounded-md bg-white text-ink shadow-[var(--shadow-sheet)]" role="status">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 pt-4 pb-3 sm:px-7">
          <p className="text-sm font-bold text-deep">Demande de rappel</p>
          <span className="stamp-press inline-flex shrink-0 items-center rounded-[3px] border-2 border-hdf bg-hdf px-2 py-0.5 text-[0.7rem] font-bold tracking-[0.06em] text-white uppercase">Transmise</span>
        </div>
        <div className="px-5 py-5 sm:px-7">
          <p className="text-lg font-bold text-deep">Merci, HDF Bâti vous rappelle.</p>
          {best && (
            <p className="mt-2 text-sm text-deep">
              Moment choisi : <strong>{best.toLowerCase()}</strong>.
            </p>
          )}
          {leadId && (
            <p className="mt-1 text-sm text-muted">
              Référence : <strong className="tabular text-deep">{leadId}</strong>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} id="callback-form" noValidate onSubmit={onSubmit} onFocusCapture={refreshFromFiche} className="relative rounded-md bg-white p-5 text-ink shadow-[var(--shadow-sheet)] sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        {segmentKnown ? (
          <p className="text-sm text-muted sm:col-span-2">
            Demande <strong className="font-semibold text-deep">{v.segment && segments[v.segment].label.toLowerCase()}</strong>
            {fiche && Object.keys(fiche).length > 0 && " : les réponses déjà données dans votre fiche sont jointes."}
          </p>
        ) : (
          <fieldset className="sm:col-span-2" aria-describedby={errors.segment ? "cb-segment-error" : undefined}>
            <legend className="mb-1.5 text-sm font-semibold text-deep">Vous êtes</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {segmentOrder.map((id) => (
                <label
                  key={id}
                  className={cn(
                    "group flex min-h-12 cursor-pointer items-center gap-2.5 rounded-md border px-3 text-sm font-semibold text-deep transition-colors hover:border-hdf has-[:checked]:border-hdf has-[:checked]:bg-surface has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy",
                    errors.segment ? "border-[#b42318]" : "border-deep/20",
                  )}
                >
                  <input
                    type="radio"
                    name="cb-segment"
                    value={id}
                    checked={v.segment === id}
                    onChange={() => {
                      setV((s) => ({ ...s, segment: id }));
                      setErrors((s) => ({ ...s, segment: undefined }));
                    }}
                    className="sr-only"
                  />
                  <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-[3px] border-2 border-deep/35 group-has-[:checked]:border-hdf">
                    <span className="size-2.5 rounded-[1px] bg-hdf opacity-0 group-has-[:checked]:opacity-100" />
                  </span>
                  {segments[id].chooserLabel}
                </label>
              ))}
            </div>
            {errors.segment && (
              <p id="cb-segment-error" className="mt-1.5 text-xs font-semibold text-[#b42318]" role="alert">
                {errors.segment}
              </p>
            )}
          </fieldset>
        )}
        <TextField label="Nom" autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} />
        <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" hint="Par exemple 06 12 34 56 78." value={v.phone} onChange={set("phone")} error={errors.phone} />
        <SelectField label="Meilleur moment pour être rappelé" placeholder="Sélectionnez…" options={bestTimeOptions} value={v.bestTime} onChange={set("bestTime")} error={errors.bestTime} className="sm:col-span-2" />
      </div>
      {/* Piège anti-robots, invisible pour les humains et les lecteurs d'écran */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site web
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <div className="mt-5">
        <ConsentField
          checked={consent}
          onChange={(c) => {
            setConsent(c);
            setErrors((s) => ({ ...s, consent: undefined }));
          }}
          error={errors.consent}
          text={CONSENT_TEXT}
        />
      </div>
      {status === "error" && (
        <p className="mt-4 rounded-md bg-[#fdecea] p-3 text-sm text-[#8b1d12]" role="alert">
          L’envoi n’a pas abouti. Réessayez ou appelez-nous au{" "}
          <a href={telHref} data-track="phone" data-track-location="callback_error" className="font-semibold underline">
            {company.phone.display}
          </a>
          .
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-action px-7 text-base font-semibold text-ink transition hover:bg-action-hover disabled:opacity-70">
        {status === "sending" && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {status === "sending" ? "Envoi en cours…" : "Demander un rappel"}
      </button>
    </form>
  );
}
