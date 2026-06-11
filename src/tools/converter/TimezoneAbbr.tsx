import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const TZ: { abbr: string; offset: string; name: string; region: string }[] = [
  { abbr: "UTC", offset: "+00:00", name: "Coordinated Universal Time", region: "Reference" },
  { abbr: "GMT", offset: "+00:00", name: "Greenwich Mean Time", region: "UK winter" },
  { abbr: "BST", offset: "+01:00", name: "British Summer Time", region: "UK summer" },
  { abbr: "CET", offset: "+01:00", name: "Central European Time", region: "Berlin, Paris" },
  { abbr: "CEST", offset: "+02:00", name: "Central European Summer Time", region: "DST in CET region" },
  { abbr: "EET", offset: "+02:00", name: "Eastern European Time", region: "Athens, Helsinki" },
  { abbr: "EEST", offset: "+03:00", name: "Eastern European Summer Time", region: "DST in EET region" },
  { abbr: "MSK", offset: "+03:00", name: "Moscow Standard Time", region: "Russia (no DST)" },
  { abbr: "GST", offset: "+04:00", name: "Gulf Standard Time", region: "UAE, Oman" },
  { abbr: "IST", offset: "+05:30", name: "Indian Standard Time", region: "India" },
  { abbr: "WIB", offset: "+07:00", name: "Waktu Indonesia Barat", region: "Jakarta, Bandung" },
  { abbr: "ICT", offset: "+07:00", name: "Indochina Time", region: "Bangkok, Hanoi" },
  { abbr: "WITA", offset: "+08:00", name: "Waktu Indonesia Tengah", region: "Bali, Makassar" },
  { abbr: "CST", offset: "+08:00", name: "China Standard Time", region: "Beijing, Shanghai" },
  { abbr: "HKT", offset: "+08:00", name: "Hong Kong Time", region: "Hong Kong" },
  { abbr: "SGT", offset: "+08:00", name: "Singapore Time", region: "Singapore" },
  { abbr: "AWST", offset: "+08:00", name: "Australian Western", region: "Perth" },
  { abbr: "WIT", offset: "+09:00", name: "Waktu Indonesia Timur", region: "Jayapura" },
  { abbr: "JST", offset: "+09:00", name: "Japan Standard Time", region: "Tokyo" },
  { abbr: "KST", offset: "+09:00", name: "Korea Standard Time", region: "Seoul" },
  { abbr: "ACST", offset: "+09:30", name: "Australian Central", region: "Adelaide" },
  { abbr: "AEST", offset: "+10:00", name: "Australian Eastern", region: "Sydney" },
  { abbr: "AEDT", offset: "+11:00", name: "Australian Eastern Daylight", region: "Sydney summer" },
  { abbr: "NZST", offset: "+12:00", name: "New Zealand Standard", region: "Auckland" },
  { abbr: "NZDT", offset: "+13:00", name: "New Zealand Daylight", region: "Auckland summer" },
  { abbr: "HST", offset: "-10:00", name: "Hawaii Standard Time", region: "Honolulu (no DST)" },
  { abbr: "AKST", offset: "-09:00", name: "Alaska Standard Time", region: "Anchorage" },
  { abbr: "AKDT", offset: "-08:00", name: "Alaska Daylight Time", region: "Anchorage summer" },
  { abbr: "PST", offset: "-08:00", name: "Pacific Standard Time", region: "Los Angeles" },
  { abbr: "PDT", offset: "-07:00", name: "Pacific Daylight Time", region: "Los Angeles summer" },
  { abbr: "MST", offset: "-07:00", name: "Mountain Standard Time", region: "Denver" },
  { abbr: "MDT", offset: "-06:00", name: "Mountain Daylight Time", region: "Denver summer" },
  { abbr: "CST (US)", offset: "-06:00", name: "Central Standard Time", region: "Chicago — collides with China Standard" },
  { abbr: "CDT", offset: "-05:00", name: "Central Daylight Time", region: "Chicago summer" },
  { abbr: "EST", offset: "-05:00", name: "Eastern Standard Time", region: "New York" },
  { abbr: "EDT", offset: "-04:00", name: "Eastern Daylight Time", region: "New York summer" },
  { abbr: "ART", offset: "-03:00", name: "Argentina Time", region: "Buenos Aires" },
  { abbr: "BRT", offset: "-03:00", name: "Brasilia Time", region: "São Paulo" },
];

export default function TimezoneAbbr() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TZ;
    return TZ.filter((t) => t.abbr.toLowerCase().includes(s) || t.name.toLowerCase().includes(s) || t.region.toLowerCase().includes(s) || t.offset.includes(s));
  }, [q]);

  return (
    <ToolShell title="Timezone Abbreviations" description="Common timezone codes — search by abbreviation, city or offset." category={categoryMap.converter}>
      <Card className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search PST, Jakarta, +07..." />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Abbr</th>
              <th className="p-3">Offset</th>
              <th className="p-3">Name</th>
              <th className="p-3">Region</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.abbr + t.offset} className="border-b last:border-0">
                <td className="p-3 font-mono">{t.abbr}</td>
                <td className="p-3 font-mono text-muted-foreground">{t.offset}</td>
                <td className="p-3">{t.name}</td>
                <td className="p-3 text-muted-foreground">{t.region}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No match.</td></tr>}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        ⚠ Many abbreviations clash (e.g. CST = both Central Standard Time in US <em>and</em> China Standard Time). For unambiguous storage, always use IANA names (<code className="font-mono">America/Chicago</code>) or UTC offsets.
      </div>
    </ToolShell>
  );
}
