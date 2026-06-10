import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7.5");
  const [years, setYears] = useState("15");

  const r = useMemo(() => {
    const p = Number(principal);
    const i = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    if (!p || !i || !n) return null;
    const monthly = (p * i) / (1 - Math.pow(1 + i, -n));
    const total = monthly * n;
    return { monthly, total, interest: total - p, n };
  }, [principal, rate, years]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <ToolShell title="Loan / Mortgage Calculator" description="Monthly payment and interest paid for a fixed-rate loan." category={categoryMap.math}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3">
        <div><Label className="text-xs">Principal</Label><Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></div>
        <div><Label className="text-xs">Annual rate (%)</Label><Input type="number" step={0.1} value={rate} onChange={(e) => setRate(e.target.value)} /></div>
        <div><Label className="text-xs">Term (years)</Label><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></div>
      </Card>
      {r && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Monthly payment</div><div className="mt-1 text-3xl font-semibold">{fmt(r.monthly)}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Total payment</div><div className="mt-1 text-3xl font-semibold">{fmt(r.total)}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Total interest</div><div className="mt-1 text-3xl font-semibold">{fmt(r.interest)}</div></Card>
        </div>
      )}
    </ToolShell>
  );
}
