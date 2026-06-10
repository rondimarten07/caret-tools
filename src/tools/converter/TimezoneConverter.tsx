import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ZONES = [
  "UTC",
  "Asia/Jakarta",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Australia/Sydney",
];

function format(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "long",
    timeZone: tz,
  }).format(d);
}

export default function TimezoneConverter() {
  const now = useMemo(() => new Date(), []);
  const isoLocal = useMemo(() => new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16), [now]);
  const [value, setValue] = useState(isoLocal);

  const date = useMemo(() => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  return (
    <ToolShell
      title="Timezone Converter"
      description="See the same moment in many time zones."
      category={categoryMap.converter}
      actions={<Button size="sm" variant="outline" onClick={() => setValue(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))}>Now</Button>}
    >
      <Card className="p-3">
        <Label className="mb-1 block">Local time</Label>
        <Input type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} />
      </Card>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {ZONES.map((tz) => (
          <Card key={tz} className="flex items-center justify-between gap-3 p-3">
            <span className="text-sm font-medium">{tz}</span>
            <span className="font-mono text-sm">{date ? format(date, tz) : "—"}</span>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
