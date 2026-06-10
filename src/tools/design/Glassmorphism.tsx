import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function Glassmorphism() {
  const [blur, setBlur] = useState(14);
  const [opacity, setOpacity] = useState(0.55);
  const [tint, setTint] = useState("#ffffff");
  const [radius, setRadius] = useState(20);

  const css = useMemo(
    () =>
      `background: ${tint}${Math.round(opacity * 255).toString(16).padStart(2, "0")};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255,255,255,0.25);
border-radius: ${radius}px;`,
    [blur, opacity, tint, radius]
  );

  const previewStyle: React.CSSProperties = {
    background: `${tint}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: `${radius}px`,
  };

  return (
    <ToolShell title="Glassmorphism" description="Build a glass-morphism card and copy the CSS." category={categoryMap.design}
      shareable>
      <Card className="grid min-h-[280px] place-items-center overflow-hidden p-0" style={{ background: "linear-gradient(135deg,#fbbf24,#ec4899,#6366f1)" }}>
        <div className="grid h-44 w-72 place-items-center p-6 text-white" style={previewStyle}>
          <span className="font-medium">Glass</span>
        </div>
      </Card>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        <div>
          <Label className="text-xs">Blur (px)</Label>
          <Input type="number" min={0} value={blur} onChange={(e) => setBlur(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Opacity</Label>
          <Input type="number" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Tint</Label>
          <Input value={tint} onChange={(e) => setTint(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label className="text-xs">Radius (px)</Label>
          <Input type="number" min={0} value={radius} onChange={(e) => setRadius(Number(e.target.value) || 0)} />
        </div>
      </Card>
      <Card className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
