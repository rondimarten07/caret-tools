import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Base = "bin" | "oct" | "dec" | "hex";

const BASES: { id: Base; name: string; radix: number; pattern: RegExp }[] = [
  { id: "bin", name: "Binary (2)", radix: 2, pattern: /^[01]*$/ },
  { id: "oct", name: "Octal (8)", radix: 8, pattern: /^[0-7]*$/ },
  { id: "dec", name: "Decimal (10)", radix: 10, pattern: /^\d*$/ },
  { id: "hex", name: "Hex (16)", radix: 16, pattern: /^[0-9a-fA-F]*$/ },
];

export default function NumberBase() {
  const [value, setValue] = useState<bigint | null>(255n);

  const display = useMemo(() => {
    const r: Record<Base, string> = { bin: "", oct: "", dec: "", hex: "" };
    if (value !== null) {
      r.bin = value.toString(2);
      r.oct = value.toString(8);
      r.dec = value.toString(10);
      r.hex = value.toString(16).toUpperCase();
    }
    return r;
  }, [value]);

  const handleChange = (base: Base, raw: string) => {
    const s = raw.trim();
    if (!s) return setValue(null);
    const def = BASES.find((b) => b.id === base)!;
    if (!def.pattern.test(s)) return;
    try {
      const n = base === "hex" ? BigInt("0x" + s) : base === "oct" ? BigInt("0o" + s) : base === "bin" ? BigInt("0b" + s) : BigInt(s);
      setValue(n);
    } catch {
      /* ignore */
    }
  };

  return (
    <ToolShell
      title="Number Base Converter"
      description="Convert non-negative integers between binary, octal, decimal and hex."
      category={categoryMap.programming}
      shareable
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {BASES.map((b) => (
          <Card key={b.id} className="space-y-2 p-3">
            <div className="flex items-center justify-between">
              <Label>{b.name}</Label>
              <CopyButton value={display[b.id]} />
            </div>
            <Input value={display[b.id]} onChange={(e) => handleChange(b.id, e.target.value)} className="font-mono" />
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
