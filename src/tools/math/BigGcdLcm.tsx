import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return (a / gcd(a, b)) * b;
}

export default function BigGcdLcm() {
  const [input, setInput] = useUrlState("n", "144\n240\n360");

  const data = useMemo(() => {
    try {
      const nums = input.split(/[\s,\n]+/).map((s) => s.trim()).filter(Boolean).map((s) => BigInt(s));
      if (nums.length < 2) return { error: "Enter at least two integers." };
      let g = nums[0], l = nums[0];
      for (let i = 1; i < nums.length; i++) {
        g = gcd(g, nums[i]);
        l = lcm(l, nums[i]);
      }
      return { gcd: g.toString(), lcm: l.toString(), count: nums.length };
    } catch {
      return { error: "Could not parse — use integers only." };
    }
  }, [input]);

  return (
    <ToolShell title="Big GCD / LCM" description="GCD and LCM for huge integers using BigInt." category={categoryMap.math} shareable>
      <Card className="space-y-3 p-4">
        <Label>Integers (whitespace or commas)</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="font-mono" spellCheck={false} />
      </Card>
      {"error" in data && data.error ? (
        <Card className="p-4 text-sm text-destructive">{data.error}</Card>
      ) : (
        <Card className="grid gap-3 p-4 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
            <div>
              <div className="text-xs text-muted-foreground">GCD ({data.count} numbers)</div>
              <div className="break-all font-mono text-lg">{data.gcd}</div>
            </div>
            <CopyButton value={data.gcd!} />
          </div>
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
            <div>
              <div className="text-xs text-muted-foreground">LCM</div>
              <div className="break-all font-mono text-lg">{data.lcm}</div>
            </div>
            <CopyButton value={data.lcm!} />
          </div>
        </Card>
      )}
    </ToolShell>
  );
}
