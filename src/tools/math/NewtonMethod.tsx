import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function safeFn(expr: string): ((x: number) => number) | null {
  try {
    return new Function("x", `return ${expr};`) as (x: number) => number;
  } catch { return null; }
}

function derivative(f: (x: number) => number) {
  return (x: number) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;
}

export default function NewtonMethod() {
  const [expr, setExpr] = useUrlState("e", "x*x*x - 2");
  const [x0, setX0] = useUrlState("x", "1.5");
  const [tol, setTol] = useUrlState("t", "1e-10");
  const [maxIter, setMaxIter] = useUrlState("m", "20");

  const data = useMemo(() => {
    const f = safeFn(expr);
    if (!f) return { error: "Invalid expression. Use JavaScript syntax with x." };
    const df = derivative(f);
    const T = Number(tol);
    const N = Math.max(1, Math.min(100, Number(maxIter) || 20));
    let x = Number(x0);
    if (!Number.isFinite(x)) return { error: "Invalid x₀." };
    const trace: { i: number; x: number; fx: number }[] = [];
    for (let i = 0; i < N; i++) {
      const fx = f(x);
      trace.push({ i, x, fx });
      if (Math.abs(fx) < T) return { ok: true, root: x, trace };
      const d = df(x);
      if (Math.abs(d) < 1e-15) return { error: "Derivative ≈ 0 — Newton diverges here.", trace };
      x = x - fx / d;
      if (!Number.isFinite(x)) return { error: "Diverged.", trace };
    }
    return { error: "Max iterations reached without converging.", trace };
  }, [expr, x0, tol, maxIter]);

  return (
    <ToolShell title="Newton's Method" description="Find roots of f(x) = 0 by Newton-Raphson iteration." category={categoryMap.math} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label>f(x) — JS expression with x</Label><Input value={expr} onChange={(e) => setExpr(e.target.value)} className="font-mono" /></div>
        <div><Label>Initial guess x₀</Label><Input value={x0} onChange={(e) => setX0(e.target.value)} className="font-mono" /></div>
        <div><Label>Tolerance</Label><Input value={tol} onChange={(e) => setTol(e.target.value)} className="font-mono" /></div>
        <div><Label>Max iterations</Label><Input value={maxIter} onChange={(e) => setMaxIter(e.target.value)} className="font-mono" /></div>
      </Card>
      {"error" in data && data.error ? (
        <Card className="p-4 text-sm text-destructive">{data.error}</Card>
      ) : (
        <Card className="p-4">
          <div className="text-center">
            <div className="text-xs uppercase text-muted-foreground">Root</div>
            <div className="font-mono text-2xl">{(data as { root: number }).root.toFixed(12)}</div>
            <div className="text-xs text-muted-foreground">Converged in {data.trace!.length} iteration(s).</div>
          </div>
        </Card>
      )}
      {data.trace && (
        <Card className="overflow-hidden p-0">
          <div className="border-b p-3 text-xs uppercase text-muted-foreground">Iterations</div>
          <table className="w-full text-sm">
            <tbody>
              {data.trace.map((t) => (
                <tr key={t.i} className="border-b last:border-0">
                  <td className="p-2 font-mono text-muted-foreground">i={t.i}</td>
                  <td className="p-2 font-mono">x = {t.x.toFixed(12)}</td>
                  <td className="p-2 font-mono text-muted-foreground">f(x) = {t.fx.toExponential(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Example: <code className="font-mono">x*x*x - 2</code> with x₀=1.5 converges to ∛2 ≈ 1.259921…
      </div>
    </ToolShell>
  );
}
