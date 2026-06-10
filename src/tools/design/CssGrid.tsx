import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function CssGrid() {
  const [cols, setCols] = useState(4);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(12);
  const [colSize, setColSize] = useState("1fr");
  const [rowSize, setRowSize] = useState("100px");

  const css = useMemo(
    () => `display: grid;
grid-template-columns: repeat(${cols}, ${colSize});
grid-template-rows: repeat(${rows}, ${rowSize});
gap: ${gap}px;`,
    [cols, rows, gap, colSize, rowSize]
  );

  return (
    <ToolShell title="CSS Grid Generator" description="Build a CSS Grid layout visually and copy the CSS." category={categoryMap.design}
      shareable>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-5">
        <div><Label className="text-xs">Columns</Label><Input type="number" min={1} max={12} value={cols} onChange={(e) => setCols(Math.max(1, Math.min(12, Number(e.target.value) || 1)))} /></div>
        <div><Label className="text-xs">Rows</Label><Input type="number" min={1} max={12} value={rows} onChange={(e) => setRows(Math.max(1, Math.min(12, Number(e.target.value) || 1)))} /></div>
        <div><Label className="text-xs">Gap (px)</Label><Input type="number" value={gap} onChange={(e) => setGap(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Col size</Label><Input value={colSize} onChange={(e) => setColSize(e.target.value)} className="font-mono" /></div>
        <div><Label className="text-xs">Row size</Label><Input value={rowSize} onChange={(e) => setRowSize(e.target.value)} className="font-mono" /></div>
      </Card>
      <Card className="p-3">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${colSize})`, gridTemplateRows: `repeat(${rows}, ${rowSize})`, gap: `${gap}px` }}>
          {Array.from({ length: cols * rows }).map((_, i) => (
            <div key={i} className="grid place-items-center rounded-md bg-primary/10 text-xs font-mono text-primary ring-1 ring-primary/20">{i + 1}</div>
          ))}
        </div>
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
