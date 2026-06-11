import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

function pct(now: number, start: number, end: number): number {
  return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
}

function bars(now: Date) {
  const t = now.getTime();
  const y = now.getFullYear();
  const yearStart = new Date(y, 0, 1).getTime();
  const yearEnd = new Date(y + 1, 0, 1).getTime();
  const q = Math.floor(now.getMonth() / 3);
  const quarterStart = new Date(y, q * 3, 1).getTime();
  const quarterEnd = new Date(y, q * 3 + 3, 1).getTime();
  const monthStart = new Date(y, now.getMonth(), 1).getTime();
  const monthEnd = new Date(y, now.getMonth() + 1, 1).getTime();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = weekStart.getTime() + 7 * 86400000;
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = dayStart.getTime() + 86400000;
  return [
    { label: `Year ${y}`, pct: pct(t, yearStart, yearEnd) },
    { label: `Q${q + 1} ${y}`, pct: pct(t, quarterStart, quarterEnd) },
    { label: now.toLocaleString(undefined, { month: "long" }), pct: pct(t, monthStart, monthEnd) },
    { label: "This week (Mon-Sun)", pct: pct(t, weekStart.getTime(), weekEnd) },
    { label: "Today", pct: pct(t, dayStart.getTime(), dayEnd) },
  ];
}

export default function YearProgress() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ToolShell title="Year Progress" description="Live progress through year, quarter, month, week and day." category={categoryMap.time}>
      <Card className="space-y-4 p-4">
        {bars(now).map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{b.label}</span>
              <span className="font-mono text-muted-foreground">{b.pct.toFixed(2)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </Card>
    </ToolShell>
  );
}
