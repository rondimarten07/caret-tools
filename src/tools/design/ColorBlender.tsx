import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.padEnd(6, "0").slice(0, 6);
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

function blend(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export default function ColorBlender() {
  const [a, setA] = useState("#4f46e5");
  const [b, setB] = useState("#f43f5e");
  const [steps, setSteps] = useState(7);

  const colors = useMemo(() => {
    return Array.from({ length: steps }, (_, i) => blend(a, b, i / (steps - 1)));
  }, [a, b, steps]);

  return (
    <ToolShell title="Color Blender" description="Mix two colors and produce a stepped gradient." category={categoryMap.design}
      shareable>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3">
        <div>
          <Label className="text-xs">From</Label>
          <div className="flex gap-2 mt-1">
            <input type="color" value={a} onChange={(e) => setA(e.target.value)} className="h-9 w-12 rounded border" />
            <Input value={a} onChange={(e) => setA(e.target.value)} className="font-mono" />
          </div>
        </div>
        <div>
          <Label className="text-xs">To</Label>
          <div className="flex gap-2 mt-1">
            <input type="color" value={b} onChange={(e) => setB(e.target.value)} className="h-9 w-12 rounded border" />
            <Input value={b} onChange={(e) => setB(e.target.value)} className="font-mono" />
          </div>
        </div>
        <div>
          <Label className="text-xs">Steps (2–15)</Label>
          <Input type="number" min={2} max={15} value={steps} onChange={(e) => setSteps(Math.max(2, Math.min(15, Number(e.target.value) || 7)))} />
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="h-16" style={{ background: `linear-gradient(to right, ${a}, ${b})` }} />
      </Card>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
        {colors.map((c, i) => (
          <Card key={i} className="overflow-hidden p-0">
            <div className="h-16" style={{ background: c }} />
            <div className="flex items-center justify-between gap-1 p-2 text-xs">
              <code className="font-mono">{c.toUpperCase()}</code>
              <CopyButton value={c.toUpperCase()} />
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-3">
        <Label className="text-xs mb-1 block">Tailwind palette</Label>
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all rounded bg-muted/30 p-2 font-mono text-xs">
            { JSON.stringify(Object.fromEntries(colors.map((c, i) => [(i + 1) * 100, c]))) }
          </code>
          <CopyButton value={JSON.stringify(Object.fromEntries(colors.map((c, i) => [(i + 1) * 100, c])), null, 2)} />
        </div>
      </Card>
    </ToolShell>
  );
}
