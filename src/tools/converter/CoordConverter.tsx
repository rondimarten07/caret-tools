import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function decimalToDMS(dec: number, isLat: boolean): string {
  const dir = dec >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
  const abs = Math.abs(dec);
  const d = Math.floor(abs);
  const minFloat = (abs - d) * 60;
  const m = Math.floor(minFloat);
  const s = (minFloat - m) * 60;
  return `${d}°${m}'${s.toFixed(2)}"${dir}`;
}

function dmsToDecimal(input: string): number | null {
  const m = input.trim().match(/^(\d+(?:\.\d+)?)°?\s*(\d+(?:\.\d+)?)?'?\s*(\d+(?:\.\d+)?)?"?\s*([NSEWnsew])?$/);
  if (!m) return null;
  const d = parseFloat(m[1]);
  const mm = m[2] ? parseFloat(m[2]) : 0;
  const ss = m[3] ? parseFloat(m[3]) : 0;
  const dir = (m[4] ?? "").toUpperCase();
  let val = d + mm / 60 + ss / 3600;
  if (dir === "S" || dir === "W") val = -val;
  return val;
}

export default function CoordConverter() {
  const [lat, setLat] = useState("-6.2088");
  const [lon, setLon] = useState("106.8456");
  const [dmsLat, setDmsLat] = useState("6°12'31.68\"S");
  const [dmsLon, setDmsLon] = useState("106°50'44.16\"E");

  const fromDecimal = useMemo(() => {
    const la = parseFloat(lat);
    const lo = parseFloat(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
    return { lat: decimalToDMS(la, true), lon: decimalToDMS(lo, false), gmaps: `${la}, ${lo}` };
  }, [lat, lon]);

  const fromDms = useMemo(() => {
    const la = dmsToDecimal(dmsLat);
    const lo = dmsToDecimal(dmsLon);
    if (la === null || lo === null) return null;
    return { lat: la.toFixed(6), lon: lo.toFixed(6) };
  }, [dmsLat, dmsLon]);

  return (
    <ToolShell title="Coordinates (DMS ↔ Decimal)" description="Convert latitude / longitude between decimal degrees and degrees-minutes-seconds." category={categoryMap.converter}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="space-y-3 p-3">
          <Label>Decimal degrees</Label>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Latitude</Label><Input value={lat} onChange={(e) => setLat(e.target.value)} className="font-mono" /></div>
            <div><Label className="text-xs">Longitude</Label><Input value={lon} onChange={(e) => setLon(e.target.value)} className="font-mono" /></div>
          </div>
          {fromDecimal && (
            <>
              <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-2">
                <code className="font-mono text-xs">{fromDecimal.lat} {fromDecimal.lon}</code>
                <CopyButton value={`${fromDecimal.lat} ${fromDecimal.lon}`} />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-2">
                <code className="font-mono text-xs">Google Maps: {fromDecimal.gmaps}</code>
                <CopyButton value={fromDecimal.gmaps} />
              </div>
            </>
          )}
        </Card>
        <Card className="space-y-3 p-3">
          <Label>DMS (degrees / minutes / seconds)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Latitude</Label><Input value={dmsLat} onChange={(e) => setDmsLat(e.target.value)} className="font-mono" /></div>
            <div><Label className="text-xs">Longitude</Label><Input value={dmsLon} onChange={(e) => setDmsLon(e.target.value)} className="font-mono" /></div>
          </div>
          {fromDms && (
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-2">
              <code className="font-mono text-xs">{fromDms.lat}, {fromDms.lon}</code>
              <CopyButton value={`${fromDms.lat}, ${fromDms.lon}`} />
            </div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
