import { useMemo, useState } from "react";
import JSON5 from "json5";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "json5-to-json" | "json-to-json5";

const SAMPLE_JSON5 = `{
  // JSON5 allows comments
  name: "Alice",
  age: 30,
  tags: ['admin', 'ops',],
  /* Trailing commas work too */
  active: true,
}`;

export default function Json5Converter() {
  const [mode, setMode] = useState<Mode>("json5-to-json");
  const [input, setInput] = useUrlState("text", SAMPLE_JSON5);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      if (mode === "json5-to-json") {
        return { ok: true as const, output: JSON.stringify(JSON5.parse(input), null, 2) };
      }
      return { ok: true as const, output: JSON5.stringify(JSON.parse(input), null, 2) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input, mode]);

  return (
    <ToolShell title="JSON5 ↔ JSON" description="JSON5 allows comments, trailing commas and unquoted keys." category={categoryMap.programming} shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant={mode === "json5-to-json" ? "default" : "outline"} onClick={() => setMode("json5-to-json")}>JSON5 → JSON</Button>
        <Button size="sm" variant={mode === "json-to-json5" ? "default" : "outline"} onClick={() => setMode("json-to-json5")}>JSON → JSON5</Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[320px] font-mono text-xs" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Output" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[320px] bg-muted/30 font-mono text-xs" />
          ) : (
            <div className="min-h-[320px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
