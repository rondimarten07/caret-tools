import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function unescapeToken(t: string): string {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}

function evalPointer(doc: unknown, pointer: string): { ok: true; value: unknown } | { ok: false; error: string } {
  if (pointer === "") return { ok: true, value: doc };
  if (!pointer.startsWith("/")) return { ok: false, error: "Pointer must start with /" };
  const parts = pointer.slice(1).split("/").map(unescapeToken);
  let cur: unknown = doc;
  for (const tok of parts) {
    if (cur === null || typeof cur !== "object") return { ok: false, error: `Cannot index into ${typeof cur} at "${tok}".` };
    if (Array.isArray(cur)) {
      if (tok === "-") return { ok: false, error: "Array '-' is for append, not lookup." };
      if (!/^\d+$/.test(tok)) return { ok: false, error: `Array index must be numeric, got "${tok}".` };
      const i = Number(tok);
      if (i >= cur.length) return { ok: false, error: `Index ${i} out of bounds.` };
      cur = cur[i];
    } else {
      const obj = cur as Record<string, unknown>;
      if (!(tok in obj)) return { ok: false, error: `Key "${tok}" not found.` };
      cur = obj[tok];
    }
  }
  return { ok: true, value: cur };
}

export default function JsonPointer() {
  const [json, setJson] = useUrlState("j", `{\n  "users": [\n    { "name": "Alex", "tags": ["admin"] },\n    { "name": "Min", "tags": ["editor", "reviewer"] }\n  ]\n}`);
  const [ptr, setPtr] = useUrlState("p", "/users/1/tags/0");

  const result = useMemo(() => {
    let doc: unknown;
    try { doc = JSON.parse(json); } catch (e) { return { ok: false as const, error: "Invalid JSON: " + (e as Error).message }; }
    return evalPointer(doc, ptr);
  }, [json, ptr]);

  const value = result.ok ? JSON.stringify(result.value, null, 2) : "";

  return (
    <ToolShell title="JSON Pointer Eval" description="RFC 6901 — evaluate a slash-separated path against a JSON document." category={categoryMap.programming} shareable>
      <Card className="space-y-3 p-4">
        <Label>JSON document</Label>
        <Textarea value={json} onChange={(e) => setJson(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Pointer</Label>
        <Input value={ptr} onChange={(e) => setPtr(e.target.value)} className="font-mono" placeholder="/foo/0/bar" />
      </Card>
      <Card className="space-y-3 p-4">
        {result.ok ? (
          <>
            <div className="flex items-center justify-between"><Label>Result</Label><CopyButton value={value} /></div>
            <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{value}</pre>
          </>
        ) : (
          <p className="text-sm text-destructive">{result.error}</p>
        )}
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Escape: <code className="font-mono">~</code> → <code className="font-mono">~0</code>, <code className="font-mono">/</code> → <code className="font-mono">~1</code>. Empty pointer <code className="font-mono">""</code> = the whole document.
      </div>
    </ToolShell>
  );
}
