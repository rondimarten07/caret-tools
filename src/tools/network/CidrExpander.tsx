import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const MAX_LIST = 4096;

function ipToInt(ip: string): number | null {
  const m = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  const [, a, b, c, d] = m.map(Number);
  if ([a, b, c, d].some((n) => n < 0 || n > 255)) return null;
  return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export default function CidrExpander() {
  const [input, setInput] = useUrlState("cidr", "192.168.1.0/29");

  const result = useMemo(() => {
    const m = input.trim().match(/^([\d.]+)\/(\d+)$/);
    if (!m) return { ok: false as const, error: "Invalid CIDR — expected x.x.x.x/n" };
    const base = ipToInt(m[1]);
    const prefix = Number(m[2]);
    if (base === null) return { ok: false as const, error: "Invalid IPv4 address." };
    if (prefix < 0 || prefix > 32) return { ok: false as const, error: "Prefix must be 0-32." };
    const count = 2 ** (32 - prefix);
    const limit = Math.min(count, MAX_LIST);
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (base & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const list: string[] = [];
    for (let i = 0; i < limit; i++) list.push(intToIp(network + i));
    return {
      ok: true as const,
      count, limit,
      truncated: count > MAX_LIST,
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      list,
    };
  }, [input]);

  return (
    <ToolShell title="CIDR Range Expander" description={`List every IP in a CIDR block — capped at ${MAX_LIST} addresses for performance.`} category={categoryMap.network} shareable>
      <Card className="p-3">
        <Label className="mb-1 block">CIDR</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
      </Card>
      {result.ok ? (
        <>
          <Card className="grid grid-cols-3 gap-3 p-3 text-center">
            <div><div className="text-xs text-muted-foreground">Network</div><div className="font-mono">{result.network}</div></div>
            <div><div className="text-xs text-muted-foreground">Broadcast</div><div className="font-mono">{result.broadcast}</div></div>
            <div><div className="text-xs text-muted-foreground">Count</div><div className="font-mono">{result.count.toLocaleString()}</div></div>
          </Card>
          {result.truncated && <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">Showing first {MAX_LIST} of {result.count.toLocaleString()} addresses.</div>}
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label>IPs</Label>
              <CopyButton value={result.list.join("\n")} />
            </div>
            <Textarea readOnly value={result.list.join("\n")} className="min-h-[280px] bg-muted/30 font-mono text-xs" />
          </Card>
        </>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
      )}
    </ToolShell>
  );
}
