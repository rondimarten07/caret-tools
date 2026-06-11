import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const R = 6371; // km

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export default function GeoDistance() {
  const [a1, setA1] = useUrlState("la1", "-6.2088");
  const [o1, setO1] = useUrlState("lo1", "106.8456");
  const [a2, setA2] = useUrlState("la2", "1.3521");
  const [o2, setO2] = useUrlState("lo2", "103.8198");

  const data = useMemo(() => {
    const A = Number(a1), B = Number(o1), C = Number(a2), D = Number(o2);
    if (![A, B, C, D].every(Number.isFinite)) return null;
    const km = haversine(A, B, C, D);
    return { km, miles: km * 0.621371, nautical: km * 0.539957, bearing: bearing(A, B, C, D) };
  }, [a1, o1, a2, o2]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 3 });

  return (
    <ToolShell title="Geo Distance" description="Great-circle distance between two coordinates (Haversine formula)." category={categoryMap.converter} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Point A latitude</Label><Input value={a1} onChange={(e) => setA1(e.target.value)} className="font-mono" /></div>
        <div><Label>Point A longitude</Label><Input value={o1} onChange={(e) => setO1(e.target.value)} className="font-mono" /></div>
        <div><Label>Point B latitude</Label><Input value={a2} onChange={(e) => setA2(e.target.value)} className="font-mono" /></div>
        <div><Label>Point B longitude</Label><Input value={o2} onChange={(e) => setO2(e.target.value)} className="font-mono" /></div>
      </Card>
      {data && (
        <Card className="grid gap-3 p-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-md bg-muted/30 p-3"><div><div className="text-xs text-muted-foreground">Kilometers</div><div className="font-mono text-lg">{fmt(data.km)} km</div></div><CopyButton value={String(data.km)} /></div>
          <div className="flex items-center justify-between rounded-md bg-muted/30 p-3"><div><div className="text-xs text-muted-foreground">Miles</div><div className="font-mono text-lg">{fmt(data.miles)} mi</div></div><CopyButton value={String(data.miles)} /></div>
          <div className="flex items-center justify-between rounded-md bg-muted/30 p-3"><div><div className="text-xs text-muted-foreground">Nautical miles</div><div className="font-mono text-lg">{fmt(data.nautical)} NM</div></div><CopyButton value={String(data.nautical)} /></div>
          <div className="flex items-center justify-between rounded-md bg-muted/30 p-3"><div><div className="text-xs text-muted-foreground">Initial bearing</div><div className="font-mono text-lg">{data.bearing.toFixed(2)}°</div></div><CopyButton value={String(data.bearing)} /></div>
        </Card>
      )}
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Uses Earth's mean radius (6371 km). Accurate to ~0.5% — for survey-grade precision use Vincenty's formulae instead.
      </div>
    </ToolShell>
  );
}
