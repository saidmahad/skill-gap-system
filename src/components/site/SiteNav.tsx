import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import brandMark from "@/assets/skillgap-mark.png";
import { useI18n } from "@/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

const links = [
  { to: "/", key: "nav.home" },
  { to: "/careers", key: "nav.careers" },
  { to: "/about", key: "nav.about" },
  { to: "/support", key: "nav.support" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/" });
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center overflow-hidden rounded-md border border-signal/25 bg-card shadow-sm transition-transform duration-500 group-hover:-translate-y-0.5">
            <img src={brandMark} alt="" width={768} height={768} className="size-8 object-contain" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">
            SkillGap
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="link-underline text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t(l.key)}
            </Link>
          ))}

          <LanguageSwitcher />

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="link-underline text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {t("nav.dashboard")}
              </Link>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSignOut}
                aria-label={t("nav.signOut")}
                className="rounded-full text-muted-foreground transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/50 hover:text-signal"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="group relative overflow-hidden rounded-full bg-signal px-4 py-2 text-xs font-semibold text-signal-foreground transition-all duration-500 hover:shadow-[var(--shadow-glow)]"
            >
              <span className="relative z-10">{t("nav.cta")}</span>
              <span className="absolute inset-0 -translate-x-full bg-foreground/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            </Link>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg transition-colors hover:border-signal/50 md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {t(l.key)}
            </Link>
          ))}
          <div className="px-3 py-2">
            <LanguageSwitcher />
          </div>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                {t("nav.dashboard")}
              </Link>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  void handleSignOut();
                }}
                className="h-auto justify-start rounded-lg px-3 py-2.5 text-left text-sm font-normal text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-signal px-3 py-2.5 text-center text-sm font-semibold text-signal-foreground"
            >
              {t("nav.cta")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
