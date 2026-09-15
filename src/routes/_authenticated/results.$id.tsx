import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Target, TriangleAlert } from "lucide-react";
import { getAnalysis } from "@/lib/skillgap.functions";
import { ScoreRing } from "@/components/app/ScoreRing";
import { Reveal } from "@/components/site/Reveal";
import { LEVEL_LABELS } from "@/components/app/LevelPicker";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/results/$id")({
  head: () => ({
    meta: [
      { title: "Your skill-gap report — SkillGap" },
      {
        name: "description",
        content:
          "Side-by-side comparison of your skills against the career benchmark, with a prioritised improvement plan.",
      },
      { property: "og:title", content: "Your skill-gap report — SkillGap" },
      { property: "og:description", content: "Where you stand and what to learn next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { id } = Route.useParams();
  const fetchAnalysis = useServerFn(getAnalysis);
  const { data, isLoading } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => fetchAnalysis({ data: { id } }),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface/50" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">Report not found</h1>
        <Link to="/dashboard" className="mt-6 inline-block text-sm text-signal link-underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { analysis, skills } = data;
  const sorted = [...skills].sort(
    (a, b) =>
      (b.required_level - b.user_level) * b.importance -
      (a.required_level - a.user_level) * a.importance,
  );
  const gaps = sorted.filter((s) => s.user_level < s.required_level);
  const strengths = sorted.filter((s) => s.user_level >= s.required_level);
  const score = analysis.readiness_score;
  const verdict =
    score >= 80
      ? "You are job-ready for this path. Focus on depth and portfolio evidence."
      : score >= 55
        ? "You are on track. Close the priority gaps below to become competitive."
        : "Early stage. Start with the highest-weighted gaps — they move your score the most.";

  return (
    <section className="relative isolate px-5 py-16 sm:px-8">
      <div className="veil pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-5xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Dashboard
        </Link>

        <Reveal className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
          <ScoreRing value={score} />
          <div>
            <p className="eyebrow">Gap report · {new Date(analysis.created_at).toLocaleDateString()}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {analysis.careers?.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{verdict}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <Badge tone="ok">{analysis.matched_count} skills matched</Badge>
              <Badge tone="warn">{analysis.gap_count} skills to improve</Badge>
              <Badge tone="muted">{analysis.careers?.salary_range}</Badge>
            </div>
          </div>
        </Reveal>

        {/* Comparison bars */}
        <Reveal className="mt-14" delay={80}>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Benchmark vs. your level
          </h2>
          <div className="surface-card mt-5 divide-y divide-border p-2">
            {sorted.map((s, i) => {
              const met = s.user_level >= s.required_level;
              return (
                <div key={s.id} className="grid gap-3 p-4 sm:grid-cols-[220px_1fr] sm:items-center">
                  <div>
                    <p className="text-sm font-medium">{s.skill_name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {LEVEL_LABELS[s.user_level]} / needs {LEVEL_LABELS[s.required_level]}
                    </p>
                  </div>
                  <div className="relative h-6">
                    <div className="absolute inset-y-2 left-0 right-0 rounded-full bg-border/60" />
                    <div
                      className="absolute inset-y-2 left-0 rounded-full bg-muted-foreground/40 transition-[width] duration-1000 ease-out"
                      style={{
                        width: `${(s.required_level / 5) * 100}%`,
                        transitionDelay: `${i * 40}ms`,
                      }}
                    />
                    <div
                      className={cn(
                        "absolute inset-y-2 left-0 rounded-full transition-[width] duration-1000 ease-out",
                        met ? "bg-signal" : "bg-amber",
                      )}
                      style={{
                        width: `${(s.user_level / 5) * 100}%`,
                        transitionDelay: `${i * 40 + 120}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Improvement plan */}
        <Reveal className="mt-14" delay={100}>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <Target className="size-4 text-amber" /> What to improve, in priority order
          </h2>
          {gaps.length === 0 ? (
            <p className="surface-card mt-5 p-6 text-sm text-muted-foreground">
              No gaps left against this benchmark. Deepen your portfolio and target specialisations.
            </p>
          ) : (
            <ol className="mt-5 space-y-3">
              {gaps.map((s, i) => (
                <li key={s.id} className="surface-card flex flex-wrap items-center gap-4 p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber/15 font-mono text-xs text-amber">
                    {i + 1}
                  </span>
                  <div className="min-w-40 flex-1">
                    <p className="text-sm font-semibold">{s.skill_name}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Move from {LEVEL_LABELS[s.user_level]} to {LEVEL_LABELS[s.required_level]} ·
                      impact weight {(s.required_level - s.user_level) * s.importance}
                    </p>
                  </div>
                  {s.resource_url && (
                    <a
                      href={s.resource_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/50 hover:text-signal"
                    >
                      {s.resource_label ?? "Learn"}
                      <ArrowUpRight className="size-3 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Reveal>

        {/* Strengths */}
        <Reveal className="mt-14" delay={120}>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <CheckCircle2 className="size-4 text-signal" /> Strengths you already bring
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {strengths.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No benchmark skill is fully met yet — that is normal at the start.
              </p>
            )}
            {strengths.map((s) => (
              <span
                key={s.id}
                className="rounded-full border border-signal/40 bg-signal/10 px-3.5 py-1.5 text-xs text-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                {s.skill_name}
              </span>
            ))}
            {analysis.extra_skills?.map((s: string) => (
              <span
                key={s}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                {s} · extra
              </span>
            ))}
          </div>
        </Reveal>

        {analysis.notes && (
          <Reveal className="mt-10" delay={140}>
            <div className="surface-card flex gap-3 p-5">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{analysis.notes}</p>
            </div>
          </Reveal>
        )}

        <div className="mt-14 flex flex-wrap gap-3">
          <Link
            to="/analyze"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground transition-all duration-500 hover:shadow-[var(--shadow-glow)]"
          >
            <span className="relative z-10">Run another analysis</span>
            <span className="absolute inset-0 -translate-x-full bg-foreground/15 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/50"
          >
            Compare another career
          </Link>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "ok" | "warn" | "muted" }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 font-medium",
        tone === "ok" && "bg-signal/15 text-signal",
        tone === "warn" && "bg-amber/15 text-amber",
        tone === "muted" && "border border-border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
