import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function ipToInt(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let out = 0;
  for (const p of parts) {
    const n = parseInt(p, 10);
    if (!Number.isInteger(n) || n < 0 || n > 255 || String(n) !== p.trim()) return null;
    out = out * 256 + n;
  }
  return out;
}

function intToIp(n: number): string {
  if (!Number.isFinite(n) || n < 0 || n > 4294967295) return "";
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export default function IpToInt() {
  const [ip, setIp] = useUrlState("ip", "192.168.1.1");
  const [num, setNum] = useUrlState("n", "");

  const intOut = useMemo(() => {
    const v = ipToInt(ip);
    return v === null ? "" : String(v);
  }, [ip]);

  const ipOut = useMemo(() => intToIp(Number(num)), [num]);
  const hexOut = useMemo(() => {
    const v = ipToInt(ip);
    return v === null ? "" : "0x" + v.toString(16).toUpperCase().padStart(8, "0");
  }, [ip]);

  return (
    <ToolShell title="IP ↔ Integer" description="Convert IPv4 addresses to their 32-bit integer representation and back." category={categoryMap.converter} shareable>
      <Card className="space-y-3 p-4">
        <Label>IPv4 address</Label>
        <Input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.1" className="font-mono" />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
            <div className="text-sm">
              <div className="text-xs text-muted-foreground">Decimal</div>
              <div className="font-mono">{intOut || "—"}</div>
            </div>
            <CopyButton value={intOut} />
          </div>
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
            <div className="text-sm">
              <div className="text-xs text-muted-foreground">Hex</div>
              <div className="font-mono">{hexOut || "—"}</div>
            </div>
            <CopyButton value={hexOut} />
          </div>
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Integer (0 – 4 294 967 295)</Label>
        <Input value={num} onChange={(e) => setNum(e.target.value)} placeholder="3232235777" className="font-mono" />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="font-mono">{ipOut || <span className="text-muted-foreground">—</span>}</p>
          <CopyButton value={ipOut} />
        </div>
      </Card>
    </ToolShell>
  );
}
