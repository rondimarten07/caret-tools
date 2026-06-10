import { useMemo, useState } from "react";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Hourly", expr: "0 * * * *" },
  { label: "Daily 09:00", expr: "0 9 * * *" },
  { label: "Weekly Sun 00:00", expr: "0 0 * * 0" },
  { label: "Monthly 1st 00:00", expr: "0 0 1 * *" },
];

export default function CronParser() {
  const [expr, setExpr] = useUrlState("cron", "*/5 * * * *");

  const result = useMemo(() => {
    if (!expr.trim()) return { ok: true as const, description: "", next: [] as string[] };
    try {
      const description = cronstrue.toString(expr);
      const it = parser.parseExpression(expr);
      const next: string[] = [];
      for (let i = 0; i < 5; i++) next.push(it.next().toString());
      return { ok: true as const, description, next };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [expr]);

  return (
    <ToolShell
      title="Cron Parser"
      description="Describe any cron expression and preview the next 5 fire times."
      category={categoryMap.programming}
      shareable
    >
      <Card className="space-y-3 p-3">
        <Label>Cron expression</Label>
        <Input value={expr} onChange={(e) => setExpr(e.target.value)} className="font-mono" />
        <div className="flex flex-wrap gap-2 text-xs">
          {PRESETS.map((p) => (
            <Button key={p.expr} size="sm" variant="outline" onClick={() => setExpr(p.expr)}>
              {p.label}
            </Button>
          ))}
        </div>
      </Card>

      {result.ok ? (
        <>
          <Card className="flex items-center justify-between gap-3 p-4">
            <div>
              <Label>Description</Label>
              <p className="mt-1 text-sm">{result.description}</p>
            </div>
            <CopyButton value={result.description} />
          </Card>
          <Card className="p-4">
            <Label>Next 5 fires</Label>
            <ul className="mt-2 space-y-1 font-mono text-sm">
              {result.next.map((d, i) => (
                <li key={i} className="flex justify-between rounded-md bg-muted/30 px-3 py-2">
                  <span>#{i + 1}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
          {result.error}
        </div>
      )}
    </ToolShell>
  );
}
