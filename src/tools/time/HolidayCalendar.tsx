import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Holiday = { date: string; name: string };

// Static fixed-date public holidays (lunar/Islamic dates vary — we use 2026 best-known approximations and mark them).
function fixedYear(y: number): Record<string, Holiday[]> {
  return {
    ID: [
      { date: `${y}-01-01`, name: "New Year's Day" },
      { date: `${y}-05-01`, name: "Labour Day" },
      { date: `${y}-06-01`, name: "Pancasila Day" },
      { date: `${y}-08-17`, name: "Independence Day" },
      { date: `${y}-12-25`, name: "Christmas Day" },
    ],
    US: [
      { date: `${y}-01-01`, name: "New Year's Day" },
      { date: `${y}-07-04`, name: "Independence Day" },
      { date: `${y}-11-11`, name: "Veterans Day" },
      { date: `${y}-12-25`, name: "Christmas Day" },
    ],
    UK: [
      { date: `${y}-01-01`, name: "New Year's Day" },
      { date: `${y}-12-25`, name: "Christmas Day" },
      { date: `${y}-12-26`, name: "Boxing Day" },
    ],
    SG: [
      { date: `${y}-01-01`, name: "New Year's Day" },
      { date: `${y}-05-01`, name: "Labour Day" },
      { date: `${y}-08-09`, name: "National Day" },
      { date: `${y}-12-25`, name: "Christmas Day" },
    ],
  };
}

export default function HolidayCalendar() {
  const [country, setCountry] = useState("ID");
  const [year, setYear] = useState(new Date().getFullYear());

  const list = useMemo(() => {
    const map = fixedYear(year);
    return (map[country] || []).sort((a, b) => a.date.localeCompare(b.date));
  }, [country, year]);

  return (
    <ToolShell title="Holiday Calendar" description="Fixed-date public holidays for selected countries. Lunar / Islamic / Easter-based dates not included." category={categoryMap.time}>
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div>
          <Label>Country</Label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block rounded-md border bg-background px-3 py-1.5 text-sm">
            <option value="ID">Indonesia</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="SG">Singapore</option>
          </select>
        </div>
        <div>
          <Label>Year</Label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value) || year)} className="mt-1 block w-24 rounded-md border bg-background px-3 py-1.5 text-sm" />
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Date</th>
              <th className="p-3">Weekday</th>
              <th className="p-3">Holiday</th>
            </tr>
          </thead>
          <tbody>
            {list.map((h) => {
              const d = new Date(h.date + "T00:00:00");
              return (
                <tr key={h.date} className="border-b last:border-0">
                  <td className="p-3 font-mono">{h.date}</td>
                  <td className="p-3 text-muted-foreground">{d.toLocaleDateString(undefined, { weekday: "long" })}</td>
                  <td className="p-3">{h.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Variable-date holidays (Eid al-Fitr, Chinese New Year, Easter, Thanksgiving, etc.) require a holiday API — not included here to keep this tool fully offline.
      </div>
    </ToolShell>
  );
}
