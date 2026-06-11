import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function factorial(n: number): bigint {
  if (n < 0 || !Number.isInteger(n)) return 0n;
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}

function permutation(n: number, r: number): bigint {
  if (r > n || n < 0 || r < 0) return 0n;
  let p = 1n;
  for (let i = n; i > n - r; i--) p *= BigInt(i);
  return p;
}

function combination(n: number, r: number): bigint {
  if (r > n || n < 0 || r < 0) return 0n;
  r = Math.min(r, n - r);
  let num = 1n;
  let den = 1n;
  for (let i = 0; i < r; i++) {
    num *= BigInt(n - i);
    den *= BigInt(i + 1);
  }
  return num / den;
}

export default function Probability() {
  const [n, setN] = useUrlState("n", "10");
  const [r, setR] = useUrlState("r", "3");

  const result = useMemo(() => {
    const N = Number(n);
    const R = Number(r);
    if (!Number.isInteger(N) || !Number.isInteger(R) || N < 0 || R < 0 || R > N) return null;
    return {
      nFact: factorial(N).toString(),
      rFact: factorial(R).toString(),
      perm: permutation(N, R).toString(),
      comb: combination(N, R).toString(),
    };
  }, [n, r]);

  return (
    <ToolShell title="Probability Calculator" description="Factorials, permutations (nPr), and combinations (nCr)." category={categoryMap.math} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>n</Label>
          <Input type="number" value={n} onChange={(e) => setN(e.target.value)} min={0} />
        </div>
        <div>
          <Label>r</Label>
          <Input type="number" value={r} onChange={(e) => setR(e.target.value)} min={0} />
        </div>
      </Card>
      {result ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">n! (factorial)</div>
            <div className="mt-1 break-all font-mono text-sm">{result.nFact}</div>
            <CopyButton value={result.nFact} />
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">r!</div>
            <div className="mt-1 break-all font-mono text-sm">{result.rFact}</div>
            <CopyButton value={result.rFact} />
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">nPr — permutations (order matters)</div>
            <div className="mt-1 break-all font-mono text-sm">{result.perm}</div>
            <CopyButton value={result.perm} />
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">nCr — combinations</div>
            <div className="mt-1 break-all font-mono text-sm">{result.comb}</div>
            <CopyButton value={result.comb} />
          </Card>
        </div>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">Enter non-negative integers with r ≤ n.</Card>
      )}
    </ToolShell>
  );
}
