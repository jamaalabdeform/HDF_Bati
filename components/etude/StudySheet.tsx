"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MessageCircle, Phone } from "lucide-react";
import { answerLabel, jawabotCopy, segmentChoices, type ChoiceOption, type Step, type TextStep } from "@/config/jawabot";
import { company, telHref, whatsappHref } from "@/config/company";
import { dossierHref } from "@/config/dossiers";
import { segmentOrder, segments, type Segment } from "@/config/services";
import { positioning } from "@/config/positioning";
import { newEventId, track } from "@/lib/analytics";
import { readConsent } from "@/lib/consent";
import { httpBackend } from "@/lib/jawabot/adapter";
import { currentStep, initialState, reducer, visibleSteps, type JawabotContact } from "@/lib/jawabot/engine";
import {
  bestTimeOptions,
  CONSENT_TEXT,
  CONSENT_TEXT_VERSION,
  isValidEmail,
  isValidPostalCode,
  normalizeFrenchPhone,
  whatsappMessageForLead,
} from "@/lib/lead";
import { getAttribution } from "@/lib/utm";
import { ConsentField, SelectField, TextField } from "../forms/Field";
import { cn } from "../ui/cn";

/**
 * Fiche d'étude : le formulaire par étapes de HDF Bâti.
 * Chaque rubrique se remplit sous les yeux du visiteur ; les questions viennent
 * de config/jawabot.ts et la logique du moteur pur lib/jawabot/engine.ts.
 */

interface Row {
  id: string;
  label: string;
  step?: Step;
}

/** Accueil, avant le choix du profil : longueur du parcours le plus court (profil compris). */
const hubTotal = 1 + Math.min(...segmentOrder.map((s) => visibleSteps(s, {}).length));

/** 0612345678 / +33612345678 → 06 12 34 56 78 (affichage du récapitulatif). */
function formatPhone(raw: string): string {
  const n = normalizeFrenchPhone(raw);
  if (!n) return raw;
  return ("0" + n.slice(3)).replace(/(\d{2})(?=\d)/g, "$1 ");
}

const segmentLabel = (s: Segment) => segmentChoices.find((c) => c.value === s)?.label ?? segments[s].label;

export function StudySheet({ segment: fixed, origin }: { segment?: Segment; origin: string }) {
  const [state, dispatch] = useReducer(reducer, fixed ? { ...initialState, started: true, segment: fixed } : initialState);
  const sheetRef = useRef<HTMLDivElement>(null);
  // Le consentement survit à un aller-retour « Modifier » (les coordonnées sont gardées dans l'état du moteur).
  const [consent, setConsent] = useState(false);
  const interacted = useRef(false);
  const startedTracking = useRef(false);

  // Accueil : un lien de campagne peut préremplir le profil (?profil=particulier…).
  useEffect(() => {
    if (fixed) return;
    const p = new URLSearchParams(window.location.search).get("profil");
    if (p && p in segments) dispatch({ type: "segment", segment: p as Segment });
  }, [fixed]);

  const steps = visibleSteps(state.segment, state.answers);
  const rows: Row[] = [...(fixed ? [] : [{ id: "segment", label: "Votre demande" }]), ...steps.map((s) => ({ id: s.id, label: s.summaryLabel, step: s }))];
  const step = currentStep(state);
  const done = state.status === "done";
  const activeId = done ? null : !state.segment ? "segment" : step?.id ?? null;
  const activeIndex = rows.findIndex((r) => r.id === activeId);
  const filledCount = done ? rows.length : Math.max(activeIndex, 0);
  const counted = state.segment !== null;
  const total = counted ? rows.length : hubTotal;

  // Après chaque réponse : la rubrique suivante prend le focus et reste à l'écran.
  useEffect(() => {
    if (!interacted.current) return;
    const node = sheetRef.current;
    if (!node) return;
    const target = node.querySelector<HTMLElement>(done ? "[data-sheet-done]" : "[data-active-rubric]");
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = target.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) target.scrollIntoView({ block: r.height > window.innerHeight * 0.8 ? "start" : "nearest", behavior: reduced ? "auto" : "smooth" });
    const focusable = done ? target : target.querySelector<HTMLElement>("[data-autofocus]");
    if (state.status !== "error") focusable?.focus({ preventScroll: true });
  }, [activeId, done, state.status]);

  const markStart = () => {
    interacted.current = true;
    if (!startedTracking.current) {
      startedTracking.current = true;
      track("start_jawabot", { origin, segment: state.segment ?? undefined });
    }
  };

  const pickSegment = (s: Segment) => {
    markStart();
    dispatch({ type: "segment", segment: s });
    track("select_segment", { segment: s, origin });
  };

  const answer = (s: Step, value: string) => {
    markStart();
    dispatch({ type: "answer", stepId: s.id, value });
    track("jawabot_step", { segment: state.segment ?? undefined, step_id: s.id, step_index: filledCount + 1, answer: s.type === "choice" ? value : undefined });
  };

  const rewind = (id: string) => {
    interacted.current = true;
    dispatch({ type: "rewind", stepId: id });
  };

  const submit = async (contact: JawabotContact) => {
    if (!state.segment) return;
    dispatch({ type: "contact", contact });
    dispatch({ type: "submitting" });
    const eventId = newEventId("lead");
    const result = await httpBackend.submit({
      source: "jawabot",
      segment: state.segment,
      answers: state.answers,
      contact: {
        name: contact.name,
        phone: contact.phone,
        email: contact.email || undefined,
        role: contact.role || undefined,
        postalCode: state.answers.code_postal,
        bestTime: contact.bestTime || undefined,
      },
      consent: { accepted: true, text: CONSENT_TEXT, version: CONSENT_TEXT_VERSION, at: new Date().toISOString() },
      attribution: getAttribution(),
      page: window.location.href,
      eventId,
      consentMarketing: readConsent()?.marketing === true,
    });
    if (result.ok) {
      dispatch({ type: "done", leadId: result.leadId });
      track("qualified_lead", { segment: state.segment, lead_id: result.leadId, lead_temperature: result.temperature, source: "jawabot" }, eventId);
      if (state.answers.contact_preference === "rdv") track("appointment_request", { segment: state.segment, lead_id: result.leadId, source: "jawabot" });
    } else {
      dispatch({ type: "error" });
    }
  };

  const restart = () => {
    interacted.current = true;
    startedTracking.current = false;
    dispatch({ type: "restart" });
    if (fixed) dispatch({ type: "segment", segment: fixed });
  };

  const valueOf = (row: Row): { text: string; note?: string } => {
    if (row.id === "segment") return { text: state.segment ? segmentLabel(state.segment) : "" };
    const s = row.step!;
    if (s.type === "contact") return { text: [state.contact.name, formatPhone(state.contact.phone)].filter(Boolean).join(" · ") };
    const v = state.answers[s.id];
    const note = s.type === "choice" ? s.options.find((o) => o.value === v)?.reply : undefined;
    return { text: v ? answerLabel(s, v) : "Non renseigné", note };
  };

  return (
    <div ref={sheetRef}>
      {fixed && (
        <nav aria-label="Changer de fiche" className="flex gap-1">
          {segmentOrder.map((id) => {
            const current = id === fixed;
            return (
              <Link
                key={id}
                href={`${dossierHref(id)}#etude`}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 flex-1 items-center justify-center rounded-t-md px-2 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors sm:flex-none sm:px-4 sm:text-sm",
                  current ? "bg-white text-deep" : "bg-white/10 text-white hover:bg-white/20",
                )}
              >
                {segments[id].label}s
              </Link>
            );
          })}
        </nav>
      )}

      <div className={cn("bg-white text-ink shadow-[var(--shadow-sheet)]", fixed ? "rounded-md rounded-tl-none sm:rounded-tl-none" : "rounded-md")}>
        {/* En-tête de la fiche */}
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 pt-4 pb-3 sm:px-6">
          <div>
            <p className="text-sm font-bold text-deep">Fiche d’étude</p>
            <p className="text-xs text-muted">
              {company.name} · {state.segment ? `${segments[state.segment].label}` : "Nouvelle demande"}
            </p>
          </div>
          <span
            key={done ? "sent" : "open"}
            className={cn(
              "stamp mt-0.5 inline-flex shrink-0 items-center rounded-[3px] border-2 px-2 py-0.5 text-[0.7rem] font-bold tracking-[0.06em] uppercase",
              done ? "stamp-press border-hdf bg-hdf text-white" : "border-hdf/70 text-hdf",
            )}
          >
            {done ? "Transmise" : "À compléter"}
          </span>
        </div>

        <div className="px-4 pt-4 sm:px-6">
          <h2 className="text-xl font-bold text-deep sm:text-[1.4rem]">
            Étudions votre projet
            {!done && (
              <span className="tabular font-semibold text-muted">
                {" "}
                · {Math.min(filledCount + 1, total)}/{total}
              </span>
            )}
          </h2>
          <p className="sr-only" aria-live="polite">
            {done ? "Fiche transmise." : `Question ${Math.min(filledCount + 1, total)} sur ${total}.`}
          </p>
          <ol aria-hidden className="mt-3 flex gap-1">
            {(counted ? rows : Array.from({ length: hubTotal }, (_, i) => ({ id: `g${i}` }))).map((r, i) => (
              <li
                key={r.id}
                className={cn(
                  "h-1.5 flex-1 rounded-[1px] transition-colors duration-300",
                  i < filledCount ? "bg-hdf" : i === filledCount && !done ? "bg-energy" : "bg-line",
                )}
              />
            ))}
          </ol>
        </div>

        {/* Rubriques */}
        <ol className="mt-2 px-4 sm:px-6">
          {rows.map((row, i) => {
            const n = String(i + 1).padStart(2, "0");
            const isActive = row.id === activeId;
            const isFilled = done || i < activeIndex;
            if (isActive)
              return (
                <li key={row.id} data-active-rubric className="rubric-in relative grid scroll-mt-24 grid-cols-[1.75rem_1fr] gap-x-2 border-t border-line py-4 first:border-t-0 sm:gap-x-3">
                  <span aria-hidden className="absolute top-4 bottom-4 -left-4 w-1 bg-energy sm:-left-6" />
                  <span className="tabular pt-1 text-sm font-bold text-hdf">{n}</span>
                  <ActiveRubric
                    row={row}
                    fixed={!!fixed}
                    state={state}
                    onSegment={pickSegment}
                    onAnswer={answer}
                    onSubmit={submit}
                    onDraft={(c) => dispatch({ type: "contact", contact: c })}
                    consent={consent}
                    onConsent={setConsent}
                  />
                </li>
              );
            if (isFilled) {
              const v = valueOf(row);
              return (
                <li key={row.id} className="grid grid-cols-[1.75rem_1fr] gap-x-2 border-t border-line py-1.5 first:border-t-0 sm:gap-x-3">
                  <span className="tabular pt-2.5 text-sm font-semibold text-hdf sm:pt-3">{n}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 py-1.5 sm:flex sm:items-baseline sm:gap-2 sm:py-2">
                        <span className="block text-xs text-muted sm:shrink-0 sm:text-sm">{row.label}</span>
                        <span aria-hidden className="hidden min-w-3 flex-1 -translate-y-1 border-b border-dotted border-deep/35 sm:block" />
                        <span className={cn("block text-[0.95rem] leading-snug font-semibold sm:text-right", v.text === "Non renseigné" ? "text-muted" : "text-deep")}>{v.text}</span>
                      </p>
                      {!done && (
                        <button
                          type="button"
                          onClick={() => rewind(row.id)}
                          disabled={state.status === "submitting"}
                          className="-mr-2 inline-flex min-h-11 shrink-0 items-center px-2 text-xs font-semibold text-hdf underline underline-offset-2 hover:text-deep disabled:opacity-50"
                        >
                          Modifier<span className="sr-only"> : {row.label}</span>
                        </button>
                      )}
                    </div>
                    {v.note && !done && <p className="pb-2 text-sm leading-snug text-navy">{v.note}</p>}
                  </div>
                </li>
              );
            }
            return (
              <li key={row.id} className="grid grid-cols-[1.75rem_1fr] gap-x-2 border-t border-line py-3 first:border-t-0 sm:gap-x-3">
                <span className="tabular text-sm text-muted">{n}</span>
                <p className="flex items-baseline gap-2">
                  <span className="text-sm text-muted">{row.label}</span>
                  <span aria-hidden className="flex-1 -translate-y-1 border-b border-dotted border-deep/25" />
                </p>
              </li>
            );
          })}
          {!counted &&
            Array.from({ length: hubTotal - 1 }, (_, i) => (
              <li key={`blank${i}`} aria-hidden className="grid grid-cols-[1.75rem_1fr] gap-x-2 border-t border-line py-3 sm:gap-x-3">
                <span className="tabular text-sm text-muted">{String(i + 2).padStart(2, "0")}</span>
                <span className="mt-3 border-b border-dotted border-deep/25" />
              </li>
            ))}
        </ol>

        {done ? (
          <div data-sheet-done tabIndex={-1} role="status" className="border-t-2 border-hdf px-4 py-5 outline-none sm:px-6">
            {/* Le tampon est reposé ici : sur mobile, l'en-tête de la fiche est alors hors écran. */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-bold text-deep">{jawabotCopy.successTitle}</p>
              <span className="stamp-press mt-0.5 inline-flex shrink-0 items-center rounded-[3px] border-2 border-hdf bg-hdf px-2 py-0.5 text-[0.7rem] font-bold tracking-[0.06em] text-white uppercase sm:hidden">Transmise</span>
            </div>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">
              {jawabotCopy.successText}
            </p>
            {state.answers.contact_preference === "rappel" && state.contact.bestTime && (
              <p className="mt-2 text-sm text-deep">
                Rappel souhaité : <strong>{bestTimeOptions.find((o) => o.value === state.contact.bestTime)?.label.toLowerCase()}</strong>.
              </p>
            )}
            {state.leadId && (
              <p className="mt-2 text-sm text-muted">
                Référence : <strong className="tabular text-deep">{state.leadId}</strong>
              </p>
            )}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href={whatsappHref(whatsappMessageForLead(state.leadId, state.segment ?? "particulier"))}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-track-location="fiche_transmise"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-hdf px-4 text-sm font-semibold text-white transition-colors hover:bg-hdf-dark"
              >
                <MessageCircle className="size-4" aria-hidden />
                Échanger avec HDF Bâti
              </a>
              <a
                href={telHref}
                data-track="phone"
                data-track-location="fiche_transmise"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-deep/25 px-4 text-sm font-semibold text-deep transition-colors hover:border-hdf hover:text-hdf"
              >
                <Phone className="size-4" aria-hidden />
                <span className="tabular">{company.phone.display}</span>
              </a>
            </div>
            <button type="button" onClick={restart} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-muted underline underline-offset-2 hover:text-deep">
              Remplir une nouvelle fiche
            </button>
          </div>
        ) : (
          <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-muted sm:px-6"><span className="block max-w-[64ch]">{jawabotCopy.disclaimer}</span></p>
        )}
      </div>
    </div>
  );
}

function ActiveRubric({
  row,
  fixed,
  state,
  onSegment,
  onAnswer,
  onSubmit,
  onDraft,
  consent,
  onConsent,
}: {
  row: Row;
  fixed: boolean;
  state: ReturnType<typeof reducer>;
  onSegment: (s: Segment) => void;
  onAnswer: (s: Step, v: string) => void;
  onSubmit: (c: JawabotContact) => void;
  onDraft: (c: JawabotContact) => void;
  consent: boolean;
  onConsent: (v: boolean) => void;
}) {
  const qid = `q-${row.id}`;
  if (row.id === "segment")
    return (
      <div>
        <h3 id={qid} className="text-lg leading-snug font-bold text-deep">
          {jawabotCopy.segmentQuestion}
        </h3>
        <Choices labelledBy={qid} options={segmentChoices} onPick={(v) => onSegment(v as Segment)} />
        {!fixed && <p className="mt-2 text-xs text-muted">Vous pourrez modifier chaque réponse avant l’envoi.</p>}
      </div>
    );
  const s = row.step!;
  return (
    <div className="min-w-0">
      <h3 id={qid} className="text-lg leading-snug font-bold text-deep">
        {s.question}
      </h3>
      {s.help && <p className="mt-1 text-sm text-muted">{s.help}</p>}
      {s.type === "choice" && <Choices labelledBy={qid} options={s.options} onPick={(v) => onAnswer(s, v)} />}
      {s.type === "text" && <LineInput key={s.id} step={s} labelledBy={qid} onSubmit={(v) => onAnswer(s, v)} />}
      {s.type === "postal" && <LineInput key={s.id} postal labelledBy={qid} onSubmit={(v) => onAnswer(s, v)} />}
      {s.type === "contact" && (
        <ContactFields
          key={s.id}
          askRole={!!s.askRole}
          askBestTime={state.answers.contact_preference === "rappel"}
          initial={state.contact}
          submitting={state.status === "submitting"}
          retry={state.status === "error"}
          onSubmit={onSubmit}
          onDraft={onDraft}
          consent={consent}
          onConsent={onConsent}
        />
      )}
    </div>
  );
}

function Choices({ options, onPick, labelledBy }: { options: readonly Pick<ChoiceOption, "value" | "label">[]; onPick: (v: string) => void; labelledBy: string }) {
  return (
    <div role="group" aria-labelledby={labelledBy} className={cn("mt-3 grid gap-2", options.length > 3 && "sm:grid-cols-2")}>
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          data-autofocus={i === 0 ? true : undefined}
          onClick={() => onPick(o.value)}
          className="group flex min-h-12 items-center gap-3 rounded-md border border-deep/20 bg-white px-3 py-2 text-left text-[0.95rem] leading-tight font-semibold text-deep transition-[border-color,background-color] duration-150 hover:border-hdf hover:bg-surface active:bg-hdf/10"
        >
          <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-[3px] border-2 border-deep/35 transition-colors group-hover:border-hdf">
            <span className="size-2.5 rounded-[1px] bg-hdf opacity-0 transition-opacity group-hover:opacity-40 group-active:opacity-100" />
          </span>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function LineInput({ step, postal = false, labelledBy, onSubmit }: { step?: TextStep; postal?: boolean; labelledBy: string; onSubmit: (v: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const optional = step?.optional ?? false;
  const errId = `${labelledBy}-err`;
  return (
    <form
      noValidate
      className="mt-3"
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (postal && !isValidPostalCode(v)) return setError("Indiquez un code postal à 5 chiffres (ex. : 59410).");
        if (!postal && !v && !optional) return setError("Cette information est nécessaire pour continuer.");
        onSubmit(v);
      }}
    >
      <div className="flex items-end gap-3">
        <input
          data-autofocus
          aria-labelledby={labelledBy}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          value={value}
          onChange={(e) => {
            setValue(postal ? e.target.value.replace(/\D/g, "") : e.target.value);
            setError(undefined);
          }}
          {...(postal
            ? { inputMode: "numeric" as const, autoComplete: "postal-code", maxLength: 5 }
            : { autoComplete: step?.autoComplete ?? "off", maxLength: step?.maxLength, placeholder: step?.placeholder })}
          className={cn(
            "min-h-12 w-full min-w-0 rounded-none border-0 border-b-2 border-deep/30 bg-transparent px-1 text-lg text-ink placeholder:text-muted focus:border-hdf aria-[invalid=true]:border-[#b42318]",
            postal && "tabular tracking-[0.12em]",
          )}
        />
        <button type="submit" className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-md bg-action px-4 text-sm font-semibold text-ink transition-colors hover:bg-action-hover">
          Continuer
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      {postal && !error && <p className="mt-1.5 text-xs text-muted">5 chiffres, par exemple 59410.</p>}
      {error && (
        <p id={errId} role="alert" className="mt-2 text-sm font-semibold text-[#b42318]">
          {error}
        </p>
      )}
      {optional && (
        <button type="button" onClick={() => onSubmit("")} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-muted underline underline-offset-2 hover:text-deep">
          Je ne sais pas, passer cette question
        </button>
      )}
    </form>
  );
}

function ContactFields({
  askRole,
  askBestTime,
  initial,
  submitting,
  retry,
  onSubmit,
  onDraft,
  consent,
  onConsent,
}: {
  askRole: boolean;
  askBestTime: boolean;
  initial: JawabotContact;
  submitting: boolean;
  retry: boolean;
  onSubmit: (v: JawabotContact) => void;
  onDraft: (v: JawabotContact) => void;
  consent: boolean;
  onConsent: (v: boolean) => void;
}) {
  const [v, setV] = useState<JawabotContact>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof JawabotContact | "consent", string>>>({});
  const alertRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (retry) alertRef.current?.focus();
  }, [retry]);

  const set = (k: keyof JawabotContact) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    onDraft(next);
    setErrors((s) => ({ ...s, [k]: undefined }));
  };

  return (
    <form
      noValidate
      className="mt-3 space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        const next: typeof errors = {};
        if (v.name.trim().length < 2) next.name = "Indiquez votre nom.";
        if (!normalizeFrenchPhone(v.phone)) next.phone = "Numéro français à 10 chiffres (ex. : 06 12 34 56 78).";
        if (v.email && !isValidEmail(v.email)) next.email = "Adresse e-mail invalide.";
        if (askBestTime && !v.bestTime) next.bestTime = "Choisissez un moment pour être rappelé.";
        if (!consent) next.consent = "Votre accord est nécessaire pour être recontacté.";
        setErrors(next);
        if (Object.keys(next).length) {
          const form = e.currentTarget;
          requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
          return;
        }
        onSubmit({ ...v, name: v.name.trim(), email: v.email.trim() });
      }}
    >
      <TextField label="Nom et prénom" autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} data-autofocus />
      <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" hint="Par exemple 06 12 34 56 78." value={v.phone} onChange={set("phone")} error={errors.phone} />
      {askBestTime && <SelectField label="Meilleur moment pour vous rappeler" placeholder="Sélectionnez…" options={bestTimeOptions} value={v.bestTime} onChange={set("bestTime")} error={errors.bestTime} />}
      <TextField label="E-mail" type="email" autoComplete="email" optional value={v.email} onChange={set("email")} error={errors.email} />
      {askRole && <TextField label="Fonction" autoComplete="organization-title" optional value={v.role} onChange={set("role")} />}
      <ConsentField
        checked={consent}
        onChange={(c) => {
          onConsent(c);
          setErrors((s) => ({ ...s, consent: undefined }));
        }}
        error={errors.consent}
        text={CONSENT_TEXT}
      />
      {retry && (
        <p ref={alertRef} tabIndex={-1} role="alert" className="rounded-md bg-[#fdecea] px-3 py-2.5 text-sm text-[#8b1d12] outline-none">
          {jawabotCopy.errorText}{" "}
          <a href={telHref} data-track="phone" data-track-location="fiche_erreur" className="tabular font-semibold whitespace-nowrap underline">
            {company.phone.display}
          </a>{" "}
          ou{" "}
          <a
            href={whatsappHref("Bonjour HDF Bâti, je n’ai pas pu envoyer ma demande depuis votre site.")}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp"
            data-track-location="fiche_erreur"
            className="font-semibold underline"
          >
            WhatsApp
          </a>
          .
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-md bg-action px-5 text-base font-semibold text-ink transition-colors hover:bg-action-hover disabled:opacity-70"
      >
        {submitting && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {submitting ? "Envoi en cours…" : retry ? "Réessayer l’envoi" : "Envoyer ma fiche"}
      </button>
      <p className="text-xs text-muted">{positioning.reactivite.short}. Vos informations servent uniquement à traiter votre demande.</p>
    </form>
  );
}
