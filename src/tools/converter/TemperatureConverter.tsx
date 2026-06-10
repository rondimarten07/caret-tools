import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Scale = "C" | "F" | "K" | "R";

function toC(v: number, s: Scale): number {
  switch (s) {
    case "C": return v;
    case "F": return (v - 32) * (5 / 9);
    case "K": return v - 273.15;
    case "R": return (v - 491.67) * (5 / 9);
  }
}

function fromC(c: number, s: Scale): number {
  switch (s) {
    case "C": return c;
    case "F": return c * (9 / 5) + 32;
    case "K": return c + 273.15;
    case "R": return (c + 273.15) * (9 / 5);
  }
}

const NAMES: Record<Scale, string> = { C: "Celsius", F: "Fahrenheit", K: "Kelvin", R: "Rankine" };

export default function TemperatureConverter() {
  const [value, setValue] = useState("25");
  const [from, setFrom] = useState<Scale>("C");

  const c = useMemo(() => toC(Number(value || 0), from), [value, from]);

  return (
    <ToolShell title="Temperature Converter" description="Celsius, Fahrenheit, Kelvin and Rankine." category={categoryMap.converter}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">Value</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">From</Label>
          <select value={from} onChange={(e) => setFrom(e.target.value as Scale)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {(["C", "F", "K", "R"] as Scale[]).map((s) => (<option key={s} value={s}>{NAMES[s]}</option>))}
          </select>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(["C", "F", "K", "R"] as Scale[]).map((s) => (
          <Card key={s} className="p-3 text-center">
            <div className="text-xs text-muted-foreground">{NAMES[s]}</div>
            <div className="mt-1 text-2xl font-semibold">{fromC(c, s).toLocaleString("en", { maximumFractionDigits: 4 })}°</div>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
