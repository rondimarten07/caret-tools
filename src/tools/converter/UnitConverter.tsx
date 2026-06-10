import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Category = {
  id: string;
  name: string;
  units: { id: string; name: string; toBase: number }[];
};

const CATS: Category[] = [
  {
    id: "length",
    name: "Length",
    units: [
      { id: "mm", name: "Millimeter", toBase: 0.001 },
      { id: "cm", name: "Centimeter", toBase: 0.01 },
      { id: "m", name: "Meter", toBase: 1 },
      { id: "km", name: "Kilometer", toBase: 1000 },
      { id: "in", name: "Inch", toBase: 0.0254 },
      { id: "ft", name: "Foot", toBase: 0.3048 },
      { id: "yd", name: "Yard", toBase: 0.9144 },
      { id: "mi", name: "Mile", toBase: 1609.344 },
    ],
  },
  {
    id: "weight",
    name: "Weight",
    units: [
      { id: "mg", name: "Milligram", toBase: 1e-6 },
      { id: "g", name: "Gram", toBase: 0.001 },
      { id: "kg", name: "Kilogram", toBase: 1 },
      { id: "t", name: "Tonne", toBase: 1000 },
      { id: "oz", name: "Ounce", toBase: 0.0283495 },
      { id: "lb", name: "Pound", toBase: 0.453592 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    units: [
      { id: "ml", name: "Milliliter", toBase: 0.001 },
      { id: "l", name: "Liter", toBase: 1 },
      { id: "m3", name: "Cubic meter", toBase: 1000 },
      { id: "tsp", name: "Teaspoon (US)", toBase: 0.00492892 },
      { id: "tbsp", name: "Tablespoon (US)", toBase: 0.0147868 },
      { id: "cup", name: "Cup (US)", toBase: 0.236588 },
      { id: "gal", name: "Gallon (US)", toBase: 3.78541 },
    ],
  },
  {
    id: "area",
    name: "Area",
    units: [
      { id: "cm2", name: "cm²", toBase: 0.0001 },
      { id: "m2", name: "m²", toBase: 1 },
      { id: "ha", name: "Hectare", toBase: 10000 },
      { id: "km2", name: "km²", toBase: 1e6 },
      { id: "ft2", name: "ft²", toBase: 0.092903 },
      { id: "ac", name: "Acre", toBase: 4046.86 },
    ],
  },
  {
    id: "time",
    name: "Time",
    units: [
      { id: "ms", name: "Millisecond", toBase: 0.001 },
      { id: "s", name: "Second", toBase: 1 },
      { id: "min", name: "Minute", toBase: 60 },
      { id: "h", name: "Hour", toBase: 3600 },
      { id: "d", name: "Day", toBase: 86400 },
      { id: "wk", name: "Week", toBase: 604800 },
    ],
  },
];

export default function UnitConverter() {
  const [cat, setCat] = useState<Category>(CATS[0]);
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(cat.units[0].id);

  const fromUnit = cat.units.find((u) => u.id === from) ?? cat.units[0];
  const base = useMemo(() => Number(value || 0) * fromUnit.toBase, [value, fromUnit]);

  return (
    <ToolShell title="Unit Converter" description="Convert across many physical units." category={categoryMap.converter}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {CATS.map((c) => (
          <Button key={c.id} size="sm" variant={cat.id === c.id ? "default" : "outline"} onClick={() => { setCat(c); setFrom(c.units[0].id); }}>{c.name}</Button>
        ))}
      </Card>
      <Card className="space-y-3 p-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
          <div>
            <Label className="text-xs">Value</Label>
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">From</Label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
              {cat.units.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
            </select>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cat.units.map((u) => (
          <Card key={u.id} className="flex items-baseline justify-between p-3">
            <span className="text-xs text-muted-foreground">{u.name}</span>
            <span className="font-mono">{(base / u.toBase).toLocaleString("en", { maximumFractionDigits: 6 })}</span>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
