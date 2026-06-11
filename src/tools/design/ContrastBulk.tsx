import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `#ffffff, #4f46e5
#000000, #ffffff
#1f2937, #fde68a
#fef3c7, #92400e
#ef4444, #ffffff`;

function hex2rgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(m)) return null;
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
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

function ratio(a: [number, number, number], b: [number, number, number]) {
  const la = lum(a), lb = lum(b);
  const [lo, hi] = la < lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export default function ContrastBulk() {
  const [input, setInput] = useUrlState("text", SAMPLE);

  const rows = useMemo(() => {
    return input.split(/\r?\n/).filter((l) => l.trim()).map((line) => {
      const [a, b] = line.split(/[,;]\s*/).slice(0, 2);
      const fg = hex2rgb(a ?? "");
      const bg = hex2rgb(b ?? "");
      if (!fg || !bg) return { fg: a, bg: b, ok: false as const };
      const r = ratio(fg, bg);
      return {
        ok: true as const,
        fg: "#" + fg.map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase(),
        bg: "#" + bg.map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase(),
        ratio: r,
        aaLarge: r >= 3,
        aa: r >= 4.5,
        aaa: r >= 7,
      };
    });
  }, [input]);

  return (
    <ToolShell title="Contrast Bulk Checker" description="Paste many color pairs (fg, bg per line) — get WCAG ratings at a glance." category={categoryMap.design} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Pairs (foreground, background — one per line)</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[160px] font-mono text-xs" />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Preview</th>
              <th className="p-3">Foreground</th>
              <th className="p-3">Background</th>
              <th className="p-3 text-right">Ratio</th>
              <th className="p-3 text-center">AA L</th>
              <th className="p-3 text-center">AA</th>
              <th className="p-3 text-center">AAA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              r.ok ? (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-3"><span style={{ color: r.fg, background: r.bg }} className="rounded px-2 py-1 font-mono text-xs">AaBbCc</span></td>
                  <td className="p-3 font-mono text-xs">{r.fg}</td>
                  <td className="p-3 font-mono text-xs">{r.bg}</td>
                  <td className="p-3 text-right font-mono">{r.ratio.toFixed(2)}</td>
                  <td className={`p-3 text-center font-mono ${r.aaLarge ? "text-emerald-600" : "text-rose-600"}`}>{r.aaLarge ? "✓" : "✗"}</td>
                  <td className={`p-3 text-center font-mono ${r.aa ? "text-emerald-600" : "text-rose-600"}`}>{r.aa ? "✓" : "✗"}</td>
                  <td className={`p-3 text-center font-mono ${r.aaa ? "text-emerald-600" : "text-rose-600"}`}>{r.aaa ? "✓" : "✗"}</td>
                </tr>
              ) : (
                <tr key={i} className="border-b last:border-0 bg-destructive/5">
                  <td colSpan={7} className="p-3 font-mono text-xs text-destructive">Invalid: "{r.fg}", "{r.bg}"</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
