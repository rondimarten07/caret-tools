import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Plus, X, ArrowDown, ArrowUp } from "lucide-react";

const SAMPLE = `name,role,age
Alice,Admin,30
Bob,Editor,28
Carol,Viewer,34`;

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

function toCsv(rows: string[][]): string {
  return rows
    .map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(","))
    .join("\n");
}

export default function CsvEditor() {
  const [raw, setRaw] = useState(SAMPLE);
  const grid = useMemo(() => parseCsv(raw), [raw]);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  if (grid.length === 0) return null;
  const headers = grid[0];
  const body = grid.slice(1);

  const sortedBody = useMemo(() => {
    if (sortCol === null) return body;
    return [...body].sort((a, b) => {
      const va = a[sortCol] ?? "";
      const vb = b[sortCol] ?? "";
      const na = Number(va);
      const nb = Number(vb);
      const cmp = Number.isFinite(na) && Number.isFinite(nb) ? na - nb : va.localeCompare(vb);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [body, sortCol, sortDir]);

  const update = (r: number, c: number, v: string) => {
    const next = grid.map((row, ri) => ri === r + 1 ? row.map((cell, ci) => ci === c ? v : cell) : row);
    setRaw(toCsv(next));
  };
  const updateHeader = (c: number, v: string) => {
    const next = grid.map((row, ri) => ri === 0 ? row.map((cell, ci) => ci === c ? v : cell) : row);
    setRaw(toCsv(next));
  };
  const addRow = () => setRaw(toCsv([...grid, headers.map(() => "")]));
  const addCol = () => setRaw(toCsv(grid.map((r, i) => [...r, i === 0 ? `Col ${r.length + 1}` : ""])));
  const removeRow = (r: number) => {
    const original = body.indexOf(sortedBody[r]);
    const next = grid.filter((_, i) => i !== original + 1);
    setRaw(toCsv(next));
  };

  const download = () => {
    const blob = new Blob([raw], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.csv";
    a.click();
  };

  return (
    <ToolShell title="CSV Editor" description="View and edit CSV in a spreadsheet-like grid." category={categoryMap.programming}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant="outline" onClick={addRow}><Plus className="mr-2 h-3 w-3" />Row</Button>
        <Button size="sm" variant="outline" onClick={addCol}><Plus className="mr-2 h-3 w-3" />Column</Button>
        <Button size="sm" variant="outline" onClick={download}>Download .csv</Button>
        <CopyButton value={raw} />
        <span className="ml-auto text-xs text-muted-foreground">{body.length} rows · {headers.length} cols</span>
      </Card>
      <Card className="overflow-auto p-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {headers.map((h, c) => (
                <th key={c} className="border bg-muted/30 p-0 text-left">
                  <div className="flex items-center">
                    <input value={h} onChange={(e) => updateHeader(c, e.target.value)} className="flex-1 bg-transparent px-2 py-1 font-medium focus:outline-none" />
                    <button
                      type="button"
                      onClick={() => {
                        if (sortCol === c) setSortDir((d) => d === "asc" ? "desc" : "asc");
                        else { setSortCol(c); setSortDir("asc"); }
                      }}
                      className="px-1 text-muted-foreground hover:text-foreground"
                    >
                      {sortCol === c ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowDown className="h-3 w-3 opacity-30" />}
                    </button>
                  </div>
                </th>
              ))}
              <th className="w-8 border bg-muted/30" />
            </tr>
          </thead>
          <tbody>
            {sortedBody.map((r, ri) => (
              <tr key={ri}>
                {r.map((cell, c) => (
                  <td key={c} className="border p-0">
                    <input value={cell} onChange={(e) => update(body.indexOf(r), c, e.target.value)} className="w-full bg-transparent px-2 py-1 focus:bg-accent/40 focus:outline-none" />
                  </td>
                ))}
                <td className="w-8 border-0 text-center">
                  <button onClick={() => removeRow(ri)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-3">
        <Label className="mb-2 block text-xs">CSV source</Label>
        <Textarea value={raw} onChange={(e) => setRaw(e.target.value)} className="min-h-[160px] font-mono text-xs" />
      </Card>
    </ToolShell>
  );
}
