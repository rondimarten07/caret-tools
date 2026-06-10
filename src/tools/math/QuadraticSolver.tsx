import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function QuadraticSolver() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-3");
  const [c, setC] = useState("2");

  const r = useMemo(() => {
    const A = parseFloat(a);
    const B = parseFloat(b);
    const C = parseFloat(c);
    if (!Number.isFinite(A) || !Number.isFinite(B) || !Number.isFinite(C)) return null;
    if (A === 0) {
      if (B === 0) return { kind: "degenerate" as const, msg: "Both a and b are zero — not an equation." };
      return { kind: "linear" as const, x: -C / B };
    }
    const disc = B * B - 4 * A * C;
    if (disc > 0) {
      const sq = Math.sqrt(disc);
      return { kind: "two" as const, x1: (-B + sq) / (2 * A), x2: (-B - sq) / (2 * A), disc };
    }
    if (disc === 0) return { kind: "one" as const, x: -B / (2 * A), disc };
    const sq = Math.sqrt(-disc);
    return {
      kind: "complex" as const,
      real: -B / (2 * A),
      imag: sq / (2 * A),
      disc,
    };
  }, [a, b, c]);

  const fmt = (n: number) => Number(n.toFixed(6)).toString();

  return (
    <ToolShell title="Quadratic Equation" description="Solve ax² + bx + c = 0 with discriminant analysis." category={categoryMap.math}>
      <Card className="grid grid-cols-3 gap-3 p-3">
        <div><Label className="text-xs">a (coefficient of x²)</Label><Input value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div><Label className="text-xs">b (coefficient of x)</Label><Input value={b} onChange={(e) => setB(e.target.value)} /></div>
        <div><Label className="text-xs">c (constant)</Label><Input value={c} onChange={(e) => setC(e.target.value)} /></div>
      </Card>
      <Card className="p-6 text-center">
        <code className="font-mono text-2xl">{a}x² {Number(b) >= 0 ? "+" : ""} {b}x {Number(c) >= 0 ? "+" : ""} {c} = 0</code>
      </Card>
      {r && (
        <Card className="p-6">
          {r.kind === "degenerate" && <p className="text-sm text-rose-600">{r.msg}</p>}
          {r.kind === "linear" && (
            <>
              <Label className="text-xs">Linear equation (a = 0)</Label>
              <div className="mt-1 font-mono text-3xl">x = {fmt(r.x)}</div>
            </>
          )}
          {r.kind === "two" && (
            <>
              <Label className="text-xs">Two real roots · discriminant = {fmt(r.disc)}</Label>
              <div className="mt-2 grid grid-cols-2 gap-3 text-center">
                <div><div className="text-xs text-muted-foreground">x₁</div><div className="font-mono text-3xl">{fmt(r.x1)}</div></div>
                <div><div className="text-xs text-muted-foreground">x₂</div><div className="font-mono text-3xl">{fmt(r.x2)}</div></div>
              </div>
            </>
          )}
          {r.kind === "one" && (
            <>
              <Label className="text-xs">One real root (double) · discriminant = 0</Label>
              <div className="mt-1 font-mono text-3xl">x = {fmt(r.x)}</div>
            </>
          )}
          {r.kind === "complex" && (
            <>
              <Label className="text-xs">Two complex roots · discriminant = {fmt(r.disc)}</Label>
              <div className="mt-1 font-mono text-2xl">x = {fmt(r.real)} ± {fmt(r.imag)}i</div>
            </>
          )}
        </Card>
      )}
    </ToolShell>
  );
}
