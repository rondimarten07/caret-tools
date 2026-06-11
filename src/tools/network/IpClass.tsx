import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function classify(ip: string) {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => parseInt(p, 10));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  const [a, b] = nums;

  let cls: "A" | "B" | "C" | "D" | "E";
  let range = "";
  let defaultMask = "";
  if (a < 128) { cls = "A"; range = "0.0.0.0 – 127.255.255.255"; defaultMask = "/8 (255.0.0.0)"; }
  else if (a < 192) { cls = "B"; range = "128.0.0.0 – 191.255.255.255"; defaultMask = "/16 (255.255.0.0)"; }
  else if (a < 224) { cls = "C"; range = "192.0.0.0 – 223.255.255.255"; defaultMask = "/24 (255.255.255.0)"; }
  else if (a < 240) { cls = "D"; range = "224.0.0.0 – 239.255.255.255"; defaultMask = "multicast (no mask)"; }
  else { cls = "E"; range = "240.0.0.0 – 255.255.255.255"; defaultMask = "reserved"; }

  const flags: string[] = [];
  if (a === 10) flags.push("Private (RFC 1918) 10.0.0.0/8");
  if (a === 172 && b >= 16 && b <= 31) flags.push("Private (RFC 1918) 172.16.0.0/12");
  if (a === 192 && b === 168) flags.push("Private (RFC 1918) 192.168.0.0/16");
  if (a === 127) flags.push("Loopback 127.0.0.0/8");
  if (a === 169 && b === 254) flags.push("Link-local 169.254.0.0/16");
  if (a === 0) flags.push('"This network" 0.0.0.0/8');
  if (a === 100 && b >= 64 && b <= 127) flags.push("Carrier-grade NAT 100.64.0.0/10");
  if (cls === "D") flags.push("Multicast");
  if (cls === "E") flags.push("Reserved (experimental)");
  if (ip === "255.255.255.255") flags.push("Limited broadcast");

  return { cls, range, defaultMask, flags };
}

export default function IpClass() {
  const [ip, setIp] = useUrlState("ip", "192.168.1.10");
  const info = useMemo(() => classify(ip), [ip]);

  return (
    <ToolShell title="IPv4 Class Identifier" description="Classify any IPv4 address (A/B/C/D/E) and flag private / loopback / multicast." category={categoryMap.network} shareable>
      <Card className="space-y-3 p-4">
        <Label>IPv4 address</Label>
        <Input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" className="font-mono" />
      </Card>
      {info ? (
        <Card className="p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Class</dt><dd className="font-mono text-lg">{info.cls}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Range</dt><dd className="font-mono">{info.range}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Default mask</dt><dd className="font-mono">{info.defaultMask}</dd></div>
            <div className="pt-2">
              <dt className="text-xs text-muted-foreground">Flags</dt>
              {info.flags.length === 0 ? (
                <dd className="mt-1 text-sm text-muted-foreground">— Public, classless routing applies in modern networks (CIDR).</dd>
              ) : (
                <dd className="mt-1 flex flex-wrap gap-2">
                  {info.flags.map((f) => (
                    <span key={f} className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">{f}</span>
                  ))}
                </dd>
              )}
            </div>
          </dl>
        </Card>
      ) : (
        <Card className="p-4 text-sm text-destructive">Not a valid IPv4 address.</Card>
      )}
    </ToolShell>
  );
}
