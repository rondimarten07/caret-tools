import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crc ^ data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function crc16(data: Uint8Array): number {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? ((crc >> 1) ^ 0xa001) : (crc >> 1);
    }
  }
  return crc & 0xffff;
}

export default function CrcCalculator() {
  const [input, setInput] = useUrlState("text", "Hello world");

  const result = useMemo(() => {
    const data = new TextEncoder().encode(input);
    const c32 = crc32(data);
    const c16 = crc16(data);
    return {
      c32,
      c16,
      c32Hex: c32.toString(16).padStart(8, "0").toUpperCase(),
      c16Hex: c16.toString(16).padStart(4, "0").toUpperCase(),
    };
  }, [input]);

  return (
    <ToolShell title="CRC32 / CRC16" description="Cyclic redundancy check (CRC) — CRC32 (IEEE) and CRC16 (Modbus)." category={categoryMap.programming}
      shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Input</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[120px]" />
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[
          { name: "CRC32", value: result.c32, hex: result.c32Hex },
          { name: "CRC16", value: result.c16, hex: result.c16Hex },
        ].map((r) => (
          <Card key={r.name} className="p-3">
            <Label>{r.name}</Label>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 font-mono text-sm">0x{r.hex}</code>
              <CopyButton value={`0x${r.hex}`} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Decimal: <code>{r.value}</code></div>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
