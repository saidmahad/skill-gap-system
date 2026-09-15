import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-sm font-semibold">SkillGap</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
          <Link to="/careers" className="link-underline hover:text-foreground">
            {t("nav.careers")}
          </Link>
          <Link to="/about" className="link-underline hover:text-foreground">
            {t("nav.about")}
          </Link>
          <Link to="/support" className="link-underline hover:text-foreground">
            {t("nav.support")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
