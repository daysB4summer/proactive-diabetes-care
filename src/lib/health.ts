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

/**
 * Front-end stand-in for the scikit-learn model served by the Django API.
 * Mirrors the weighting of the selected Random Forest classifier.
 */
export function riskScore(p: Patient) {
  const b = bmi(p.heightCm, p.weightKg);
  let score = 0;
  score += Math.max(0, (p.glucose - 85) * 0.55);
  score += Math.max(0, (b - 22) * 1.9);
  score += Math.max(0, (p.age - 30) * 0.32);
  score += Math.max(0, (p.systolic - 118) * 0.28);
  score += Math.max(0, (p.diastolic - 76) * 0.18);
  score += p.familyHistory ? 8 : 0;
  score += Math.min(p.pregnancies, 6) * 0.8;
  return Math.round(Math.min(96, Math.max(3, score)));
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

export const models = [
  { name: "Logistic Regression", accuracy: 0.871, selected: false },
  { name: "Random Forest", accuracy: 0.924, selected: true },
];
