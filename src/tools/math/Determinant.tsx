import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

function det(m: number[][]): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (n === 3) {
    const [[a, b, c], [d, e, f], [g, h, i]] = m;
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  }
  // Generic Laplace for completeness (n=4).
  let s = 0;
  for (let j = 0; j < n; j++) {
    const minor = m.slice(1).map((row) => row.filter((_, k) => k !== j));
    s += (j % 2 === 0 ? 1 : -1) * m[0][j] * det(minor);
  }
  return s;
}

export default function Determinant() {
  const [size, setSize] = useState<2 | 3 | 4>(3);
  const [vals, setVals] = useState<string[][]>(() => Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => "0")));

  const result = useMemo(() => {
    const m: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        const v = Number(vals[i][j]);
        if (!Number.isFinite(v)) return null;
        row.push(v);
      }
      m.push(row);
    }
    return det(m);
  }, [size, vals]);

  function update(i: number, j: number, v: string) {
    setVals((prev) => {
      const next = prev.map((r) => [...r]);
      next[i][j] = v;
      return next;
    });
  }

  return (
    <ToolShell title="Matrix Determinant" description="Compute the determinant of a 2×2, 3×3 or 4×4 matrix." category={categoryMap.math}>
      <Card className="flex gap-2 p-3">
        {[2, 3, 4].map((s) => (
          <button key={s} onClick={() => setSize(s as 2 | 3 | 4)} className={`rounded-md border px-3 py-1.5 text-sm ${size === s ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s}×{s}</button>
        ))}
      </Card>
      <Card className="space-y-2 p-4">
        {Array.from({ length: size }).map((_, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            {Array.from({ length: size }).map((__, j) => (
              <Input key={j} className="w-20" value={vals[i][j]} onChange={(e) => update(i, j, e.target.value)} />
            ))}
          </div>
        ))}
      </Card>
      <Card className="p-4">
        {result === null ? (
          <p className="text-sm text-destructive">Invalid input.</p>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
            <span className="font-mono text-lg">det = {result}</span>
            <CopyButton value={String(result)} />
          </div>
        )}
      </Card>
    </ToolShell>
  );
}
