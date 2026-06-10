import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function parseMatrix(s: string): number[][] | null {
  const lines = s.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  const rows = lines.map((l) => l.split(/[\s,]+/).map(Number));
  const cols = rows[0].length;
  if (rows.some((r) => r.length !== cols || r.some((n) => !Number.isFinite(n)))) return null;
  return rows;
}

function multiply(A: number[][], B: number[][]): number[][] | null {
  const ar = A.length, ac = A[0].length, br = B.length, bc = B[0].length;
  if (ac !== br) return null;
  const C: number[][] = Array.from({ length: ar }, () => Array(bc).fill(0));
  for (let i = 0; i < ar; i++) {
    for (let j = 0; j < bc; j++) {
      let sum = 0;
      for (let k = 0; k < ac; k++) sum += A[i][k] * B[k][j];
      C[i][j] = sum;
    }
  }
  return C;
}

function fmt(m: number[][]): string {
  const widths = m[0].map((_, j) => Math.max(...m.map((r) => String(Number(r[j].toFixed(4))).length)));
  return m.map((r) => r.map((v, j) => String(Number(v.toFixed(4))).padStart(widths[j], " ")).join("  ")).join("\n");
}

export default function MatrixMultiply() {
  const [a, setA] = useState("1 2 3\n4 5 6");
  const [b, setB] = useState("7 8\n9 10\n11 12");

  const result = useMemo(() => {
    const A = parseMatrix(a);
    const B = parseMatrix(b);
    if (!A) return { ok: false as const, error: "Matrix A is invalid." };
    if (!B) return { ok: false as const, error: "Matrix B is invalid." };
    const C = multiply(A, B);
    if (!C) return { ok: false as const, error: `Cannot multiply: A is ${A.length}×${A[0].length}, B is ${B.length}×${B[0].length}. Inner dims must match.` };
    return { ok: true as const, A, B, C };
  }, [a, b]);

  return (
    <ToolShell title="Matrix Multiplication" description="Multiply two matrices (each row on a new line, space- or comma-separated)." category={categoryMap.math}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Matrix A</Label>
          <Textarea value={a} onChange={(e) => setA(e.target.value)} className="min-h-[180px] font-mono text-sm" />
        </Card>
        <Card className="p-3">
          <Label className="mb-2 block">Matrix B</Label>
          <Textarea value={b} onChange={(e) => setB(e.target.value)} className="min-h-[180px] font-mono text-sm" />
        </Card>
      </div>
      {result.ok ? (
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>A × B = {result.A.length}×{result.A[0].length} · {result.B.length}×{result.B[0].length} → {result.C.length}×{result.C[0].length}</Label>
            <CopyButton value={fmt(result.C)} />
          </div>
          <pre className="overflow-auto rounded-md bg-muted/30 p-3 font-mono text-sm">{fmt(result.C)}</pre>
        </Card>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
      )}
    </ToolShell>
  );
}
