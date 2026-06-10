import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function DateDiff() {
  const [a, setA] = useState(new Date().toISOString().slice(0, 10));
  const [b, setB] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));

  const r = useMemo(() => {
    const da = new Date(a);
    const db = new Date(b);
    if (isNaN(da.getTime()) || isNaN(db.getTime())) return null;
    const ms = Math.abs(+db - +da);
    return {
      days: Math.floor(ms / 86400000),
      hours: Math.floor(ms / 3600000),
      weeks: Math.floor(ms / (7 * 86400000)),
      months: Math.floor(ms / (30.44 * 86400000)),
    };
  }, [a, b]);

  return (
    <ToolShell title="Date Difference" description="Time between two dates in days, weeks and months." category={categoryMap.math}>
      <Card className="grid grid-cols-2 gap-3 p-3">
        <div><Label className="text-xs">From</Label><Input type="date" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div><Label className="text-xs">To</Label><Input type="date" value={b} onChange={(e) => setB(e.target.value)} /></div>
      </Card>
      {r && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Days</div><div className="text-3xl font-semibold">{r.days.toLocaleString()}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Weeks</div><div className="text-3xl font-semibold">{r.weeks.toLocaleString()}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Months</div><div className="text-3xl font-semibold">{r.months}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs text-muted-foreground">Hours</div><div className="text-3xl font-semibold">{r.hours.toLocaleString()}</div></Card>
        </div>
      )}
    </ToolShell>
  );
}
