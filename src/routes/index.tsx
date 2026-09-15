import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Compass,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import heroGraph from "@/assets/hero-graph.jpg";
import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillGap — Close the graduate skills gap with AI" },
      {
        name: "description",
        content:
          "SkillGap compares your skills with the requirements of your target career to reveal what's missing and what to learn next.",
      },
      { property: "og:title", content: "SkillGap — Close the graduate skills gap with AI" },
      {
        property: "og:description",
        content:
          "SkillGap compares your skills with the requirements of your target career to reveal what's missing and what to learn next.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const metrics = [
  { value: "≥90%", key: "metric.precision" },
  { value: "<500ms", key: "metric.latency" },
  { value: "99.9%", key: "metric.uptime" },
  { value: "500", key: "metric.users" },
];

const personas = [
  { icon: GraduationCap, id: "grad" },
  { icon: Compass, id: "adv" },
  { icon: Briefcase, id: "emp" },
];

const capabilities = [
  { icon: UserCircle2, n: 1 },
  { icon: Sparkles, n: 2 },
  { icon: BarChart3, n: 3 },
  { icon: LineChart, n: 4 },
  { icon: BookOpen, n: 5 },
  { icon: ShieldCheck, n: 6 },
];

function Home() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="veil pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
          <div>
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-signal" />
                {t("home.badge")}
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-7 font-display text-[clamp(2.6rem,6.2vw,4.5rem)] leading-[0.98] font-semibold">
                {t("home.h1a")} <span className="text-gradient">{t("home.h1b")}</span>
                {t("home.h1c")}
              </h1>
            </Reveal>
            <Reveal delay={170}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("home.lede")}
              </p>
            </Reveal>
            <Reveal delay={250}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/auth"
                  className="group relative overflow-hidden rounded-full bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground transition-shadow duration-500 hover:shadow-[var(--shadow-glow)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("home.ctaPrimary")}
                    <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-foreground/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                </Link>
                <Link
                  to="/careers"
                  className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-all duration-400 hover:border-signal/60 hover:bg-surface"
                >
                  {t("home.ctaSecondary")}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative animate-float rounded-3xl border border-border p-2 shadow-[var(--shadow-lift)]">
              <img
                src={heroGraph}
                alt="Skill knowledge graph connecting graduate profiles to job-market demand"
                width={1600}
                height={1200}
                className="rounded-2xl"
              />
              <div className="absolute -bottom-6 -left-4 rounded-2xl border border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:-left-8">
                <p className="font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase">
                  {t("home.gapDetected")}
                </p>
                <p className="mt-1 font-display text-sm font-semibold">{t("home.gapExample")}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Metrics */}
        <div className="relative border-y border-border">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <Reveal
                key={m.key}
                delay={i * 80}
                className="group border-border py-8 transition-colors duration-500 hover:bg-surface/60 lg:border-l lg:px-8 lg:first:border-l-0"
              >
                <p className="font-display text-3xl font-semibold text-signal transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-4xl">
                  {m.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{t(m.key)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <p className="eyebrow">{t("personas.eyebrow")}</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-tight font-semibold">
            {t("personas.title")}
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {personas.map((p, i) => (
            <Reveal key={p.id} delay={i * 110}>
              <article className="surface-card group h-full p-7">
                <p.icon className="size-6 text-signal transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mt-5 font-display text-lg font-semibold">
                  {t(`persona.${p.id}.name`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`persona.${p.id}.need`)}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {[1, 2, 3].map((n) => (
                    <li
                      key={n}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-muted-foreground transition-colors duration-400 group-hover:border-signal/40 group-hover:text-foreground"
                    >
                      {t(`persona.${p.id}.t${n}`)}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <p className="eyebrow">{t("cap.eyebrow")}</p>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-tight font-semibold">
              {t("cap.title")}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.n} delay={(i % 3) * 100}>
                <article className="surface-card group relative h-full overflow-hidden p-7">
                  <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-signal transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                  <c.icon className="size-5 text-signal" />
                  <h3 className="mt-5 font-display text-base font-semibold">{t(`cap.${c.n}.t`)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`cap.${c.n}.b`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="veil pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight font-semibold">
              {t("cta.titleA")} <span className="text-gradient">{t("cta.titleB")}</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{t("cta.body")}</p>
            <Link
              to="/auth"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-signal-foreground transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
            >
              {t("cta.button")}
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
