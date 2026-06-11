import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const C = 299_792_458; // speed of light, m/s

const NAMED: { name: string; nm: number; color: string }[] = [
  { name: "UV-A boundary", nm: 380, color: "#5a00ff" },
  { name: "Violet", nm: 420, color: "#7a1de9" },
  { name: "Blue", nm: 470, color: "#1e7cff" },
  { name: "Cyan", nm: 495, color: "#00d7ff" },
  { name: "Green", nm: 540, color: "#1de87a" },
  { name: "Yellow", nm: 580, color: "#ffd400" },
  { name: "Orange", nm: 610, color: "#ff8c00" },
  { name: "Red", nm: 680, color: "#ff2b2b" },
  { name: "IR boundary", nm: 740, color: "#aa0000" },
];

export default function Wavelength() {
  const [nm, setNm] = useUrlState("n", "550");

  const data = useMemo(() => {
    const v = Number(nm);
    if (!Number.isFinite(v) || v <= 0) return null;
    const m = v * 1e-9;
    const freqHz = C / m;
    return {
      thz: freqHz / 1e12,
      ev: 1239.84 / v, // eV from nm
    };
  }, [nm]);

  return (
    <ToolShell title="Wavelength ↔ Frequency" description="Convert between wavelength (nm) and frequency (THz) for electromagnetic waves." category={categoryMap.converter} shareable>
      <Card className="space-y-3 p-4">
        <Label>Wavelength (nm)</Label>
        <Input value={nm} onChange={(e) => setNm(e.target.value)} type="number" min={100} max={10000} className="font-mono" />
        <input type="range" min={380} max={750} step={1} value={nm} onChange={(e) => setNm(e.target.value)} className="w-full" />
      </Card>
      {data && (
        <>
          <Card className="grid gap-3 p-4 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3"><div><div className="text-xs text-muted-foreground">Frequency</div><div className="font-mono text-lg">{data.thz.toFixed(3)} THz</div></div><CopyButton value={String(data.thz)} /></div>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3"><div><div className="text-xs text-muted-foreground">Photon energy</div><div className="font-mono text-lg">{data.ev.toFixed(3)} eV</div></div><CopyButton value={String(data.ev)} /></div>
            <div className="flex items-center justify-center rounded-md p-3" style={{ background: nmToHex(Number(nm)) }}>
              <span className="font-mono text-white drop-shadow">{nm} nm</span>
            </div>
          </Card>
        </>
      )}
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Visible spectrum reference</div>
        <table className="w-full text-sm">
          <tbody>
            {NAMED.map((n) => (
              <tr key={n.name} className="border-b last:border-0">
                <td className="p-2"><div className="h-6 w-12 rounded" style={{ background: n.color }} /></td>
                <td className="p-2 font-mono">{n.nm} nm</td>
                <td className="p-2 text-muted-foreground">{n.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}

function nmToHex(nm: number): string {
  if (nm < 380 || nm > 750) return "#222";
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else { r = 1; }
  const to = (x: number) => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
