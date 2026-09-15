import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, Sparkles, X } from "lucide-react";
import { listCareers, getCareerBundle, saveAnalysis } from "@/lib/skillgap.functions";
import { LevelPicker } from "@/components/app/LevelPicker";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

type Search = { career?: string | undefined };

export const Route = createFileRoute("/_authenticated/analyze")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    career: typeof search["career"] === "string" ? (search["career"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Run a skill-gap analysis — SkillGap" },
      {
        name: "description",
        content:
          "Choose your target career, rate the skills you already have and get an instant weighted gap report.",
      },
      { property: "og:title", content: "Run a skill-gap analysis — SkillGap" },
      {
        property: "og:description",
        content: "Career benchmark vs. your skills, compared instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyzePage,
});

const STEPS = ["Choose career", "Rate your skills", "Review & save"];

function AnalyzePage() {
  const navigate = useNavigate();
  const { career: careerParam } = Route.useSearch();

  const fetchCareers = useServerFn(listCareers);
  const fetchBundle = useServerFn(getCareerBundle);
  const persist = useServerFn(saveAnalysis);

  const [step, setStep] = useState(careerParam ? 1 : 0);
  const [slug, setSlug] = useState<string | undefined>(careerParam);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<string[]>([]);
  const [extraDraft, setExtraDraft] = useState("");
  const [notes, setNotes] = useState("");

  const careersQuery = useQuery({ queryKey: ["careers"], queryFn: () => fetchCareers() });
  const bundleQuery = useQuery({
    queryKey: ["career-bundle", slug],
    queryFn: () => fetchBundle({ data: { slug: slug! } }),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    setLevels({});
  }, [slug]);

  const skills = bundleQuery.data?.skills ?? [];
  const career = bundleQuery.data?.career;

  const preview = useMemo(() => {
    if (skills.length === 0) return { score: 0, matched: 0, gaps: 0 };
    let max = 0;
    let got = 0;
    let matched = 0;
    for (const s of skills) {
      const need = Math.max(s.required_level, 1);
      const have = levels[s.id] ?? 0;
      max += need * s.importance;
      got += Math.min(have, need) * s.importance;
      if (have >= s.required_level) matched += 1;
    }
    return {
      score: max === 0 ? 0 : Math.round((got / max) * 100),
      matched,
      gaps: skills.length - matched,
    };
  }, [skills, levels]);

  const save = useMutation({
    mutationFn: async () => {
      if (!career) throw new Error("Pick a career first");
      return persist({
        data: {
          careerId: career.id,
          notes: notes.trim() || undefined,
          extraSkills: extras,
          skills: skills.map((s) => ({
            skill_name: s.skill_name,
            skill_category: s.skill_category,
            required_level: s.required_level,
            user_level: levels[s.id] ?? 0,
            importance: s.importance,
            resource_label: s.resource_label,
            resource_url: s.resource_url,
          })),
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Your gap report is ready.");
      void navigate({ to: "/results/$id", params: { id: res.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save analysis"),
  });

  function addExtra() {
    const v = extraDraft.trim().slice(0, 60);
    if (!v) return;
    if (extras.includes(v)) {
      setExtraDraft("");
      return;
    }
    if (extras.length >= 30) return;
    setExtras((p) => [...p, v]);
    setExtraDraft("");
  }

  return (
    <section className="relative isolate px-5 py-16 sm:px-8">
      <div className="veil pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="eyebrow">Skill-gap analyzer</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps to your <span className="text-gradient">readiness score</span>.
          </h1>
        </Reveal>

        {/* Stepper */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === step
                    ? "border-signal/60 bg-signal/15 text-foreground shadow-[var(--shadow-glow)]"
                    : i < step
                      ? "border-signal/30 text-signal hover:-translate-y-0.5"
                      : "border-border text-muted-foreground",
                )}
              >
                <span className="grid size-5 place-items-center rounded-full bg-background/60 font-mono text-[10px]">
                  {i < step ? <Check className="size-3" /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <span className="hidden h-px w-8 bg-border sm:block" />}
            </div>
          ))}
        </div>

        {/* Step 0 */}
        {step === 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careersQuery.isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-surface/50" />
              ))}
            {careersQuery.data?.map((c, i) => (
              <Reveal key={c.id} delay={i * 50}>
                <button
                  onClick={() => {
                    setSlug(c.slug);
                    setStep(1);
                  }}
                  className={cn(
                    "surface-card group h-full w-full p-5 text-left",
                    slug === c.slug && "border-signal/60",
                  )}
                >
                  <span className="eyebrow">{c.category}</span>
                  <p className="mt-3 font-display text-base font-semibold transition-colors duration-300 group-hover:text-signal">
                    {c.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {c.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-signal">
                    Select
                    <ArrowRight className="size-3 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
            <div>
              {bundleQuery.isLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface/50" />
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {skills.map((s, i) => {
                  const have = levels[s.id] ?? 0;
                  const meets = have >= s.required_level;
                  return (
                    <Reveal key={s.id} delay={i * 35}>
                      <div className="surface-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-display text-sm font-semibold">{s.skill_name}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {s.skill_category} · required level {s.required_level} · importance{" "}
                              {s.importance}/5
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500",
                              meets
                                ? "bg-signal/15 text-signal"
                                : "bg-amber/10 text-amber",
                            )}
                          >
                            {meets ? "Meets" : "Gap"}
                          </span>
                        </div>
                        <div className="mt-4">
                          <LevelPicker
                            value={have}
                            required={s.required_level}
                            onChange={(v) => setLevels((p) => ({ ...p, [s.id]: v }))}
                          />
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {/* extras */}
              <div className="surface-card mt-6 p-5">
                <p className="font-display text-sm font-semibold">
                  Other skills you already have
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Anything outside this benchmark — languages, tools, certifications.
                </p>
                <div className="mt-4 flex gap-2">
                  <input
                    value={extraDraft}
                    onChange={(e) => setExtraDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addExtra();
                      }
                    }}
                    placeholder="e.g. Arabic, Photoshop, CCNA"
                    className="flex-1 rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm outline-none transition-all duration-400 focus:border-signal/60 focus:shadow-[var(--shadow-glow)]"
                  />
                  <button
                    onClick={addExtra}
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-border transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/60 hover:text-signal"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                {extras.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {extras.map((x) => (
                      <span
                        key={x}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] transition-colors duration-300 hover:border-signal/50"
                      >
                        {x}
                        <button
                          aria-label={`Remove ${x}`}
                          onClick={() => setExtras((p) => p.filter((e) => e !== x))}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="surface-card sticky top-24 p-6">
              <p className="eyebrow">Live preview</p>
              <p className="mt-3 font-display text-4xl font-semibold tabular-nums text-signal">
                {preview.score}%
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-signal transition-[width] duration-700 ease-out"
                  style={{ width: `${preview.score}%` }}
                />
              </div>
              <dl className="mt-5 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <dt>Career</dt>
                  <dd className="text-foreground">{career?.title ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Matched</dt>
                  <dd className="text-signal">{preview.matched}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Gaps</dt>
                  <dd className="text-amber">{preview.gaps}</dd>
                </div>
              </dl>
              <button
                onClick={() => setStep(2)}
                disabled={skills.length === 0}
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-signal px-5 py-2.5 text-xs font-semibold text-signal-foreground transition-all duration-500 hover:shadow-[var(--shadow-glow)] disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Review
                  <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-foreground/15 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
              <button
                onClick={() => setStep(0)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3" /> Change career
              </button>
            </aside>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Reveal className="mt-10">
            <div className="surface-card p-7 sm:p-9">
              <Sparkles className="size-6 text-signal" />
              <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                Ready to compare against {career?.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                We will store this snapshot so you can measure progress later. Everything is private
                to your account.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  { k: "Readiness", v: `${preview.score}%` },
                  { k: "Skills matched", v: preview.matched },
                  { k: "Skills to improve", v: preview.gaps },
                ].map((x) => (
                  <div key={x.k} className="rounded-xl border border-border p-4">
                    <div className="eyebrow">{x.k}</div>
                    <div className="mt-2 font-display text-2xl font-semibold tabular-nums">
                      {x.v}
                    </div>
                  </div>
                ))}
              </div>

              <label className="mt-7 block">
                <span className="eyebrow">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 600))}
                  rows={3}
                  placeholder="Target graduation date, preferred city, constraints…"
                  className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-all duration-400 focus:border-signal/60 focus:shadow-[var(--shadow-glow)]"
                />
              </label>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => save.mutate()}
                  disabled={save.isPending}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground transition-all duration-500 hover:shadow-[var(--shadow-glow)] disabled:opacity-60"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {save.isPending && <Loader2 className="size-4 animate-spin" />}
                    Generate my gap report
                    <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-foreground/15 transition-transform duration-500 group-hover:translate-x-0" />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/50"
                >
                  <ArrowLeft className="size-4" /> Edit skills
                </button>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
