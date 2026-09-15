import { Globe } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { languages, type Lang } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const current = languages.find((l) => l.code === lang) ?? languages[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={t("nav.language")}
          className={`gap-2 rounded-full text-xs text-muted-foreground transition-all duration-400 hover:-translate-y-0.5 hover:border-signal/50 hover:text-foreground ${className ?? ""}`}
        >
          <Globe className="size-4" />
          <span className="uppercase">{current.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={l.code === lang ? "text-signal" : undefined}
          >
            {l.native}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
