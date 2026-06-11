import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function parsePoints(text: string): { x: number; y: number }[] {
  return text.split(/\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [x, y] = line.split(/[,\s\t]+/).map(Number);
    return { x, y };
  }).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}

function regress(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n < 2) return null;
  const sx = pts.reduce((a, p) => a + p.x, 0);
  const sy = pts.reduce((a, p) => a + p.y, 0);
  const sxx = pts.reduce((a, p) => a + p.x * p.x, 0);
  const sxy = pts.reduce((a, p) => a + p.x * p.y, 0);
  const denom = n * sxx - sx * sx;
  if (denom === 0) return null;
  const m = (n * sxy - sx * sy) / denom;
  const b = (sy - m * sx) / n;
  const meanY = sy / n;
  const ssTot = pts.reduce((a, p) => a + (p.y - meanY) ** 2, 0);
  const ssRes = pts.reduce((a, p) => a + (p.y - (m * p.x + b)) ** 2, 0);
  const r2 = ssTot ? 1 - ssRes / ssTot : 1;
  return { m, b, r2 };
}

export default function LinearRegression() {
  const [text, setText] = useUrlState("p", "1, 2.1\n2, 3.9\n3, 6.1\n4, 8.2\n5, 10.0");

  const data = useMemo(() => {
    const pts = parsePoints(text);
    const fit = regress(pts);
    if (!fit) return null;
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { pts, fit, minX, maxX, minY, maxY };
  }, [text]);

  return (
    <ToolShell title="Linear Regression" description="Least-squares best-fit y = mx + b from (x, y) points." category={categoryMap.math} shareable>
      <Card className="space-y-3 p-4">
        <Label>Points (x,y per line)</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
      </Card>
      {data ? (
        <>
          <Card className="grid gap-3 p-4 sm:grid-cols-3">
            <div className="rounded-md bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">Slope (m)</div>
              <div className="flex items-center gap-2"><span className="font-mono">{data.fit.m.toFixed(6)}</span><CopyButton value={String(data.fit.m)} /></div>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">Intercept (b)</div>
              <div className="flex items-center gap-2"><span className="font-mono">{data.fit.b.toFixed(6)}</span><CopyButton value={String(data.fit.b)} /></div>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">R² (fit quality)</div>
              <div className="font-mono">{data.fit.r2.toFixed(6)}</div>
            </div>
          </Card>
          <Card className="p-4">
            <svg viewBox="0 0 200 100" className="aspect-[2/1] w-full">
              {(() => {
                const xRange = data.maxX - data.minX || 1;
                const yRange = data.maxY - data.minY || 1;
                const tx = (x: number) => ((x - data.minX) / xRange) * 195 + 2.5;
                const ty = (y: number) => 97.5 - ((y - data.minY) / yRange) * 95;
                const lineY1 = data.fit.m * data.minX + data.fit.b;
                const lineY2 = data.fit.m * data.maxX + data.fit.b;
                return (
                  <>
                    <line x1={tx(data.minX)} y1={ty(lineY1)} x2={tx(data.maxX)} y2={ty(lineY2)} stroke="currentColor" strokeWidth={0.5} className="text-primary" />
                    {data.pts.map((p, i) => <circle key={i} cx={tx(p.x)} cy={ty(p.y)} r={1.5} fill="currentColor" className="text-primary" />)}
                  </>
                );
              })()}
            </svg>
          </Card>
        </>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">Need at least 2 distinct points.</Card>
      )}
    </ToolShell>
  );
}
