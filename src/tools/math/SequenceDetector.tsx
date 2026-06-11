import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function detect(nums: number[]) {
  if (nums.length < 3) return { type: "unknown" as const };
  const diffs = nums.slice(1).map((n, i) => n - nums[i]);
  const isArith = diffs.every((d) => Math.abs(d - diffs[0]) < 1e-9);
  if (isArith) {
    const d = diffs[0];
    const next = [...Array(3)].map((_, i) => nums[nums.length - 1] + d * (i + 1));
    const nth = `a_n = ${nums[0]} + ${d}(n - 1)`;
    return { type: "arithmetic" as const, d, next, nth };
  }
  const ratios = nums.slice(1).map((n, i) => (nums[i] === 0 ? NaN : n / nums[i]));
  const r = ratios[0];
  if (Number.isFinite(r) && ratios.every((x) => Math.abs(x - r) < 1e-6)) {
    const next = [...Array(3)].map((_, i) => nums[nums.length - 1] * Math.pow(r, i + 1));
    const nth = `a_n = ${nums[0]} × ${r}^(n - 1)`;
    return { type: "geometric" as const, r, next, nth };
  }
  // Fibonacci-like?
  const fib = nums.slice(2).every((n, i) => Math.abs(n - (nums[i] + nums[i + 1])) < 1e-9);
  if (fib) {
    const next = [
      nums[nums.length - 2] + nums[nums.length - 1],
      nums[nums.length - 1] + (nums[nums.length - 2] + nums[nums.length - 1]),
    ];
    return { type: "fibonacci-like" as const, next };
  }
  return { type: "unknown" as const };
}

export default function SequenceDetector() {
  const [input, setInput] = useState("2 5 8 11 14");

  const result = useMemo(() => {
    const nums = (input.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    return { nums, ...detect(nums) };
  }, [input]);

  return (
    <ToolShell title="Sequence Detector" description="Detect arithmetic, geometric, or Fibonacci-like patterns in a number sequence." category={categoryMap.math}>
      <Card className="p-3">
        <Label className="mb-1 block">Numbers (at least 3)</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" placeholder="2, 5, 8, 11, 14" />
      </Card>
      <Card className="p-6 text-center">
        {result.type === "unknown" && <div className="text-muted-foreground">No simple arithmetic / geometric / Fibonacci pattern detected.</div>}
        {result.type === "arithmetic" && (
          <>
            <div className="text-xs uppercase text-muted-foreground">Arithmetic sequence</div>
            <div className="mt-1 font-mono text-2xl">common difference d = {result.d}</div>
            <div className="mt-3 text-sm">Next: <span className="font-mono">{result.next.join(", ")}</span></div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">{result.nth}</div>
          </>
        )}
        {result.type === "geometric" && (
          <>
            <div className="text-xs uppercase text-muted-foreground">Geometric sequence</div>
            <div className="mt-1 font-mono text-2xl">common ratio r = {result.r}</div>
            <div className="mt-3 text-sm">Next: <span className="font-mono">{result.next.map((n) => Number(n.toFixed(4))).join(", ")}</span></div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">{result.nth}</div>
          </>
        )}
        {result.type === "fibonacci-like" && (
          <>
            <div className="text-xs uppercase text-muted-foreground">Fibonacci-like</div>
            <div className="mt-1 font-mono text-xl">a_n = a_(n-1) + a_(n-2)</div>
            <div className="mt-3 text-sm">Next: <span className="font-mono">{result.next.join(", ")}</span></div>
          </>
        )}
      </Card>
    </ToolShell>
  );
}
