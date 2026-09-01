import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  bmi,
  bmiCategory,
  bpCategory,
  defaultPatient,
  glucoseHistory,
  models,
  recommendations,
  riskBand,
  riskScore,
  type Patient,
} from "@/lib/health";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Risk Dashboard — HealthGuard AI" },
      {
        name: "description",
        content:
          "Your diabetes risk score, BMI, blood pressure analysis, glucose trend and personalized recommendations in one dashboard.",
      },
      { property: "og:title", content: "Risk Dashboard — HealthGuard AI" },
      {
        property: "og:description",
        content:
          "Your diabetes risk score, BMI, blood pressure analysis, glucose trend and personalized recommendations in one dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const toneClass = {
  mint: "bg-mint/25 text-foreground",
  peach: "bg-peach/60 text-foreground",
  accent: "bg-accent/15 text-accent",
  sky: "bg-sky/25 text-foreground",
} as const;

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <label className="block">
      <span className="label-mono">{label}</span>
      <span className="mt-1 flex items-center gap-2 rounded-2xl bg-background px-3 py-2 ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-sm font-medium outline-none"
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          {suffix}
        </span>
      </span>
    </label>
  );
}

function Dashboard() {
  const [patient, setPatient] = useState<Patient>(defaultPatient);
  const set = (patch: Partial<Patient>) =>
    setPatient((p) => ({ ...p, ...patch }));

  const bmiValue = useMemo(
    () => bmi(patient.heightCm, patient.weightKg),
    [patient.heightCm, patient.weightKg],
  );
  const bmiInfo = bmiCategory(bmiValue);
  const bpInfo = bpCategory(patient.systolic, patient.diastolic);
  const score = riskScore(patient);
  const band = riskBand(score);
  const tips = recommendations(patient);

  const points = glucoseHistory
    .map((g, i) => {
      const x = (i / (glucoseHistory.length - 1)) * 320;
      const y = 120 - ((g.value - 90) / 60) * 100;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  function downloadReport() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>HealthGuard AI Report</title>
<style>body{font-family:Inter,Arial,sans-serif;color:#33304a;margin:48px;line-height:1.6}
h1{font-size:24px;margin:0}h2{font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:#6b6885;margin-top:32px}
table{width:100%;border-collapse:collapse;margin-top:8px}td{padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
li{font-size:14px}</style></head><body>
<h1>HealthGuard AI — Health Report</h1>
<p style="color:#6b6885;font-size:13px">${patient.name} · Generated ${new Date().toLocaleString()}</p>
<h2>Diabetes risk</h2><p style="font-size:32px;margin:0"><strong>${score}/100</strong> — ${band.label}</p>
<p style="font-size:13px;color:#6b6885">Model: Random Forest (92.4% accuracy), auto-selected over Logistic Regression (87.1%).</p>
<h2>Patient profile</h2><table>
<tr><td>Age</td><td align="right">${patient.age}</td></tr>
<tr><td>Gender</td><td align="right">${patient.gender}</td></tr>
<tr><td>Height</td><td align="right">${patient.heightCm} cm</td></tr>
<tr><td>Weight</td><td align="right">${patient.weightKg} kg</td></tr>
<tr><td>BMI</td><td align="right">${bmiValue.toFixed(1)} (${bmiInfo.label})</td></tr>
<tr><td>Blood pressure</td><td align="right">${patient.systolic}/${patient.diastolic} mmHg (${bpInfo.label})</td></tr>
<tr><td>Fasting glucose</td><td align="right">${patient.glucose} mg/dL</td></tr>
<tr><td>Family history</td><td align="right">${patient.familyHistory ? "Yes" : "No"}</td></tr>
</table>
<h2>Recommendations</h2><ul>${tips.map((t) => `<li>${t}</li>`).join("")}</ul>
<p style="margin-top:40px;font-size:12px;color:#9a97ad">For demonstration only — not medical advice.</p>
<script>window.onload=()=>window.print()<\/script></body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1180px] px-6 py-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 rise">
            <div className="grid size-10 place-items-center rounded-2xl bg-brand text-brand-foreground">
              <span className="text-lg font-semibold">H</span>
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">
                HealthGuard <span className="text-brand">AI</span>
              </p>
              <p className="label-mono mt-1">Capstone · v1.0</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <span className="label-mono">Diabetes Risk</span>
            <Link
              to="/"
              className="rounded-full bg-peach/50 px-3 py-1 font-mono text-[11px] font-medium"
            >
              Log out
            </Link>
          </div>
        </header>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div className="rise [animation-delay:80ms]">
            <p className="label-mono">(a) Patient Dashboard</p>
            <h1 className="mt-1 text-3xl font-semibold text-balance">
              Good morning, {patient.name.split(" ")[0]}
            </h1>
          </div>
          <div className="rise [animation-delay:140ms]">
            <p className="text-sm text-muted-foreground">Model selected</p>
            <p className="font-mono text-sm font-medium">
              Random Forest · 92.4%
            </p>
          </div>
        </div>

        <main className="mt-6 grid grid-cols-12 gap-5">
          {/* risk gauge */}
          <section className="col-span-12 rounded-[28px] bg-surface p-6 ring-1 ring-border sm:col-span-5 rise [animation-delay:120ms]">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Diabetes Risk</p>
              <span className="label-mono">Random Forest</span>
            </div>
            <div className="relative mx-auto mt-4 grid h-[210px] w-[210px] place-items-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 180deg, var(--mint) 0deg, var(--peach) 140deg, var(--accent) 250deg, var(--secondary) ${
                    (score / 100) * 360
                  }deg 360deg)`,
                }}
              />
              <div className="relative z-10 grid size-[150px] place-items-center rounded-full bg-surface">
                <div className="text-center">
                  <p className="text-[44px] font-semibold leading-none text-accent">
                    {score}
                  </p>
                  <p className="label-mono mt-1">/ 100</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium ${toneClass[band.tone]}`}
                  >
                    {band.label}
                  </span>
                </div>
              </div>
            </div>
            <p className="mx-auto mt-3 max-w-[34ch] text-center text-sm text-pretty text-muted-foreground">
              Scored from your glucose, BMI, blood pressure, age and family
              history. Small weekly habits can move this.
            </p>
          </section>

          {/* vitals */}
          <section className="col-span-12 grid grid-cols-2 gap-5 sm:col-span-4">
            <div className="rounded-[24px] bg-surface p-5 ring-1 ring-border rise [animation-delay:180ms]">
              <p className="label-mono">Blood Pressure</p>
              <p className="mt-2 text-3xl font-semibold">
                {patient.systolic}
                <span className="text-lg text-muted-foreground">
                  /{patient.diastolic}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">mmHg</p>
              <span
                className={`mt-3 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] font-medium ${toneClass[bpInfo.tone]}`}
              >
                {bpInfo.label}
              </span>
            </div>
            <div className="rounded-[24px] bg-surface p-5 ring-1 ring-border rise [animation-delay:240ms]">
              <p className="label-mono">BMI</p>
              <p className="mt-2 text-3xl font-semibold">
                {bmiValue.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">kg/m²</p>
              <span
                className={`mt-3 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] font-medium ${toneClass[bmiInfo.tone]}`}
              >
                {bmiInfo.label}
              </span>
            </div>
          </section>

          {/* report */}
          <section className="col-span-12 rounded-[24px] bg-surface p-5 ring-1 ring-border sm:col-span-3 rise [animation-delay:300ms]">
            <p className="label-mono">Health Report</p>
            <div className="mt-3 h-[112px] rounded-2xl bg-background p-3 ring-1 ring-border">
              <div className="h-2 w-2/3 rounded-full bg-line" />
              <div className="mt-2 h-2 w-full rounded-full bg-line" />
              <div className="mt-2 h-2 w-5/6 rounded-full bg-line" />
              <div className="mt-2 flex gap-1">
                <span className="h-6 flex-1 rounded-md bg-sky/40" />
                <span className="h-6 flex-1 rounded-md bg-mint/40" />
                <span className="h-6 flex-1 rounded-md bg-peach/60" />
                <span className="h-6 flex-1 rounded-md bg-accent/40" />
              </div>
            </div>
            <button
              onClick={downloadReport}
              className="mt-4 w-full rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand/90"
            >
              Download PDF
            </button>
          </section>

          {/* glucose trend */}
          <section className="col-span-12 rounded-[24px] bg-surface p-5 ring-1 ring-border sm:col-span-7 rise [animation-delay:340ms]">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Glucose Trend</p>
              <span className="font-mono text-[11px] text-muted-foreground">
                7 mo · mg/dL
              </span>
            </div>
            <svg
              viewBox="0 0 320 130"
              className="mt-4 h-32 w-full"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,100 320,100"
                fill="none"
                stroke="var(--line)"
                strokeWidth="1"
              />
              <polyline
                points={points}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hg-line"
                pathLength={1}
              />
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              {glucoseHistory.map((g) => (
                <span key={g.month}>{g.month}</span>
              ))}
            </div>
          </section>

          {/* recommendations */}
          <section className="col-span-12 rounded-[24px] bg-surface p-5 ring-1 ring-border sm:col-span-5 rise [animation-delay:400ms]">
            <p className="text-base font-semibold">For You This Week</p>
            <ul className="mt-4 space-y-3">
              {tips.map((tip, i) => (
                <li key={tip} className="flex gap-3">
                  <span
                    className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl font-mono text-xs font-semibold ${
                      [
                        toneClass.mint,
                        toneClass.sky,
                        toneClass.peach,
                        toneClass.accent,
                      ][i % 4]
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-pretty">{tip}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* profile + calculators */}
          <section className="col-span-12 rounded-[24px] bg-surface p-5 ring-1 ring-border sm:col-span-7 rise [animation-delay:440ms]">
            <p className="text-base font-semibold">
              Patient Profile & Calculators
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Update a value to recalculate BMI, blood pressure analysis and the
              risk score instantly.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field
                label="Age"
                value={patient.age}
                suffix="yrs"
                onChange={(v) => set({ age: v })}
              />
              <Field
                label="Height"
                value={patient.heightCm}
                suffix="cm"
                onChange={(v) => set({ heightCm: v })}
              />
              <Field
                label="Weight"
                value={patient.weightKg}
                suffix="kg"
                onChange={(v) => set({ weightKg: v })}
              />
              <Field
                label="Systolic"
                value={patient.systolic}
                suffix="mmHg"
                onChange={(v) => set({ systolic: v })}
              />
              <Field
                label="Diastolic"
                value={patient.diastolic}
                suffix="mmHg"
                onChange={(v) => set({ diastolic: v })}
              />
              <Field
                label="Glucose"
                value={patient.glucose}
                suffix="mg/dL"
                onChange={(v) => set({ glucose: v })}
              />
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={patient.familyHistory}
                onChange={(e) => set({ familyHistory: e.target.checked })}
                className="size-4 accent-brand"
              />
              Family history of diabetes
            </label>
          </section>

          {/* model comparison */}
          <section className="col-span-12 rounded-[24px] bg-surface p-5 ring-1 ring-border sm:col-span-5 rise [animation-delay:480ms]">
            <p className="text-base font-semibold">Model Selection</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Trained on the Pima diabetes dataset; the higher scoring model is
              used automatically.
            </p>
            <div className="mt-4 space-y-4">
              {models.map((m) => (
                <div key={m.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{m.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {(m.accuracy * 100).toFixed(1)}%
                      {m.selected ? " · selected" : ""}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-background ring-1 ring-border">
                    <div
                      className={`h-full rounded-full ${m.selected ? "bg-brand" : "bg-sky"}`}
                      style={{ width: `${m.accuracy * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 font-mono text-[11px] text-muted-foreground">
          <span>HealthGuard AI · Diabetes risk only</span>
          <span>Final-year capstone · For demonstration, not medical advice</span>
        </footer>
      </div>
    </div>
  );
}
