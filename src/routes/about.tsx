import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass, ShieldCheck, Target, Users } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us — SkillGap" },
      {
        name: "description",
        content:
          "SkillGap helps graduates compare their real skills against career benchmarks and get a clear, prioritised plan to close the gap.",
      },
      { property: "og:title", content: "About us — SkillGap" },
      {
        property: "og:description",
        content:
          "Who we are, why we built a skill-gap analyzer, and how we protect the data you trust us with.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: Target,
    title: "Clarity over noise",
    body: "One readiness score, one prioritised list of missing skills. No dashboards you need a manual to read.",
  },
  {
    icon: Compass,
    title: "Actionable by default",
    body: "Every gap ships with a learning resource, so the next step is always obvious.",
  },
  {
    icon: Users,
    title: "Built for real graduates",
    body: "Designed with students and career advisors, tested against live labour-market skill demand.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Your profile and analyses are yours alone — row-level access control, encrypted in transit and at rest.",
  },
];

const steps = [
  { n: "01", t: "Create your account", b: "Register in seconds with email or Google." },
  { n: "02", t: "Choose a career", b: "Pick from a library of benchmarked roles." },
  { n: "03", t: "Rate your skills", b: "Tell us the level you actually have, 0 to 5." },
  { n: "04", t: "Get your gap report", b: "Compare, prioritise, and start learning." },
];

function About() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="veil pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <p className="eyebrow">About us</p>
            <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.05] font-semibold">
              We turn a vague worry into a <span className="text-gradient">measurable plan</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Most graduates know something is missing — they just can't name it. SkillGap
              compares what you have against what the role actually requires, then hands you the
              shortest path between the two.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 90}>
              <article className="surface-card group h-full p-7">
                <v.icon className="size-5 text-signal transition-transform duration-500 group-hover:scale-110" />
                <h2 className="mt-5 font-display text-base font-semibold">{v.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold">
              Four steps, about five minutes.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="surface-card h-full p-6">
                  <span className="font-mono text-xs tracking-widest text-signal">{s.n}</span>
                  <h3 className="mt-3 font-display text-sm font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-semibold">
            Ready to see your number?
          </h2>
          <Link
            to="/auth"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-signal-foreground transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
          >
            Start your analysis
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
