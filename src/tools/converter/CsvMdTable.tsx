import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "csv-to-md" | "md-to-csv";

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (q) {
      if (c === '"' && input[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c !== "\r") cur += c;
    }
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

function toMarkdown(rows: string[][]): string {
  if (rows.length === 0) return "";
  const headers = rows[0];
  const sep = headers.map(() => "---");
  const body = rows.slice(1).map((r) => `| ${r.join(" | ")} |`).join("\n");
  return `| ${headers.join(" | ")} |\n| ${sep.join(" | ")} |\n${body}`;
}

function fromMarkdown(input: string): string[][] {
  const rows = input.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith("|"));
  if (rows.length === 0) return [];
  const split = (l: string) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const all = rows.map(split);
  // Drop separator row (--- only)
  return all.filter((r) => !r.every((c) => /^:?-+:?$/.test(c)));
}

function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n");
}

const SAMPLE_CSV = `name,role,age
Alice,Admin,30
Bob,Editor,28
Carol,Viewer,34`;

export default function CsvMdTable() {
  const [mode, setMode] = useState<Mode>("csv-to-md");
  const [input, setInput] = useUrlState("text", SAMPLE_CSV);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "csv-to-md" ? toMarkdown(parseCsv(input)) : toCsv(fromMarkdown(input));
  }, [mode, input]);

  return (
    <ToolShell title="CSV ↔ Markdown Table" description="Convert between CSV and Markdown table syntax." category={categoryMap.converter} shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant={mode === "csv-to-md" ? "default" : "outline"} onClick={() => setMode("csv-to-md")}>CSV → Markdown</Button>
        <Button size="sm" variant={mode === "md-to-csv" ? "default" : "outline"} onClick={() => setMode("md-to-csv")}>Markdown → CSV</Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[320px] font-mono text-xs" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Output</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[320px] bg-muted/30 font-mono text-xs" />
        </Card>
      </div>
    </ToolShell>
  );
}
