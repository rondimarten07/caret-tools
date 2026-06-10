import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type DiffEntry = { path: string; type: "added" | "removed" | "changed"; from?: unknown; to?: unknown };

function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function diff(a: unknown, b: unknown, path = "$", out: DiffEntry[] = []): DiffEntry[] {
  if (a === b) return out;
  if (isObj(a) && isObj(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!(k in a)) out.push({ path: `${path}.${k}`, type: "added", to: b[k] });
      else if (!(k in b)) out.push({ path: `${path}.${k}`, type: "removed", from: a[k] });
      else diff(a[k], b[k], `${path}.${k}`, out);
    }
    return out;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if (i >= a.length) out.push({ path: `${path}[${i}]`, type: "added", to: b[i] });
      else if (i >= b.length) out.push({ path: `${path}[${i}]`, type: "removed", from: a[i] });
      else diff(a[i], b[i], `${path}[${i}]`, out);
    }
    return out;
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    out.push({ path, type: "changed", from: a, to: b });
  }
  return out;
}

const COLORS: Record<DiffEntry["type"], string> = {
  added: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  removed: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  changed: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const SIGN: Record<DiffEntry["type"], string> = {
  added: "+",
  removed: "−",
  changed: "~",
};

export default function JsonDiff() {
  const [a, setA] = useUrlState("a", `{ "name": "Alice", "age": 30, "tags": ["a", "b"] }`);
  const [b, setB] = useUrlState("b", `{ "name": "Alice", "age": 31, "tags": ["a", "c"], "active": true }`);

  const result = useMemo(() => {
    try {
      return { ok: true as const, entries: diff(JSON.parse(a), JSON.parse(b)) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [a, b]);

  return (
    <ToolShell title="JSON Diff" description="Structural diff between two JSON documents." category={categoryMap.programming} shareable>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">A (original)</Label>
          <Textarea value={a} onChange={(e) => setA(e.target.value)} className="min-h-[220px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <Label className="mb-2 block">B (changed)</Label>
          <Textarea value={b} onChange={(e) => setB(e.target.value)} className="min-h-[220px]" spellCheck={false} />
        </Card>
      </div>
      <Card className="p-3">
        <Label className="mb-2 block">
          {result.ok ? `${result.entries.length} change${result.entries.length === 1 ? "" : "s"}` : "Error"}
        </Label>
        {result.ok ? (
          result.entries.length === 0 ? (
            <p className="rounded-md bg-muted/30 p-3 text-sm text-muted-foreground">Documents are identical.</p>
          ) : (
            <ul className="space-y-1 font-mono text-xs">
              {result.entries.map((e, i) => (
                <li key={i} className={`flex items-start gap-2 rounded-md px-3 py-1.5 ${COLORS[e.type]}`}>
                  <span className="font-bold">{SIGN[e.type]}</span>
                  <span className="font-medium">{e.path}</span>
                  <span className="ml-auto">
                    {e.type === "added" && <code>+ {JSON.stringify(e.to)}</code>}
                    {e.type === "removed" && <code>− {JSON.stringify(e.from)}</code>}
                    {e.type === "changed" && (
                      <code>
                        {JSON.stringify(e.from)} → {JSON.stringify(e.to)}
                      </code>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
        )}
      </Card>
    </ToolShell>
  );
}
