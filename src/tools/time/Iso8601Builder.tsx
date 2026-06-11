import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function pad(n: number, w = 2): string {
  return String(n).padStart(w, "0");
}

export default function Iso8601Builder() {
  const now = new Date();
  const [date, setDate] = useUrlState("d", now.toISOString().slice(0, 10));
  const [time, setTime] = useUrlState("t", now.toISOString().slice(11, 19));
  const [tz, setTz] = useState<"Z" | "local" | "+00:00" | "+07:00" | "-05:00" | "-08:00">("Z");

  const built = useMemo(() => {
    if (!date) return "";
    let offset = "";
    if (tz === "Z") offset = "Z";
    else if (tz === "local") {
      const min = -now.getTimezoneOffset();
      const sign = min >= 0 ? "+" : "-";
      const a = Math.abs(min);
      offset = `${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
    } else offset = tz;
    return `${date}T${time || "00:00:00"}${offset}`;
  }, [date, time, tz, now]);

  const parsed = useMemo(() => {
    if (!built) return null;
    const d = new Date(built);
    if (isNaN(+d)) return null;
    return {
      iso: d.toISOString(),
      epochSec: Math.floor(+d / 1000),
      epochMs: +d,
      local: d.toLocaleString(),
      utc: d.toUTCString(),
    };
  }, [built]);

  return (
    <ToolShell title="ISO 8601 Builder" description="Build and inspect ISO 8601 date/time strings." category={categoryMap.time}>
      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Time</Label>
          <Input type="time" step="1" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <Label>Offset</Label>
          <select className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm" value={tz} onChange={(e) => setTz(e.target.value as typeof tz)}>
            <option value="Z">Z (UTC)</option>
            <option value="local">Local browser</option>
            <option value="+00:00">+00:00</option>
            <option value="+07:00">+07:00 (Jakarta)</option>
            <option value="-05:00">-05:00 (NY)</option>
            <option value="-08:00">-08:00 (PT)</option>
          </select>
        </div>
      </Card>
      <Card className="flex items-center justify-between gap-2 p-4">
        <code className="break-all text-lg">{built || "—"}</code>
        <CopyButton value={built} />
      </Card>
      {parsed && (
        <Card className="p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Canonical ISO (UTC)</dt><dd className="font-mono">{parsed.iso}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Epoch seconds</dt><dd className="font-mono">{parsed.epochSec}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Epoch ms</dt><dd className="font-mono">{parsed.epochMs}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Local</dt><dd className="font-mono">{parsed.local}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">UTC string</dt><dd className="font-mono">{parsed.utc}</dd></div>
          </dl>
        </Card>
      )}
    </ToolShell>
  );
}
