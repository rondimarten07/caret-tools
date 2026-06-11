import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function expand(x: number, max: number): number[] {
  const a: number[] = [];
  for (let i = 0; i < max; i++) {
    const ai = Math.floor(x);
    a.push(ai);
    const frac = x - ai;
    if (Math.abs(frac) < 1e-15) break;
    x = 1 / frac;
  }
  return a;
}

function convergents(a: number[]): { p: number; q: number; value: number; err: number }[] {
  const out: { p: number; q: number; value: number; err: number }[] = [];
  let p0 = 1, p1 = a[0], q0 = 0, q1 = 1;
  out.push({ p: p1, q: q1, value: p1 / q1, err: 0 });
  for (let i = 1; i < a.length; i++) {
    const p2 = a[i] * p1 + p0;
    const q2 = a[i] * q1 + q0;
    out.push({ p: p2, q: q2, value: p2 / q2, err: 0 });
    [p0, p1, q0, q1] = [p1, p2, q1, q2];
  }
  return out;
}

export default function ContinuedFraction() {
  const [val, setVal] = useUrlState("v", "3.14159265358979");
  const [max, setMax] = useUrlState("m", "12");

  const data = useMemo(() => {
    const x = Number(val);
    const N = Math.max(1, Math.min(30, Number(max) || 12));
    if (!Number.isFinite(x)) return null;
    const a = expand(x, N);
    const c = convergents(a).map((c) => ({ ...c, err: Math.abs(c.value - x) }));
    return { a, c, x };
  }, [val, max]);

  return (
    <ToolShell title="Continued Fraction" description="Expand a real number as [a₀; a₁, a₂, …] and list rational convergents." category={categoryMap.math} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Number</Label><Input value={val} onChange={(e) => setVal(e.target.value)} className="font-mono" /></div>
        <div><Label>Max terms</Label><Input value={max} onChange={(e) => setMax(e.target.value)} type="number" min={1} max={30} /></div>
      </Card>
      {data && (
        <>
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between"><Label>Expansion</Label><CopyButton value={`[${data.a.join("; ")}]`} /></div>
            <code className="block break-all rounded-md bg-muted/30 p-3 font-mono">[{data.a[0]}; {data.a.slice(1).join(", ")}]</code>
          </Card>
          <Card className="overflow-hidden p-0">
            <div className="border-b p-3 text-xs uppercase text-muted-foreground">Convergents</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-3">#</th>
                  <th className="p-3">p / q</th>
                  <th className="p-3">value</th>
                  <th className="p-3">error</th>
                </tr>
              </thead>
              <tbody>
                {data.c.map((c, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-3 font-mono text-muted-foreground">{i}</td>
                    <td className="p-3 font-mono">{c.p} / {c.q}</td>
                    <td className="p-3 font-mono">{c.value.toFixed(12)}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{c.err.toExponential(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </ToolShell>
  );
}
