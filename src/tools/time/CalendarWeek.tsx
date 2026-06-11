import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function* weeks(year: number) {
  const start = new Date(year, 0, 1);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  let d = start;
  while (d.getFullYear() <= year || d.getMonth() === 0) {
    yield new Date(d);
    d = new Date(d.getTime() + 7 * 86400000);
    if (d.getFullYear() > year && d.getMonth() > 0) break;
  }
}

export default function CalendarWeek() {
  const [year, setYear] = useState(new Date().getFullYear());

  const grid = useMemo(() => {
    const arr: Date[] = [];
    for (const w of weeks(year)) arr.push(w);
    return arr;
  }, [year]);

  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setHours(0, 0, 0, 0);
  thisWeekStart.setDate(thisWeekStart.getDate() - ((thisWeekStart.getDay() + 6) % 7));

  return (
    <ToolShell title="Calendar Year Grid" description="All ISO weeks of the year visualized as a grid. Highlights the current week." category={categoryMap.time}>
      <Card className="flex items-end gap-3 p-3">
        <div>
          <Label>Year</Label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value) || year)} className="mt-1 block w-24 rounded-md border bg-background px-3 py-1.5 text-sm" />
        </div>
        <div className="ml-auto text-xs text-muted-foreground">{grid.length} weeks</div>
      </Card>
      <Card className="p-4">
        <div className="grid grid-cols-13 gap-1 sm:grid-cols-26 lg:grid-cols-26" style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}>
          {grid.map((w, i) => {
            const isCurrent = Math.abs(+w - +thisWeekStart) < 7 * 86400000 && w.getFullYear() === today.getFullYear();
            const isPast = +w < +thisWeekStart && w.getFullYear() === year;
            return (
              <div
                key={i}
                title={`Week of ${w.toLocaleDateString()}`}
                className={`aspect-square rounded ${isCurrent ? "bg-primary ring-2 ring-primary" : isPast ? "bg-primary/40" : "bg-muted/40"}`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-primary/40" /> past</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-primary" /> current</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-muted/40" /> upcoming</span>
        </div>
      </Card>
    </ToolShell>
  );
}
