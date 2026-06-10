import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function hex2hsl(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.padEnd(6, "0").slice(0, 6);
  const n = parseInt(v, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function hsl2hex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

type Mode = "analog" | "complementary" | "triadic" | "tetradic" | "shades";

function palette(base: string, mode: Mode): string[] {
  const [h, s, l] = hex2hsl(base);
  switch (mode) {
    case "analog":
      return [-30, -15, 0, 15, 30].map((d) => hsl2hex((h + d + 360) % 360, s, l));
    case "complementary":
      return [0, 180].map((d) => hsl2hex((h + d) % 360, s, l));
    case "triadic":
      return [0, 120, 240].map((d) => hsl2hex((h + d) % 360, s, l));
    case "tetradic":
      return [0, 90, 180, 270].map((d) => hsl2hex((h + d) % 360, s, l));
    case "shades":
      return [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((nl) => hsl2hex(h, s, nl));
  }
}

const MODES: Mode[] = ["analog", "complementary", "triadic", "tetradic", "shades"];

export default function ColorPalette() {
  const [base, setBase] = useUrlState("hex", "#6366f1");
  const [mode, setMode] = useState<Mode>("analog");
  const colors = useMemo(() => palette(base, mode), [base, mode]);

  return (
    <ToolShell title="Color Palette" description="Generate harmonious palettes from a base color." category={categoryMap.design}
      shareable>
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-9 w-12 cursor-pointer rounded border" />
        <Input value={base} onChange={(e) => setBase(e.target.value)} className="w-32 font-mono" />
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>{m}</Button>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {colors.map((c, i) => (
          <Card key={i} className="overflow-hidden p-0">
            <div className="h-24" style={{ background: c }} />
            <div className="flex items-center justify-between gap-2 p-2">
              <code className="font-mono text-xs">{c.toUpperCase()}</code>
              <CopyButton value={c.toUpperCase()} />
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-3">
        <Label className="mb-2 block text-xs">CSS</Label>
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{colors.join(", ")}</code>
          <CopyButton value={colors.join(", ")} />
        </div>
      </Card>
    </ToolShell>
  );
}
