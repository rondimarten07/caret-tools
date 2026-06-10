import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function parse(cidr: string) {
  const m = cidr.trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
  if (!m) return null;
  const [, a, b, c, d, p] = m;
  const oct = [a, b, c, d].map(Number);
  const prefix = Number(p);
  if (oct.some((n) => n < 0 || n > 255) || prefix < 0 || prefix > 32) return null;
  const ip = ((oct[0] << 24) | (oct[1] << 16) | (oct[2] << 8) | oct[3]) >>> 0;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hosts = prefix >= 31 ? 0 : 2 ** (32 - prefix) - 2;
  return { ip, prefix, mask, network, broadcast, hosts };
}

function toDotted(n: number) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export default function Ipv4Subnet() {
  const [input, setInput] = useUrlState("cidr", "192.168.1.10/24");
  const data = useMemo(() => parse(input), [input]);

  return (
    <ToolShell title="IPv4 Subnet Calculator" description="Network, broadcast, mask and usable hosts from a CIDR block." category={categoryMap.network}
      shareable>
      <Card className="p-3">
        <Label className="mb-1 block">CIDR</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
      </Card>
      {data ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["IP", toDotted(data.ip)],
            ["Prefix", "/" + data.prefix],
            ["Subnet mask", toDotted(data.mask)],
            ["Network", toDotted(data.network)],
            ["Broadcast", toDotted(data.broadcast)],
            ["First host", data.hosts > 0 ? toDotted(data.network + 1) : "—"],
            ["Last host", data.hosts > 0 ? toDotted(data.broadcast - 1) : "—"],
            ["Usable hosts", data.hosts.toLocaleString()],
          ].map(([k, v]) => (
            <Card key={k} className="flex items-center justify-between p-3">
              <span className="text-xs text-muted-foreground">{k}</span>
              <code className="font-mono">{v}</code>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">Invalid CIDR (use a.b.c.d/n)</div>
      )}
    </ToolShell>
  );
}
