import { useMemo, useState } from "react";
import { html as beautifyHtml } from "js-beautify";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "beautify" | "minify";

function minifyHtml(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function HtmlFormatter() {
  const [input, setInput] = useUrlState("text", "");
  const [mode, setMode] = useState<Mode>("beautify");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      return {
        ok: true as const,
        output:
          mode === "beautify"
            ? beautifyHtml(input, { indent_size: 2, wrap_line_length: 100 })
            : minifyHtml(input),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input, mode]);

  return (
    <ToolShell
      title="HTML Formatter"
      description="Beautify or minify HTML markup."
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
