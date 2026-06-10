import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function hex2rgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.padEnd(6, "0").slice(0, 6);
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lum([r, g, b]: [number, number, number]) {
  const a = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function ratio(fg: string, bg: string) {
  const l1 = lum(hex2rgb(fg));
  const l2 = lum(hex2rgb(bg));
  const [lo, hi] = l1 < l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function rate(r: number) {
  return {
    aaLarge: r >= 3,
    aa: r >= 4.5,
    aaa: r >= 7,
  };
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#111827");
  const [bg, setBg] = useState("#ffffff");

  const { r, grade } = useMemo(() => {
    const r = ratio(fg, bg);
    return { r, grade: rate(r) };
  }, [fg, bg]);

  return (
    <ToolShell title="WCAG Contrast Checker" description="Check color contrast against WCAG AA / AAA." category={categoryMap.design}
      shareable>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
        <Card className="space-y-3 p-3">
          <div>
            <Label className="mb-1 block">Foreground</Label>
            <div className="flex gap-2">
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-14 cursor-pointer rounded border" />
              <Input value={fg} onChange={(e) => setFg(e.target.value)} className="font-mono" />
            </div>
          </div>
          <div>
            <Label className="mb-1 block">Background</Label>
            <div className="flex gap-2">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-14 cursor-pointer rounded border" />
              <Input value={bg} onChange={(e) => setBg(e.target.value)} className="font-mono" />
            </div>
          </div>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-3 p-6" style={{ background: bg, color: fg }}>
          <p className="text-2xl font-semibold">The quick brown fox</p>
          <p className="text-base">jumps over the lazy dog.</p>
        </Card>
      </div>
      <Card className="space-y-3 p-4">
        <div className="text-center">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Contrast ratio</div>
          <div className="text-5xl font-semibold">{r.toFixed(2)} : 1</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          {[
            { label: "AA large (3:1)", ok: grade.aaLarge },
            { label: "AA normal (4.5:1)", ok: grade.aa },
            { label: "AAA (7:1)", ok: grade.aaa },
          ].map((g) => (
            <div key={g.label} className={`rounded-lg border p-3 ${g.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}>
              <div className="text-xs uppercase tracking-wide">{g.label}</div>
              <div className="mt-1 font-semibold">{g.ok ? "Pass" : "Fail"}</div>
            </div>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
