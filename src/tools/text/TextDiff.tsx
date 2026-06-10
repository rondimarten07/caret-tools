import { useMemo, useState } from "react";
import { diffLines } from "diff";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { cn } from "@/lib/utils";

export default function TextDiff() {
  const [a, setA] = useUrlState("a", "Hello world\nThis is line 2\nGoodbye");
  const [b, setB] = useUrlState("b", "Hello there\nThis is line 2\nGoodbye, friend");

  const parts = useMemo(() => diffLines(a, b), [a, b]);

  return (
    <ToolShell
      title="Text Diff"
      description="Compare two texts and highlight added / removed lines."
      category={categoryMap.text}
      shareable
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Original</Label>
          <Textarea value={a} onChange={(e) => setA(e.target.value)} className="min-h-[200px]" />
        </Card>
        <Card className="p-3">
          <Label className="mb-2 block">Changed</Label>
          <Textarea value={b} onChange={(e) => setB(e.target.value)} className="min-h-[200px]" />
        </Card>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="border-b px-3 py-2 text-xs text-muted-foreground">Diff</div>
        <pre className="overflow-auto font-mono text-sm">
          {parts.map((p, i) => (
            <span
              key={i}
              className={cn(
                "block whitespace-pre-wrap px-3 py-0.5",
                p.added && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                p.removed && "bg-rose-500/10 text-rose-700 dark:text-rose-300"
              )}
            >
              {(p.added ? "+ " : p.removed ? "- " : "  ") + p.value.replace(/\n$/, "")}
            </span>
          ))}
        </pre>
      </Card>
    </ToolShell>
  );
}
