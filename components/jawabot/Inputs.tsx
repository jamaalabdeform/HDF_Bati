"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { ChoiceOption, TextStep } from "@/config/jawabot";
import { CONSENT_TEXT, isValidEmail, isValidPostalCode, normalizeFrenchPhone } from "@/lib/lead";
import { ConsentField, TextField } from "../forms/Field";
import { cn } from "../ui/cn";

export function ChoiceInput({ options, onPick }: { options: readonly Pick<ChoiceOption, "value" | "label">[]; onPick: (value: string) => void }) {
  return (
    <div className={cn("grid gap-2", options.length > 3 ? "grid-cols-2" : "grid-cols-1")} role="group" aria-label="Réponses proposées">
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          data-autofocus={i === 0 ? true : undefined}
          onClick={() => onPick(o.value)}
          className="min-h-12 rounded-xl border-2 border-hdf/25 bg-white px-3 py-2 text-left text-sm leading-tight font-semibold text-deep transition-[border-color,background-color,transform] duration-150 hover:border-hdf hover:bg-[#eef7f1] active:scale-[0.98]"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SendButton({ disabled, label = "Valider" }: { disabled?: boolean; label?: string }) {
  return (
    <button type="submit" disabled={disabled} aria-label={label} className="grid min-h-12 min-w-12 shrink-0 place-items-center rounded-xl bg-hdf text-white transition hover:bg-hdf-dark disabled:opacity-50">
      <ArrowRight className="size-5" aria-hidden />
    </button>
  );
}

export function TextInput({ step, onSubmit }: { step: TextStep; onSubmit: (v: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (!v && !step.optional) return setError("Ce champ est nécessaire pour continuer.");
        onSubmit(v);
      }}
      className="space-y-2"
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={`jb-${step.id}`}>{step.question}</label>
        <input
          id={`jb-${step.id}`}
          data-autofocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(undefined);
          }}
          maxLength={step.maxLength}
          placeholder={step.placeholder}
          autoComplete={step.autoComplete ?? "off"}
          aria-invalid={error ? true : undefined}
          className="min-h-12 w-full min-w-0 rounded-xl border border-deep/20 px-3.5 text-base outline-none focus:border-hdf focus:ring-4 focus:ring-hdf/15"
        />
        <SendButton />
      </div>
      {error && <p className="text-xs font-semibold text-[#b42318]" role="alert">{error}</p>}
      {step.optional && (
        <button type="button" onClick={() => onSubmit("")} className="min-h-11 text-xs font-semibold text-muted underline underline-offset-2 hover:text-deep">
          Je ne sais pas — passer cette question
        </button>
      )}
    </form>
  );
}

export function PostalInput({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValidPostalCode(value)) return setError("Indiquez un code postal à 5 chiffres (ex. : 59410).");
        onSubmit(value.trim());
      }}
      className="space-y-2"
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="jb-cp">Code postal</label>
        <input
          id="jb-cp"
          data-autofocus
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="Code postal"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, ""));
            setError(undefined);
          }}
          aria-invalid={error ? true : undefined}
          className="min-h-12 w-full min-w-0 rounded-xl border border-deep/20 px-3.5 text-base tracking-wider outline-none focus:border-hdf focus:ring-4 focus:ring-hdf/15"
        />
        <SendButton />
      </div>
      {error && <p className="text-xs font-semibold text-[#b42318]" role="alert">{error}</p>}
    </form>
  );
}

interface ContactValues {
  name: string;
  phone: string;
  email: string;
  role: string;
}

export function ContactInput({
  askRole,
  initial,
  submitting,
  retry,
  ctaLabel,
  onSubmit,
}: {
  askRole: boolean;
  initial: ContactValues;
  submitting: boolean;
  retry: boolean;
  ctaLabel: string;
  onSubmit: (v: ContactValues) => void;
}) {
  const [v, setV] = useState<ContactValues>(initial);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues | "consent", string>>>({});

  const set = (k: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    setErrors((s) => ({ ...s, [k]: undefined }));
  };

  return (
    <form
      noValidate
      className="max-h-[52dvh] space-y-3 overflow-y-auto px-0.5 pb-1 sm:max-h-none"
      onSubmit={(e) => {
        e.preventDefault();
        const next: typeof errors = {};
        if (v.name.trim().length < 2) next.name = "Indiquez votre nom.";
        if (!normalizeFrenchPhone(v.phone)) next.phone = "Numéro français à 10 chiffres (ex. : 06 12 34 56 78).";
        if (v.email && !isValidEmail(v.email)) next.email = "Adresse e-mail invalide.";
        if (!consent) next.consent = "Votre accord est nécessaire pour être recontacté.";
        setErrors(next);
        if (Object.keys(next).length) return;
        onSubmit({ ...v, name: v.name.trim(), email: v.email.trim() });
      }}
    >
      <TextField label="Nom et prénom" autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} data-autofocus />
      <TextField label="Téléphone" type="tel" inputMode="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} error={errors.phone} />
      <TextField label="E-mail" type="email" autoComplete="email" optional value={v.email} onChange={set("email")} error={errors.email} />
      {askRole && <TextField label="Fonction" autoComplete="organization-title" optional value={v.role} onChange={set("role")} />}
      <ConsentField checked={consent} onChange={(c) => { setConsent(c); setErrors((s) => ({ ...s, consent: undefined })); }} error={errors.consent} text={CONSENT_TEXT} />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-action px-5 font-semibold text-ink transition hover:bg-action-hover disabled:opacity-70"
      >
        {submitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
        {submitting ? "Envoi en cours…" : retry ? "Réessayer l’envoi" : ctaLabel}
      </button>
    </form>
  );
}
