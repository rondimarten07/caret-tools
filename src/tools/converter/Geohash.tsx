import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

function encode(lat: number, lng: number, precision: number): string {
  let minLat = -90, maxLat = 90;
  let minLng = -180, maxLng = 180;
  let bit = 0;
  let ch = 0;
  let even = true;
  let geo = "";
  while (geo.length < precision) {
    if (even) {
      const mid = (minLng + maxLng) / 2;
      if (lng >= mid) { ch = (ch << 1) | 1; minLng = mid; }
      else { ch = ch << 1; maxLng = mid; }
    } else {
      const mid = (minLat + maxLat) / 2;
      if (lat >= mid) { ch = (ch << 1) | 1; minLat = mid; }
      else { ch = ch << 1; maxLat = mid; }
    }
    even = !even;
    if (++bit === 5) { geo += BASE32[ch]; bit = 0; ch = 0; }
  }
  return geo;
}

function decode(hash: string): { lat: number; lng: number; latErr: number; lngErr: number } | null {
  let minLat = -90, maxLat = 90;
  let minLng = -180, maxLng = 180;
  let even = true;
  for (const c of hash.toLowerCase()) {
    const idx = BASE32.indexOf(c);
    if (idx < 0) return null;
    for (let i = 4; i >= 0; i--) {
      const bit = (idx >> i) & 1;
      if (even) {
        const mid = (minLng + maxLng) / 2;
        if (bit) minLng = mid; else maxLng = mid;
      } else {
        const mid = (minLat + maxLat) / 2;
        if (bit) minLat = mid; else maxLat = mid;
      }
      even = !even;
    }
  }
  return {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
    latErr: (maxLat - minLat) / 2,
    lngErr: (maxLng - minLng) / 2,
  };
}

export default function Geohash() {
  const [lat, setLat] = useUrlState("la", "-6.2088");
  const [lng, setLng] = useUrlState("lo", "106.8456");
  const [precision, setPrecision] = useUrlState("p", "9");
  const [hash, setHash] = useUrlState("h", "");

  const encoded = useMemo(() => {
    const a = Number(lat), b = Number(lng), p = Math.max(1, Math.min(12, Number(precision) || 9));
    if (!Number.isFinite(a) || !Number.isFinite(b)) return "";
    return encode(a, b, p);
  }, [lat, lng, precision]);

  const decoded = useMemo(() => hash.trim() ? decode(hash.trim()) : null, [hash]);

  return (
    <ToolShell title="Geohash" description="Encode lat/lng to a base-32 geohash and back." category={categoryMap.converter} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <div><Label>Latitude</Label><Input value={lat} onChange={(e) => setLat(e.target.value)} className="font-mono" /></div>
        <div><Label>Longitude</Label><Input value={lng} onChange={(e) => setLng(e.target.value)} className="font-mono" /></div>
        <div><Label>Precision (1–12)</Label><Input value={precision} onChange={(e) => setPrecision(e.target.value)} type="number" min={1} max={12} /></div>
      </Card>
      <Card className="flex items-center justify-between gap-2 p-4">
        <code className="font-mono text-lg">{encoded || "—"}</code>
        <CopyButton value={encoded} />
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Geohash → lat/lng</Label>
        <Input value={hash} onChange={(e) => setHash(e.target.value.toLowerCase())} placeholder="qqgu29tvg" className="font-mono" />
        {decoded ? (
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-md bg-muted/30 p-3"><dt className="text-xs text-muted-foreground">Latitude</dt><dd className="font-mono">{decoded.lat.toFixed(6)} ± {decoded.latErr.toExponential(2)}°</dd></div>
            <div className="rounded-md bg-muted/30 p-3"><dt className="text-xs text-muted-foreground">Longitude</dt><dd className="font-mono">{decoded.lng.toFixed(6)} ± {decoded.lngErr.toExponential(2)}°</dd></div>
          </dl>
        ) : hash.trim() ? <p className="text-sm text-destructive">Invalid geohash character.</p> : null}
      </Card>
    </ToolShell>
  );
}
