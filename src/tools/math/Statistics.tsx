import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function Statistics() {
  const [input, setInput] = useUrlState("text", "12 18 24 31 7 15 22 28 35 14");

  const stats = useMemo(() => {
    const nums = (input.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
    if (nums.length === 0) return null;
    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    const counts = new Map<number, number>();
    for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);
    const maxCount = Math.max(...counts.values());
    const mode = Array.from(counts.entries()).filter(([, c]) => c === maxCount && maxCount > 1).map(([v]) => v);
    const variance = nums.reduce((a, n) => a + (n - mean) ** 2, 0) / nums.length;
    const stddev = Math.sqrt(variance);
    return {
      n: nums.length,
      sum,
      mean,
      median,
      mode,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      range: sorted[sorted.length - 1] - sorted[0],
      variance,
      stddev,
    };
  }, [input]);

  return (
    <ToolShell title="Statistics Calculator" description="Mean, median, mode, range, variance, standard deviation." category={categoryMap.math} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Numbers (any separator)</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[120px] font-mono" placeholder="12, 18, 24, 31, 7…" />
      </Card>
      {stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">N</div><div className="font-mono text-xl">{stats.n}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Sum</div><div className="font-mono text-xl">{stats.sum.toLocaleString("en", { maximumFractionDigits: 4 })}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Mean</div><div className="font-mono text-xl">{stats.mean.toLocaleString("en", { maximumFractionDigits: 4 })}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Median</div><div className="font-mono text-xl">{stats.median.toLocaleString("en", { maximumFractionDigits: 4 })}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Mode</div><div className="font-mono text-xl">{stats.mode.length ? stats.mode.join(", ") : "—"}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Min</div><div className="font-mono text-xl">{stats.min}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Max</div><div className="font-mono text-xl">{stats.max}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Range</div><div className="font-mono text-xl">{stats.range}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Variance</div><div className="font-mono text-xl">{stats.variance.toLocaleString("en", { maximumFractionDigits: 4 })}</div></Card>
          <Card className="p-3 text-center"><div className="text-xs text-muted-foreground">Std dev</div><div className="font-mono text-xl">{stats.stddev.toLocaleString("en", { maximumFractionDigits: 4 })}</div></Card>
        </div>
      )}
    </ToolShell>
  );
}
