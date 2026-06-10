import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [contribution, setContribution] = useState("100");
  const [freq, setFreq] = useState(12);

  const result = useMemo(() => {
    const P = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(years);
    const C = Number(contribution);
    const n = freq;
    if (!P || !r || !t) return null;

    const finalFromP = P * Math.pow(1 + r / n, n * t);
    const finalFromC = C > 0 ? C * ((Math.pow(1 + r / n, n * t) - 1) / (r / n)) : 0;
    const final = finalFromP + finalFromC;
    const contributed = P + C * n * t;
    const interest = final - contributed;

    return { final, contributed, interest };
  }, [principal, rate, years, contribution, freq]);

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <ToolShell title="Compound Interest" description="Investment growth with optional regular contributions." category={categoryMap.math}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3">
        <div><Label className="text-xs">Initial principal</Label><Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></div>
        <div><Label className="text-xs">Annual rate (%)</Label><Input type="number" step={0.1} value={rate} onChange={(e) => setRate(e.target.value)} /></div>
        <div><Label className="text-xs">Years</Label><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></div>
        <div><Label className="text-xs">Periodic contribution</Label><Input type="number" value={contribution} onChange={(e) => setContribution(e.target.value)} /></div>
        <div className="md:col-span-2">
          <Label className="text-xs">Frequency (per year)</Label>
          <select value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            <option value={1}>Annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={52}>Weekly</option>
            <option value={365}>Daily</option>
          </select>
        </div>
      </Card>
      {result && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Final balance</div><div className="mt-1 text-3xl font-semibold">{fmt(result.final)}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Total contributed</div><div className="mt-1 text-3xl font-semibold">{fmt(result.contributed)}</div></Card>
          <Card className="p-4 bg-emerald-500/10"><div className="text-xs uppercase text-muted-foreground">Interest earned</div><div className="mt-1 text-3xl font-semibold text-emerald-600">{fmt(result.interest)}</div></Card>
        </div>
      )}
    </ToolShell>
  );
}
