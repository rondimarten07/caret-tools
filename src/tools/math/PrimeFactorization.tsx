import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function factor(n: bigint): bigint[] {
  const out: bigint[] = [];
  if (n <= 1n) return out;
  for (let p = 2n; p * p <= n; p++) {
    while (n % p === 0n) {
      out.push(p);
      n /= p;
    }
  }
  if (n > 1n) out.push(n);
  return out;
}

export default function PrimeFactorization() {
  const [input, setInput] = useState("360");

  const result = useMemo(() => {
    try {
      const n = BigInt(input.replace(/[^\d-]/g, ""));
      if (n <= 1n) return { factors: [], grouped: [], pretty: "—" };
      const factors = factor(n);
      // Group: { 2: 3, 3: 2, 5: 1 } for 360
      const map = new Map<string, number>();
      for (const f of factors) {
        const k = f.toString();
        map.set(k, (map.get(k) ?? 0) + 1);
      }
      const grouped = Array.from(map.entries()).map(([p, e]) => ({ p, e }));
      const pretty = grouped.map((g) => g.e === 1 ? g.p : `${g.p}^${g.e}`).join(" × ");
      return { factors, grouped, pretty };
    } catch {
      return { factors: [], grouped: [], pretty: "—" };
    }
  }, [input]);

  return (
    <ToolShell title="Prime Factorization" description="Break a positive integer into its prime factors." category={categoryMap.math}>
      <Card className="p-3">
        <Label className="mb-1 block">Number (any size)</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
      </Card>
      <Card className="p-6 text-center">
        <div className="text-xs uppercase text-muted-foreground">Prime factorization</div>
        <div className="mt-2 flex items-center justify-center gap-2">
          <code className="font-mono text-3xl break-all">{result.pretty}</code>
          {result.pretty !== "—" && <CopyButton value={result.pretty} />}
        </div>
        {result.factors.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {result.factors.map((f, i) => (
              <span key={i} className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">{f.toString()}</span>
            ))}
          </div>
        )}
      </Card>
    </ToolShell>
  );
}
