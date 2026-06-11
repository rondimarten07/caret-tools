import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function CssClamp() {
  const [minSize, setMinSize] = useUrlState("a", "16");
  const [maxSize, setMaxSize] = useUrlState("b", "24");
  const [minVw, setMinVw] = useUrlState("c", "320");
  const [maxVw, setMaxVw] = useUrlState("d", "1280");

  const data = useMemo(() => {
    const a = Number(minSize), b = Number(maxSize);
    const va = Number(minVw), vb = Number(maxVw);
    if (![a, b, va, vb].every(Number.isFinite) || vb === va) return null;
    const slope = (b - a) / (vb - va);
    const intercept = a - slope * va;
    const slopeVw = slope * 100;
    const interceptRem = intercept / 16;
    const preferred = `${interceptRem.toFixed(4)}rem + ${slopeVw.toFixed(4)}vw`;
    const value = `clamp(${(a / 16).toFixed(3)}rem, ${preferred}, ${(b / 16).toFixed(3)}rem)`;
    return { value, slope, intercept };
  }, [minSize, maxSize, minVw, maxVw]);

  return (
    <ToolShell title="CSS clamp() Calculator" description="Fluid sizes: smooth interpolation between two breakpoints." category={categoryMap.design} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Min size (px)</Label><Input value={minSize} onChange={(e) => setMinSize(e.target.value)} className="font-mono" /></div>
        <div><Label>Max size (px)</Label><Input value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className="font-mono" /></div>
        <div><Label>Min viewport (px)</Label><Input value={minVw} onChange={(e) => setMinVw(e.target.value)} className="font-mono" /></div>
        <div><Label>Max viewport (px)</Label><Input value={maxVw} onChange={(e) => setMaxVw(e.target.value)} className="font-mono" /></div>
      </Card>
      {data && (
        <>
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between"><Label>clamp()</Label><CopyButton value={data.value} /></div>
            <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-sm">{data.value}</code>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Live preview (resize the window)</div>
            <div style={{ fontSize: data.value }} className="mt-2 font-semibold">
              Sample text scales fluidly.
            </div>
          </Card>
        </>
      )}
    </ToolShell>
  );
}
