import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function TipCalculator() {
  const [bill, setBill] = useState("100");
  const [tip, setTip] = useState("15");
  const [people, setPeople] = useState("2");

  const r = useMemo(() => {
    const b = Number(bill);
    const t = Number(tip);
    const p = Math.max(1, Number(people));
    const tipAmt = (b * t) / 100;
    const total = b + tipAmt;
    return { tipAmt, total, perPerson: total / p };
  }, [bill, tip, people]);

  const fmt = (v: number) => v.toLocaleString("en", { maximumFractionDigits: 2 });

  return (
    <ToolShell title="Tip & Split" description="Tip the bill and split between people." category={categoryMap.math}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3">
        <div><Label className="text-xs">Bill</Label><Input type="number" value={bill} onChange={(e) => setBill(e.target.value)} /></div>
        <div><Label className="text-xs">Tip (%)</Label><Input type="number" value={tip} onChange={(e) => setTip(e.target.value)} /></div>
        <div><Label className="text-xs">People</Label><Input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} /></div>
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Tip amount</div><div className="mt-1 text-3xl font-semibold">{fmt(r.tipAmt)}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Total</div><div className="mt-1 text-3xl font-semibold">{fmt(r.total)}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Per person</div><div className="mt-1 text-3xl font-semibold">{fmt(r.perPerson)}</div></Card>
      </div>
    </ToolShell>
  );
}
