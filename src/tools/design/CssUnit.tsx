import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/tool/CopyButton";
import { categoryMap } from "@/data/categories";

export default function CssUnit() {
  const [px, setPx] = useState(16);
  const [base, setBase] = useState(16);
  const [vpW, setVpW] = useState(1440);
  const [vpH, setVpH] = useState(900);

  const v = useMemo(() => {
    return {
      px: px,
      rem: px / base,
      em: px / base,
      pt: px * 0.75,
      pc: px * 0.0625,
      vw: (px / vpW) * 100,
      vh: (px / vpH) * 100,
      percent: (px / base) * 100,
    };
  }, [px, base, vpW, vpH]);

  const fmt = (n: number) => Number(n.toFixed(4)).toString();

  return (
    <ToolShell title="CSS Unit Converter" description="Convert px to rem, em, pt, pc, vw, vh and %." category={categoryMap.design}
      shareable>
      <Card className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-3">
        <div>
          <Label className="text-xs">Pixels</Label>
          <Input type="number" value={px} onChange={(e) => setPx(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Base font-size (px)</Label>
          <Input type="number" value={base} onChange={(e) => setBase(Number(e.target.value) || 16)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Viewport W</Label>
            <Input type="number" value={vpW} onChange={(e) => setVpW(Number(e.target.value) || 1440)} />
          </div>
          <div>
            <Label className="text-xs">Viewport H</Label>
            <Input type="number" value={vpH} onChange={(e) => setVpH(Number(e.target.value) || 900)} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {[
          ["rem", `${fmt(v.rem)}rem`, "Relative to root font-size"],
          ["em", `${fmt(v.em)}em`, "Relative to parent font-size"],
          ["pt", `${fmt(v.pt)}pt`, "Print typographic point"],
          ["pc", `${fmt(v.pc)}pc`, "Pica (12 pt)"],
          ["vw", `${fmt(v.vw)}vw`, `Relative to viewport ${vpW}px wide`],
          ["vh", `${fmt(v.vh)}vh`, `Relative to viewport ${vpH}px tall`],
          ["%", `${fmt(v.percent)}%`, "As percentage of base"],
        ].map(([label, value, hint]) => (
          <Card key={label} className="flex items-center gap-3 p-3">
            <span className="w-12 text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
            <div className="flex-1">
              <code className="font-mono text-sm">{value}</code>
              <div className="text-[10px] text-muted-foreground">{hint}</div>
            </div>
            <CopyButton value={String(value)} />
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
