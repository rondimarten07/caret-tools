import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Shortcut = {
  keys: string[];
  label: string;
};

const SHORTCUTS: { group: string; items: Shortcut[] }[] = [
  {
    group: "Navigation",
    items: [
      { keys: ["Ctrl", "K"], label: "Open command palette / search" },
      { keys: ["?"], label: "Open this shortcuts overlay" },
      { keys: ["Esc"], label: "Close dialog / overlay" },
    ],
  },
  {
    group: "Sidebar",
    items: [
      { keys: ["Click"], label: "Toggle category expand/collapse" },
      { keys: ["Hover", "★"], label: "Reveal star to favorite a tool" },
    ],
  },
  {
    group: "Inside a tool",
    items: [
      { keys: ["Ctrl", "C"], label: "Copy focused output" },
      { keys: ["Click", "Share"], label: "Copy a link reproducing your input" },
      { keys: ["Click", "History"], label: "Restore a recent input" },
      { keys: ["Click", "Examples"], label: "Load a curated sample" },
    ],
  },
];

export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      const t = e.target as HTMLElement | null;
      if (t && /^(input|textarea|select)$/i.test(t.tagName)) return;
      if (t?.isContentEditable) return;
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0">
        <div className="border-b p-4">
          <DialogTitle className="text-base">Keyboard shortcuts</DialogTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Press <Kbd>?</Kbd> any time to toggle this panel.
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto p-4">
          {SHORTCUTS.map((g) => (
            <section key={g.group} className="mb-4 last:mb-0">
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {g.group}
              </h3>
              <ul className="space-y-1.5">
                {g.items.map((it, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-accent/40">
                    <span className="text-sm">{it.label}</span>
                    <span className="flex items-center gap-1">
                      {it.keys.map((k, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && <span className="text-xs text-muted-foreground">+</span>}
                          <Kbd>{k}</Kbd>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground">
      {children}
    </kbd>
  );
}
