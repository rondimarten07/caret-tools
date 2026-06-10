import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function toSeconds(h: number, m: number, s: number) {
  return h * 3600 + m * 60 + s;
}

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export default function PaceCalculator() {
  const [distance, setDistance] = useState(10);
  const [h, setH] = useState(0);
  const [m, setM] = useState(50);
  const [s, setS] = useState(0);

  const r = useMemo(() => {
    const total = toSeconds(h, m, s);
    if (!distance || !total) return null;
    const pacePerKm = total / distance;
    const pacePerMi = pacePerKm * 1.609344;
    const kmh = (distance / total) * 3600;
    const mph = kmh / 1.609344;
    return { pacePerKm, pacePerMi, kmh, mph };
  }, [distance, h, m, s]);

  return (
    <ToolShell title="Pace Calculator" description="Pace (min/km, min/mi) and speed (km/h, mph) from distance and time." category={categoryMap.math}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-4">
        <div>
          <Label className="text-xs">Distance (km)</Label>
          <Input type="number" step={0.1} value={distance} onChange={(e) => setDistance(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Hours</Label>
          <Input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Minutes</Label>
          <Input type="number" value={m} onChange={(e) => setM(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Seconds</Label>
          <Input type="number" value={s} onChange={(e) => setS(Number(e.target.value) || 0)} />
        </div>
      </Card>
      {r && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">Pace</div><div className="mt-1 font-mono text-2xl">{fmt(r.pacePerKm)}</div><div className="text-xs text-muted-foreground">min/km</div></Card>
          <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">Pace</div><div className="mt-1 font-mono text-2xl">{fmt(r.pacePerMi)}</div><div className="text-xs text-muted-foreground">min/mi</div></Card>
          <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">Speed</div><div className="mt-1 font-mono text-2xl">{r.kmh.toFixed(2)}</div><div className="text-xs text-muted-foreground">km/h</div></Card>
          <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">Speed</div><div className="mt-1 font-mono text-2xl">{r.mph.toFixed(2)}</div><div className="text-xs text-muted-foreground">mph</div></Card>
        </div>
      )}
    </ToolShell>
  );
}
