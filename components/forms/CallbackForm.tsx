"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { company, telHref } from "@/config/company";
import { newEventId, track } from "@/lib/analytics";
import { readConsent } from "@/lib/consent";
import {
  bestTimeOptions,
  callbackProjectOptions,
  CONSENT_TEXT,
  CONSENT_TEXT_VERSION,
  isValidPostalCode,
  normalizeFrenchPhone,
  submitLead,
} from "@/lib/lead";
import { getAttribution } from "@/lib/utm";
import { segmentOrder, segments, type Segment } from "@/config/services";
import { ConsentField, SelectField, TextField } from "./Field";

type Values = { segment: Segment | ""; name: string; phone: string; postalCode: string; project: string; bestTime: string };
const empty: Values = { segment: "", name: "", phone: "", postalCode: "", project: "", bestTime: "" };

export function CallbackForm({ defaultSegment }: { defaultSegment?: Segment }) {
  const [v, setV] = useState<Values>({ ...empty, segment: defaultSegment ?? "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "consent", string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [leadId, setLeadId] = useState<string>();

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    setErrors((s) => ({ ...s, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (v.name.trim().length < 2) next.name = "Indiquez votre nom.";
    if (!normalizeFrenchPhone(v.phone)) next.phone = "Numéro français à 10 chiffres (ex. : 06 12 34 56 78).";
    if (!isValidPostalCode(v.postalCode)) next.postalCode = "Code postal à 5 chiffres.";
    if (!v.segment) next.segment = "Indiquez si vous êtes un particulier, un professionnel ou une collectivité.";
    else if (!v.project) next.project = "Choisissez un type de projet.";
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
    const res = await submitLead({
      source: "callback_form",
      segment,
      answers: { projet: v.project, code_postal: v.postalCode },
      contact: { name: v.name.trim(), phone: v.phone, postalCode: v.postalCode, bestTime: v.bestTime },
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
      track("submit_callback", { segment, project: v.project, best_time: v.bestTime, lead_id: res.leadId }, eventId);
    } else {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-md bg-white p-7 text-center text-ink" role="status">
        <CheckCircle2 className="mx-auto size-12 text-hdf" aria-hidden />
        <p className="mt-4 text-xl font-bold text-deep">Demande de rappel bien reçue</p>
        <p className="mt-2 text-muted">HDF Bâti vous rappelle au moment indiqué. Merci pour votre confiance.</p>
        {leadId && <p className="mt-3 text-xs text-muted">Référence : <strong className="text-deep">{leadId}</strong></p>}
      </div>
    );
  }

  return (
    <form id="callback-form" noValidate onSubmit={onSubmit} className="relative rounded-md bg-white p-5 shadow-[var(--shadow-sheet)] text-ink sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        {!defaultSegment && (
        <fieldset className="sm:col-span-2" aria-describedby={errors.segment ? "cb-segment-error" : undefined}>
          <legend className="mb-1.5 text-sm font-semibold text-deep">Vous êtes</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {segmentOrder.map((id) => (
              <label
                key={id}
                className="group flex min-h-12 cursor-pointer items-center gap-2 rounded-md border border-deep/20 px-3 text-sm font-semibold text-deep transition-colors hover:border-hdf has-[:checked]:border-hdf has-[:checked]:bg-surface has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy"
              >
                <input
                  type="radio"
                  name="cb-segment"
                  value={id}
                  checked={v.segment === id}
                  onChange={() => {
                    setV((s) => ({ ...s, segment: id, project: "" }));
                    setErrors((s) => ({ ...s, segment: undefined, project: undefined }));
                  }}
                  className="sr-only"
                />
                <span aria-hidden className="grid size-4 shrink-0 place-items-center rounded-full border-2 border-deep/35 group-has-[:checked]:border-hdf">
                  <span className="size-2 rounded-full bg-hdf opacity-0 group-has-[:checked]:opacity-100" />
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
        <TextField label="Nom" autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} className="sm:col-span-2" />
        <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" hint="Par exemple 06 12 34 56 78." value={v.phone} onChange={set("phone")} error={errors.phone} />
        <TextField label="Code postal" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={v.postalCode} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ""); set("postalCode")(e); }} error={errors.postalCode} />
        <SelectField label="Type de projet" placeholder={v.segment ? "Sélectionnez…" : "Choisissez un profil"} disabled={!v.segment} options={v.segment ? callbackProjectOptions[v.segment] : []} value={v.project} onChange={set("project")} error={errors.project} />
        <SelectField label="Meilleur moment pour être rappelé" placeholder="Sélectionnez…" options={bestTimeOptions} value={v.bestTime} onChange={set("bestTime")} error={errors.bestTime} />
      </div>
      {/* Piège anti-robots, invisible pour les humains et les lecteurs d'écran */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site web
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <div className="mt-5">
        <ConsentField checked={consent} onChange={(c) => { setConsent(c); setErrors((s) => ({ ...s, consent: undefined })); }} error={errors.consent} text={CONSENT_TEXT} />
      </div>
      {status === "error" && (
        <p className="mt-4 rounded-md bg-[#fdecea] p-3 text-sm text-[#8b1d12]" role="alert">
          L’envoi n’a pas abouti. Réessayez ou appelez-nous au{" "}
          <a href={telHref} data-track="phone" data-track-location="callback_error" className="font-semibold underline">{company.phone.display}</a>.
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-action px-7 text-base font-semibold text-ink transition hover:bg-action-hover disabled:opacity-70">
        {status === "sending" && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {status === "sending" ? "Envoi en cours…" : "Demander un rappel"}
      </button>
    </form>
  );
}
