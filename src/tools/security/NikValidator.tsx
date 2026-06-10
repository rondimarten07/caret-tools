import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

/**
 * Indonesian NIK (KTP) format: 16 digits
 *   pp kk cc DDMMYY ssss
 *   - pp: province code (2 digits)
 *   - kk: regency/city code (2 digits)
 *   - cc: district code (2 digits)
 *   - DD: day (+40 if female)
 *   - MM: month
 *   - YY: birth year (2 digits)
 *   - ssss: serial number
 */

const PROVINCES: Record<string, string> = {
  "11": "Aceh", "12": "Sumatera Utara", "13": "Sumatera Barat", "14": "Riau",
  "15": "Jambi", "16": "Sumatera Selatan", "17": "Bengkulu", "18": "Lampung",
  "19": "Kepulauan Bangka Belitung", "21": "Kepulauan Riau",
  "31": "DKI Jakarta", "32": "Jawa Barat", "33": "Jawa Tengah", "34": "DI Yogyakarta",
  "35": "Jawa Timur", "36": "Banten", "51": "Bali", "52": "Nusa Tenggara Barat",
  "53": "Nusa Tenggara Timur", "61": "Kalimantan Barat", "62": "Kalimantan Tengah",
  "63": "Kalimantan Selatan", "64": "Kalimantan Timur", "65": "Kalimantan Utara",
  "71": "Sulawesi Utara", "72": "Sulawesi Tengah", "73": "Sulawesi Selatan",
  "74": "Sulawesi Tenggara", "75": "Gorontalo", "76": "Sulawesi Barat",
  "81": "Maluku", "82": "Maluku Utara", "91": "Papua Barat", "94": "Papua",
};

export default function NikValidator() {
  const [nik, setNik] = useUrlState("nik", "3201234505900001");

  const result = useMemo(() => {
    const clean = nik.replace(/\D/g, "");
    if (clean.length !== 16) return { ok: false as const, error: `Length is ${clean.length}, must be 16.` };
    const province = clean.slice(0, 2);
    const regency = clean.slice(2, 4);
    const district = clean.slice(4, 6);
    let day = parseInt(clean.slice(6, 8), 10);
    const month = parseInt(clean.slice(8, 10), 10);
    const yy = parseInt(clean.slice(10, 12), 10);
    const serial = clean.slice(12);
    const sex = day > 40 ? "Female" : "Male";
    if (day > 40) day -= 40;
    if (!PROVINCES[province]) return { ok: false as const, error: `Unknown province code ${province}.` };
    if (day < 1 || day > 31) return { ok: false as const, error: `Invalid day ${day}.` };
    if (month < 1 || month > 12) return { ok: false as const, error: `Invalid month ${month}.` };
    const currentYY = new Date().getFullYear() % 100;
    const year = yy <= currentYY ? 2000 + yy : 1900 + yy;
    return {
      ok: true as const,
      province: PROVINCES[province],
      provinceCode: province,
      regencyCode: regency,
      districtCode: district,
      day,
      month,
      year,
      sex,
      serial,
      dob: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
    };
  }, [nik]);

  return (
    <ToolShell title="NIK / KTP Validator" description="Validate Indonesian KTP (NIK) numbers — region, date of birth, gender." category={categoryMap.security}
      shareable>
      <Card className="p-3">
        <Label className="mb-1 block">NIK (16 digits)</Label>
        <Input value={nik} onChange={(e) => setNik(e.target.value)} className="font-mono text-lg" maxLength={16} />
      </Card>
      {result.ok ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="p-4 bg-emerald-500/10">
            <div className="text-xs uppercase text-muted-foreground">Status</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-600">✓ Valid format</div>
          </Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Province</div><div className="mt-1 text-lg font-semibold">{result.province}</div><div className="text-xs text-muted-foreground">Code {result.provinceCode}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Date of birth</div><div className="mt-1 text-lg font-semibold">{result.dob}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Sex</div><div className="mt-1 text-lg font-semibold">{result.sex}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Regency code</div><div className="mt-1 font-mono text-lg">{result.regencyCode}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">District code</div><div className="mt-1 font-mono text-lg">{result.districtCode}</div></Card>
          <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Serial</div><div className="mt-1 font-mono text-lg">{result.serial}</div></Card>
        </div>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
      )}
    </ToolShell>
  );
}
