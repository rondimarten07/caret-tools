import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function squirclePath(w: number, h: number, n: number): string {
  // Lamé curve: |x/a|^n + |y/b|^n = 1. Sample 200 points.
  const a = w / 2, b = h / 2;
  const pts: [number, number][] = [];
  const N = 200;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const cosT = Math.cos(t), sinT = Math.sin(t);
    const x = a * Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n);
    const y = b * Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n);
    pts.push([a + x, b + y]);
  }
  return "M " + pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" L ") + " Z";
}

export default function Squircle() {
  const [n, setN] = useUrlState("n", "4");
  const [size, setSize] = useUrlState("s", "200");

  const data = useMemo(() => {
    const N = Math.max(2, Math.min(8, Number(n) || 4));
    const S = Math.max(40, Math.min(400, Number(size) || 200));
    const path = squirclePath(S, S, N);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><path d="${path}" fill="currentColor"/></svg>`;
    const css = `clip-path: path("${path}");\n/* or: */\nborder-radius: 40%; /* fallback */`;
    return { N, S, path, svg, css };
  }, [n, size]);

  return (
    <ToolShell title="Squircle Generator" description="iOS-style smooth-corner shape via the Lamé superellipse." category={categoryMap.design} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Roundness exponent n (2 = circle, 4 = squircle, 8 ≈ square)</Label>
          <input type="range" min={2} max={8} step={0.1} value={n} onChange={(e) => setN(e.target.value)} className="mt-2 w-full" />
          <div className="mt-1 text-xs font-mono text-muted-foreground">n = {data.N.toFixed(1)}</div>
        </div>
        <div>
          <Label>Size (px)</Label>
          <input type="range" min={40} max={400} step={10} value={size} onChange={(e) => setSize(e.target.value)} className="mt-2 w-full" />
          <div className="mt-1 text-xs font-mono text-muted-foreground">{data.S} × {data.S}</div>
        </div>
      </Card>
      <Card className="flex items-center justify-center p-8">
        <svg viewBox={`0 0 ${data.S} ${data.S}`} width={data.S} height={data.S} className="text-primary">
          <path d={data.path} fill="currentColor" />
        </svg>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>SVG</Label><CopyButton value={data.svg} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{data.svg}</pre>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>CSS clip-path</Label><CopyButton value={data.css} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{data.css}</pre>
      </Card>
    </ToolShell>
  );
}
