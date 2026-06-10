import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Style = "ring" | "dots" | "bars" | "pulse";

export default function CssSpinner() {
  const [style, setStyle] = useState<Style>("ring");
  const [size, setSize] = useState(40);
  const [color, setColor] = useState("#4f46e5");
  const [speed, setSpeed] = useState(1);

  const css = useMemo(() => {
    if (style === "ring") {
      return `@keyframes caret-spin { to { transform: rotate(360deg); } }

.spinner {
  width: ${size}px;
  height: ${size}px;
  border: ${Math.max(2, size / 10)}px solid ${color}33;
  border-top-color: ${color};
  border-radius: 50%;
  animation: caret-spin ${speed}s linear infinite;
}`;
    }
    if (style === "pulse") {
      return `@keyframes caret-pulse { 0%, 100% { transform: scale(0.6); opacity: 0.6; } 50% { transform: scale(1); opacity: 1; } }

.spinner {
  width: ${size}px;
  height: ${size}px;
  background: ${color};
  border-radius: 50%;
  animation: caret-pulse ${speed}s ease-in-out infinite;
}`;
    }
    if (style === "dots") {
      return `@keyframes caret-dot { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

.spinner { display: inline-flex; gap: ${size / 6}px; }
.spinner > span {
  width: ${size / 3}px;
  height: ${size / 3}px;
  background: ${color};
  border-radius: 50%;
  animation: caret-dot ${speed}s ease-in-out infinite both;
}
.spinner > span:nth-child(1) { animation-delay: -0.32s; }
.spinner > span:nth-child(2) { animation-delay: -0.16s; }`;
    }
    return `@keyframes caret-bar { 0%, 40%, 100% { transform: scaleY(0.4); } 20% { transform: scaleY(1); } }

.spinner { display: inline-flex; align-items: end; gap: ${size / 10}px; height: ${size}px; }
.spinner > span {
  width: ${size / 6}px;
  height: 100%;
  background: ${color};
  animation: caret-bar ${speed}s ease-in-out infinite;
}
.spinner > span:nth-child(2) { animation-delay: -0.9s; }
.spinner > span:nth-child(3) { animation-delay: -0.8s; }
.spinner > span:nth-child(4) { animation-delay: -0.7s; }`;
  }, [style, size, color, speed]);

  const html = style === "dots" || style === "bars"
    ? `<div class="spinner">${style === "dots" ? "<span></span><span></span><span></span>" : "<span></span><span></span><span></span><span></span>"}</div>`
    : `<div class="spinner"></div>`;

  return (
    <ToolShell title="CSS Loading Spinner" description="Build pure-CSS loading spinners — ring, dots, bars, or pulse." category={categoryMap.design}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(["ring", "dots", "bars", "pulse"] as Style[]).map((s) => (
          <Button key={s} size="sm" variant={style === s ? "default" : "outline"} onClick={() => setStyle(s)}>{s}</Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs">Size</Label>
          <Input type="number" min={16} max={120} value={size} onChange={(e) => setSize(Number(e.target.value) || 40)} className="w-20" />
          <Label className="text-xs">Speed (s)</Label>
          <Input type="number" step={0.1} min={0.2} max={4} value={speed} onChange={(e) => setSpeed(Number(e.target.value) || 1)} className="w-20" />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-16 rounded border p-1" />
        </div>
      </Card>
      <Card className="grid min-h-[200px] place-items-center bg-muted/20 p-12">
        <style>{css}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="flex items-start gap-2 p-3">
          <pre className="flex-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{css}</pre>
          <CopyButton value={css} label="CSS copied" />
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{html}</code>
          <CopyButton value={html} label="HTML copied" />
        </Card>
      </div>
    </ToolShell>
  );
}
