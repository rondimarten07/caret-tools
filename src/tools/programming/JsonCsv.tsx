import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "j2c" | "c2j";

function escape(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function jsonToCsv(input: string): string {
  const data = JSON.parse(input);
  if (!Array.isArray(data) || data.length === 0)
    throw new Error("Input must be a non-empty JSON array of objects.");
  const headers = Array.from(
    data.reduce<Set<string>>((acc, row) => {
      Object.keys(row ?? {}).forEach((k) => acc.add(k));
      return acc;
    }, new Set())
  );
  const rows = data.map((row) => headers.map((h) => escape(row?.[h])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function parseCsv(input: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n") {
        row.push(field);
        out.push(row);
        row = [];
        field = "";
      } else if (ch !== "\r") field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    out.push(row);
  }
  return out;
}

function csvToJson(input: string): string {
  const rows = parseCsv(input.trim());
  if (rows.length === 0) return "[]";
  const headers = rows[0];
  const objects = rows.slice(1).map((r) => {
    const o: Record<string, string> = {};
    headers.forEach((h, i) => (o[h] = r[i] ?? ""));
    return o;
  });
  return JSON.stringify(objects, null, 2);
}

export default function JsonCsv() {
  const [mode, setMode] = useState<Mode>("j2c");
  const [input, setInput] = useUrlState("text", "");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      return { ok: true as const, output: mode === "j2c" ? jsonToCsv(input) : csvToJson(input) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [mode, input]);

  return (
    <ToolShell
      title="JSON ↔ CSV"
      description="Convert a JSON array of objects to CSV (and back)."
      category={categoryMap.programming}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>}
    >
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/40 p-3">
        <Button size="sm" variant={mode === "j2c" ? "default" : "outline"} onClick={() => setMode("j2c")}>JSON → CSV</Button>
        <Button size="sm" variant={mode === "c2j" ? "default" : "outline"} onClick={() => setMode("c2j")}>CSV → JSON</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">{mode === "j2c" ? "JSON array" : "CSV"}</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? (mode === "j2c" ? "CSV" : "JSON") : "Error"}</Label>
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
