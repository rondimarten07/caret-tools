import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Pattern = "dots" | "grid" | "stripes-h" | "stripes-d" | "checker";

export default function PatternGenerator() {
  const [pat, setPat] = useState<Pattern>("dots");
  const [fg, setFg] = useState("#4f46e5");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState(24);

  const css = useMemo(() => {
    switch (pat) {
      case "dots":
        return `background-color: ${bg};
background-image: radial-gradient(${fg} 1.5px, transparent 1.5px);
background-size: ${size}px ${size}px;`;
      case "grid":
        return `background-color: ${bg};
background-image:
  linear-gradient(${fg}33 1px, transparent 1px),
  linear-gradient(90deg, ${fg}33 1px, transparent 1px);
background-size: ${size}px ${size}px;`;
      case "stripes-h":
        return `background-color: ${bg};
background-image: linear-gradient(0deg, ${fg}33 50%, transparent 50%);
background-size: ${size}px ${size}px;`;
      case "stripes-d":
        return `background-color: ${bg};
background-image: linear-gradient(45deg, ${fg}33 25%, transparent 25%, transparent 50%, ${fg}33 50%, ${fg}33 75%, transparent 75%, transparent);
background-size: ${size}px ${size}px;`;
      case "checker":
        return `background-color: ${bg};
background-image:
  linear-gradient(45deg, ${fg}33 25%, transparent 25%),
  linear-gradient(-45deg, ${fg}33 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, ${fg}33 75%),
  linear-gradient(-45deg, transparent 75%, ${fg}33 75%);
background-size: ${size}px ${size}px;
background-position: 0 0, 0 ${size / 2}px, ${size / 2}px -${size / 2}px, -${size / 2}px 0;`;
    }
  }, [pat, fg, bg, size]);

  const previewStyle = useMemo<React.CSSProperties>(() => {
    const decl: Record<string, string> = {};
    css.split(";").map((s) => s.trim()).filter(Boolean).forEach((line) => {
      const [k, ...v] = line.split(":");
      decl[k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v.join(":").trim();
    });
    return decl as React.CSSProperties;
  }, [css]);

  return (
    <ToolShell title="CSS Pattern Generator" description="Pure-CSS background patterns — dots, grid, stripes, checkerboard." category={categoryMap.design}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(["dots", "grid", "stripes-h", "stripes-d", "checker"] as Pattern[]).map((p) => (
          <Button key={p} size="sm" variant={pat === p ? "default" : "outline"} onClick={() => setPat(p)}>{p}</Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs">Size</Label>
          <Input type="number" min={6} max={120} value={size} onChange={(e) => setSize(Number(e.target.value) || 24)} className="w-20" />
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-12 rounded border p-1" title="Foreground" />
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-12 rounded border p-1" title="Background" />
        </div>
      </Card>
      <Card className="h-64 overflow-hidden p-0" style={previewStyle} />
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
