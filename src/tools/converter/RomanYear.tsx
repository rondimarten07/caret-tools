import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const TABLE: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  if (n <= 0 || n > 3999) return "";
  let out = "";
  for (const [v, s] of TABLE) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
}

function fromRoman(s: string): number | null {
  const r = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(r)) return null;
  let n = 0;
  let i = 0;
  for (const [v, sym] of TABLE) {
    while (r.startsWith(sym, i)) { n += v; i += sym.length; }
  }
  return i === r.length && toRoman(n) === r ? n : null;
}

export default function RomanYear() {
  const [year, setYear] = useUrlState("y", "2026");
  const [roman, setRoman] = useUrlState("r", "");

  const fromYear = useMemo(() => {
    const n = parseInt(year, 10);
    return Number.isFinite(n) ? toRoman(n) : "";
  }, [year]);

  const fromRomanNum = useMemo(() => {
    if (!roman.trim()) return null;
    return fromRoman(roman);
  }, [roman]);

  return (
    <ToolShell title="Roman Year Converter" description="Convert any year (1–3999) to its Roman numeral form, and back." category={categoryMap.converter} shareable>
      <Card className="space-y-3 p-4">
        <Label>Year (1 – 3999)</Label>
        <Input type="number" min={1} max={3999} value={year} onChange={(e) => setYear(e.target.value)} />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="font-mono text-lg">{fromYear || <span className="text-muted-foreground">—</span>}</p>
          <CopyButton value={fromYear} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Roman numeral</Label>
        <Input value={roman} onChange={(e) => setRoman(e.target.value.toUpperCase())} placeholder="MMXXVI" className="font-mono" />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="font-mono text-lg">
            {fromRomanNum === null
              ? roman.trim() ? <span className="text-destructive">Invalid</span> : <span className="text-muted-foreground">—</span>
              : fromRomanNum}
          </p>
          {fromRomanNum !== null && <CopyButton value={String(fromRomanNum)} />}
        </div>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Standard Roman numerals only go up to <span className="font-mono">MMMCMXCIX</span> (3999). For larger numbers historical sources used vinculum (overlines) — not represented here.
      </div>
    </ToolShell>
  );
}
