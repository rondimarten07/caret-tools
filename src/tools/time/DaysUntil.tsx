import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function DaysUntil() {
  const [target, setTarget] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [name, setName] = useState("New Year");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const r = useMemo(() => {
    const t = new Date(target + "T00:00:00");
    if (isNaN(t.getTime())) return null;
    const diff = t.getTime() - now.getTime();
    const past = diff < 0;
    const ms = Math.abs(diff);
    const days = Math.floor(ms / (24 * 3600 * 1000));
    const hours = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
    const minutes = Math.floor((ms % (3600 * 1000)) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return { days, hours, minutes, seconds, past };
  }, [target, now]);

  return (
    <ToolShell title="Days Until…" description="Live countdown — days, hours, minutes, seconds until any date." category={categoryMap.time}>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        <div>
          <Label className="text-xs">What</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Birthday, exam, vacation…" />
        </div>
        <div>
          <Label className="text-xs">When</Label>
          <Input type="date" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
      </Card>
      {r && (
        <Card className="p-6 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {r.past ? "Time since" : "Time until"} {name || "your date"}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            <div><div className="font-mono text-4xl">{r.days}</div><div className="text-xs text-muted-foreground">days</div></div>
            <div><div className="font-mono text-4xl">{r.hours}</div><div className="text-xs text-muted-foreground">hours</div></div>
            <div><div className="font-mono text-4xl">{r.minutes}</div><div className="text-xs text-muted-foreground">minutes</div></div>
            <div><div className="font-mono text-4xl tabular-nums">{r.seconds}</div><div className="text-xs text-muted-foreground">seconds</div></div>
          </div>
        </Card>
      )}
    </ToolShell>
  );
}
