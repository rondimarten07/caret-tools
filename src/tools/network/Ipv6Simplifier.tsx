import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function expand(addr: string): string[] | null {
  const a = addr.trim();
  if (!a) return null;
  let head: string[] = [], tail: string[] = [];
  if (a.includes("::")) {
    const [l, r] = a.split("::");
    head = l ? l.split(":") : [];
    tail = r ? r.split(":") : [];
    const fill = 8 - head.length - tail.length;
    if (fill < 0) return null;
    return [...head, ...Array(fill).fill("0"), ...tail].map((g) => g.padStart(4, "0").toLowerCase());
  }
  const parts = a.split(":");
  if (parts.length !== 8) return null;
  return parts.map((g) => g.padStart(4, "0").toLowerCase());
}

function compress(groups: string[]): string {
  // RFC 5952: lowercase, no leading zeros, longest run of zeros (≥2) → ::, leftmost on tie.
  const norm = groups.map((g) => g.replace(/^0+/, "") || "0");
  let bestStart = -1, bestLen = 0;
  let curStart = -1, curLen = 0;
  for (let i = 0; i < norm.length; i++) {
    if (norm[i] === "0") {
      if (curStart === -1) curStart = i;
      curLen++;
      if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
    } else {
      curStart = -1; curLen = 0;
    }
  }
  if (bestLen < 2) return norm.join(":");
  const left = norm.slice(0, bestStart).join(":");
  const right = norm.slice(bestStart + bestLen).join(":");
  return `${left}::${right}` || "::";
}

export default function Ipv6Simplifier() {
  const [addr, setAddr] = useUrlState("a", "2001:0db8:0000:0000:0000:ff00:0042:8329");

  const data = useMemo(() => {
    const ex = expand(addr);
    if (!ex) return null;
    const exp = ex.join(":");
    const comp = compress(ex);
    return { exp, comp };
  }, [addr]);

  return (
    <ToolShell title="IPv6 Simplifier" description="Expand to full eight-group form or compress to RFC 5952 canonical." category={categoryMap.network} shareable>
      <Card className="space-y-3 p-4">
        <Label>IPv6 address</Label>
        <Input value={addr} onChange={(e) => setAddr(e.target.value)} className="font-mono" />
      </Card>
      {data ? (
        <>
          <Card className="space-y-3 p-4">
            <Label>Expanded</Label>
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
              <code className="break-all font-mono text-sm">{data.exp}</code>
              <CopyButton value={data.exp} />
            </div>
          </Card>
          <Card className="space-y-3 p-4">
            <Label>Compressed (canonical)</Label>
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
              <code className="break-all font-mono text-sm">{data.comp}</code>
              <CopyButton value={data.comp} />
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-4 text-sm text-destructive">Not a valid IPv6 address.</Card>
      )}
    </ToolShell>
  );
}
