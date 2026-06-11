import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

// Tanner Helland's well-known Kelvin→RGB approximation.
function kelvinToRgb(k: number): { r: number; g: number; b: number } {
  const temp = k / 100;
  let r: number, g: number, b: number;
  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
    b = temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    b = 255;
  }
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return { r: clamp(r), g: clamp(g), b: clamp(b) };
}

const REFERENCES: { k: number; label: string }[] = [
  { k: 1700, label: "Match flame" },
  { k: 1850, label: "Candle" },
  { k: 2400, label: "Incandescent bulb" },
  { k: 2700, label: "Soft white LED" },
  { k: 3000, label: "Warm white LED" },
  { k: 3200, label: "Studio lamp / sunrise" },
  { k: 4100, label: "Moonlight" },
  { k: 5000, label: "Horizon daylight" },
  { k: 5500, label: "Mid-day sun / flash" },
  { k: 6500, label: "Daylight monitor" },
  { k: 7500, label: "Overcast sky" },
  { k: 10000, label: "Blue sky" },
];

export default function ColorTemp() {
  const [k, setK] = useUrlState("k", "5500");

  const data = useMemo(() => {
    const K = Number(k);
    if (!Number.isFinite(K) || K < 1000 || K > 40000) return null;
    const rgb = kelvinToRgb(K);
    const hex = "#" + [rgb.r, rgb.g, rgb.b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
    return { rgb, hex };
  }, [k]);

  return (
    <ToolShell title="Color Temperature" description="Kelvin → RGB approximation. Useful for white-balance and lighting design." category={categoryMap.converter} shareable>
      <Card className="space-y-3 p-4">
        <Label>Color temperature (1000 – 40000 K)</Label>
        <Input type="number" value={k} onChange={(e) => setK(e.target.value)} className="font-mono" min={1000} max={40000} step={100} />
        <input type="range" min={1000} max={20000} step={100} value={k} onChange={(e) => setK(e.target.value)} className="w-full" />
      </Card>
      {data && (
        <Card className="p-4">
          <div className="aspect-[3/1] w-full rounded-md" style={{ background: data.hex }} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-2">
              <span className="font-mono">{data.hex}</span>
              <CopyButton value={data.hex} />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-2">
              <span className="font-mono">rgb({data.rgb.r}, {data.rgb.g}, {data.rgb.b})</span>
              <CopyButton value={`rgb(${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b})`} />
            </div>
            <div className="rounded-md bg-muted/30 p-2 font-mono">{k} K</div>
          </div>
        </Card>
      )}
      <Card className="p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">References</div>
        <table className="w-full text-sm">
          <tbody>
            {REFERENCES.map((r) => {
              const rgb = kelvinToRgb(r.k);
              return (
                <tr key={r.k} className="border-b last:border-0">
                  <td className="p-2"><div className="h-6 w-12 rounded" style={{ background: `rgb(${rgb.r},${rgb.g},${rgb.b})` }} /></td>
                  <td className="p-2 font-mono">{r.k} K</td>
                  <td className="p-2 text-muted-foreground">{r.label}</td>
                  <td className="p-2"><button onClick={() => setK(String(r.k))} className="text-xs text-primary hover:underline">use</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
