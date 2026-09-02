import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Field, Panel, toneClass } from "@/components/AppShell";
import { bpCategory } from "@/lib/health";
import { updatePatient, useHealthState } from "@/lib/patient-store";

export const Route = createFileRoute("/blood-pressure")({
  head: () => ({
    meta: [
      { title: "Blood Pressure Analysis — HealthGuard AI" },
      {
        name: "description",
        content:
          "Enter systolic and diastolic readings to classify your blood pressure and see how it affects diabetes risk.",
      },
      {
        property: "og:title",
        content: "Blood Pressure Analysis — HealthGuard AI",
      },
      {
        property: "og:description",
        content:
          "Classify your systolic and diastolic readings and see the impact on diabetes risk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BloodPressurePage,
});

const ranges = [
  { label: "Optimal", range: "< 120 / < 80", tone: "mint" as const },
  { label: "High-normal", range: "120–129 / < 80", tone: "peach" as const },
  {
    label: "Stage 1 hypertension",
    range: "130–139 / 80–89",
    tone: "peach" as const,
  },
  {
    label: "Stage 2 hypertension",
    range: "140+ / 90+",
    tone: "accent" as const,
  },
];

function BloodPressurePage() {
  const { patient } = useHealthState();
  const info = bpCategory(patient.systolic, patient.diastolic);

  return (
    <AppShell eyebrow="(d) Blood Pressure" title="Blood pressure analysis">
      <div className="grid grid-cols-12 gap-5">
        <Panel
          className="col-span-12 lg:col-span-5"
          title="Latest reading"
          description="Use a seated reading taken after five minutes of rest."
        >
          <div className="mt-4 grid grid-cols-2 gap-4">
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
          <div className="mt-5 rounded-2xl bg-background p-4 ring-1 ring-border">
            <p className="text-4xl font-semibold">
              {patient.systolic}
              <span className="text-xl text-muted-foreground">
                /{patient.diastolic}
              </span>
            </p>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 font-mono text-[11px] font-medium ${toneClass[info.tone]}`}
            >
              {info.label}
            </span>
          </div>
        </Panel>

        <Panel
          className="col-span-12 lg:col-span-7 [animation-delay:120ms]"
          title="Classification guide"
          description="Your reading is highlighted below."
        >
          <ul className="mt-4 space-y-2">
            {ranges.map((r) => (
              <li
                key={r.label}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${r.label === info.label ? toneClass[r.tone] : "bg-background ring-1 ring-border"}`}
              >
                <span className="font-medium">{r.label}</span>
                <span className="font-mono text-[11px]">{r.range}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-pretty text-muted-foreground">
            Raised blood pressure often travels with insulin resistance, so it
            carries weight in the diabetes risk score.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
