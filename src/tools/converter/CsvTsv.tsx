import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function parse(text: string, delim: string): string[][] {
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

function serialize(rows: string[][], delim: string): string {
  return rows.map((r) => r.map((c) => {
    if (c.includes(delim) || c.includes('"') || c.includes("\n")) return `"${c.replace(/"/g, '""')}"`;
    return c;
  }).join(delim)).join("\n");
}

export default function CsvTsv() {
  const [input, setInput] = useUrlState("i", "name,role,city\nAlex,Designer,Jakarta\nMin,Engineer,Singapore");
  const [dir, setDir] = useState<"c2t" | "t2c">("c2t");

  const output = useMemo(() => {
    const fromDelim = dir === "c2t" ? "," : "\t";
    const toDelim = dir === "c2t" ? "\t" : ",";
    return serialize(parse(input, fromDelim), toDelim);
  }, [input, dir]);

  return (
    <ToolShell title="CSV ↔ TSV" description="Convert between comma- and tab-separated values — safely round-trips quoted fields." category={categoryMap.converter} shareable>
      <Card className="flex gap-2 p-3">
        {(["c2t", "t2c"] as const).map((d) => (
          <button key={d} onClick={() => setDir(d)} className={`rounded-md border px-3 py-1.5 text-sm ${dir === d ? "bg-primary text-primary-foreground" : "bg-card"}`}>{d === "c2t" ? "CSV → TSV" : "TSV → CSV"}</button>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Input</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Output</Label><CopyButton value={output} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{output}</pre>
      </Card>
    </ToolShell>
  );
}
