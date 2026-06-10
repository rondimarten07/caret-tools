import { useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const PRESETS = [
  { name: "ease", v: [0.25, 0.1, 0.25, 1.0] },
  { name: "ease-in", v: [0.42, 0, 1, 1] },
  { name: "ease-out", v: [0, 0, 0.58, 1] },
  { name: "ease-in-out", v: [0.42, 0, 0.58, 1] },
  { name: "anticipate", v: [0.36, 0, 0.66, -0.56] },
  { name: "overshoot", v: [0.34, 1.56, 0.64, 1] },
] as const;

export default function CubicBezier() {
  const [p, setP] = useState<[number, number, number, number]>([0.34, 1.56, 0.64, 1]);
  const svgRef = useRef<SVGSVGElement>(null);

  const update = (i: number, v: number) => setP((prev) => prev.map((x, idx) => (idx === i ? v : x)) as [number, number, number, number]);

  // Map (x in 0-1, y in 0-1.6 with possible overshoot) to SVG pixels
  const W = 320;
  const H = 320;
  const margin = 30;
  const toX = (x: number) => margin + x * (W - 2 * margin);
  const toY = (y: number) => H - margin - y * (H - 2 * margin);
  // For overshoot we allow y outside [0,1] — display in [-0.3, 1.3] range
  const yMin = -0.3, yMax = 1.3;
  const toYscaled = (y: number) => margin + ((yMax - y) / (yMax - yMin)) * (H - 2 * margin);

  const path = `M ${toX(0)} ${toYscaled(0)} C ${toX(p[0])} ${toYscaled(p[1])} ${toX(p[2])} ${toYscaled(p[3])} ${toX(1)} ${toYscaled(1)}`;

  const css = `cubic-bezier(${p[0]}, ${p[1]}, ${p[2]}, ${p[3]})`;
  const animation = `transition: transform 1s ${css};`;

  return (
    <ToolShell title="Cubic Bézier Editor" description="Visual editor for cubic-bezier() CSS easing functions." category={categoryMap.design}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Presets</Label>
        {PRESETS.map((preset) => (
          <Button key={preset.name} size="sm" variant="outline" onClick={() => setP([...preset.v] as [number, number, number, number])}>
            {preset.name}
          </Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
        <Card className="grid place-items-center bg-muted/20 p-4">
          <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="rounded-md bg-card">
            {/* Grid baselines */}
            <line x1={toX(0)} y1={toYscaled(0)} x2={toX(1)} y2={toYscaled(0)} stroke="currentColor" strokeOpacity="0.2" />
            <line x1={toX(0)} y1={toYscaled(1)} x2={toX(1)} y2={toYscaled(1)} stroke="currentColor" strokeOpacity="0.2" />
            <line x1={toX(0)} y1={toYscaled(0)} x2={toX(0)} y2={toYscaled(1)} stroke="currentColor" strokeOpacity="0.2" />
            <line x1={toX(1)} y1={toYscaled(0)} x2={toX(1)} y2={toYscaled(1)} stroke="currentColor" strokeOpacity="0.2" />
            {/* Control handles */}
            <line x1={toX(0)} y1={toYscaled(0)} x2={toX(p[0])} y2={toYscaled(p[1])} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
            <line x1={toX(1)} y1={toYscaled(1)} x2={toX(p[2])} y2={toYscaled(p[3])} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
            {/* Curve */}
            <path d={path} stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none" />
            {/* Endpoints */}
            <circle cx={toX(0)} cy={toYscaled(0)} r="4" fill="hsl(var(--foreground))" />
            <circle cx={toX(1)} cy={toYscaled(1)} r="4" fill="hsl(var(--foreground))" />
            {/* Control points */}
            <circle cx={toX(p[0])} cy={toYscaled(p[1])} r="6" fill="hsl(var(--primary))" />
            <circle cx={toX(p[2])} cy={toYscaled(p[3])} r="6" fill="hsl(var(--primary))" />
          </svg>
        </Card>
        <Card className="space-y-2 p-3">
          {(["x1", "y1", "x2", "y2"] as const).map((n, i) => (
            <div key={n}>
              <Label className="text-xs">{n}</Label>
              <Input type="number" step={0.01} value={p[i]} onChange={(e) => update(i, Number(e.target.value))} />
            </div>
          ))}
        </Card>
      </div>
      <Card className="flex items-center gap-2 p-3">
        <code className="flex-1 font-mono text-sm">{css}</code>
        <CopyButton value={css} />
      </Card>
      <Card className="flex items-center gap-2 p-3">
        <code className="flex-1 font-mono text-xs">{animation}</code>
        <CopyButton value={animation} />
      </Card>
    </ToolShell>
  );
}
