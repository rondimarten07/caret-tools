import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function diff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    const prev = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prev;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((+to - +from) / 86400000);
  return { years, months, days, totalDays };
}

export default function AgeCalculator() {
  const [birth, setBirth] = useState("2000-01-01");
  const [as, setAs] = useState(new Date().toISOString().slice(0, 10));

  const r = useMemo(() => {
    const b = new Date(birth);
    const a = new Date(as);
    if (isNaN(b.getTime()) || isNaN(a.getTime()) || b > a) return null;
    return diff(b, a);
  }, [birth, as]);

  return (
    <ToolShell title="Age Calculator" description="Exact age in years, months and days." category={categoryMap.math}>
      <Card className="grid grid-cols-2 gap-3 p-3">
        <div>
          <Label className="text-xs">Birth date</Label>
          <Input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">As of</Label>
          <Input type="date" value={as} onChange={(e) => setAs(e.target.value)} />
        </div>
      </Card>
      {r && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Years</div><div className="text-3xl font-semibold">{r.years}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Months</div><div className="text-3xl font-semibold">{r.months}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Days</div><div className="text-3xl font-semibold">{r.days}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Total days</div><div className="text-3xl font-semibold">{r.totalDays.toLocaleString()}</div></Card>
        </div>
      )}
    </ToolShell>
  );
}
