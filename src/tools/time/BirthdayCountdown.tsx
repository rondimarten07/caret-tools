import { useEffect, useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function BirthdayCountdown() {
  const [dob, setDob] = useUrlState("d", "1995-06-15");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const data = useMemo(() => {
    const b = new Date(dob + "T00:00:00");
    if (isNaN(+b)) return null;
    const y = now.getFullYear();
    let next = new Date(y, b.getMonth(), b.getDate());
    if (next.getTime() < +now) next = new Date(y + 1, b.getMonth(), b.getDate());
    const ms = +next - +now;
    const days = Math.floor(ms / 86400000);
    const hrs = Math.floor((ms % 86400000) / 3600000);
    const min = Math.floor((ms % 3600000) / 60000);
    const sec = Math.floor((ms % 60000) / 1000);

    const ageYears = next.getFullYear() - b.getFullYear() - 1;
    const ageMs = +now - +b;
    const ageDays = Math.floor(ageMs / 86400000);

    const isToday = b.getMonth() === now.getMonth() && b.getDate() === now.getDate();

    return { ms, days, hrs, min, sec, ageYears, ageDays, nextAge: ageYears + 1, isToday };
  }, [dob, now]);

  return (
    <ToolShell title="Birthday Countdown" description="Days until your next birthday and your exact age." category={categoryMap.time} shareable>
      <Card className="space-y-3 p-4">
        <Label>Date of birth</Label>
        <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      </Card>
      {data && (
        <>
          {data.isToday && (
            <Card className="p-4 text-center">
              <div className="text-5xl">🎉</div>
              <div className="mt-2 text-lg font-semibold">Happy birthday!</div>
            </Card>
          )}
          <Card className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground">Time until turning {data.nextAge}</div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[
                ["Days", data.days],
                ["Hours", data.hrs],
                ["Min", data.min],
                ["Sec", data.sec],
              ].map(([l, v]) => (
                <div key={l} className="rounded-md bg-muted/30 p-3">
                  <div className="font-mono text-2xl">{v}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="grid gap-3 p-4 sm:grid-cols-2">
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">You're currently</div><div className="font-mono text-lg">{data.ageYears} years old</div></div>
            <div className="rounded-md bg-muted/30 p-3"><div className="text-xs text-muted-foreground">That's about</div><div className="font-mono text-lg">{data.ageDays.toLocaleString()} days</div></div>
          </Card>
        </>
      )}
    </ToolShell>
  );
}
