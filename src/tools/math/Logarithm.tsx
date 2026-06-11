import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function Logarithm() {
  const [x, setX] = useUrlState("x", "1000");
  const [b, setB] = useUrlState("b", "10");

  const data = useMemo(() => {
    const X = Number(x);
    const B = Number(b);
    if (!Number.isFinite(X) || X <= 0) return null;
    if (!Number.isFinite(B) || B <= 0 || B === 1) return null;
    return {
      base: Math.log(X) / Math.log(B),
      ln: Math.log(X),
      log10: Math.log10(X),
      log2: Math.log2(X),
    };
  }, [x, b]);

  const fmt = (n: number) => Number(n.toFixed(10)).toString();

  return (
    <ToolShell title="Logarithm Calculator" description="log_b(x), ln(x), log₁₀(x), log₂(x)." category={categoryMap.math} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>x (positive)</Label>
          <Input value={x} onChange={(e) => setX(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label>Base b (positive, ≠ 1)</Label>
          <Input value={b} onChange={(e) => setB(e.target.value)} className="font-mono" />
        </div>
      </Card>
      {data ? (
        <Card className="p-4">
          <dl className="space-y-2 text-sm">
            <Row label={`log_${b}(${x})`} value={fmt(data.base)} />
            <Row label={`ln(${x})`} value={fmt(data.ln)} />
            <Row label={`log₁₀(${x})`} value={fmt(data.log10)} />
            <Row label={`log₂(${x})`} value={fmt(data.log2)} />
          </dl>
        </Card>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">x must be positive; base must be positive and not 1.</Card>
      )}
    </ToolShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
      <span className="font-mono text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono">{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
