import { useMemo, useState } from "react";
import { format } from "sql-formatter";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const DIALECTS = [
  "sql",
  "postgresql",
  "mysql",
  "mariadb",
  "sqlite",
  "bigquery",
  "snowflake",
  "transactsql",
] as const;
type Dialect = (typeof DIALECTS)[number];

export default function SqlFormatter() {
  const [input, setInput] = useUrlState("text", "");
  const [dialect, setDialect] = useState<Dialect>("sql");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      return {
        ok: true as const,
        output: format(input, { language: dialect, keywordCase: "upper" }),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input, dialect]);

  return (
    <ToolShell
      title="SQL Formatter"
      description="Pretty-print SQL queries for many dialects."
      category={categoryMap.programming}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>}
    >
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Dialect</Label>
        {DIALECTS.map((d) => (
          <Button key={d} size="sm" variant={dialect === d ? "default" : "outline"} onClick={() => setDialect(d)}>
            {d}
          </Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input SQL</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Formatted" : "Error"}</Label>
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
