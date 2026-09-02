import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Field, Panel, toneClass } from "@/components/AppShell";
import { bmi, bmiCategory } from "@/lib/health";
import { updatePatient, useHealthState } from "@/lib/patient-store";

export const Route = createFileRoute("/bmi")({
  head: () => ({
    meta: [
      { title: "BMI Calculator — HealthGuard AI" },
      {
        name: "description",
        content:
          "Calculate your body mass index from height and weight and see which clinical BMI band you fall into.",
      },
      { property: "og:title", content: "BMI Calculator — HealthGuard AI" },
      {
        property: "og:description",
        content:
          "Calculate your BMI from height and weight and see your clinical BMI band.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BmiPage,
});

const bands = [
  { label: "Underweight", range: "< 18.5", tone: "sky" as const },
  { label: "Healthy", range: "18.5 – 24.9", tone: "mint" as const },
  { label: "Overweight", range: "25 – 29.9", tone: "peach" as const },
  { label: "Obese", range: "30 +", tone: "accent" as const },
];

function BmiPage() {
  const { patient } = useHealthState();
  const value = bmi(patient.heightCm, patient.weightKg);
  const info = bmiCategory(value);
  const pct = Math.min(100, Math.max(0, ((value - 14) / 26) * 100));

  return (
    <AppShell eyebrow="(c) BMI Calculator" title="Body mass index">
      <div className="grid grid-cols-12 gap-5">
        <Panel
          className="col-span-12 lg:col-span-5"
          title="Measurements"
          description="Results update as you type."
        >
          <div className="mt-4 grid grid-cols-2 gap-4">
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
          </div>
        </Panel>

        <Panel className="col-span-12 lg:col-span-7 [animation-delay:120ms]">
          <div className="flex items-end justify-between">
            <div>
              <p className="label-mono">Your BMI</p>
              <p className="mt-1 text-[52px] font-semibold leading-none">
                {value.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">kg/m²</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium ${toneClass[info.tone]}`}
            >
              {info.label}
            </span>
          </div>
          <div className="relative mt-6 h-3 rounded-full bg-gradient-to-r from-sky via-mint to-accent">
            <span
              className="absolute -top-1 size-5 -translate-x-1/2 rounded-full bg-surface ring-2 ring-brand transition-[left] duration-300"
              style={{ left: `${pct}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bands.map((b) => (
              <div
                key={b.label}
                className={`rounded-2xl p-3 ${b.label === info.label ? toneClass[b.tone] : "bg-background ring-1 ring-border"}`}
              >
                <p className="text-sm font-medium">{b.label}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {b.range}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
