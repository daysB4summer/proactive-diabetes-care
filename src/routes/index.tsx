import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { selectedModel } from "@/lib/health";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — HealthGuard AI" },
      {
        name: "description",
        content:
          "Secure sign in to HealthGuard AI, the machine-learning diabetes risk prediction dashboard for patients.",
      },
      { property: "og:title", content: "Sign in — HealthGuard AI" },
      {
        property: "og:description",
        content:
          "Secure sign in to HealthGuard AI, the machine-learning diabetes risk prediction dashboard for patients.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("priya@healthguard.ai");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="flex flex-col justify-between bg-brand/10 p-8 lg:p-14">
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

        <div className="max-w-md rise [animation-delay:100ms]">
          <h1 className="text-4xl font-semibold leading-tight text-balance">
            Know your diabetes risk before it becomes a diagnosis.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            HealthGuard AI reads your profile, BMI, blood pressure and glucose
            history, then scores your risk with a model trained and selected
            automatically from Logistic Regression and Random Forest.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
              <p className="label-mono">Accuracy</p>
              <p className="mt-1 text-2xl font-semibold">{(selectedModel.accuracy * 100).toFixed(1)}%</p>
            </div>
            <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
              <p className="label-mono">Features</p>
              <p className="mt-1 text-2xl font-semibold">6</p>
            </div>
            <div className="rounded-2xl bg-surface p-4 ring-1 ring-border">
              <p className="label-mono">Report</p>
              <p className="mt-1 text-2xl font-semibold">PDF</p>
            </div>
          </div>
        </div>

        <p className="font-mono text-[11px] text-muted-foreground">
          For demonstration · Not medical advice
        </p>
      </section>

      <section className="flex items-center justify-center p-8 lg:p-14">
        <form
          onSubmit={submit}
          className="w-full max-w-sm rounded-[28px] bg-surface p-8 ring-1 ring-border rise [animation-delay:160ms]"
        >
          <p className="label-mono">Secure login</p>
          <h2 className="mt-2 text-2xl font-semibold">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to view your risk dashboard.
          </p>

          <label className="mt-6 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-background px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-ring"
          />

          <label className="mt-4 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-background px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-ring"
          />

          {error ? (
            <p className="mt-3 text-sm text-accent">{error}</p>
          ) : null}

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand/90"
          >
            Sign in
          </button>
          <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">
            Demo credentials are pre-filled
          </p>
        </form>
      </section>
    </div>
  );
}
