import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ScoreRing({
  value,
  size = 168,
  label = "Readiness",
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone = value >= 75 ? "text-signal" : value >= 45 ? "text-amber" : "text-destructive";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * shown) / 100}
          className={cn("transition-[stroke-dashoffset] duration-[1400ms] ease-out", tone)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute text-center">
        <div className={cn("font-display text-4xl font-semibold tabular-nums", tone)}>
          {Math.round(shown)}%
        </div>
        <div className="eyebrow mt-1">{label}</div>
      </div>
    </div>
  );
}
