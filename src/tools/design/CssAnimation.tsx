import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categoryMap } from "@/data/categories";

const PRESETS = [
  { name: "Bounce", keyframes: `0%,20%,53%,80%,100% { transform: translateY(0); } 40%,43% { transform: translateY(-30px); } 70% { transform: translateY(-15px); }` },
  { name: "Pulse", keyframes: `0%,100% { transform: scale(1); } 50% { transform: scale(1.1); }` },
  { name: "Spin", keyframes: `from { transform: rotate(0deg); } to { transform: rotate(360deg); }` },
  { name: "Wiggle", keyframes: `0%,100% { transform: rotate(0); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); }` },
];

const EASINGS = ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.34, 1.56, 0.64, 1)"];

export default function CssAnimation() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [duration, setDuration] = useState(1.2);
  const [easing, setEasing] = useState("ease-in-out");
  const [iter, setIter] = useState("infinite");

  const css = useMemo(
    () => `@keyframes ${preset.name.toLowerCase()} { ${preset.keyframes} }

.animated {
  animation: ${preset.name.toLowerCase()} ${duration}s ${easing} ${iter};
}`,
    [preset, duration, easing, iter]
  );

  const previewStyle: React.CSSProperties = {
    animation: `${preset.name.toLowerCase()} ${duration}s ${easing} ${iter}`,
  };

  return (
    <ToolShell title="CSS Animation Playground" description="Tweak duration, easing and iteration on common keyframes." category={categoryMap.design}
      shareable>
      <style>{`@keyframes ${preset.name.toLowerCase()} { ${preset.keyframes} }`}</style>
      <Card className="grid min-h-[200px] place-items-center p-12">
        <div className="h-20 w-20 rounded-2xl bg-primary" style={previewStyle} />
      </Card>
      <Card className="space-y-3 p-3">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Button key={p.name} size="sm" variant={preset.name === p.name ? "default" : "outline"} onClick={() => setPreset(p)}>
              {p.name}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div>
            <Label className="text-xs">Duration (s)</Label>
            <Input type="number" step={0.1} min={0.1} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 1)} />
          </div>
          <div>
            <Label className="text-xs">Iteration</Label>
            <Input value={iter} onChange={(e) => setIter(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Easing</Label>
            <select value={easing} onChange={(e) => setEasing(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
              {EASINGS.map((e) => (<option key={e}>{e}</option>))}
            </select>
          </div>
        </div>
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
