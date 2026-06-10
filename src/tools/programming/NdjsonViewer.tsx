import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `{"id":1,"name":"Alice","role":"Admin"}
{"id":2,"name":"Bob","role":"Editor"}
{"id":3,"name":"Carol","role":"Viewer"}`;

export default function NdjsonViewer() {
  const [input, setInput] = useUrlState("text", SAMPLE);

  const parsed = useMemo(() => {
    const lines = input.split(/\r?\n/).filter((l) => l.trim());
    const rows: { ok: boolean; value?: unknown; error?: string }[] = lines.map((l) => {
      try { return { ok: true, value: JSON.parse(l) }; }
      catch (e) { return { ok: false, error: (e as Error).message }; }
    });
    const valid = rows.filter((r) => r.ok).map((r) => r.value);
    const columns = Array.from(new Set(valid.flatMap((v) => v && typeof v === "object" && !Array.isArray(v) ? Object.keys(v as Record<string, unknown>) : [])));
    return { rows, valid, columns };
  }, [input]);

  const asArray = JSON.stringify(parsed.valid, null, 2);

  return (
    <ToolShell title="NDJSON / JSON Lines Viewer" description="View newline-delimited JSON as a table, validate every line." category={categoryMap.programming} shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className="p-3">
          <Label className="mb-2 block">NDJSON</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px] font-mono text-xs" spellCheck={false} />
          <div className="mt-2 text-xs text-muted-foreground">
            {parsed.valid.length} valid · {parsed.rows.length - parsed.valid.length} invalid
          </div>
        </Card>
        <Card className="overflow-auto p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Table</Label>
            <CopyButton value={asArray} label="As JSON array" />
          </div>
          {parsed.columns.length > 0 ? (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  {parsed.columns.map((c) => (<th key={c} className="px-2 py-1 font-mono">{c}</th>))}
                </tr>
              </thead>
              <tbody>
                {(parsed.valid as Record<string, unknown>[]).map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {parsed.columns.map((c) => (
                      <td key={c} className="px-2 py-1 font-mono">{r[c] != null ? typeof r[c] === "object" ? JSON.stringify(r[c]) : String(r[c]) : "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted-foreground">Paste NDJSON lines — each line a JSON value.</p>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
