import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function PolarCartesian() {
  const [x, setX] = useUrlState("x", "3");
  const [y, setY] = useUrlState("y", "4");
  const [r, setR] = useUrlState("r", "5");
  const [theta, setTheta] = useUrlState("th", "53.13");
  const [angle, setAngle] = useState<"deg" | "rad">("deg");

  const toPolar = useMemo(() => {
    const X = Number(x), Y = Number(y);
    if (!Number.isFinite(X) || !Number.isFinite(Y)) return null;
    const R = Math.hypot(X, Y);
    let T = Math.atan2(Y, X);
    if (angle === "deg") T = (T * 180) / Math.PI;
    return { r: R, t: T };
  }, [x, y, angle]);

  const toCart = useMemo(() => {
    const R = Number(r);
    let T = Number(theta);
    if (!Number.isFinite(R) || !Number.isFinite(T)) return null;
    if (angle === "deg") T = (T * Math.PI) / 180;
    return { x: R * Math.cos(T), y: R * Math.sin(T) };
  }, [r, theta, angle]);

  const fmt = (n: number) => n.toFixed(6).replace(/\.?0+$/, "");

  return (
    <ToolShell title="Polar ↔ Cartesian" description="Convert between (x, y) and (r, θ) coordinates." category={categoryMap.converter} shareable>
      <Card className="flex gap-2 p-3">
        {(["deg", "rad"] as const).map((a) => (
          <button key={a} onClick={() => setAngle(a)} className={`rounded-md border px-3 py-1.5 text-sm ${angle === a ? "bg-primary text-primary-foreground" : "bg-card"}`}>{a.toUpperCase()}</button>
        ))}
      </Card>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>x</Label>
          <Input value={x} onChange={(e) => setX(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label>y</Label>
          <Input value={y} onChange={(e) => setY(e.target.value)} className="font-mono" />
        </div>
        {toPolar && (
          <>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <span className="font-mono">r = {fmt(toPolar.r)}</span>
              <CopyButton value={fmt(toPolar.r)} />
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <span className="font-mono">θ = {fmt(toPolar.t)} {angle}</span>
              <CopyButton value={fmt(toPolar.t)} />
            </div>
          </>
        )}
      </Card>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>r</Label>
          <Input value={r} onChange={(e) => setR(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label>θ ({angle})</Label>
          <Input value={theta} onChange={(e) => setTheta(e.target.value)} className="font-mono" />
        </div>
        {toCart && (
          <>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <span className="font-mono">x = {fmt(toCart.x)}</span>
              <CopyButton value={fmt(toCart.x)} />
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <span className="font-mono">y = {fmt(toCart.y)}</span>
              <CopyButton value={fmt(toCart.y)} />
            </div>
          </>
        )}
      </Card>
    </ToolShell>
  );
}
