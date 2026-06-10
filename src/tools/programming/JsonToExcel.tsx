import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

const SAMPLE = `[
  { "id": 1, "name": "Alice", "role": "Admin", "age": 30 },
  { "id": 2, "name": "Bob", "role": "Editor", "age": 28 },
  { "id": 3, "name": "Carol", "role": "Viewer", "age": 34 }
]`;

export default function JsonToExcel() {
  const [input, setInput] = useState(SAMPLE);
  const [sheetName, setSheetName] = useState("Sheet1");

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, rows: 0, cols: 0 };
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data) || data.length === 0)
        throw new Error("Input must be a non-empty JSON array.");
      const cols = Array.from(
        new Set(data.flatMap((row) => Object.keys(row ?? {})))
      );
      return { ok: true as const, rows: data.length, cols: cols.length, data };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input]);

  const download = () => {
    if (!result.ok || !("data" in result)) return;
    const ws = XLSX.utils.json_to_sheet(result.data as object[]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet1");
    XLSX.writeFile(wb, `${sheetName || "export"}.xlsx`);
  };

  return (
    <ToolShell title="JSON → Excel" description="Convert a JSON array of objects to a downloadable .xlsx file." category={categoryMap.programming}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">JSON array</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[320px]" spellCheck={false} />
        </Card>
        <Card className="space-y-3 p-3">
          <div>
            <Label className="text-xs">Sheet name</Label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          {result.ok && "data" in result ? (
            <div className="rounded-md bg-muted/30 p-3 text-sm">
              <div className="text-xs text-muted-foreground">Detected</div>
              <div className="mt-1 font-mono">
                {result.rows} rows · {result.cols} columns
              </div>
            </div>
          ) : !result.ok ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
              {result.error}
            </div>
          ) : null}
          <Button onClick={download} disabled={!result.ok || !("data" in result)}>
            <Download className="mr-2 h-4 w-4" />
            Download .xlsx
          </Button>
        </Card>
      </div>
    </ToolShell>
  );
}
