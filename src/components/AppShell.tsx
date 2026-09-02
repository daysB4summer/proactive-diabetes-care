import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const toneClass = {
  mint: "bg-mint/25 text-foreground",
  peach: "bg-peach/60 text-foreground",
  accent: "bg-accent/15 text-accent",
  sky: "bg-sky/25 text-foreground",
} as const;

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/bmi", label: "BMI Calculator" },
  { to: "/blood-pressure", label: "Blood Pressure" },
  { to: "/diabetes-risk", label: "Diabetes Risk" },
] as const;

export function Field({
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

export function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[24px] bg-surface p-5 ring-1 ring-border rise ${className}`}
    >
      {title ? <p className="text-base font-semibold">{title}</p> : null}
      {description ? (
        <p className="mt-1 text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export function AppShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1240px] gap-6 px-4 py-6 sm:px-6">
        <aside className="sticky top-6 hidden h-fit w-[230px] shrink-0 rounded-[28px] bg-surface p-5 ring-1 ring-border md:block">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-brand text-brand-foreground">
              <span className="text-lg font-semibold">H</span>
            </div>
            <div>
              <p className="text-base font-semibold leading-none">
                HealthGuard <span className="text-brand">AI</span>
              </p>
              <p className="label-mono mt-1">Capstone · v1.0</p>
            </div>
          </div>
          <nav className="mt-6 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-secondary"
                activeProps={{
                  className:
                    "block rounded-2xl px-3 py-2 text-sm font-medium bg-brand text-brand-foreground hover:bg-brand",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/"
            className="mt-6 block rounded-2xl bg-peach/50 px-3 py-2 text-sm font-medium transition-opacity duration-200 hover:opacity-80"
          >
            Log out
          </Link>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="rise">
              <p className="label-mono">{eyebrow}</p>
              <h1 className="mt-1 text-3xl font-semibold text-balance">
                {title}
              </h1>
            </div>
            <div className="rise [animation-delay:120ms] text-right">
              <p className="text-sm text-muted-foreground">Model selected</p>
              <p className="font-mono text-sm font-medium">
                Random Forest · 92.4%
              </p>
            </div>
          </header>

          <nav className="mt-5 flex flex-wrap gap-2 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full bg-surface px-3 py-1.5 font-mono text-[11px] ring-1 ring-border"
                activeProps={{
                  className:
                    "rounded-full bg-brand text-brand-foreground px-3 py-1.5 font-mono text-[11px]",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              className="rounded-full bg-peach/50 px-3 py-1.5 font-mono text-[11px]"
            >
              Log out
            </Link>
          </nav>

          <main className="mt-6">{children}</main>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 font-mono text-[11px] text-muted-foreground">
            <span>HealthGuard AI · Diabetes risk only</span>
            <span>
              Final-year capstone · For demonstration, not medical advice
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
