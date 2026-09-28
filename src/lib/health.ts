export type Patient = {
  name: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  systolic: number;
  diastolic: number;
  glucose: number;
  pregnancies: number;
  familyHistory: boolean;
};

export const defaultPatient: Patient = {
  name: "Priya Naidoo",
  age: 42,
  gender: "Female",
  heightCm: 168,
  weightKg: 69,
  systolic: 128,
  diastolic: 82,
  glucose: 118,
  pregnancies: 2,
  familyHistory: true,
};

export function bmi(heightCm: number, weightKg: number) {
  const m = heightCm / 100;
  if (!m) return 0;
  return weightKg / (m * m);
}

export function bmiCategory(value: number) {
  if (value < 18.5) return { label: "Underweight", tone: "sky" as const };
  if (value < 25) return { label: "Healthy", tone: "mint" as const };
  if (value < 30) return { label: "Overweight", tone: "peach" as const };
  return { label: "Obese", tone: "accent" as const };
}

export function bpCategory(systolic: number, diastolic: number) {
  if (systolic < 120 && diastolic < 80)
    return { label: "Optimal", tone: "mint" as const };
  if (systolic < 130 && diastolic < 80)
    return { label: "High-normal", tone: "peach" as const };
  if (systolic < 140 || diastolic < 90)
    return { label: "Stage 1 hypertension", tone: "peach" as const };
  return { label: "Stage 2 hypertension", tone: "accent" as const };
}

import model from "./model.json";

type Tree = { f: number[]; t: number[]; l: number[]; r: number[]; p: number[] };

/** Feature vector in the order the models were trained on: preg, glucose, dbp, bmi, dpf, age. */
function features(p: Patient) {
  const b = bmi(p.heightCm, p.weightKg) || model.imputedMedians.bmi;
  const dpf = p.familyHistory ? model.dpf.familyHistory : model.dpf.none;
  return [p.pregnancies, p.glucose || model.imputedMedians.glucose, p.diastolic || model.imputedMedians.dbp, b, dpf, p.age];
}

function rfProbability(x: number[]) {
  const trees = model.rf as Tree[];
  let sum = 0;
  for (const t of trees) {
    let n = 0;
    while (t.l[n] !== -1) n = x[t.f[n]] <= t.t[n] ? t.l[n] : t.r[n];
    sum += t.p[n];
  }
  return sum / trees.length;
}

function lrProbability(x: number[]) {
  const { mean, scale, coef, intercept } = model.lr;
  const z = x.reduce((acc, v, i) => acc + ((v - mean[i]) / scale[i]) * coef[i], intercept);
  return 1 / (1 + Math.exp(-z));
}

export const models = model.metrics as { name: string; accuracy: number; auc: number; selected: boolean }[];
export const selectedModel = models.find((m) => m.selected) ?? models[0];
export const dataset = model.dataset;

/** Real prediction: probability (0-100) from the model trained on the Pima dataset. */
export function riskScore(p: Patient) {
  const x = features(p);
  const prob = selectedModel.name === "Random Forest" ? rfProbability(x) : lrProbability(x);
  return Math.round(prob * 100);
}

export function riskBand(score: number) {
  if (score < 35) return { label: "Low", tone: "mint" as const };
  if (score < 60) return { label: "Moderate", tone: "peach" as const };
  return { label: "Elevated", tone: "accent" as const };
}

export function recommendations(p: Patient) {
  const out: string[] = [];
  const b = bmi(p.heightCm, p.weightKg);
  if (p.glucose >= 100)
    out.push("Walk 20 minutes after dinner to steady evening glucose levels.");
  if (b >= 25)
    out.push("Aim for a 5% weight reduction over 12 weeks through portion control.");
  if (p.systolic >= 125 || p.diastolic >= 80)
    out.push("Keep sodium under 2,000 mg a day to bring blood pressure down.");
  if (p.familyHistory)
    out.push("With family history, book an HbA1c panel every six months.");
  out.push("Swap sugary drinks for water or unsweetened tea before 3 PM.");
  out.push("Log your next fasting glucose reading in two weeks.");
  return out.slice(0, 4);
}

export const glucoseHistory = [
  { month: "Jan", value: 132 },
  { month: "Feb", value: 129 },
  { month: "Mar", value: 126 },
  { month: "Apr", value: 128 },
  { month: "May", value: 122 },
  { month: "Jun", value: 120 },
  { month: "Jul", value: 118 },
];

