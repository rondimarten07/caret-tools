import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCopy } from "@/hooks/useCopy";
import { categoryMap } from "@/data/categories";
import { cn } from "@/lib/utils";

const SAMPLE = `{
  "store": {
    "books": [
      { "title": "Sapiens", "author": "Y. Harari", "price": 18 },
      { "title": "Atomic Habits", "author": "J. Clear", "price": 14 }
    ],
    "bicycle": { "color": "red", "price": 199 }
  }
}`;

function typeLabel(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function preview(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return `[ ${v.length} ]`;
  if (typeof v === "object") return `{ ${Object.keys(v as object).length} }`;
  if (typeof v === "string") return `"${v}"`;
  return String(v);
}

function Node({
  name,
  value,
  path,
  depth,
}: {
  name: string;
  value: unknown;
  path: string;
  depth: number;
}) {
  const isObj = value !== null && typeof value === "object";
  const [open, setOpen] = useState(depth < 1);
  const { copy } = useCopy();

  if (!isObj) {
    return (
      <div
        className={cn(
          "group flex items-center gap-2 rounded-md py-0.5 pl-[calc(var(--depth)*0.85rem+1rem)] pr-2 font-mono text-xs hover:bg-accent/40"
        )}
        style={{ ["--depth" as never]: depth }}
      >
        <span className="text-foreground/80">{name}</span>
        <span className="text-muted-foreground">:</span>
        <span
          className={cn(
            "truncate",
            typeof value === "string" && "text-emerald-600 dark:text-emerald-400",
            typeof value === "number" && "text-amber-600 dark:text-amber-400",
            typeof value === "boolean" && "text-violet-600 dark:text-violet-400",
            value === null && "text-rose-600 dark:text-rose-400"
          )}
        >
          {preview(value)}
        </span>
        <button
          type="button"
          onClick={() => copy(path, `${path} copied`)}
          className="ml-auto rounded px-1 text-[10px] text-muted-foreground opacity-0 hover:bg-background group-hover:opacity-100"
        >
          {path}
        </button>
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center gap-1 rounded-md py-0.5 pr-2 font-mono text-xs hover:bg-accent/40"
        style={{ paddingLeft: `${depth * 0.85 + 0.5}rem` }}
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span className="text-foreground/80">{name}</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-muted-foreground">{preview(value)}</span>
        <span className="ml-2 text-[10px] uppercase text-muted-foreground/70">
          {typeLabel(value)}
        </span>
      </button>
      {open && (
        <div>
          {entries.map(([k, v]) => (
            <Node
              key={k}
              name={Array.isArray(value) ? `[${k}]` : k}
              value={v}
              path={
                Array.isArray(value) ? `${path}[${k}]` : `${path}.${k}`
              }
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JsonTreeViewer() {
  const [input, setInput] = useUrlState("json", SAMPLE);
  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, value: null };
    try {
      return { ok: true as const, value: JSON.parse(input) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input]);

  return (
    <ToolShell
      title="JSON Tree Viewer"
      description="Explore JSON as a collapsible tree. Hover any node to see and copy its JSONPath."
      category={categoryMap.programming}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card className="p-3">
          <Label className="mb-2 block">JSON</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[420px]"
            spellCheck={false}
          />
        </Card>
        <Card className="overflow-hidden p-3">
          <Label className="mb-2 block">Tree</Label>
          {result.ok ? (
            result.value === null ? (
              <p className="text-sm text-muted-foreground">Paste JSON to explore.</p>
            ) : (
              <div className="max-h-[480px] overflow-auto rounded-md bg-muted/30 p-2">
                <Node name="$" value={result.value} path="$" depth={0} />
              </div>
            )
          ) : (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-xs text-destructive">
              {result.error}
            </div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
