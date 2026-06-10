import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function WorkingDays() {
  const [a, setA] = useState(new Date().toISOString().slice(0, 10));
  const [b, setB] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));

  const r = useMemo(() => {
    const da = new Date(a);
    const db = new Date(b);
    if (isNaN(da.getTime()) || isNaN(db.getTime())) return null;
    const [start, end] = da <= db ? [da, db] : [db, da];
    let business = 0;
    let weekend = 0;
    let total = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day === 0 || day === 6) weekend++;
      else business++;
      total++;
      cur.setDate(cur.getDate() + 1);
    }
    return { business, weekend, total };
  }, [a, b]);

  return (
    <ToolShell title="Working Days" description="Count business / weekend days between two dates (inclusive)." category={categoryMap.time}>
      <Card className="grid grid-cols-2 gap-3 p-3">
        <div><Label className="text-xs">From</Label><Input type="date" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div><Label className="text-xs">To</Label><Input type="date" value={b} onChange={(e) => setB(e.target.value)} /></div>
      </Card>
      {r && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">Business</div><div className="mt-1 text-3xl font-semibold">{r.business}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">Weekend</div><div className="mt-1 text-3xl font-semibold">{r.weekend}</div></Card>
          <Card className="p-4 text-center"><div className="text-xs uppercase text-muted-foreground">Total</div><div className="mt-1 text-3xl font-semibold">{r.total}</div></Card>
        </div>
      )}
    </ToolShell>
  );
}
