import type { CategoryId } from "@/data/categories";

/**
 * Tiny, purely-visual "what this category does" preview that lives
 * inside the bento card on the home page. Inspired by 10015.io —
 * each preview is a stylized hint of a representative tool.
 *
 * All previews are inline SVG / CSS only (no extra deps, no JS work).
 * Designed at ~96px tall, full-width of the card.
 */
export function CategoryPreview({ id }: { id: CategoryId }) {
  switch (id) {
    case "programming":
      return (
        <pre className="overflow-hidden rounded-md bg-background/60 px-3 py-2 font-mono text-[10px] leading-tight text-muted-foreground ring-1 ring-border/60">
          <span className="text-indigo-500">{"{"}</span>
          <br />
          {"  "}<span className="text-foreground/80">"name"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Tools"</span>,
          <br />
          {"  "}<span className="text-foreground/80">"count"</span>: <span className="text-amber-600 dark:text-amber-400">107</span>
          <br />
          <span className="text-indigo-500">{"}"}</span>
        </pre>
      );

    case "design":
      return (
        <div className="flex items-center gap-1.5">
          {["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#f59e0b", "#10b981"].map(
            (c) => (
              <div
                key={c}
                className="h-8 flex-1 rounded-md ring-1 ring-black/5 transition-transform group-hover:scale-y-110"
                style={{ background: c }}
              />
            )
          )}
        </div>
      );

    case "text":
      return (
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            kebab-case
          </span>
          <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-sans text-sm font-semibold">Title Case</span>
        </div>
      );

    case "converter":
      return (
        <div className="flex items-center justify-around gap-1 font-mono text-[11px]">
          <div className="text-muted-foreground">
            <div>100</div>
            <div className="text-[9px]">km/h</div>
          </div>
          <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 7l-3 3 3 3M17 17l3-3-3-3M4 10h16M20 14H4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-foreground">
            <div>62.1</div>
            <div className="text-[9px]">mph</div>
          </div>
        </div>
      );

    case "generator":
      return (
        <div className="flex items-center gap-2">
          {/* mini QR-like grid */}
          <div className="grid h-10 w-10 grid-cols-5 gap-[1px] rounded-sm bg-foreground/90 p-[2px]">
            {Array.from({ length: 25 }).map((_, i) => {
              const filled = [0, 2, 3, 5, 6, 8, 10, 12, 13, 14, 17, 18, 20, 22, 24].includes(i);
              return (
                <span
                  key={i}
                  className={filled ? "bg-background" : "bg-transparent"}
                />
              );
            })}
          </div>
          <div className="flex-1 font-mono text-[10px] text-muted-foreground">
            <div>•••••••</div>
            <div className="opacity-50">••••</div>
          </div>
        </div>
      );

    case "network":
      return (
        <div className="font-mono text-[10px] leading-relaxed">
          <span className="text-violet-600 dark:text-violet-400">https://</span>
          <span className="text-cyan-600 dark:text-cyan-400">tools.dev</span>
          <span className="text-muted-foreground">/api</span>
          <span className="text-amber-600 dark:text-amber-400">?q=value</span>
        </div>
      );

    case "math":
      return (
        <div className="flex items-baseline gap-2 font-mono text-sm">
          <span className="text-muted-foreground">42 ×</span>
          <span className="text-foreground">π</span>
          <span className="text-muted-foreground">=</span>
          <span className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
            131.9
          </span>
        </div>
      );

    case "image":
      return (
        <div className="relative h-12 overflow-hidden rounded-md bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-500">
          <div className="absolute inset-2 rounded ring-2 ring-dashed ring-white/70" />
          <div className="absolute right-1 top-1 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-white">
            960×540
          </div>
        </div>
      );

    case "security":
      return (
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <div className="flex-1 break-all text-muted-foreground">
            $2b$10$N9qo8...
          </div>
        </div>
      );

    case "time":
      return (
        <div className="flex items-center gap-2 font-mono">
          <div className="text-3xl tabular-nums text-blue-600 dark:text-blue-400">
            03:42
          </div>
          <div className="text-xs text-muted-foreground">
            <div>WIB</div>
            <div>+07:00</div>
          </div>
        </div>
      );
  }
}
