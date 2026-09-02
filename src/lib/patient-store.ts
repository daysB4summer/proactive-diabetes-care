import { useSyncExternalStore } from "react";
import { defaultPatient, type Patient } from "./health";

export type Prediction = {
  id: string;
  score: number;
  band: string;
  at: string;
};

type State = { patient: Patient; predictions: Prediction[] };

const KEY = "healthguard.state";

function load(): State {
  if (typeof window === "undefined")
    return { patient: defaultPatient, predictions: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      return {
        patient: { ...defaultPatient, ...parsed.patient },
        predictions: parsed.predictions ?? [],
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return { patient: defaultPatient, predictions: [] };
}

let state: State = { patient: defaultPatient, predictions: [] };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    state = load();
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const serverSnapshot: State = { patient: defaultPatient, predictions: [] };

export function useHealthState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverSnapshot,
  );
}

export function updatePatient(patch: Partial<Patient>) {
  state = { ...state, patient: { ...state.patient, ...patch } };
  persist();
  emit();
}

export function addPrediction(score: number, band: string) {
  const entry: Prediction = {
    id: `${Date.now()}`,
    score,
    band,
    at: new Date().toISOString(),
  };
  state = { ...state, predictions: [entry, ...state.predictions].slice(0, 12) };
  persist();
  emit();
}

export function clearPredictions() {
  state = { ...state, predictions: [] };
  persist();
  emit();
}
