import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function sumIntegers(n: bigint): bigint {
  return (n * (n + 1n)) / 2n;
}

function sumSquares(n: bigint): bigint {
  return (n * (n + 1n) * (2n * n + 1n)) / 6n;
}

function sumCubes(n: bigint): bigint {
  const s = sumIntegers(n);
  return s * s;
}

function sumGeometric(a: number, r: number, n: number): number {
  if (r === 1) return a * n;
  return (a * (1 - Math.pow(r, n))) / (1 - r);
}

export default function SequenceSum() {
  const [type, setType] = useState<"integers" | "squares" | "cubes" | "geometric">("integers");
  const [n, setN] = useUrlState("n", "100");
  const [a, setA] = useUrlState("a", "1");
  const [r, setR] = useUrlState("r", "2");

  const result = useMemo(() => {
    if (type === "geometric") {
      const N = Number(n);
      const A = Number(a);
      const R = Number(r);
      if (!Number.isFinite(N) || !Number.isFinite(A) || !Number.isFinite(R) || N < 0) return null;
      return sumGeometric(A, R, N).toString();
    }
    try {
      const N = BigInt(n.trim());
      if (N < 0n || N > 10n ** 9n) return null;
      if (type === "integers") return sumIntegers(N).toString();
      if (type === "squares") return sumSquares(N).toString();
      return sumCubes(N).toString();
    } catch { return null; }
  }, [type, n, a, r]);

  return (
    <ToolShell title="Sequence Sum" description="Closed-form sums: 1+2+…+n, squares, cubes, geometric series." category={categoryMap.math} shareable>
      <Card className="flex flex-wrap gap-2 p-3">
        {(["integers", "squares", "cubes", "geometric"] as const).map((t) => (
          <button key={t} onClick={() => setType(t)} className={`rounded-md border px-3 py-1.5 text-sm ${type === t ? "bg-primary text-primary-foreground" : "bg-card"}`}>{t}</button>
        ))}
      </Card>
      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <div>
          <Label>n (terms)</Label>
          <Input value={n} onChange={(e) => setN(e.target.value)} className="font-mono" />
        </div>
        {type === "geometric" && (
          <>
            <div>
              <Label>a (first term)</Label>
              <Input value={a} onChange={(e) => setA(e.target.value)} className="font-mono" />
            </div>
            <div>
              <Label>r (ratio)</Label>
              <Input value={r} onChange={(e) => setR(e.target.value)} className="font-mono" />
            </div>
          </>
        )}
      </Card>
      <Card className="p-4">
        {result === null ? (
          <p className="text-sm text-muted-foreground">Invalid input.</p>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
            <span className="break-all font-mono text-lg">{result}</span>
            <CopyButton value={result} />
          </div>
        )}
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Formulas: integers = n(n+1)/2 · squares = n(n+1)(2n+1)/6 · cubes = (n(n+1)/2)² · geometric = a(1-rⁿ)/(1-r).
      </div>
    </ToolShell>
  );
}
