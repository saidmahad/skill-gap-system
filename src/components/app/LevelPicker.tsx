import { cn } from "@/lib/utils";

const LEVELS = ["None", "Aware", "Basic", "Working", "Strong", "Expert"];

export function LevelPicker({
  value,
  required,
  onChange,
}: {
  value: number;
  required: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {LEVELS.map((l, i) => {
        const active = value === i;
        const meets = i >= required;
        return (
          <button
            key={l}
            type="button"
            aria-label={`${l} (level ${i})`}
            onClick={() => onChange(i)}
            className={cn(
              "group relative rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              active
                ? meets
                  ? "border-signal/70 bg-signal/20 text-foreground shadow-[var(--shadow-glow)]"
                  : "border-amber/60 bg-amber/15 text-foreground"
                : "border-border text-muted-foreground hover:-translate-y-0.5 hover:border-signal/50 hover:text-foreground",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

export const LEVEL_LABELS = LEVELS;
