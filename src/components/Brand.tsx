import { cn } from "@/lib/utils";
import { brand } from "@/brand";

type LogoSize = "sm" | "md" | "lg";

const SIZE: Record<LogoSize, { box: string; mark: string; markIcon: string; type: string }> = {
  sm: { box: "h-6 gap-1.5", mark: "h-5 w-5", markIcon: "h-3 w-3", type: "text-sm" },
  md: { box: "h-7 gap-2", mark: "h-7 w-7", markIcon: "h-4 w-4", type: "text-[15px]" },
  lg: { box: "h-9 gap-2.5", mark: "h-9 w-9", markIcon: "h-5 w-5", type: "text-lg" },
};

/**
 * Caret brand mark — v2.
 *
 * Anatomy:
 *   1. Bold chevron (^) — the caret apex pointing up. Stroke 3, rounded caps.
 *   2. Horizontal baseline below — the line the caret rests on. Stroke 2.5.
 *
 * Conceptually: "the caret marks where it acts; the baseline is where it
 * rests." Architectural, precise, unique enough to be brandable yet still
 * reads as the ^ glyph at favicon size.
 */
export function BrandMark({ className, size = "md" }: { className?: string; size?: LogoSize }) {
  const s = SIZE[size];
  return (
    <span
      className={cn(
        "grid place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm",
        s.mark,
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={s.markIcon}
      >
        {/* Bold chevron — the caret apex */}
        <path d="M4 14 L12 6 L20 14" strokeWidth="3" />
        {/* Baseline — the cursor's resting line */}
        <path d="M8 19 H 16" strokeWidth="2.6" />
      </svg>
    </span>
  );
}

/**
 * Wordmark — "Caret." in tight Inter SemiBold.
 * The period is always indigo — it's the brand's signature flourish
 * (nods to the tagline which always ends in a full stop).
 */
export function BrandWordmark({
  className,
  size = "md",
  showMark = true,
}: {
  className?: string;
  size?: LogoSize;
  showMark?: boolean;
}) {
  const s = SIZE[size];
  return (
    <span
      className={cn("inline-flex items-center font-semibold tracking-tight", s.box, className)}
    >
      {showMark && <BrandMark size={size} />}
      <span className={cn(s.type, "leading-none")}>
        {brand.name}
        <span className="text-primary">.</span>
      </span>
    </span>
  );
}
