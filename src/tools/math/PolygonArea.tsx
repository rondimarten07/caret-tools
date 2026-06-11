import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function parsePoints(text: string): [number, number][] {
  return text
    .split(/[\n;]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [x, y] = line.split(/[,\s]+/).map((s) => Number(s));
      return [x, y] as [number, number];
    })
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
}

function shoelace(pts: [number, number][]): number {
  let area = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

function perimeter(pts: [number, number][]): number {
  let p = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    p += Math.hypot(x2 - x1, y2 - y1);
  }
  return p;
}

export default function PolygonArea() {
  const [pts, setPts] = useUrlState("p", "0,0\n4,0\n4,3\n0,3");

  const data = useMemo(() => {
    const points = parsePoints(pts);
    if (points.length < 3) return null;
    return { points, area: shoelace(points), perimeter: perimeter(points) };
  }, [pts]);

  const svg = useMemo(() => {
    if (!data) return null;
    const xs = data.points.map((p) => p[0]);
    const ys = data.points.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = Math.max(1, maxX - minX);
    const h = Math.max(1, maxY - minY);
    const pad = 0.1;
    const points = data.points.map((p) => `${p[0]},${maxY - p[1]}`).join(" ");
    return { points, viewBox: `${minX - w * pad} ${-w * pad} ${w * (1 + 2 * pad)} ${h * (1 + 2 * pad)}` };
  }, [data]);

  return (
    <ToolShell title="Polygon Area & Perimeter" description="Vertex coordinates → area (shoelace) and perimeter. One vertex per line, comma-separated." category={categoryMap.math} shareable>
      <Card className="space-y-3 p-4">
        <Label>Vertices (x,y per line)</Label>
        <Textarea value={pts} onChange={(e) => setPts(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
      </Card>
      {data ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Vertices</dt><dd className="font-mono">{data.points.length}</dd></div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Area</dt>
                <dd className="flex items-center gap-2 font-mono">{data.area.toFixed(4)}<CopyButton value={data.area.toFixed(4)} /></dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Perimeter</dt>
                <dd className="flex items-center gap-2 font-mono">{data.perimeter.toFixed(4)}<CopyButton value={data.perimeter.toFixed(4)} /></dd>
              </div>
            </dl>
          </Card>
          {svg && (
            <Card className="p-4">
              <svg viewBox={svg.viewBox} className="aspect-square w-full">
                <polygon points={svg.points} fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth={0.05} className="text-primary" />
              </svg>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">Add at least 3 vertices.</Card>
      )}
    </ToolShell>
  );
}
