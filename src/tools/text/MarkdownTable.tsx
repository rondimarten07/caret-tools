import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Plus, X } from "lucide-react";

type Align = "left" | "center" | "right";

export default function MarkdownTable() {
  const [headers, setHeaders] = useState<string[]>(["Name", "Role", "Age"]);
  const [aligns, setAligns] = useState<Align[]>(["left", "left", "right"]);
  const [rows, setRows] = useState<string[][]>([
    ["Alice", "Admin", "30"],
    ["Bob", "Editor", "28"],
    ["Carol", "Viewer", "34"],
  ]);

  const updateCell = (r: number, c: number, v: string) =>
    setRows((rs) => rs.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)));

  const updateHeader = (c: number, v: string) => setHeaders((h) => h.map((x, i) => (i === c ? v : x)));

  const addRow = () => setRows((rs) => [...rs, headers.map(() => "")]);
  const removeRow = (r: number) => setRows((rs) => rs.filter((_, i) => i !== r));

  const addCol = () => {
    setHeaders((h) => [...h, `Col ${h.length + 1}`]);
    setAligns((a) => [...a, "left"]);
    setRows((rs) => rs.map((row) => [...row, ""]));
  };
  const removeCol = (c: number) => {
    setHeaders((h) => h.filter((_, i) => i !== c));
    setAligns((a) => a.filter((_, i) => i !== c));
    setRows((rs) => rs.map((row) => row.filter((_, i) => i !== c)));
  };

  const markdown = useMemo(() => {
    const sep = aligns.map((a) =>
      a === "left" ? ":---" : a === "right" ? "---:" : ":---:"
    );
    const lines: string[] = [];
    lines.push("| " + headers.join(" | ") + " |");
    lines.push("| " + sep.join(" | ") + " |");
    for (const row of rows) lines.push("| " + row.join(" | ") + " |");
    return lines.join("\n");
  }, [headers, aligns, rows]);

  return (
    <ToolShell title="Markdown Table Editor" description="Edit a table visually, get Markdown output ready to paste." category={categoryMap.text}
      shareable>
      <Card className="space-y-2 p-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={addRow}><Plus className="mr-2 h-3 w-3" />Row</Button>
          <Button variant="outline" size="sm" onClick={addCol}><Plus className="mr-2 h-3 w-3" />Column</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {headers.map((h, c) => (
                  <th key={c} className="border bg-muted/30 p-1">
                    <input
                      value={h}
                      onChange={(e) => updateHeader(c, e.target.value)}
                      className="w-full bg-transparent px-2 py-1 font-medium focus:outline-none"
                    />
                    <div className="flex items-center justify-between px-1 pt-1">
                      <select
                        value={aligns[c]}
                        onChange={(e) => setAligns((a) => a.map((x, i) => (i === c ? (e.target.value as Align) : x)))}
                        className="rounded border bg-background px-1 text-[10px]"
                      >
                        <option value="left">left</option>
                        <option value="center">center</option>
                        <option value="right">right</option>
                      </select>
                      <button onClick={() => removeCol(c)} className="text-muted-foreground hover:text-destructive" disabled={headers.length === 1}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border p-0">
                      <input
                        value={cell}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        className="w-full bg-transparent px-2 py-1 focus:bg-accent/40 focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="w-8 border-0 text-center">
                    <button onClick={() => removeRow(r)} className="text-muted-foreground hover:text-destructive" disabled={rows.length === 1}>
                      <X className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Markdown</Label>
          <CopyButton value={markdown} />
        </div>
        <Textarea readOnly value={markdown} className="min-h-[180px] bg-muted/30 font-mono text-xs" />
      </Card>
    </ToolShell>
  );
}
