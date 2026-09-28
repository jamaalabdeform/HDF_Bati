"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, MessageCircle, Phone, RotateCcw, X } from "lucide-react";
import { answerLabel, jawabotCopy, segmentChoices, type Step } from "@/config/jawabot";
import { company, telHref, whatsappHref } from "@/config/company";
import { newEventId, track } from "@/lib/analytics";
import { answeredSteps, currentStep, progress } from "@/lib/jawabot/engine";
import { httpBackend } from "@/lib/jawabot/adapter";
import { CONSENT_TEXT, CONSENT_TEXT_VERSION, whatsappMessageForLead } from "@/lib/lead";
import { getAttribution } from "@/lib/utm";
import { readConsent } from "@/lib/consent";
import { useJawabot } from "./JawabotProvider";
import { BotBubble, UserBubble, TypingBubble } from "./Bubbles";
import { ChoiceInput, ContactInput, PostalInput, TextInput } from "./Inputs";

export function JawabotPanel() {
  const { isOpen, close, state, dispatch } = useJawabot();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thinking, setThinking] = useState(false);
  const step = currentStep(state);
  const answered = answeredSteps(state);
  const pct = Math.round(progress(state) * 100);

  // Petite pause « Jawabot écrit… » entre deux questions (désactivée si mouvement réduit).
  const answeredCount = answered.length + (state.segment ? 1 : 0);
  const prevCount = useRef(answeredCount);
  useEffect(() => {
    if (answeredCount > prevCount.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setThinking(true);
      const t = setTimeout(() => setThinking(false), 420);
      prevCount.current = answeredCount;
      return () => clearTimeout(t);
    }
    prevCount.current = answeredCount;
  }, [answeredCount]);

  // Défilement vers le bas à chaque nouveau message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [answeredCount, thinking, state.status]);

  // Clavier : Échap ferme ; focus piégé dans le panneau.
  useEffect(() => {
    if (!isOpen) return;
    const node = dialogRef.current;
    const t = setTimeout(() => node?.querySelector<HTMLElement>("[data-autofocus]")?.focus() ?? node?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !node) return;
      const f = node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, step?.id, state.status]);

  // Mobile : bloque le défilement de la page derrière la feuille plein écran.
  useEffect(() => {
    if (!isOpen) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onAnswer = (s: Step, value: string) => {
    dispatch({ type: "answer", stepId: s.id, value });
    track("jawabot_step", { segment: state.segment ?? undefined, step_id: s.id, step_index: answered.length + 1, answer: s.type === "choice" ? value : undefined });
  };

  const onSubmit = async (contact: { name: string; phone: string; email: string; role: string; bestTime: string }) => {
    if (!state.segment) return;
    dispatch({ type: "contact", contact });
    dispatch({ type: "submitting" });
    const eventId = newEventId("lead");
    const result = await httpBackend.submit({
      source: "jawabot",
      segment: state.segment,
      answers: state.answers,
      contact: { name: contact.name, phone: contact.phone, email: contact.email || undefined, role: contact.role || undefined, postalCode: state.answers.code_postal, bestTime: contact.bestTime || undefined },
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


  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end sm:inset-auto sm:right-5 sm:bottom-5" role="presentation">
      <button type="button" aria-label="Fermer l’assistant" tabIndex={-1} onClick={close} className="absolute inset-0 bg-deep/40 backdrop-blur-[2px] sm:hidden" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jawabot-title"
        tabIndex={-1}
        className="animate-jawabot-in relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl outline-none sm:h-[min(44rem,calc(100dvh-2.5rem))] sm:w-[25.5rem] sm:rounded-[1.5rem] sm:ring-1 sm:ring-deep/10"
      >
        {/* En-tête */}
        <div className="relative bg-deep px-4 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/hdf-bati-pictogramme-blanc.svg" alt="" width={24} height={26} />
            </span>
            <div className="min-w-0 flex-1">
              <p id="jawabot-title" className="text-[0.95rem] font-bold">{jawabotCopy.title}</p>
              <p className="text-xs text-white/75">{jawabotCopy.humanNote}</p>
            </div>
            <button type="button" onClick={close} className="grid size-11 shrink-0 place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white" aria-label="Fermer l’assistant">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Progression de votre demande" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <div className="h-full rounded-full bg-energy transition-[width] duration-500 ease-[var(--ease-out-soft)]" style={{ width: `${Math.max(pct, 4)}%` }} />
          </div>
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-surface px-4 py-5" aria-live="polite" aria-relevant="additions">
          <BotBubble>
            <span className="font-semibold">{jawabotCopy.greeting}</span>
            <br />
            {jawabotCopy.intro}
          </BotBubble>
          <p className="px-9 text-[0.72rem] leading-snug text-muted">{jawabotCopy.disclaimer}</p>
          <BotBubble>{jawabotCopy.segmentQuestion}</BotBubble>
          {state.segment && <UserBubble>{segmentChoices.find((c) => c.value === state.segment)?.label}</UserBubble>}

          {answered.map((s) => {
            const v = state.answers[s.id];
            const reply = s.type === "choice" ? s.options.find((o) => o.value === v)?.reply : undefined;
            return (
              <div key={s.id} className="space-y-3">
                <BotBubble>{s.question}</BotBubble>
                <UserBubble>{v ? answerLabel(s, v) : <em className="opacity-80">Passé</em>}</UserBubble>
                {reply && <BotBubble tone="info">{reply}</BotBubble>}
              </div>
            );
          })}

          {thinking && state.status === "chatting" && <TypingBubble />}

          {!thinking && step && state.status !== "done" && (
            <BotBubble>
              {step.question}
              {step.help && <span className="mt-1 block text-xs text-muted">{step.help}</span>}
            </BotBubble>
          )}

          {state.status === "done" && (
            <div className="animate-bubble-in rounded-2xl bg-white p-4 shadow-[var(--shadow-float)] ring-1 ring-hdf/20">
              <p className="flex items-center gap-2 font-bold text-deep">
                <span className="grid size-7 place-items-center rounded-full bg-hdf text-white"><Check className="size-4" aria-hidden /></span>
                {jawabotCopy.successTitle}
              </p>
              <p className="mt-2 text-sm text-muted">{jawabotCopy.successText}</p>
              {state.leadId && <p className="mt-2 text-xs text-muted">Référence de votre demande : <strong className="text-deep">{state.leadId}</strong></p>}
              <div className="mt-4 grid gap-2">
                <a
                  href={whatsappHref(whatsappMessageForLead(state.leadId, state.segment ?? "particulier"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp"
                  data-track-location="jawabot_success"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-hdf px-5 font-semibold text-white transition hover:bg-hdf-dark"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  Échanger avec HDF Bâti sur WhatsApp
                </a>
                <a href={telHref} data-track="phone" data-track-location="jawabot_success" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-deep/15 px-5 font-semibold text-deep transition hover:border-hdf hover:text-hdf">
                  <Phone className="size-4" aria-hidden />
                  Appeler le {company.phone.display}
                </a>
              </div>
            </div>
          )}

          {state.status === "error" && (
            <BotBubble tone="error">
              {jawabotCopy.errorText}{" "}
              <a href={telHref} className="font-semibold underline" data-track="phone" data-track-location="jawabot_error">
                {company.phone.display}
              </a>
            </BotBubble>
          )}
        </div>

        {/* Zone de réponse */}
        <div className="border-t border-line bg-white px-4 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))]">
          {state.status !== "done" && !thinking && (
            <>
              {!state.segment && (
                <ChoiceInput
                  options={segmentChoices}
                  onPick={(v) => {
                    dispatch({ type: "segment", segment: v as typeof segmentChoices[number]["value"] });
                    track("select_segment", { segment: v, origin: "jawabot" });
                    track("jawabot_step", { segment: v, step_id: "segment", step_index: 0 });
                  }}
                />
              )}
              {step?.type === "choice" && <ChoiceInput key={step.id} options={step.options} onPick={(v) => onAnswer(step, v)} />}
              {step?.type === "text" && <TextInput key={step.id} step={step} onSubmit={(v) => onAnswer(step, v)} />}
              {step?.type === "postal" && <PostalInput key={step.id} onSubmit={(v) => onAnswer(step, v)} />}
              {step?.type === "contact" && (
                <ContactInput
                  key={step.id}
                  askRole={!!step.askRole}
                  askBestTime={state.answers.contact_preference === "rappel"}
                  recap={answered
                    .filter((s) => s.type !== "text" && s.id !== "contact_preference")
                    .slice(0, 4)
                    .map((s) => answerLabel(s, state.answers[s.id]))}
                  initial={state.contact}
                  submitting={state.status === "submitting"}
                  retry={state.status === "error"}
                  ctaLabel="Envoyer ma demande"
                  onSubmit={onSubmit}
                />
              )}
            </>
          )}

          {(state.status === "done" || state.segment) && (
            <div className="mt-1.5 flex items-center justify-between gap-2">
              {state.status !== "done" ? (
                <button type="button" onClick={() => dispatch({ type: "back" })} disabled={state.status === "submitting"} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-xs font-semibold whitespace-nowrap text-muted transition hover:text-deep">
                  <ArrowLeft className="size-4" aria-hidden /> Modifier ma réponse
                </button>
              ) : (
                <button type="button" onClick={() => dispatch({ type: "restart" })} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-xs font-semibold whitespace-nowrap text-muted transition hover:text-deep">
                  <RotateCcw className="size-4" aria-hidden /> Nouvelle demande
                </button>
              )}
              <span className="text-right text-[0.7rem] text-muted">{step?.type === "contact" ? "Dernière étape" : `${pct} %`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
