import { useMemo, useState } from "react";
import { js as beautifyJs } from "js-beautify";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "beautify" | "minify";

function minifyJs(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/\s*([=+\-*/%<>!&|?:;,{}()\[\]])\s*/g, "$1")
    .trim();
}

export default function JsFormatter() {
  const [input, setInput] = useUrlState("text", "");
  const [mode, setMode] = useState<Mode>("beautify");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      return {
        ok: true as const,
        output:
          mode === "beautify"
            ? beautifyJs(input, { indent_size: 2, space_in_empty_paren: true })
            : minifyJs(input),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input, mode]);

  return (
    <ToolShell
      title="JS / TS Formatter"
      description="Beautify or naively minify JavaScript / TypeScript. For production, prefer a real bundler."
      category={categoryMap.programming}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>}
    >
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <Button size="sm" variant={mode === "beautify" ? "default" : "outline"} onClick={() => setMode("beautify")}>Beautify</Button>
        <Button size="sm" variant={mode === "minify" ? "default" : "outline"} onClick={() => setMode("minify")}>Minify</Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Output" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[360px] bg-muted/30" />
          ) : (
            <div className="min-h-[360px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
