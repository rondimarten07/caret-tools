import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ZONES = [
  "UTC", "Asia/Jakarta", "Asia/Tokyo", "Asia/Singapore", "Asia/Dubai",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "America/New_York",
  "America/Los_Angeles", "America/Sao_Paulo", "Australia/Sydney",
];

function offsetMinutes(tz: string, when: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "longOffset",
  });
  const parts = dtf.formatToParts(when);
  const off = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  const m = off.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
  if (!m) return 0;
  const sign = m[1] === "+" ? 1 : -1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

export default function TimezoneDiff() {
  const [a, setA] = useState("Asia/Jakarta");
  const [b, setB] = useState("America/New_York");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const diff = useMemo(() => {
    const oa = offsetMinutes(a, now);
    const ob = offsetMinutes(b, now);
    const m = oa - ob;
    const abs = Math.abs(m);
    return {
      minutes: m,
      hours: m / 60,
      pretty: `${m >= 0 ? "+" : "-"}${Math.floor(abs / 60)}h${abs % 60 ? ` ${abs % 60}m` : ""}`,
    };
  }, [a, b, now]);

  const fmt = (tz: string) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, dateStyle: "medium", timeStyle: "short" }).format(now);

  return (
    <ToolShell title="Timezone Difference" description="Hour offset between two time zones right now (DST-aware)." category={categoryMap.time}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        <div>
          <Label className="text-xs">Zone A</Label>
          <select value={a} onChange={(e) => setA(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {ZONES.map((z) => (<option key={z}>{z}</option>))}
          </select>
          <div className="mt-1 font-mono text-sm">{fmt(a)}</div>
        </div>
        <div>
          <Label className="text-xs">Zone B</Label>
          <select value={b} onChange={(e) => setB(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            {ZONES.map((z) => (<option key={z}>{z}</option>))}
          </select>
          <div className="mt-1 font-mono text-sm">{fmt(b)}</div>
        </div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-xs uppercase text-muted-foreground">A is {diff.minutes >= 0 ? "ahead of" : "behind"} B by</div>
        <div className="mt-1 font-mono text-4xl">{diff.pretty}</div>
        <div className="mt-1 text-xs text-muted-foreground">{diff.minutes} minutes · {diff.hours.toFixed(2)} hours</div>
      </Card>
    </ToolShell>
  );
}
