import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Field, Panel, toneClass } from "@/components/AppShell";
import {
  bmi,
  models,
  recommendations,
  riskBand,
  riskScore,
} from "@/lib/health";
import {
  addPrediction,
  updatePatient,
  useHealthState,
} from "@/lib/patient-store";

export const Route = createFileRoute("/diabetes-risk")({
  head: () => ({
    meta: [
      { title: "Diabetes Risk Prediction — HealthGuard AI" },
      {
        name: "description",
        content:
          "Run a diabetes risk prediction on your latest vitals and save the result to your prediction history.",
      },
      {
        property: "og:title",
        content: "Diabetes Risk Prediction — HealthGuard AI",
      },
      {
        property: "og:description",
        content:
          "Run a diabetes risk prediction on your latest vitals and save it to your history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DiabetesRiskPage,
});

function DiabetesRiskPage() {
  const { patient } = useHealthState();
  const score = riskScore(patient);
  const band = riskBand(score);
  const tips = recommendations(patient);
  const bmiValue = bmi(patient.heightCm, patient.weightKg);

  const factors = [
    { label: "Fasting glucose", weight: Math.min(100, (patient.glucose / 180) * 100) },
    { label: "BMI", weight: Math.min(100, (bmiValue / 40) * 100) },
    { label: "Age", weight: Math.min(100, (patient.age / 80) * 100) },
    {
      label: "Blood pressure",
      weight: Math.min(100, (patient.systolic / 170) * 100),
    },
    { label: "Family history", weight: patient.familyHistory ? 80 : 15 },
  ];

  return (
    <AppShell eyebrow="(e) Diabetes Risk" title="Risk prediction">
      <div className="grid grid-cols-12 gap-5">
        <Panel
          className="col-span-12 lg:col-span-5"
          title="Model inputs"
          description="Adjust a value, then run the prediction to log it."
        >
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field
              label="Glucose"
              suffix="mg/dL"
              value={patient.glucose}
              onChange={(v) => updatePatient({ glucose: v })}
            />
            <Field
              label="Age"
              suffix="yrs"
              value={patient.age}
              onChange={(v) => updatePatient({ age: v })}
            />
            <Field
              label="Height"
              suffix="cm"
              value={patient.heightCm}
              onChange={(v) => updatePatient({ heightCm: v })}
            />
            <Field
              label="Weight"
              suffix="kg"
              value={patient.weightKg}
              onChange={(v) => updatePatient({ weightKg: v })}
            />
            <Field
              label="Systolic"
              suffix="mmHg"
              value={patient.systolic}
              onChange={(v) => updatePatient({ systolic: v })}
            />
            <Field
              label="Diastolic"
              suffix="mmHg"
              value={patient.diastolic}
              onChange={(v) => updatePatient({ diastolic: v })}
            />
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={patient.familyHistory}
              onChange={(e) =>
                updatePatient({ familyHistory: e.target.checked })
              }
              className="size-4 accent-brand"
            />
            Family history of diabetes
          </label>
          <button
            onClick={() => addPrediction(score, band.label)}
            className="mt-5 w-full rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand/90"
          >
            Run prediction
          </button>
        </Panel>

        <div className="col-span-12 grid gap-5 lg:col-span-7">
          <Panel className="[animation-delay:120ms]">
            <div className="flex items-end justify-between">
              <div>
                <p className="label-mono">Predicted risk</p>
                <p className="mt-1 text-[52px] font-semibold leading-none text-accent">
                  {score}
                  <span className="text-xl text-muted-foreground">/100</span>
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium ${toneClass[band.tone]}`}
              >
                {band.label}
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {factors.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{f.label}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {f.weight.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-background ring-1 ring-border">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-300"
                      style={{ width: `${f.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            className="[animation-delay:180ms]"
            title="Model selection"
            description="Trained on the real Pima Indians Diabetes dataset (768 patients, 80/20 split); the more accurate model is used automatically."
          >
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
          </Panel>

          <Panel
            className="[animation-delay:240ms]"
            title="Personalized recommendations"
          >
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
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
