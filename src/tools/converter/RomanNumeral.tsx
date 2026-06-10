import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const MAP: [string, number][] = [
  ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
  ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
  ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1],
];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "";
  let out = "";
  for (const [s, v] of MAP) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

function fromRoman(s: string): number {
  const up = s.toUpperCase();
  if (!/^[MDCLXVI]+$/.test(up)) return NaN;
  let n = 0;
  for (let i = 0; i < up.length; i++) {
    const cur = MAP.find((m) => m[0] === up[i])?.[1] ?? 0;
    const next = MAP.find((m) => m[0] === up[i + 1])?.[1] ?? 0;
    n += cur < next ? -cur : cur;
  }
  return n;
}

export default function RomanNumeral() {
  const [num, setNum] = useState("2026");
  const [rom, setRom] = useState("MMXXVI");

  const fromN = useMemo(() => toRoman(Number(num)), [num]);
  const fromR = useMemo(() => fromRoman(rom), [rom]);

  return (
    <ToolShell title="Roman Numerals" description="Convert between integers (1–3999) and Roman numerals." category={categoryMap.converter}
      shareable>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="space-y-2 p-3">
          <Label>Number</Label>
          <Input type="number" value={num} onChange={(e) => setNum(e.target.value)} />
          <div className="flex items-center justify-between text-sm">
            <code className="font-mono">{fromN || "—"}</code>
            <CopyButton value={fromN} />
          </div>
        </Card>
        <Card className="space-y-2 p-3">
          <Label>Roman</Label>
          <Input value={rom} onChange={(e) => setRom(e.target.value.toUpperCase())} className="font-mono" />
          <div className="flex items-center justify-between text-sm">
            <code className="font-mono">{Number.isFinite(fromR) ? fromR : "—"}</code>
            <CopyButton value={String(fromR)} />
          </div>
        </Card>
      </div>
    </ToolShell>
  );
}
