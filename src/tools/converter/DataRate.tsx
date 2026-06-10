import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const UNITS = [
  { id: "bps", name: "bit/s", v: 1 },
  { id: "kbps", name: "kbit/s", v: 1e3 },
  { id: "mbps", name: "Mbit/s", v: 1e6 },
  { id: "gbps", name: "Gbit/s", v: 1e9 },
  { id: "Bps", name: "Byte/s", v: 8 },
  { id: "KBps", name: "KB/s", v: 8 * 1e3 },
  { id: "MBps", name: "MB/s", v: 8 * 1e6 },
  { id: "GBps", name: "GB/s", v: 8 * 1e9 },
];

export default function DataRate() {
  const [value, setValue] = useState("100");
  const [from, setFrom] = useState("mbps");
  const fromUnit = UNITS.find((u) => u.id === from)!;
  const base = useMemo(() => Number(value || 0) * fromUnit.v, [value, fromUnit]);

  return (
    <ToolShell title="Data Rate Converter" description="Convert bps, Kbps, Mbps, Gbps and byte rates." category={categoryMap.converter}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">Value</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">From</Label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {UNITS.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {UNITS.map((u) => (
          <Card key={u.id} className="flex items-baseline justify-between p-3">
            <span className="text-xs text-muted-foreground">{u.name}</span>
            <span className="font-mono">{(base / u.v).toLocaleString("en", { maximumFractionDigits: 6 })}</span>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
