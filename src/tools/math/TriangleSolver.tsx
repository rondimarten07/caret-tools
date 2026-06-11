import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

type Solved = { a: number; b: number; c: number; A: number; B: number; C: number; area: number; perimeter: number };

function solveSSS(a: number, b: number, c: number): Solved | null {
  if (a + b <= c || a + c <= b || b + c <= a) return null;
  const A = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
  const B = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
  const C = 180 - A - B;
  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  return { a, b, c, A, B, C, area, perimeter: a + b + c };
}

function solveSAS(a: number, C: number, b: number): Solved | null {
  if (a <= 0 || b <= 0 || C <= 0 || C >= 180) return null;
  const cRad = toRad(C);
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(cRad));
  return solveSSS(a, b, c);
}

export default function TriangleSolver() {
  const [a, setA] = useUrlState("a", "3");
  const [b, setB] = useUrlState("b", "4");
  const [c, setC] = useUrlState("c", "5");

  const sol = useMemo(() => solveSSS(Number(a), Number(b), Number(c)), [a, b, c]);

  const fmt = (n: number) => n.toFixed(4).replace(/\.?0+$/, "");

  return (
    <ToolShell title="Triangle Solver" description="Enter three sides (SSS) — get all angles, area and perimeter." category={categoryMap.math} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <div><Label>Side a</Label><Input type="number" value={a} onChange={(e) => setA(e.target.value)} step="any" min={0} /></div>
        <div><Label>Side b</Label><Input type="number" value={b} onChange={(e) => setB(e.target.value)} step="any" min={0} /></div>
        <div><Label>Side c</Label><Input type="number" value={c} onChange={(e) => setC(e.target.value)} step="any" min={0} /></div>
      </Card>
      {sol ? (
        <Card className="p-4">
          <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
            <div><dt className="text-xs text-muted-foreground">Angle A (opp a)</dt><dd className="font-mono">{fmt(sol.A)}°</dd></div>
            <div><dt className="text-xs text-muted-foreground">Angle B (opp b)</dt><dd className="font-mono">{fmt(sol.B)}°</dd></div>
            <div><dt className="text-xs text-muted-foreground">Angle C (opp c)</dt><dd className="font-mono">{fmt(sol.C)}°</dd></div>
            <div><dt className="text-xs text-muted-foreground">Area</dt><dd className="font-mono">{fmt(sol.area)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Perimeter</dt><dd className="font-mono">{fmt(sol.perimeter)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Type</dt>
              <dd className="font-mono">
                {Math.max(sol.A, sol.B, sol.C) > 90.0001 ? "obtuse" : Math.max(sol.A, sol.B, sol.C) > 89.9999 && Math.max(sol.A, sol.B, sol.C) < 90.0001 ? "right" : "acute"}
              </dd>
            </div>
          </dl>
        </Card>
      ) : (
        <Card className="p-4 text-sm text-destructive">Not a valid triangle — the sum of any two sides must exceed the third.</Card>
      )}
    </ToolShell>
  );
}
