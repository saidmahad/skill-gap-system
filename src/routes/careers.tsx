import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, TrendingUp, Wallet } from "lucide-react";
import { listCareers } from "@/lib/skillgap.functions";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Career benchmarks — SkillGap" },
      {
        name: "description",
        content:
          "Browse career paths with market demand, salary bands and the exact skill benchmark used to score your readiness.",
      },
      { property: "og:title", content: "Career benchmarks — SkillGap" },
      {
        property: "og:description",
        content: "Explore career paths and the skills each one really requires.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const fetchCareers = useServerFn(listCareers);
  const { data, isLoading } = useQuery({
    queryKey: ["careers"],
    queryFn: () => fetchCareers(),
  });

  return (
    <section className="relative isolate px-5 py-20 sm:px-8">
      <div className="veil pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Career library</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Every path comes with a <span className="text-gradient">measurable benchmark</span>.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Pick a target career, then run the analyzer to see exactly which of its skills you
            already hold and which ones stand between you and the role.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-border bg-surface/50" />
            ))}
          {data?.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <article className="surface-card group flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {c.category}
                  </span>
                  <span className="font-mono text-xs text-signal">{c.demand_score}</span>
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-signal">
                  {c.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.summary}
                </p>
                <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-3.5 text-signal" /> {c.growth_label}
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="size-3.5 text-signal" /> {c.salary_range}
                  </div>
                </div>
                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-signal transition-[width] duration-1000 ease-out"
                    style={{ width: `${c.demand_score}%` }}
                  />
                </div>
                <Link
                  to="/analyze"
                  search={{ career: c.slug }}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-signal"
                >
                  Analyse my gap
                  <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
