import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Trash2, Plus } from "lucide-react";

type Stop = { color: string; pos: number };
type Type = "linear" | "radial";

export default function GradientGenerator() {
  const [type, setType] = useState<Type>("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#6366f1", pos: 0 },
    { color: "#ec4899", pos: 100 },
  ]);

  const css = useMemo(() => {
    const parts = stops.map((s) => `${s.color} ${s.pos}%`).join(", ");
    return type === "linear"
      ? `linear-gradient(${angle}deg, ${parts})`
      : `radial-gradient(circle, ${parts})`;
  }, [type, angle, stops]);

  const declaration = `background: ${css};`;

  const addStop = () => setStops((s) => [...s, { color: "#ffffff", pos: 50 }]);
  const removeStop = (i: number) => setStops((s) => s.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<Stop>) =>
    setStops((s) => s.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <ToolShell title="CSS Gradient Generator" description="Build linear and radial CSS gradients live." category={categoryMap.design}
      shareable>
      <Card className="h-64 overflow-hidden p-0" style={{ background: css }} />
      <Card className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={type === "linear" ? "default" : "outline"} onClick={() => setType("linear")}>Linear</Button>
          <Button size="sm" variant={type === "radial" ? "default" : "outline"} onClick={() => setType("radial")}>Radial</Button>
          {type === "linear" && (
            <div className="flex items-center gap-2">
              <Label className="text-xs">Angle</Label>
              <Input type="number" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value) || 0)} className="w-24" />
              <span className="text-xs text-muted-foreground">°</span>
            </div>
          )}
          <Button size="sm" variant="outline" className="ml-auto" onClick={addStop}>
            <Plus className="mr-1 h-3 w-3" />
            Stop
          </Button>
        </div>
        {stops.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="color" value={s.color} onChange={(e) => update(i, { color: e.target.value })} className="h-9 w-12 cursor-pointer rounded border" />
            <Input value={s.color} onChange={(e) => update(i, { color: e.target.value })} className="w-32 font-mono" />
            <Input type="number" min={0} max={100} value={s.pos} onChange={(e) => update(i, { pos: Number(e.target.value) || 0 })} className="w-24" />
            <span className="text-xs text-muted-foreground">%</span>
            <Button size="icon" variant="ghost" onClick={() => removeStop(i)} disabled={stops.length <= 2}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Card>
      <Card className="p-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{declaration}</code>
          <CopyButton value={declaration} />
        </div>
      </Card>
    </ToolShell>
  );
}
