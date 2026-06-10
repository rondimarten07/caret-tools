import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const UNITS = [
  { id: "ms", name: "Meter / second", v: 1 },
  { id: "kmh", name: "Kilometer / hour", v: 1000 / 3600 },
  { id: "mph", name: "Mile / hour", v: 1609.344 / 3600 },
  { id: "fts", name: "Foot / second", v: 0.3048 },
  { id: "knot", name: "Knot", v: 1852 / 3600 },
  { id: "mach", name: "Mach (sea level)", v: 340.29 },
  { id: "c", name: "Speed of light", v: 299792458 },
];

export default function SpeedConverter() {
  const [value, setValue] = useState("100");
  const [from, setFrom] = useState("kmh");

  const fromUnit = UNITS.find((u) => u.id === from)!;
  const base = useMemo(() => Number(value || 0) * fromUnit.v, [value, fromUnit]);

  return (
    <ToolShell title="Speed Converter" description="Convert between m/s, km/h, mph, knots and more." category={categoryMap.converter}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_220px]">
        <div>
          <Label className="text-xs">Value</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">From</Label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {UNITS.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {UNITS.map((u) => (
          <Card key={u.id} className="flex items-baseline justify-between p-3">
            <span className="text-xs text-muted-foreground">{u.name}</span>
            <span className="font-mono">{(base / u.v).toLocaleString("en", { maximumFractionDigits: 6 })}</span>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
