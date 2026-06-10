import { useMemo, useState } from "react";
import { optimize } from "svgo";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- A sample SVG -->
  <rect x="0" y="0" width="32" height="32" rx="7" fill="#4f46e5"/>
  <path d="M 6 18 L 16 8 L 26 18" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M 11 25 H 21" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
</svg>`;

export default function SvgOptimizer() {
  const [input, setInput] = useUrlState("svg", SAMPLE);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "", saved: 0, original: 0 };
    try {
      const out = optimize(input, {
        multipass: true,
        plugins: ["preset-default"],
      });
      const data = out.data;
      const original = new Blob([input]).size;
      const after = new Blob([data]).size;
      return {
        ok: true as const,
        output: data,
        original,
        after,
        saved: original - after,
        pct: original ? ((original - after) / original) * 100 : 0,
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input]);

  const download = () => {
    if (!result.ok || !("output" in result)) return;
    const blob = new Blob([result.output], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "optimized.svg";
    a.click();
  };

  return (
    <ToolShell title="SVG Optimizer" description="Strip metadata and shrink SVG files with SVGO. Runs entirely in your browser." category={categoryMap.design}
      shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input SVG</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px] font-mono text-xs" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Optimized" : "Error"}</Label>
            {result.ok && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={download}><Download className="mr-2 h-3.5 w-3.5" />SVG</Button>
                <CopyButton value={result.output} />
              </div>
            )}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[300px] bg-muted/30 font-mono text-xs" />
          ) : (
            <div className="min-h-[300px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
      {result.ok && "original" in result && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground">Before</div>
            <div className="mt-1 font-mono text-2xl">{result.original} B</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground">After</div>
            <div className="mt-1 font-mono text-2xl">{result.after} B</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground">Saved</div>
            <div className="mt-1 font-mono text-2xl text-emerald-600">{result.pct?.toFixed(1)}%</div>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
