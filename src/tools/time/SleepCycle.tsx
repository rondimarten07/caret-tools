import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "wake" | "sleep";

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  let total = h * 60 + m + minutes;
  total = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  const period = hh >= 12 ? "PM" : "AM";
  const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${period}`;
}

const CYCLE_MIN = 90;
const FALL_ASLEEP_MIN = 14;
const CYCLES = [6, 5, 4, 3];

export default function SleepCycle() {
  const [mode, setMode] = useState<Mode>("wake");
  const [time, setTime] = useState("06:30");

  const results = useMemo(() => {
    return CYCLES.map((c) => {
      const minutes = c * CYCLE_MIN + FALL_ASLEEP_MIN;
      const t = mode === "wake" ? addMinutes(time, -minutes) : addMinutes(time, minutes);
      return { cycles: c, time: t, hours: (c * CYCLE_MIN) / 60 };
    });
  }, [mode, time]);

  return (
    <ToolShell title="Sleep Cycle Calculator" description="Recommended bed or wake times in 90-minute sleep cycles." category={categoryMap.time}>
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <Label className="text-xs">I want to</Label>
        <Button size="sm" variant={mode === "wake" ? "default" : "outline"} onClick={() => setMode("wake")}>Wake up at…</Button>
        <Button size="sm" variant={mode === "sleep" ? "default" : "outline"} onClick={() => setMode("sleep")}>Sleep at…</Button>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-32" />
      </Card>
      <Card className="p-3">
        <Label className="mb-2 block">
          {mode === "wake" ? "Go to bed at one of these times:" : "Wake up at one of these times:"}
        </Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {results.map((r) => (
            <Card key={r.cycles} className={`p-4 text-center ${r.cycles >= 5 ? "bg-emerald-500/10" : r.cycles === 4 ? "bg-amber-500/10" : "bg-rose-500/10"}`}>
              <div className="text-xs uppercase text-muted-foreground">{r.cycles} cycles · {r.hours}h</div>
              <div className="mt-1 font-mono text-2xl">{r.time}</div>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Assumes ~14 min to fall asleep. Aim for 5-6 cycles. Waking up at the end of a cycle feels less groggy than mid-cycle.
        </p>
      </Card>
    </ToolShell>
  );
}
