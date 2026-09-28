import { getFlow, type Answers, type Step } from "@/config/jawabot";
import type { Segment } from "@/config/services";

/**
 * Moteur Jawabot — logique pure, sans React, testable et réutilisable
 * (Core Jawabot STIPway + configuration HDF dans config/jawabot.ts).
 */

export type JawabotStatus = "chatting" | "submitting" | "done" | "error";

export interface JawabotContact {
  name: string;
  phone: string;
  email: string;
  role: string;
  bestTime: string;
}

export interface JawabotState {
  segment: Segment | null;
  answers: Answers;
  contact: JawabotContact;
  status: JawabotStatus;
  leadId?: string;
  started: boolean;
  /** Rubrique rouverte par « Modifier » : sa réponse reste en place tant qu'elle n'est pas remplacée. */
  editing: string | null;
}

export const initialState: JawabotState = {
  segment: null,
  answers: {},
  contact: { name: "", phone: "", email: "", role: "", bestTime: "" },
  status: "chatting",
  started: false,
  editing: null,
};

export type JawabotAction =
  | { type: "start"; segment?: Segment; preset?: Answers }
  | { type: "segment"; segment: Segment }
  | { type: "answer"; stepId: string; value: string }
  | { type: "back" }
  /** Rouvre une rubrique déjà remplie ; toutes les réponses restent en place. */
  | { type: "rewind"; stepId: string }
  /** Referme la rubrique rouverte en gardant sa réponse. */
  | { type: "keep" }
  /** Reprise d'une fiche interrompue (réponses seulement, jamais les coordonnées). */
  | { type: "restore"; segment: Segment | null; answers: Answers }
  | { type: "contact"; contact: JawabotContact }
  | { type: "submitting" }
  | { type: "done"; leadId?: string }
  | { type: "error" }
  | { type: "restart" };

export function visibleSteps(segment: Segment | null, answers: Answers): Step[] {
  if (!segment) return [];
  return getFlow(segment).filter((s) => !s.when || s.when(answers));
}

export function answeredSteps(state: JawabotState): Step[] {
  return visibleSteps(state.segment, state.answers).filter((s) => s.id in state.answers);
}

export function currentStep(state: JawabotState): Step | null {
  if (!state.segment) return null;
  if (state.editing) {
    const edited = visibleSteps(state.segment, state.answers).find((s) => s.id === state.editing);
    if (edited) return edited;
  }
  return visibleSteps(state.segment, state.answers).find((s) => !(s.id in state.answers)) ?? null;
}

/** Progression 0 → 1 (le choix du segment compte pour une étape). */
export function progress(state: JawabotState): number {
  if (state.status === "done") return 1;
  if (!state.segment) return 0;
  const steps = visibleSteps(state.segment, state.answers);
  const done = steps.filter((s) => s.id in state.answers).length + 1;
  return Math.min(1, done / (steps.length + 1));
}

export function reducer(state: JawabotState, action: JawabotAction): JawabotState {
  switch (action.type) {
    case "start":
      if (state.started && !action.segment) return state;
      if (state.started && state.segment && action.segment === state.segment) return state;
      return {
        ...initialState,
        started: true,
        segment: action.segment ?? null,
        answers: action.segment ? { ...(action.preset ?? {}) } : {},
      };
    case "segment":
      return { ...state, segment: action.segment, answers: {}, editing: null };
    case "answer": {
      // Une réponse peut masquer des rubriques conditionnelles : leurs anciennes réponses sont retirées.
      const answers = { ...state.answers, [action.stepId]: action.value };
      if (state.segment) for (const s of getFlow(state.segment)) if (s.when && !s.when(answers)) delete answers[s.id];
      return { ...state, answers, editing: null };
    }
    case "back": {
      if (state.status === "done") return state;
      const answered = answeredSteps(state);
      if (answered.length === 0) return { ...state, segment: null, answers: {} };
      const last = answered[answered.length - 1];
      const answers = { ...state.answers };
      delete answers[last.id];
      return { ...state, answers, status: "chatting" };
    }
    case "rewind": {
      if (state.status === "done" || state.status === "submitting") return state;
      if (action.stepId === "segment") return { ...state, segment: null, answers: {}, editing: null, status: "chatting" };
      if (!(action.stepId in state.answers)) return state;
      return { ...state, editing: action.stepId, status: "chatting" };
    }
    case "keep":
      return { ...state, editing: null };
    case "restore":
      return { ...state, started: true, segment: action.segment, answers: { ...action.answers }, editing: null };
    case "contact":
      return { ...state, contact: action.contact };
    case "submitting":
      return { ...state, status: "submitting" };
    case "done":
      return { ...state, status: "done", leadId: action.leadId };
    case "error":
      return { ...state, status: "error" };
    case "restart":
      return { ...initialState, started: true };
  }
}
