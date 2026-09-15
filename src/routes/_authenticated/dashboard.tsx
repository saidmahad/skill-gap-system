import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Sparkles, Trash2, ArrowRight, Clock } from "lucide-react";
import { listAnalyses, deleteAnalysis } from "@/lib/skillgap.functions";
import { useAuth } from "@/hooks/useAuth";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — SkillGap" },
      {
        name: "description",
        content: "Track every skill-gap analysis you have run and your readiness over time.",
      },
      { property: "og:title", content: "Your dashboard — SkillGap" },
      { property: "og:description", content: "Your saved skill-gap analyses and readiness scores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const fetchAnalyses = useServerFn(listAnalyses);
  const removeAnalysis = useServerFn(deleteAnalysis);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => fetchAnalyses(),
  });

  const del = useMutation({
    mutationFn: (id: string) => removeAnalysis({ data: { id } }),
    onSuccess: () => {
      toast.success("Analysis deleted");
      void refetch();
    },
    onError: () => toast.error("Could not delete that analysis"),
  });

  const best = data?.reduce((m, a) => Math.max(m, a.readiness_score), 0) ?? 0;
  const name = (user?.user_metadata as { full_name?: string } | undefined)?.full_name;

  return (
    <section className="relative isolate px-5 py-16 sm:px-8">
      <div className="veil pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {name ? `Welcome back, ${name.split(" ")[0]}.` : "Welcome back."}
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              Run a new analysis or revisit a previous comparison to track how your gaps are
              closing.
            </p>
          </div>
          <Link
            to="/analyze"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-signal px-5 py-3 text-xs font-semibold text-signal-foreground transition-all duration-500 hover:shadow-[var(--shadow-glow)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="size-4" /> New analysis
            </span>
            <span className="absolute inset-0 -translate-x-full bg-foreground/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Analyses run", value: data?.length ?? 0 },
            { label: "Best readiness", value: `${best}%` },
            {
              label: "Open gaps",
              value: data?.[0] ? data[0].gap_count : 0,
            },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="surface-card p-6">
                <div className="eyebrow">{s.label}</div>
                <div className="mt-3 font-display text-3xl font-semibold tabular-nums text-signal">
                  {s.value}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="font-display text-lg font-semibold tracking-tight">Your analyses</h2>

          {isLoading && (
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface/50" />
              ))}
            </div>
          )}

          {!isLoading && (data?.length ?? 0) === 0 && (
            <div className="surface-card mt-6 p-10 text-center">
              <Sparkles className="mx-auto size-7 text-signal" />
              <p className="mt-4 font-display text-lg font-semibold">No analysis yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Choose a career, tell us the skills you already have, and we will show you the exact
                distance to the role.
              </p>
              <Link
                to="/analyze"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-signal/50 px-5 py-2.5 text-xs font-semibold text-signal transition-all duration-400 hover:-translate-y-0.5 hover:bg-signal/10"
              >
                Start your first analysis <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {data?.map((a, i) => (
              <Reveal key={a.id} delay={i * 60}>
                <div className="surface-card flex flex-wrap items-center gap-5 p-5">
                  <div
                    className={cn(
                      "grid size-14 shrink-0 place-items-center rounded-xl font-display text-sm font-semibold tabular-nums",
                      a.readiness_score >= 75
                        ? "bg-signal/15 text-signal"
                        : a.readiness_score >= 45
                          ? "bg-amber/15 text-amber"
                          : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {a.readiness_score}%
                  </div>
                  <div className="min-w-40 flex-1">
                    <p className="font-display text-sm font-semibold">
                      {a.careers?.title ?? "Career"}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {new Date(a.created_at).toLocaleDateString()} · {a.matched_count} matched ·{" "}
                      {a.gap_count} gaps
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/results/$id"
                      params={{ id: a.id }}
                      className="rounded-full border border-border px-4 py-2 text-xs font-semibold transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/50 hover:text-signal"
                    >
                      View report
                    </Link>
                    <button
                      aria-label="Delete analysis"
                      onClick={() => del.mutate(a.id)}
                      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-400 hover:border-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
