import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function isoWeek(d: Date): { week: number; year: number } {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+t - +yearStart) / 86400000 + 1) / 7);
  return { week, year: t.getUTCFullYear() };
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = +d - +start;
  return Math.floor(diff / 86400000);
}

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export default function DayOfYear() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const [date, setDate] = useUrlState("d", todayStr);

  const info = useMemo(() => {
    const d = new Date(date + "T00:00:00");
    if (isNaN(+d)) return null;
    const year = d.getFullYear();
    const totalDays = isLeap(year) ? 366 : 365;
    const doy = dayOfYear(d);
    const iso = isoWeek(d);
    const quarter = Math.floor(d.getMonth() / 3) + 1;
    return { date: d, year, totalDays, doy, iso, quarter, remaining: totalDays - doy };
  }, [date]);

  return (
    <ToolShell title="Day of Year" description="Day-of-year, ISO week, quarter and remaining days for any date." category={categoryMap.time} shareable>
      <Card className="space-y-3 p-4">
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Card>
      {info && (
        <Card className="p-4">
          <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
            <div><dt className="text-xs text-muted-foreground">Day of year</dt><dd className="font-mono text-lg">{info.doy} / {info.totalDays}</dd></div>
            <div><dt className="text-xs text-muted-foreground">ISO week</dt><dd className="font-mono text-lg">W{info.iso.week}-{info.iso.year}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Quarter</dt><dd className="font-mono text-lg">Q{info.quarter} {info.year}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Weekday</dt><dd className="font-mono text-lg">{info.date.toLocaleDateString(undefined, { weekday: "long" })}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Days remaining</dt><dd className="font-mono text-lg">{info.remaining}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Leap year?</dt><dd className="font-mono text-lg">{isLeap(info.year) ? "yes" : "no"}</dd></div>
          </dl>
        </Card>
      )}
    </ToolShell>
  );
}
