import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — SkillGap" },
      {
        name: "description",
        content:
          "Create your SkillGap account to analyse your skills against a target career and get a personalised improvement plan.",
      },
      { property: "og:title", content: "Sign in or create an account — SkillGap" },
      {
        property: "og:description",
        content: "Register, choose a career, and measure your real skill gap in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const em = emailSchema.safeParse(email);
    if (!em.success) {
      toast.error(em.error.issues[0]!.message);
      return;
    }
    const pw = passwordSchema.safeParse(password);
    if (!pw.success) {
      toast.error(pw.error.issues[0]!.message);
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: em.data,
          password: pw.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim().slice(0, 80) },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your inbox to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: em.data,
          password: pw.data,
        });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Try again.");
      return;
    }
    if (result.redirected) return;
  }

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden px-5 py-16 sm:px-8">
      <div className="veil pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <Reveal className="hidden lg:block">
          <p className="eyebrow">Step 01 — Create your account</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight">
            Measure the distance between <span className="text-gradient">who you are</span> and the
            career you want.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Register once, pick a target career, rate the skills you already have, and receive a
            side-by-side comparison with a prioritised plan for everything you are missing.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {[
              "Benchmarks built from real role requirements",
              "Weighted readiness score, not a vague grade",
              "Curated learning resource for every gap",
            ].map((t, i) => (
              <li key={t} className="flex items-start gap-3" style={{ transitionDelay: `${i}ms` }}>
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-signal" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="surface-card p-7 sm:p-9">
            <div className="mb-7 grid grid-cols-2 gap-1 rounded-full border border-border p-1">
              {(["signup", "signin"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    mode === m
                      ? "bg-signal text-signal-foreground shadow-[var(--shadow-glow)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "signup" ? "Create account" : "Sign in"}
                </button>
              ))}
            </div>

            {sent ? (
              <div className="text-center">
                <Mail className="mx-auto size-8 text-signal" />
                <h2 className="mt-4 font-display text-xl font-semibold">Confirm your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We sent a confirmation link to <span className="text-foreground">{email}</span>.
                  Open it to activate your account, then sign in.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setMode("signin");
                  }}
                  className="mt-6 text-xs font-semibold text-signal link-underline"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={onSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <Field
                      icon={<User className="size-4" />}
                      label="Full name"
                      value={fullName}
                      onChange={setFullName}
                      placeholder="Amina Yusuf"
                      type="text"
                    />
                  )}
                  <Field
                    icon={<Mail className="size-4" />}
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@university.edu"
                    type="email"
                  />
                  <Field
                    icon={<Lock className="size-4" />}
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="At least 8 characters"
                    type="password"
                  />

                  <button
                    type="submit"
                    disabled={busy}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-signal px-5 py-3 text-sm font-semibold text-signal-foreground transition-all duration-500 hover:shadow-[var(--shadow-glow)] disabled:opacity-60"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {busy && <Loader2 className="size-4 animate-spin" />}
                      {mode === "signup" ? "Create my account" : "Sign in"}
                      <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-foreground/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
                </div>

                <button
                  onClick={onGoogle}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-border px-5 py-3 text-sm font-medium transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/50 hover:bg-surface disabled:opacity-60"
                >
                  <GoogleMark />
                  Continue with Google
                </button>

                <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
                  By continuing you agree that your skill data is stored privately and only visible
                  to you.{" "}
                  <Link to="/careers" className="text-signal link-underline">
                    Browse careers first
                  </Link>
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="group relative flex items-center">
        <span className="pointer-events-none absolute left-3.5 text-muted-foreground transition-colors duration-300 group-focus-within:text-signal">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-input bg-background/60 py-3 pl-10 pr-4 text-sm outline-none transition-all duration-400 placeholder:text-muted-foreground/60 focus:border-signal/60 focus:bg-surface focus:shadow-[var(--shadow-glow)]"
        />
      </span>
    </label>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
  );
}
