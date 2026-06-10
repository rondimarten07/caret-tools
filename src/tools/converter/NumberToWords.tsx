import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES = ["", "thousand", "million", "billion", "trillion"];

function below1000(n: number): string {
  let out = "";
  if (n >= 100) {
    out += ONES[Math.floor(n / 100)] + " hundred";
    n %= 100;
    if (n) out += " ";
  }
  if (n >= 20) {
    out += TENS[Math.floor(n / 10)];
    if (n % 10) out += "-" + ONES[n % 10];
  } else if (n > 0) {
    out += ONES[n];
  }
  return out;
}

function toWords(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "minus " + toWords(-n);
  const parts: string[] = [];
  let i = 0;
  while (n > 0) {
    const chunk = n % 1000;
    if (chunk) parts.unshift(below1000(chunk) + (SCALES[i] ? " " + SCALES[i] : ""));
    n = Math.floor(n / 1000);
    i++;
  }
  return parts.join(" ");
}

export default function NumberToWords() {
  const [n, setN] = useUrlState("n", "2026");
  const words = useMemo(() => {
    const v = Number(n);
    if (!Number.isFinite(v) || !Number.isInteger(v)) return "";
    if (Math.abs(v) > 1e15) return "Too large";
    return toWords(v);
  }, [n]);

  return (
    <ToolShell title="Number to Words" description="Spell out integers in English words." category={categoryMap.converter}
      shareable>
      <Card className="space-y-3 p-4">
        <Label>Integer</Label>
        <Input type="number" value={n} onChange={(e) => setN(e.target.value)} />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="text-sm capitalize">{words || "—"}</p>
          <CopyButton value={words} />
        </div>
      </Card>
    </ToolShell>
  );
}
