import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const VOLUME = [
  { id: "tsp", name: "Teaspoon (tsp, US)", ml: 4.92892 },
  { id: "tbsp", name: "Tablespoon (tbsp, US)", ml: 14.7868 },
  { id: "fl-oz", name: "Fluid ounce (fl oz, US)", ml: 29.5735 },
  { id: "cup", name: "Cup (US)", ml: 236.588 },
  { id: "pint", name: "Pint (US)", ml: 473.176 },
  { id: "ml", name: "Milliliter (ml)", ml: 1 },
  { id: "l", name: "Liter (L)", ml: 1000 },
];

// Approximate weights per 1 cup for common ingredients
const WEIGHTS: { name: string; gPerCup: number }[] = [
  { name: "Water", gPerCup: 237 },
  { name: "Flour (all-purpose)", gPerCup: 120 },
  { name: "Sugar (granulated)", gPerCup: 200 },
  { name: "Brown sugar (packed)", gPerCup: 220 },
  { name: "Butter", gPerCup: 227 },
  { name: "Rice (uncooked)", gPerCup: 185 },
  { name: "Honey", gPerCup: 340 },
  { name: "Cocoa powder", gPerCup: 100 },
];

export default function CookingConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("cup");

  const fromUnit = VOLUME.find((u) => u.id === from)!;
  const baseMl = useMemo(() => Number(value || 0) * fromUnit.ml, [value, fromUnit]);

  return (
    <ToolShell title="Cooking Measurements" description="Convert between teaspoon, tablespoon, cup, ml, fl oz — plus weight estimates." category={categoryMap.converter}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_220px]">
        <div><Label className="text-xs">Amount</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></div>
        <div>
          <Label className="text-xs">From</Label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {VOLUME.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
        </div>
      </Card>
      <Label className="block text-xs uppercase tracking-wider text-muted-foreground">Volume</Label>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {VOLUME.map((u) => (
          <Card key={u.id} className="flex items-baseline justify-between p-3">
            <span className="text-xs text-muted-foreground">{u.name}</span>
            <span className="font-mono">{(baseMl / u.ml).toLocaleString("en", { maximumFractionDigits: 4 })}</span>
          </Card>
        ))}
      </div>
      <Label className="mt-2 block text-xs uppercase tracking-wider text-muted-foreground">Weight (approx, for common ingredients)</Label>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {WEIGHTS.map((w) => {
          // 1 cup = 236.588 ml, weight scales with volume
          const grams = (baseMl / 236.588) * w.gPerCup;
          return (
            <Card key={w.name} className="flex items-baseline justify-between p-3">
              <span className="text-xs text-muted-foreground">{w.name}</span>
              <span className="font-mono">{grams.toLocaleString("en", { maximumFractionDigits: 1 })} g</span>
            </Card>
          );
        })}
      </div>
    </ToolShell>
  );
}
