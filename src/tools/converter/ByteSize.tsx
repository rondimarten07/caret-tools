import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type System = "iec" | "si";

const IEC = [
  { id: "B", name: "Byte", v: 1 },
  { id: "KiB", name: "Kibibyte", v: 1024 },
  { id: "MiB", name: "Mebibyte", v: 1024 ** 2 },
  { id: "GiB", name: "Gibibyte", v: 1024 ** 3 },
  { id: "TiB", name: "Tebibyte", v: 1024 ** 4 },
  { id: "PiB", name: "Pebibyte", v: 1024 ** 5 },
];

const SI = [
  { id: "B", name: "Byte", v: 1 },
  { id: "KB", name: "Kilobyte", v: 1e3 },
  { id: "MB", name: "Megabyte", v: 1e6 },
  { id: "GB", name: "Gigabyte", v: 1e9 },
  { id: "TB", name: "Terabyte", v: 1e12 },
  { id: "PB", name: "Petabyte", v: 1e15 },
];

export default function ByteSize() {
  const [system, setSystem] = useState<System>("iec");
  const [value, setValue] = useState("1024");
  const [from, setFrom] = useState("B");

  const units = system === "iec" ? IEC : SI;
  const fromUnit = units.find((u) => u.id === from) ?? units[0];
  const base = useMemo(() => Number(value || 0) * fromUnit.v, [value, fromUnit]);

  return (
    <ToolShell title="Byte Size Converter" description="Convert bytes between IEC (KiB/MiB) and SI (KB/MB) units." category={categoryMap.converter}
      shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant={system === "iec" ? "default" : "outline"} onClick={() => { setSystem("iec"); setFrom("B"); }}>IEC (1024)</Button>
        <Button size="sm" variant={system === "si" ? "default" : "outline"} onClick={() => { setSystem("si"); setFrom("B"); }}>SI (1000)</Button>
      </Card>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">Value</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">From</Label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {units.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((u) => (
          <Card key={u.id} className="flex items-baseline justify-between p-3">
            <span className="text-xs text-muted-foreground">{u.name} ({u.id})</span>
            <span className="font-mono">{(base / u.v).toLocaleString("en", { maximumFractionDigits: 6 })}</span>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
