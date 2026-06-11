import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function extGcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const { g, x: x1, y: y1 } = extGcd(b, a % b);
  return { g, x: y1, y: x1 - (a / b) * y1 };
}

function modInverse(a: bigint, m: bigint): bigint | null {
  if (m <= 0n) return null;
  const aNorm = ((a % m) + m) % m;
  const { g, x } = extGcd(aNorm, m);
  if (g !== 1n) return null;
  return ((x % m) + m) % m;
}

export default function ModularInverse() {
  const [a, setA] = useUrlState("a", "3");
  const [m, setM] = useUrlState("m", "11");

  const data = useMemo(() => {
    try {
      const A = BigInt(a.trim());
      const M = BigInt(m.trim());
      if (M <= 0n) return { ok: false as const, error: "Modulus must be positive." };
      const aNorm = ((A % M) + M) % M;
      const eg = extGcd(aNorm, M);
      const inv = modInverse(A, M);
      return { ok: true as const, eg, inv, aNorm };
    } catch {
      return { ok: false as const, error: "Enter valid integers." };
    }
  }, [a, m]);

  return (
    <ToolShell title="Modular Inverse" description="Compute a⁻¹ mod m via the extended Euclidean algorithm." category={categoryMap.math} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>a</Label>
          <Input value={a} onChange={(e) => setA(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label>m (modulus)</Label>
          <Input value={m} onChange={(e) => setM(e.target.value)} className="font-mono" />
        </div>
      </Card>
      <Card className="p-4">
        {!data.ok ? (
          <p className="text-sm text-destructive">{data.error}</p>
        ) : (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">a mod m</dt><dd className="font-mono">{String(data.aNorm)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">gcd(a, m)</dt><dd className="font-mono">{String(data.eg.g)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Bézout x</dt><dd className="font-mono break-all">{String(data.eg.x)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Bézout y</dt><dd className="font-mono break-all">{String(data.eg.y)}</dd></div>
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
              <span><strong className="font-mono">a⁻¹ mod m =</strong> <span className="font-mono">{data.inv === null ? "—" : String(data.inv)}</span></span>
              {data.inv !== null && <CopyButton value={String(data.inv)} />}
            </div>
            {data.inv === null && (
              <p className="text-sm text-muted-foreground">No inverse — a and m are not coprime (gcd ≠ 1).</p>
            )}
          </dl>
        )}
      </Card>
    </ToolShell>
  );
}
