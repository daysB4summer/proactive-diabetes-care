import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Field, Panel } from "@/components/AppShell";
import { updatePatient, useHealthState } from "@/lib/patient-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Patient Profile — HealthGuard AI" },
      {
        name: "description",
        content:
          "Update your age, gender, pregnancies and family history so HealthGuard AI can score your diabetes risk accurately.",
      },
      { property: "og:title", content: "Patient Profile — HealthGuard AI" },
      {
        property: "og:description",
        content:
          "Update your age, gender, pregnancies and family history for accurate diabetes risk scoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { patient } = useHealthState();

  return (
    <AppShell eyebrow="(b) Patient Profile" title="Your profile">
      <div className="grid grid-cols-12 gap-5">
        <Panel
          className="col-span-12 lg:col-span-7"
          title="Personal details"
          description="These values feed every calculator and the diabetes risk model."
        >
          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="col-span-2 block sm:col-span-1">
              <span className="label-mono">Full name</span>
              <span className="mt-1 flex rounded-2xl bg-background px-3 py-2 ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
                <input
                  value={patient.name}
                  onChange={(e) => updatePatient({ name: e.target.value })}
                  className="w-full bg-transparent text-sm font-medium outline-none"
                />
              </span>
            </label>
            <label className="col-span-2 block sm:col-span-1">
              <span className="label-mono">Gender</span>
              <span className="mt-1 flex rounded-2xl bg-background px-3 py-2 ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
                <select
                  value={patient.gender}
                  onChange={(e) => updatePatient({ gender: e.target.value })}
                  className="w-full bg-transparent text-sm font-medium outline-none"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </span>
            </label>
            <Field
              label="Age"
              suffix="yrs"
              value={patient.age}
              onChange={(v) => updatePatient({ age: v })}
            />
            <Field
              label="Pregnancies"
              suffix="count"
              value={patient.pregnancies}
              onChange={(v) => updatePatient({ pregnancies: v })}
            />
            <Field
              label="Fasting glucose"
              suffix="mg/dL"
              value={patient.glucose}
              onChange={(v) => updatePatient({ glucose: v })}
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
        </Panel>

        <Panel
          className="col-span-12 lg:col-span-5"
          title="Why we ask"
          description="Every field maps to a feature the model was trained on."
        >
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-2xl bg-background p-3 ring-1 ring-border">
              <span className="label-mono">Glucose</span>
              <p className="mt-1 text-pretty">
                Strongest single predictor in the Pima dataset.
              </p>
            </li>
            <li className="rounded-2xl bg-background p-3 ring-1 ring-border">
              <span className="label-mono">Age & pregnancies</span>
              <p className="mt-1 text-pretty">
                Risk rises with age and with each pregnancy history entry.
              </p>
            </li>
            <li className="rounded-2xl bg-background p-3 ring-1 ring-border">
              <span className="label-mono">Family history</span>
              <p className="mt-1 text-pretty">
                Stands in for the diabetes pedigree function feature.
              </p>
            </li>
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
