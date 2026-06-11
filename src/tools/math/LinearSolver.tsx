import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function solve(matrix: number[][]): number[] | null {
  const n = matrix.length;
  const m = matrix.map((r) => [...r]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(m[k][i]) > Math.abs(m[maxRow][i])) maxRow = k;
    }
    [m[i], m[maxRow]] = [m[maxRow], m[i]];
    if (Math.abs(m[i][i]) < 1e-12) return null;
    for (let k = i + 1; k < n; k++) {
      const factor = m[k][i] / m[i][i];
      for (let j = i; j <= n; j++) m[k][j] -= factor * m[i][j];
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = m[i][n];
    for (let j = i + 1; j < n; j++) s -= m[i][j] * x[j];
    x[i] = s / m[i][i];
  }
  return x;
}

export default function LinearSolver() {
  const [size, setSize] = useState<2 | 3>(2);
  const [vals, setVals] = useState<string[][]>(() => Array.from({ length: 3 }, (_, i) => Array.from({ length: 4 }, () => (i === 0 ? "1" : "0"))));

  const sol = useMemo(() => {
    const m: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j <= size; j++) {
        const v = Number(vals[i][j]);
        if (!Number.isFinite(v)) return null;
        row.push(v);
      }
      m.push(row);
    }
    return solve(m);
  }, [size, vals]);

  function update(i: number, j: number, v: string) {
    setVals((prev) => {
      const next = prev.map((r) => [...r]);
      next[i][j] = v;
      return next;
    });
  }

  const vars = ["x", "y", "z"];

  return (
    <ToolShell title="Linear System Solver" description="Solve a 2×2 or 3×3 system of linear equations via Gaussian elimination." category={categoryMap.math}>
      <Card className="flex gap-2 p-3">
        {[2, 3].map((s) => (
          <button key={s} onClick={() => setSize(s as 2 | 3)} className={`rounded-md border px-3 py-1.5 text-sm ${size === s ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s}×{s}</button>
        ))}
      </Card>
      <Card className="space-y-2 p-4">
        <Label>Augmented coefficient matrix</Label>
        {Array.from({ length: size }).map((_, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            {Array.from({ length: size }).map((__, j) => (
              <div key={j} className="flex items-center gap-1">
                <Input className="w-20" value={vals[i][j]} onChange={(e) => update(i, j, e.target.value)} />
                <span className="text-sm text-muted-foreground">{vars[j]}</span>
                {j < size - 1 && <span className="text-sm">+</span>}
              </div>
            ))}
            <span className="text-sm">=</span>
            <Input className="w-20" value={vals[i][size]} onChange={(e) => update(i, size, e.target.value)} />
          </div>
        ))}
      </Card>
      <Card className="p-4">
        {sol ? (
          <dl className="space-y-2 text-sm">
            {sol.map((v, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <dt className="font-mono text-muted-foreground">{vars[i]}</dt>
                <dd className="flex items-center gap-2 font-mono">{v.toFixed(6).replace(/\.?0+$/, "")}<CopyButton value={String(v)} /></dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-destructive">No unique solution (singular matrix or invalid input).</p>
        )}
      </Card>
    </ToolShell>
  );
}
