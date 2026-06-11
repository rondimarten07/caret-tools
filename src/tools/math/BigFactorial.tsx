import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function factorial(n: number): { value: bigint; ms: number } {
  const start = performance.now();
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return { value: r, ms: performance.now() - start };
}

function digitsOfFactorial(n: number): number {
  // Stirling's approximation: log10(n!) ≈ n log10(n) − n log10(e) + 0.5 log10(2πn)
  if (n < 2) return 1;
  const lg = n * Math.log10(n) - n * Math.log10(Math.E) + 0.5 * Math.log10(2 * Math.PI * n);
  return Math.floor(lg) + 1;
}

export default function BigFactorial() {
  const [n, setN] = useUrlState("n", "100");

  const data = useMemo(() => {
    const v = Number(n);
    if (!Number.isInteger(v) || v < 0) return { ok: false as const, error: "Enter a non-negative integer." };
    if (v > 5000) return { ok: false as const, error: "Capped at 5000 to keep the browser responsive." };
    const r = factorial(v);
    return { ok: true as const, ...r, digits: r.value.toString().length, approxDigits: digitsOfFactorial(v) };
  }, [n]);

  return (
    <ToolShell title="Big Factorial" description="n! using BigInt — up to 5000! in the browser." category={categoryMap.math} shareable>
      <Card className="space-y-3 p-4">
        <Label>n (0 – 5000)</Label>
        <Input value={n} onChange={(e) => setN(e.target.value)} type="number" min={0} max={5000} className="font-mono" />
      </Card>
      {!data.ok ? (
        <Card className="p-4 text-sm text-destructive">{data.error}</Card>
      ) : (
        <>
          <Card className="grid gap-3 p-4 sm:grid-cols-3">
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Digits</div><div className="font-mono text-lg">{data.digits.toLocaleString()}</div></div>
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Stirling estimate</div><div className="font-mono text-lg">{data.approxDigits.toLocaleString()}</div></div>
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">Compute time</div><div className="font-mono text-lg">{data.ms.toFixed(1)} ms</div></div>
          </Card>
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between"><Label>{n}! (full digits)</Label><CopyButton value={data.value.toString()} /></div>
            <pre className="max-h-96 overflow-auto break-all rounded-md bg-muted/30 p-3 text-xs font-mono">{data.value.toString()}</pre>
          </Card>
        </>
      )}
    </ToolShell>
  );
}
