import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Sex = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very";

const MULT: Record<Activity, { v: number; label: string }> = {
  sedentary: { v: 1.2, label: "Sedentary (little/no exercise)" },
  light: { v: 1.375, label: "Light (1–3 days/week)" },
  moderate: { v: 1.55, label: "Moderate (3–5 days/week)" },
  active: { v: 1.725, label: "Active (6–7 days/week)" },
  very: { v: 1.9, label: "Very active (physical job + training)" },
};

export default function BmrCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activity, setActivity] = useState<Activity>("moderate");

  const result = useMemo(() => {
    // Mifflin-St Jeor
    const base = 10 * weight + 6.25 * height - 5 * age;
    const bmr = sex === "male" ? base + 5 : base - 161;
    const tdee = bmr * MULT[activity].v;
    return {
      bmr,
      tdee,
      cut: tdee - 500,
      bulk: tdee + 300,
    };
  }, [sex, age, height, weight, activity]);

  return (
    <ToolShell title="BMR / Calorie Calculator" description="Basal metabolic rate (Mifflin-St Jeor) and daily calorie targets." category={categoryMap.math}>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        <div>
          <Label className="text-xs">Sex</Label>
          <div className="mt-1 flex gap-1">
            <Button size="sm" variant={sex === "male" ? "default" : "outline"} onClick={() => setSex("male")}>Male</Button>
            <Button size="sm" variant={sex === "female" ? "default" : "outline"} onClick={() => setSex("female")}>Female</Button>
          </div>
        </div>
        <div><Label className="text-xs">Age</Label><Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Height (cm)</Label><Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Weight (kg)</Label><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} /></div>
        <div className="col-span-2 md:col-span-4">
          <Label className="text-xs">Activity level</Label>
          <select value={activity} onChange={(e) => setActivity(e.target.value as Activity)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {(Object.entries(MULT) as [Activity, typeof MULT.sedentary][]).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
          </select>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">BMR</div><div className="mt-1 font-mono text-2xl">{Math.round(result.bmr)}</div><div className="text-xs text-muted-foreground">kcal/day</div></Card>
        <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">TDEE</div><div className="mt-1 font-mono text-2xl">{Math.round(result.tdee)}</div><div className="text-xs text-muted-foreground">maintain</div></Card>
        <Card className="p-4 text-center bg-rose-50 dark:bg-rose-950/30"><div className="text-xs uppercase text-muted-foreground">Cut</div><div className="mt-1 font-mono text-2xl">{Math.round(result.cut)}</div><div className="text-xs text-muted-foreground">−500 kcal</div></Card>
        <Card className="p-4 text-center bg-emerald-50 dark:bg-emerald-950/30"><div className="text-xs uppercase text-muted-foreground">Bulk</div><div className="mt-1 font-mono text-2xl">{Math.round(result.bulk)}</div><div className="text-xs text-muted-foreground">+300 kcal</div></Card>
      </div>
    </ToolShell>
  );
}
