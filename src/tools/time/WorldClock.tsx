import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const CITIES = [
  { city: "Jakarta", tz: "Asia/Jakarta" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Singapore", tz: "Asia/Singapore" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "London", tz: "Europe/London" },
  { city: "Berlin", tz: "Europe/Berlin" },
  { city: "Paris", tz: "Europe/Paris" },
  { city: "New York", tz: "America/New_York" },
  { city: "Los Angeles", tz: "America/Los_Angeles" },
  { city: "São Paulo", tz: "America/Sao_Paulo" },
  { city: "Sydney", tz: "Australia/Sydney" },
  { city: "UTC", tz: "UTC" },
];

export default function WorldClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <ToolShell title="World Clock" description="Current time in major cities." category={categoryMap.time}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CITIES.map((c) => {
          const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: c.tz }).format(now);
          const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: c.tz }).format(now);
          return (
            <Card key={c.tz} className="p-4 text-center">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.city}</div>
              <div className="mt-1 font-mono text-3xl tabular-nums">{time}</div>
              <div className="mt-1 text-xs text-muted-foreground">{date}</div>
            </Card>
          );
        })}
      </div>
    </ToolShell>
  );
}
