import { useMemo, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function BezierPicker() {
  const [p1, setP1] = useState({ x: 0.25, y: 0.1 });
  const [p2, setP2] = useState({ x: 0.25, y: 1.0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"p1" | "p2" | null>(null);

  const SIZE = 300;

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(-0.5, Math.min(1.5, 1 - (e.clientY - rect.top) / rect.height));
    if (dragging.current === "p1") setP1({ x, y });
    else setP2({ x, y });
  }

  const cssValue = `cubic-bezier(${p1.x.toFixed(3)}, ${p1.y.toFixed(3)}, ${p2.x.toFixed(3)}, ${p2.y.toFixed(3)})`;

  const path = useMemo(() => {
    const X = (v: number) => v * SIZE;
    const Y = (v: number) => (1 - v) * SIZE;
    return `M ${X(0)} ${Y(0)} C ${X(p1.x)} ${Y(p1.y)}, ${X(p2.x)} ${Y(p2.y)}, ${X(1)} ${Y(1)}`;
  }, [p1, p2]);

  return (
    <ToolShell title="Bezier Picker" description="Drag the handles to dial in a custom cubic-bezier easing." category={categoryMap.generator}>
      <Card className="flex flex-col items-center gap-3 p-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="aspect-square w-full max-w-md cursor-crosshair touch-none rounded-md bg-muted/30"
          onPointerMove={onPointerMove}
          onPointerUp={() => (dragging.current = null)}
          onPointerCancel={() => (dragging.current = null)}
        >
          <line x1={0} y1={SIZE} x2={SIZE} y2={0} stroke="currentColor" strokeOpacity={0.15} strokeDasharray="4 4" />
          <line x1={0} y1={p1.x * SIZE} x2={p1.x * SIZE} y2={(1 - p1.y) * SIZE} stroke="currentColor" strokeOpacity={0.3} />
          <line x1={SIZE} y1={(1 - 1) * SIZE} x2={p2.x * SIZE} y2={(1 - p2.y) * SIZE} stroke="currentColor" strokeOpacity={0.3} />
          <path d={path} stroke="currentColor" strokeWidth={2} fill="none" className="text-primary" />
          <circle cx={p1.x * SIZE} cy={(1 - p1.y) * SIZE} r={8} fill="currentColor" className="text-primary cursor-grab" onPointerDown={(e) => { dragging.current = "p1"; (e.target as Element).setPointerCapture(e.pointerId); }} />
          <circle cx={p2.x * SIZE} cy={(1 - p2.y) * SIZE} r={8} fill="currentColor" className="text-primary cursor-grab" onPointerDown={(e) => { dragging.current = "p2"; (e.target as Element).setPointerCapture(e.pointerId); }} />
        </svg>
      </Card>
      <Card className="flex items-center justify-between gap-2 p-3">
        <code className="font-mono text-sm">{cssValue}</code>
        <CopyButton value={cssValue} />
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Live preview</Label>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/4 rounded-full bg-primary" style={{ animation: `bezDemoAnim 2.5s ${cssValue} infinite alternate` }} />
        </div>
        <style>{`@keyframes bezDemoAnim { from { transform: translateX(0); } to { transform: translateX(300%); } }`}</style>
      </Card>
    </ToolShell>
  );
}
