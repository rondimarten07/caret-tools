import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Unit = "days" | "weeks" | "months" | "years";

function addUnits(base: Date, n: number, u: Unit): Date {
  const d = new Date(base);
  if (u === "days") d.setDate(d.getDate() + n);
  if (u === "weeks") d.setDate(d.getDate() + n * 7);
  if (u === "months") d.setMonth(d.getMonth() + n);
  if (u === "years") d.setFullYear(d.getFullYear() + n);
  return d;
}

export default function DateAdd() {
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [op, setOp] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState(7);
  const [unit, setUnit] = useState<Unit>("days");

  const result = useMemo(() => {
    const base = new Date(start + "T00:00:00");
    if (isNaN(base.getTime())) return null;
    const delta = op === "add" ? amount : -amount;
    const d = addUnits(base, delta, unit);
    return {
      iso: d.toISOString().slice(0, 10),
      pretty: d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
    };
  }, [start, op, amount, unit]);

  return (
    <ToolShell title="Date Add / Subtract" description="Add or subtract days, weeks, months, or years from any date." category={categoryMap.time}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-4">
        <div><Label className="text-xs">Start date</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
        <div>
          <Label className="text-xs">Op</Label>
          <div className="mt-1 flex gap-1">
            <Button size="sm" variant={op === "add" ? "default" : "outline"} onClick={() => setOp("add")}>+ add</Button>
            <Button size="sm" variant={op === "subtract" ? "default" : "outline"} onClick={() => setOp("subtract")}>− subtract</Button>
          </div>
        </div>
        <div><Label className="text-xs">Amount</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></div>
        <div>
          <Label className="text-xs">Unit</Label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
        </div>
      </Card>
      {result && (
        <Card className="p-6 text-center">
          <div className="text-xs uppercase text-muted-foreground">Result</div>
          <div className="mt-1 flex items-center justify-center gap-2 font-mono text-3xl">{result.iso}<CopyButton value={result.iso} /></div>
          <div className="mt-2 text-sm text-muted-foreground">{result.pretty}</div>
        </Card>
      )}
    </ToolShell>
  );
}
