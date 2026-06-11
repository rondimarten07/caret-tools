import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const STEPS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];

function clampValue(minPx: number, maxPx: number, vwMin: number, vwMax: number): string {
  if (vwMax === vwMin) return `${(minPx / 16).toFixed(3)}rem`;
  const slope = (maxPx - minPx) / (vwMax - vwMin);
  const intercept = minPx - slope * vwMin;
  const preferred = `${(intercept / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`;
  return `clamp(${(minPx / 16).toFixed(3)}rem, ${preferred}, ${(maxPx / 16).toFixed(3)}rem)`;
}

export default function FluidType() {
  const [minBase, setMinBase] = useUrlState("a", "16");
  const [maxBase, setMaxBase] = useUrlState("b", "20");
  const [minRatio, setMinRatio] = useUrlState("c", "1.2");
  const [maxRatio, setMaxRatio] = useUrlState("d", "1.333");
  const [vwMin, setVwMin] = useUrlState("e", "320");
  const [vwMax, setVwMax] = useUrlState("f", "1280");

  const rows = useMemo(() => {
    const mb = Number(minBase), Mb = Number(maxBase);
    const mr = Number(minRatio), Mr = Number(maxRatio);
    const va = Number(vwMin), vb = Number(vwMax);
    if (!Number.isFinite(mb) || !Number.isFinite(Mb)) return [];
    return STEPS.map((step, i) => {
      const exp = i - 2; // base index = 2
      const minPx = mb * Math.pow(mr, exp);
      const maxPx = Mb * Math.pow(Mr, exp);
      return { step, minPx, maxPx, clamp: clampValue(minPx, maxPx, va, vb) };
    });
  }, [minBase, maxBase, minRatio, maxRatio, vwMin, vwMax]);

  const css = useMemo(() => rows.map((r) => `--font-${r.step}: ${r.clamp};`).join("\n"), [rows]);

  return (
    <ToolShell title="Fluid Typography Scale" description="Generate clamp-based type scale that grows with viewport width." category={categoryMap.design} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <div><Label>Min base (px)</Label><Input value={minBase} onChange={(e) => setMinBase(e.target.value)} className="font-mono" /></div>
        <div><Label>Max base (px)</Label><Input value={maxBase} onChange={(e) => setMaxBase(e.target.value)} className="font-mono" /></div>
        <div />
        <div><Label>Min ratio</Label><Input value={minRatio} onChange={(e) => setMinRatio(e.target.value)} className="font-mono" /></div>
        <div><Label>Max ratio</Label><Input value={maxRatio} onChange={(e) => setMaxRatio(e.target.value)} className="font-mono" /></div>
        <div />
        <div><Label>Min viewport (px)</Label><Input value={vwMin} onChange={(e) => setVwMin(e.target.value)} className="font-mono" /></div>
        <div><Label>Max viewport (px)</Label><Input value={vwMax} onChange={(e) => setVwMax(e.target.value)} className="font-mono" /></div>
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Step</th>
              <th className="p-3">Min / Max</th>
              <th className="p-3">clamp()</th>
              <th className="p-3">Preview</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.step} className="border-b last:border-0">
                <td className="p-3 font-mono">{r.step}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{r.minPx.toFixed(1)} / {r.maxPx.toFixed(1)}px</td>
                <td className="p-3 font-mono text-xs">{r.clamp}</td>
                <td className="p-3" style={{ fontSize: r.clamp }}>Aa</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>CSS variables</Label><CopyButton value={css} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{css}</pre>
      </Card>
    </ToolShell>
  );
}
