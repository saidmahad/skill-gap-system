import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy, Mail, MessageCircleQuestion, Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Help with your skill-gap analysis | SkillGap" },
      {
        name: "description",
        content:
          "Answers to common questions about accounts, careers, skill ratings, readiness scores and privacy — plus how to reach the SkillGap team.",
      },
      { property: "og:title", content: "Support — SkillGap" },
      {
        property: "og:description",
        content: "FAQs and direct help for anything related to your skill-gap analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Support,
});

const faqs = [
  {
    q: "How do I create an account?",
    a: "Go to Sign in, choose Create account, and register with your email and a password — or continue with Google. Your profile is created automatically.",
  },
  {
    q: "How is my readiness score calculated?",
    a: "For each skill the career requires, we compare your level with the benchmark level and weight it by how important the skill is for the role. The score is the weighted share of the benchmark you already meet.",
  },
  {
    q: "What do the skill levels 0–5 mean?",
    a: "0 means no exposure, 1–2 is learning basics, 3 is comfortable in real work, 4 is strong and independent, 5 is expert level able to mentor others. Be honest — an inflated rating only hides a real gap.",
  },
  {
    q: "Can I run more than one analysis?",
    a: "Yes. Run an analysis for every career you're considering and compare them side by side from your dashboard. Re-run the same career later to see how much you've closed.",
  },
  {
    q: "Can I delete my data?",
    a: "Yes. Delete any analysis from your dashboard at any time. Your analyses are visible only to you — access is enforced at the database level.",
  },
  {
    q: "My career isn't listed. What now?",
    a: "Pick the closest role for now and send us a message — we add new benchmarked careers regularly based on what people ask for.",
  },
];

function Support() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="veil pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <p className="eyebrow">Support</p>
            <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.05] font-semibold">
              Stuck somewhere? <span className="text-gradient">We'll unstick you.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Start with the questions below — most answers live here. If not, message us and a
              real person replies.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-display text-xl font-semibold">Frequently asked questions</h2>
        </Reveal>
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300 hover:bg-surface"
                >
                  <span className="font-display text-sm font-semibold">{f.q}</span>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-signal transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-surface/60">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-20 sm:px-8 md:grid-cols-3">
          {[
            {
              icon: MessageCircleQuestion,
              t: "Run a new analysis",
              b: "Pick a career, rate your skills and get an updated gap report.",
              to: "/dashboard" as const,
              cta: "Go to dashboard",
            },
            {
              icon: LifeBuoy,
              t: "Trouble signing in?",
              b: "Reset from the sign-in screen or try Google if email fails.",
              to: "/auth" as const,
              cta: "Go to sign in",
            },
            {
              icon: Mail,
              t: "Explore careers",
              b: "Browse benchmarked roles before you run an analysis.",
              to: "/careers" as const,
              cta: "View careers",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 90}>
              <article className="surface-card group flex h-full flex-col p-7">
                <c.icon className="size-5 text-signal transition-transform duration-500 group-hover:scale-110" />
                <h3 className="mt-5 font-display text-base font-semibold">{c.t}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.b}</p>
                <Link
                  to={c.to}
                  className="link-underline mt-5 self-start text-xs font-semibold text-signal"
                >
                  {c.cta}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
