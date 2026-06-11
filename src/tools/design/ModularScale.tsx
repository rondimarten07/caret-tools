import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const PRESETS = [
  { name: "Minor 2nd", v: 1.067 },
  { name: "Major 2nd", v: 1.125 },
  { name: "Minor 3rd", v: 1.2 },
  { name: "Major 3rd", v: 1.25 },
  { name: "Perfect 4th", v: 1.333 },
  { name: "Augmented 4th", v: 1.414 },
  { name: "Perfect 5th", v: 1.5 },
  { name: "Golden", v: 1.618 },
];

export default function ModularScale() {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [stepsUp, setStepsUp] = useState(6);
  const [stepsDown, setStepsDown] = useState(2);

  const scale = useMemo(() => {
    const list: { step: number; px: number; rem: number }[] = [];
    for (let i = stepsUp; i >= -stepsDown; i--) {
      const px = base * Math.pow(ratio, i);
      list.push({ step: i, px, rem: px / 16 });
    }
    return list;
  }, [base, ratio, stepsUp, stepsDown]);

  const cssVars = scale.map((s) => `  --fs-${s.step >= 0 ? s.step : `n${-s.step}`}: ${s.rem.toFixed(4)}rem;`).join("\n");
  const css = `:root {\n${cssVars}\n}`;

  return (
    <ToolShell title="Modular Scale" description="Generate a typographic modular scale (base × ratio^step)." category={categoryMap.design}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs">Presets</Label>
        {PRESETS.map((p) => (
          <Button key={p.name} size="sm" variant={Math.abs(ratio - p.v) < 0.005 ? "default" : "outline"} onClick={() => setRatio(p.v)}>{p.name} ({p.v})</Button>
        ))}
      </Card>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        <div><Label className="text-xs">Base (px)</Label><Input type="number" value={base} onChange={(e) => setBase(Number(e.target.value) || 16)} /></div>
        <div><Label className="text-xs">Ratio</Label><Input type="number" step={0.001} value={ratio} onChange={(e) => setRatio(Number(e.target.value) || 1.25)} /></div>
        <div><Label className="text-xs">Steps up</Label><Input type="number" min={0} max={10} value={stepsUp} onChange={(e) => setStepsUp(Number(e.target.value) || 0)} /></div>
        <div><Label className="text-xs">Steps down</Label><Input type="number" min={0} max={10} value={stepsDown} onChange={(e) => setStepsDown(Number(e.target.value) || 0)} /></div>
      </Card>
      <Card className="p-3">
        {scale.map((s) => (
          <div key={s.step} className="flex items-center gap-3 border-b py-2 last:border-0">
            <code className="w-12 font-mono text-xs text-muted-foreground">{s.step >= 0 ? `+${s.step}` : s.step}</code>
            <code className="w-20 font-mono text-xs text-muted-foreground">{s.px.toFixed(2)}px</code>
            <code className="w-20 font-mono text-xs text-muted-foreground">{s.rem.toFixed(4)}rem</code>
            <span className="truncate" style={{ fontSize: `${s.px}px` }}>The quick brown fox</span>
          </div>
        ))}
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
