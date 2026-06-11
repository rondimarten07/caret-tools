import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const UNITS: { id: string; label: string; hz: number }[] = [
  { id: "mhz", label: "mHz", hz: 0.001 },
  { id: "hz", label: "Hz", hz: 1 },
  { id: "khz", label: "kHz", hz: 1e3 },
  { id: "mhzC", label: "MHz", hz: 1e6 },
  { id: "ghz", label: "GHz", hz: 1e9 },
  { id: "thz", label: "THz", hz: 1e12 },
  { id: "rpm", label: "RPM", hz: 1 / 60 },
  { id: "bpm", label: "BPM", hz: 1 / 60 },
  { id: "period_ms", label: "Period (ms)", hz: -1 },
];

export default function Frequency() {
  const [value, setValue] = useUrlState("v", "440");
  const [unit, setUnit] = useUrlState("u", "hz");

  const hz = useMemo(() => {
    const v = Number(value);
    if (!Number.isFinite(v) || v <= 0) return null;
    const u = UNITS.find((x) => x.id === unit);
    if (!u) return null;
    if (u.id === "period_ms") return 1000 / v;
    return v * u.hz;
  }, [value, unit]);

  const fmt = (n: number) => {
    if (n === 0) return "0";
    if (Math.abs(n) >= 1e6 || Math.abs(n) < 1e-3) return n.toExponential(4);
    return Number(n.toFixed(6)).toString();
  };

  return (
    <ToolShell title="Frequency Units" description="Convert between Hz, kHz, MHz, GHz, RPM, BPM and signal period." category={categoryMap.converter} shareable>
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div>
          <Label>Value</Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} className="w-40 font-mono" />
        </div>
        <div>
          <Label>Unit</Label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-1 block rounded-md border bg-background px-3 py-1.5 text-sm">
            {UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
      </Card>
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Unit</th>
              <th className="p-3">Value</th>
              <th className="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {hz === null ? (
              <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Enter a positive number.</td></tr>
            ) : (
              UNITS.map((u) => {
                const out = u.id === "period_ms" ? 1000 / hz : hz / u.hz;
                return (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-3">{u.label}</td>
                    <td className="p-3 font-mono">{fmt(out)}</td>
                    <td className="p-3"><CopyButton value={fmt(out)} /></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
