import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Scheme = "analogous" | "complementary" | "triadic" | "tetradic" | "monochromatic";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x: number) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}

function build(base: number, scheme: Scheme): { h: number; s: number; l: number }[] {
  const sats = [70, 75, 70, 75, 70];
  const lights = [85, 65, 50, 35, 20];
  let hues: number[];
  switch (scheme) {
    case "analogous": hues = [-30, -15, 0, 15, 30].map((d) => (base + d + 360) % 360); break;
    case "complementary": hues = [0, 30, 180, 210, 195].map((d) => (base + d) % 360); break;
    case "triadic": hues = [0, 120, 240, 30, 150].map((d) => (base + d) % 360); break;
    case "tetradic": hues = [0, 90, 180, 270, 30].map((d) => (base + d) % 360); break;
    default: hues = [base, base, base, base, base]; break;
  }
  return hues.map((h, i) => ({ h, s: sats[i], l: lights[i] }));
}

export default function HslPalette() {
  const [base, setBase] = useState(() => Math.floor(Math.random() * 360));
  const [scheme, setScheme] = useState<Scheme>("analogous");

  const palette = useMemo(() => build(base, scheme), [base, scheme]);
  const hexList = palette.map((p) => hslToHex(p.h, p.s, p.l));

  return (
    <ToolShell
      title="Random HSL Palette"
      description="Harmonic 5-color palettes from a hue + scheme."
      category={categoryMap.generator}
      actions={<Button variant="outline" size="sm" onClick={() => setBase(Math.floor(Math.random() * 360))}>Reroll</Button>}
    >
      <Card className="flex flex-wrap gap-2 p-3">
        {(["analogous", "complementary", "triadic", "tetradic", "monochromatic"] as Scheme[]).map((s) => (
          <button key={s} onClick={() => setScheme(s)} className={`rounded-md border px-3 py-1.5 text-sm ${scheme === s ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s}</button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <Label className="text-sm">Base hue: {base}°</Label>
          <input type="range" min={0} max={359} value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-40" />
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="flex h-32">
          {palette.map((p, i) => (
            <div key={i} className="flex-1" style={{ background: `hsl(${p.h.toFixed(1)}, ${p.s}%, ${p.l}%)` }} />
          ))}
        </div>
        <div className="grid grid-cols-5">
          {palette.map((p, i) => (
            <div key={i} className="border-t p-2 text-xs">
              <div className="font-mono">{hexList[i]}</div>
              <div className="font-mono text-muted-foreground">hsl({p.h.toFixed(0)}, {p.s}%, {p.l}%)</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="flex items-center justify-between p-3">
        <code className="break-all font-mono text-xs">{hexList.join(", ")}</code>
        <CopyButton value={hexList.join(", ")} />
      </Card>
    </ToolShell>
  );
}
