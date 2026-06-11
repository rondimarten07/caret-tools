import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return (a * b) / gcd(a, b);
}

export default function GcdLcm() {
  const [input, setInput] = useState("12 18 24");

  const result = useMemo(() => {
    const nums = (input.match(/-?\d+/g) ?? []).map((s) => BigInt(s));
    if (nums.length < 2) return null;
    const g = nums.reduce(gcd);
    const l = nums.reduce(lcm);
    return { g, l, n: nums.length };
  }, [input]);

  return (
    <ToolShell title="GCD / LCM" description="Greatest common divisor and least common multiple of any number of integers." category={categoryMap.math}>
      <Card className="p-3">
        <Label className="mb-1 block">Numbers (any separator)</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" placeholder="12, 18, 24" />
      </Card>
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground">GCD of {result.n}</div>
            <div className="mt-1 flex items-center justify-center gap-2"><span className="font-mono text-3xl">{result.g.toString()}</span><CopyButton value={result.g.toString()} /></div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground">LCM of {result.n}</div>
            <div className="mt-1 flex items-center justify-center gap-2"><span className="font-mono text-3xl">{result.l.toString()}</span><CopyButton value={result.l.toString()} /></div>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
