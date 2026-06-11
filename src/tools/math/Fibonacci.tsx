import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function fibFast(n: number): { value: bigint; ms: number } {
  const start = performance.now();
  if (n < 0) return { value: 0n, ms: 0 };
  // Fast doubling.
  function fd(k: bigint): [bigint, bigint] {
    if (k === 0n) return [0n, 1n];
    const [a, b] = fd(k >> 1n);
    const c = a * (2n * b - a);
    const d = a * a + b * b;
    return (k & 1n) === 0n ? [c, d] : [d, c + d];
  }
  const [f] = fd(BigInt(n));
  return { value: f, ms: performance.now() - start };
}

export default function Fibonacci() {
  const [n, setN] = useUrlState("n", "50");

  const data = useMemo(() => {
    const v = Number(n);
    if (!Number.isInteger(v) || v < 0 || v > 50000) return null;
    return fibFast(v);
  }, [n]);

  const str = data?.value.toString() || "";

  return (
    <ToolShell title="Fibonacci" description="Nth Fibonacci number via fast-doubling. Handles up to F(50000) with BigInt." category={categoryMap.math} shareable>
      <Card className="space-y-3 p-4">
        <Label>n (0 – 50 000)</Label>
        <Input type="number" value={n} onChange={(e) => setN(e.target.value)} min={0} max={50000} className="font-mono" />
      </Card>
      {data ? (
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">F({n}) — {str.length} digits, {data.ms.toFixed(1)} ms</span>
            <CopyButton value={str} />
          </div>
          <pre className="max-h-96 overflow-auto break-all rounded-md bg-muted/30 p-3 text-sm font-mono">{str}</pre>
        </Card>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">Enter a non-negative integer up to 50 000.</Card>
      )}
    </ToolShell>
  );
}
