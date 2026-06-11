import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function decToDms(dec: number, isLat: boolean): string {
  if (!Number.isFinite(dec)) return "";
  const abs = Math.abs(dec);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = (minFloat - min) * 60;
  const dir = dec >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
  return `${deg}°${min}'${sec.toFixed(3)}"${dir}`;
}

function dmsToDec(s: string): number | null {
  const m = s.match(/(\d+(?:\.\d+)?)°\s*(\d+(?:\.\d+)?)?'?\s*(\d+(?:\.\d+)?)?"?\s*([NSEW])?/i);
  if (!m) return null;
  const deg = parseFloat(m[1]) || 0;
  const min = parseFloat(m[2] || "0") || 0;
  const sec = parseFloat(m[3] || "0") || 0;
  const dir = (m[4] || "").toUpperCase();
  let v = deg + min / 60 + sec / 3600;
  if (dir === "S" || dir === "W") v = -v;
  return v;
}

export default function LatLngDms() {
  const [lat, setLat] = useUrlState("la", "-6.2088");
  const [lng, setLng] = useUrlState("lo", "106.8456");

  const dms = useMemo(() => {
    const la = parseFloat(lat);
    const lo = parseFloat(lng);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
    return { lat: decToDms(la, true), lng: decToDms(lo, false) };
  }, [lat, lng]);

  const [latDms, setLatDms] = useUrlState("lad", "");
  const [lngDms, setLngDms] = useUrlState("lod", "");

  const dec = useMemo(() => {
    const la = dmsToDec(latDms);
    const lo = dmsToDec(lngDms);
    return { lat: la, lng: lo };
  }, [latDms, lngDms]);

  return (
    <ToolShell title="Lat/Lng ↔ DMS" description="Convert between decimal degrees and degrees-minutes-seconds." category={categoryMap.converter} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Latitude (decimal)</Label>
          <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="-6.2088" className="font-mono" />
        </div>
        <div>
          <Label>Longitude (decimal)</Label>
          <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="106.8456" className="font-mono" />
        </div>
        {dms && (
          <>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <span className="font-mono text-sm">{dms.lat}</span>
              <CopyButton value={dms.lat} />
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <span className="font-mono text-sm">{dms.lng}</span>
              <CopyButton value={dms.lng} />
            </div>
          </>
        )}
      </Card>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Latitude (DMS)</Label>
          <Input value={latDms} onChange={(e) => setLatDms(e.target.value)} placeholder={`6°12'31.7"S`} className="font-mono" />
        </div>
        <div>
          <Label>Longitude (DMS)</Label>
          <Input value={lngDms} onChange={(e) => setLngDms(e.target.value)} placeholder={`106°50'44.2"E`} className="font-mono" />
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
          <span className="font-mono text-sm">{dec.lat === null ? "—" : dec.lat.toFixed(6)}</span>
          {dec.lat !== null && <CopyButton value={dec.lat.toFixed(6)} />}
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
          <span className="font-mono text-sm">{dec.lng === null ? "—" : dec.lng.toFixed(6)}</span>
          {dec.lng !== null && <CopyButton value={dec.lng.toFixed(6)} />}
        </div>
      </Card>
    </ToolShell>
  );
}
