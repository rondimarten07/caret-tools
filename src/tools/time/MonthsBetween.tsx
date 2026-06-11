import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function diff(start: Date, end: Date) {
  if (start > end) [start, end] = [end, start];
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months--;
    const prev = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prev;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const totalMs = +end - +start;
  return {
    years,
    months,
    days,
    totalDays: Math.floor(totalMs / 86400000),
    totalWeeks: totalMs / (86400000 * 7),
    totalMonths: years * 12 + months + days / 30,
  };
}

export default function MonthsBetween() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useUrlState("s", "2000-01-01");
  const [end, setEnd] = useUrlState("e", today);

  const data = useMemo(() => {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    if (isNaN(+s) || isNaN(+e)) return null;
    return diff(s, e);
  }, [start, end]);

  return (
    <ToolShell title="Months Between Dates" description="Years, months, and days between two dates." category={categoryMap.time} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Start</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
        <div><Label>End</Label><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
      </Card>
      {data && (
        <Card className="p-4">
          <div className="text-center text-3xl font-mono">
            {data.years} <span className="text-base text-muted-foreground">years</span>{" "}
            {data.months} <span className="text-base text-muted-foreground">months</span>{" "}
            {data.days} <span className="text-base text-muted-foreground">days</span>
          </div>
          <dl className="mt-4 grid gap-2 text-sm md:grid-cols-3">
            <div className="rounded-md bg-muted/30 p-3"><dt className="text-xs text-muted-foreground">Total days</dt><dd className="font-mono">{data.totalDays.toLocaleString()}</dd></div>
            <div className="rounded-md bg-muted/30 p-3"><dt className="text-xs text-muted-foreground">Total weeks</dt><dd className="font-mono">{data.totalWeeks.toFixed(2)}</dd></div>
            <div className="rounded-md bg-muted/30 p-3"><dt className="text-xs text-muted-foreground">Total months ≈</dt><dd className="font-mono">{data.totalMonths.toFixed(1)}</dd></div>
          </dl>
        </Card>
      )}
    </ToolShell>
  );
}
