import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function ExpGrowth() {
  const [p0, setP0] = useUrlState("p", "1000");
  const [rate, setRate] = useUrlState("r", "5");
  const [years, setYears] = useUrlState("y", "10");

  const data = useMemo(() => {
    const P = Number(p0);
    const R = Number(rate) / 100;
    const Y = Number(years);
    if (!Number.isFinite(P) || !Number.isFinite(R) || !Number.isFinite(Y)) return null;
    const final = P * Math.pow(1 + R, Y);
    const k = Math.log(1 + R);
    const doublingTime = R > 0 ? Math.log(2) / k : null;
    const halfLife = R < 0 ? Math.log(0.5) / k : null;
    const series: { t: number; value: number }[] = [];
    const step = Y / 20;
    for (let i = 0; i <= 20; i++) {
      const t = i * step;
      series.push({ t, value: P * Math.pow(1 + R, t) });
    }
    return { final, doublingTime, halfLife, series };
  }, [p0, rate, years]);

  return (
    <ToolShell title="Exponential Growth / Decay" description="Project a value with a constant per-period rate. Negative rates = decay." category={categoryMap.math} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <div><Label>Initial P₀</Label><Input value={p0} onChange={(e) => setP0(e.target.value)} className="font-mono" /></div>
        <div><Label>Rate (% / period)</Label><Input value={rate} onChange={(e) => setRate(e.target.value)} className="font-mono" /></div>
        <div><Label>Periods t</Label><Input value={years} onChange={(e) => setYears(e.target.value)} className="font-mono" /></div>
      </Card>
      {data && (
        <>
          <Card className="grid gap-3 p-4 sm:grid-cols-3">
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Final value</div><div className="font-mono text-lg">{data.final.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div></div>
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Doubling time</div><div className="font-mono text-lg">{data.doublingTime === null ? "—" : data.doublingTime.toFixed(2) + " periods"}</div></div>
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Half-life</div><div className="font-mono text-lg">{data.halfLife === null ? "—" : data.halfLife.toFixed(2) + " periods"}</div></div>
          </Card>
          <Card className="p-4">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="aspect-[2/1] w-full">
              {(() => {
                const max = Math.max(...data.series.map((p) => p.value));
                const min = Math.min(...data.series.map((p) => p.value), 0);
                const pts = data.series.map((p, i) => {
                  const x = (i / 20) * 200;
                  const y = 100 - ((p.value - min) / (max - min || 1)) * 95 - 2;
                  return `${x},${y}`;
                }).join(" ");
                return <polyline points={pts} fill="none" stroke="currentColor" strokeWidth={1} className="text-primary" />;
              })()}
            </svg>
          </Card>
        </>
      )}
    </ToolShell>
  );
}
