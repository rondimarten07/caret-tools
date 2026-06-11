import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function parseCsv(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false;
      } else cell += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === delim) { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (c === "\r") { /* skip */ }
      else cell += c;
    }
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function toMd(rows: string[][], align: "left" | "center" | "right"): string {
  if (!rows.length) return "";
  const cols = Math.max(...rows.map((r) => r.length));
  const norm = rows.map((r) => Array.from({ length: cols }, (_, i) => (r[i] || "").trim()));
  const widths = Array.from({ length: cols }, (_, i) => Math.max(3, ...norm.map((r) => r[i].length)));
  const sep = widths.map((w) => align === "center" ? `:${"-".repeat(w)}:` : align === "right" ? `${"-".repeat(w)}:` : `:${"-".repeat(w)}`);
  const lines = [
    "| " + norm[0].map((c, i) => c.padEnd(widths[i])).join(" | ") + " |",
    "| " + sep.join(" | ") + " |",
    ...norm.slice(1).map((r) => "| " + r.map((c, i) => c.padEnd(widths[i])).join(" | ") + " |"),
  ];
  return lines.join("\n");
}

export default function CsvToMarkdown() {
  const [csv, setCsv] = useUrlState("c", "name,role,city\nAlex,Designer,Jakarta\nMin,Engineer,Singapore\nSara,PM,Tokyo");
  const [delim, setDelim] = useState(",");
  const [align, setAlign] = useState<"left" | "center" | "right">("left");

  const md = useMemo(() => toMd(parseCsv(csv, delim), align), [csv, delim, align]);

  return (
    <ToolShell title="CSV → Markdown Table" description="Paste CSV, get a GitHub-flavored Markdown table." category={categoryMap.programming} shareable>
      <Card className="flex flex-wrap gap-3 p-3">
        <div>
          <Label>Delimiter</Label>
          <select value={delim} onChange={(e) => setDelim(e.target.value)} className="mt-1 block rounded-md border bg-background px-3 py-1.5 text-sm">
            <option value=",">comma</option>
            <option value=";">semicolon</option>
            <option value={"\t"}>tab</option>
            <option value="|">pipe</option>
          </select>
        </div>
        <div>
          <Label>Align</Label>
          <select value={align} onChange={(e) => setAlign(e.target.value as "left" | "center" | "right")} className="mt-1 block rounded-md border bg-background px-3 py-1.5 text-sm">
            <option value="left">left</option>
            <option value="center">center</option>
            <option value="right">right</option>
          </select>
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>CSV input</Label>
        <Textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={6} className="font-mono" spellCheck={false} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Markdown</Label><CopyButton value={md} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{md}</pre>
      </Card>
    </ToolShell>
  );
}
