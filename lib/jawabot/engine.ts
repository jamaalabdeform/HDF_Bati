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
  /** Réponse d'information à afficher après un choix (clé = step id). */
  started: boolean;
}

export const initialState: JawabotState = {
  segment: null,
  answers: {},
  contact: { name: "", phone: "", email: "", role: "", bestTime: "" },
  status: "chatting",
  started: false,
};

export type JawabotAction =
  | { type: "start"; segment?: Segment; preset?: Answers }
  | { type: "segment"; segment: Segment }
  | { type: "answer"; stepId: string; value: string }
  | { type: "back" }
  /** Reprend la fiche à une rubrique : efface sa seule réponse, les autres sont conservées. */
  | { type: "rewind"; stepId: string }
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
      return { ...state, segment: action.segment, answers: {} };
    case "answer": {
      // Une réponse peut masquer des rubriques conditionnelles : leurs anciennes réponses sont retirées.
      const answers = { ...state.answers, [action.stepId]: action.value };
      if (state.segment) for (const s of getFlow(state.segment)) if (s.when && !s.when(answers)) delete answers[s.id];
      return { ...state, answers };
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
      if (action.stepId === "segment") return { ...state, segment: null, answers: {}, status: "chatting" };
      if (!(action.stepId in state.answers)) return state;
      const answers = { ...state.answers };
      delete answers[action.stepId];
      return { ...state, answers, status: "chatting" };
    }
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
