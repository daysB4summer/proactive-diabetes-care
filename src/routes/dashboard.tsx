import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel, toneClass } from "@/components/AppShell";
import {
  bmi,
  bmiCategory,
  bpCategory,
  glucoseHistory,
  recommendations,
  riskBand,
  riskScore,
} from "@/lib/health";
import {
  addPrediction,
  clearPredictions,
  useHealthState,
} from "@/lib/patient-store";
import { downloadReport } from "@/lib/report";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { patient, predictions } = useHealthState();

  const bmiValue = bmi(patient.heightCm, patient.weightKg);
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

  return (
    <AppShell
      eyebrow="(a) Patient Dashboard"
      title={`Good day, ${patient.name.split(" ")[0]}`}
    >
      <div className="grid grid-cols-12 gap-5">
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
          <button
            onClick={() => addPrediction(score, band.label)}
            className="mt-4 w-full rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand/90"
          >
            Save this prediction
          </button>
        </section>

        {/* vitals */}
        <section className="col-span-12 grid auto-rows-min grid-cols-2 gap-5 sm:col-span-4">
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
            <p className="mt-2 text-3xl font-semibold">{bmiValue.toFixed(1)}</p>
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
            onClick={() => downloadReport(patient)}
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

        {/* recent predictions */}
        <Panel
          className="col-span-12 [animation-delay:440ms]"
          title="Recent Predictions"
          description="Every saved risk prediction, newest first."
        >
          {predictions.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-background p-4 text-sm text-muted-foreground ring-1 ring-border">
              No predictions saved yet. Run one from the Diabetes Risk page or
              save the current score above.
            </p>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-line">
                {predictions.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Risk score {p.score}/100
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {new Date(p.at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium ${
                        toneClass[
                          p.band === "Low"
                            ? "mint"
                            : p.band === "Moderate"
                              ? "peach"
                              : "accent"
                        ]
                      }`}
                    >
                      {p.band}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={clearPredictions}
                className="mt-4 rounded-2xl bg-secondary px-4 py-2 text-sm font-medium transition-opacity duration-200 hover:opacity-80"
              >
                Clear history
              </button>
            </>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
