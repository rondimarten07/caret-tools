import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type System = "metric" | "imperial";

function category(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-sky-600" };
  if (bmi < 25) return { label: "Normal", color: "text-emerald-600" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-600" };
  return { label: "Obese", color: "text-rose-600" };
}

export default function BmiCalculator() {
  const [system, setSystem] = useState<System>("metric");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");

  const bmi = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) return 0;
    return system === "metric" ? w / Math.pow(h / 100, 2) : (w / (h * h)) * 703;
  }, [height, weight, system]);

  const cat = category(bmi);

  return (
    <ToolShell title="BMI Calculator" description="Body-Mass Index for metric or imperial units." category={categoryMap.math}>
      <Card className="flex gap-2 p-3">
        <Button size="sm" variant={system === "metric" ? "default" : "outline"} onClick={() => setSystem("metric")}>Metric (cm / kg)</Button>
        <Button size="sm" variant={system === "imperial" ? "default" : "outline"} onClick={() => setSystem("imperial")}>Imperial (in / lb)</Button>
      </Card>
      <Card className="grid grid-cols-2 gap-3 p-3">
        <div>
          <Label className="text-xs">Height ({system === "metric" ? "cm" : "in"})</Label>
          <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Weight ({system === "metric" ? "kg" : "lb"})</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-xs uppercase text-muted-foreground">BMI</div>
        <div className="text-5xl font-semibold">{bmi.toFixed(1)}</div>
        <div className={`mt-1 text-lg font-medium ${cat.color}`}>{cat.label}</div>
      </Card>
    </ToolShell>
  );
}
