import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function BoxModel() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(80);
  const [margin, setMargin] = useState(16);
  const [border, setBorder] = useState(2);
  const [padding, setPadding] = useState(12);

  const totalW = width + 2 * (padding + border + margin);
  const totalH = height + 2 * (padding + border + margin);

  const css = `width: ${width}px;
height: ${height}px;
padding: ${padding}px;
border: ${border}px solid;
margin: ${margin}px;
/* total = ${totalW}px × ${totalH}px */`;

  return (
    <ToolShell title="Box Model Visualizer" description="See how margin, border, padding and content add up to the total box." category={categoryMap.design}>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-5">
        <div><Label className="text-xs">Width</Label><Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Height</Label><Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Padding</Label><Input type="number" value={padding} onChange={(e) => setPadding(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Border</Label><Input type="number" value={border} onChange={(e) => setBorder(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Margin</Label><Input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value) || 0)} /></div>
      </Card>
      <Card className="grid place-items-center bg-muted/20 p-8">
        <div className="relative">
          {/* Margin */}
          <div className="bg-orange-200/40 dark:bg-orange-900/30 ring-1 ring-orange-300/60 dark:ring-orange-700/40 grid place-items-end p-2" style={{ padding: `${margin}px` }}>
            <span className="absolute -top-5 left-0 text-[10px] text-orange-700 dark:text-orange-300">margin {margin}px</span>
            {/* Border */}
            <div className="bg-yellow-200/40 dark:bg-yellow-900/30 ring-1 ring-yellow-300/60 dark:ring-yellow-700/40 grid place-items-end p-2 relative" style={{ borderWidth: `${border}px`, borderStyle: "solid" }}>
              <span className="absolute -top-5 left-0 text-[10px] text-yellow-700 dark:text-yellow-300">border {border}px</span>
              {/* Padding */}
              <div className="bg-emerald-200/40 dark:bg-emerald-900/30 ring-1 ring-emerald-300/60 dark:ring-emerald-700/40 grid place-items-center relative" style={{ padding: `${padding}px` }}>
                <span className="absolute -top-5 left-0 text-[10px] text-emerald-700 dark:text-emerald-300">padding {padding}px</span>
                {/* Content */}
                <div className="grid place-items-center bg-sky-200/60 dark:bg-sky-900/40 ring-1 ring-sky-400/60 dark:ring-sky-700/60 font-mono text-xs text-sky-800 dark:text-sky-300" style={{ width: `${width}px`, height: `${height}px` }}>
                  {width} × {height}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="grid grid-cols-3 gap-3 p-3 text-center text-sm">
        <div><div className="text-xs text-muted-foreground">Content</div><div className="font-mono">{width} × {height}</div></div>
        <div><div className="text-xs text-muted-foreground">+ padding + border</div><div className="font-mono">{width + 2 * (padding + border)} × {height + 2 * (padding + border)}</div></div>
        <div><div className="text-xs text-muted-foreground">+ margin (total)</div><div className="font-mono">{totalW} × {totalH}</div></div>
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
