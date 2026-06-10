import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const PRESETS: { name: string; w: number; h: number }[] = [
  { name: "16:9 (HD)", w: 16, h: 9 },
  { name: "4:3 (TV)", w: 4, h: 3 },
  { name: "1:1 (square)", w: 1, h: 1 },
  { name: "21:9 (cinema)", w: 21, h: 9 },
  { name: "3:2 (photo)", w: 3, h: 2 },
  { name: "9:16 (story)", w: 9, h: 16 },
];

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

export default function CssAspectRatio() {
  const [w, setW] = useState(16);
  const [h, setH] = useState(9);
  const [knownW, setKnownW] = useState(1920);

  const ratio = useMemo(() => {
    const g = gcd(w, h);
    return { simplified: `${w / g}:${h / g}`, decimal: w / h };
  }, [w, h]);

  const knownH = (knownW * h) / w;

  const css = `aspect-ratio: ${w} / ${h};`;
  const padding = `padding-top: ${(h / w * 100).toFixed(4)}%;`;

  return (
    <ToolShell title="CSS Aspect Ratio" description="Calculate ratios and copy CSS aspect-ratio properties." category={categoryMap.design}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs uppercase text-muted-foreground">Presets</Label>
        {PRESETS.map((p) => (
          <Button key={p.name} size="sm" variant="outline" onClick={() => { setW(p.w); setH(p.h); }}>{p.name}</Button>
        ))}
      </Card>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        <div><Label className="text-xs">Width</Label><Input type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 1)} /></div>
        <div><Label className="text-xs">Height</Label><Input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 1)} /></div>
        <div><Label className="text-xs">Known width (px)</Label><Input type="number" value={knownW} onChange={(e) => setKnownW(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Calculated height</Label><div className="mt-1 font-mono text-lg">{knownH.toFixed(1)} px</div></div>
      </Card>
      <Card className="p-3">
        <Label className="mb-2 block text-xs">Preview</Label>
        <div className="mx-auto max-w-md rounded-md bg-primary/10 ring-1 ring-primary/20" style={{ aspectRatio: `${w} / ${h}` }}>
          <div className="grid h-full place-items-center font-mono text-sm text-primary">{ratio.simplified} · {ratio.decimal.toFixed(3)}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="flex items-center gap-2 p-3">
          <code className="flex-1 font-mono text-sm">{css}</code>
          <CopyButton value={css} />
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <code className="flex-1 font-mono text-sm">{padding}</code>
          <CopyButton value={padding} />
        </Card>
      </div>
    </ToolShell>
  );
}
