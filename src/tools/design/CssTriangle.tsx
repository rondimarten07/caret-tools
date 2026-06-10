import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Dir = "up" | "down" | "left" | "right";

export default function CssTriangle() {
  const [dir, setDir] = useState<Dir>("up");
  const [size, setSize] = useState(40);
  const [color, setColor] = useState("#4f46e5");

  const css = useMemo(() => {
    const s = size;
    const c = color;
    switch (dir) {
      case "up":
        return `width: 0;
height: 0;
border-left: ${s}px solid transparent;
border-right: ${s}px solid transparent;
border-bottom: ${s}px solid ${c};`;
      case "down":
        return `width: 0;
height: 0;
border-left: ${s}px solid transparent;
border-right: ${s}px solid transparent;
border-top: ${s}px solid ${c};`;
      case "left":
        return `width: 0;
height: 0;
border-top: ${s}px solid transparent;
border-bottom: ${s}px solid transparent;
border-right: ${s}px solid ${c};`;
      case "right":
        return `width: 0;
height: 0;
border-top: ${s}px solid transparent;
border-bottom: ${s}px solid transparent;
border-left: ${s}px solid ${c};`;
    }
  }, [dir, size, color]);

  const style = useMemo(() => {
    const s = size;
    const c = color;
    const base: React.CSSProperties = { width: 0, height: 0 };
    switch (dir) {
      case "up":
        return { ...base, borderLeft: `${s}px solid transparent`, borderRight: `${s}px solid transparent`, borderBottom: `${s}px solid ${c}` };
      case "down":
        return { ...base, borderLeft: `${s}px solid transparent`, borderRight: `${s}px solid transparent`, borderTop: `${s}px solid ${c}` };
      case "left":
        return { ...base, borderTop: `${s}px solid transparent`, borderBottom: `${s}px solid transparent`, borderRight: `${s}px solid ${c}` };
      case "right":
        return { ...base, borderTop: `${s}px solid transparent`, borderBottom: `${s}px solid transparent`, borderLeft: `${s}px solid ${c}` };
    }
  }, [dir, size, color]);

  return (
    <ToolShell title="CSS Triangle" description="Pure-CSS triangle generator (no SVG) — useful for tooltips and arrows." category={categoryMap.design}>
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Direction</Label>
        {(["up", "down", "left", "right"] as Dir[]).map((d) => (
          <Button key={d} size="sm" variant={dir === d ? "default" : "outline"} onClick={() => setDir(d)}>
            {d}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs">Size</Label>
          <Input type="number" min={4} max={200} value={size} onChange={(e) => setSize(Number(e.target.value) || 40)} className="w-20" />
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-16 p-1" />
        </div>
      </Card>
      <Card className="grid min-h-[200px] place-items-center p-6">
        <div style={style} />
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
