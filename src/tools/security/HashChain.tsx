import { useEffect, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashChain() {
  const [seed, setSeed] = useUrlState("s", "hello");
  const [n, setN] = useUrlState("n", "5");
  const [chain, setChain] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const count = Math.max(1, Math.min(200, Number(n) || 1));
    setBusy(true);
    (async () => {
      const out: string[] = [];
      let cur = seed;
      for (let i = 0; i < count; i++) {
        cur = await sha256Hex(cur);
        if (cancelled) return;
        out.push(cur);
      }
      setChain(out);
      setBusy(false);
    })();
    return () => { cancelled = true; };
  }, [seed, n]);

  return (
    <ToolShell title="Hash Chain" description="Apply SHA-256 N times to a seed value. Used in Lamport one-time signatures, S/Key, key stretching." category={categoryMap.security} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Seed</Label>
          <Input value={seed} onChange={(e) => setSeed(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label>Iterations (1–200)</Label>
          <Input type="number" min={1} max={200} value={n} onChange={(e) => setN(e.target.value)} className="font-mono" />
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="w-12 p-3">#</th>
              <th className="p-3">SHA-256</th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {busy && chain.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">Computing…</td></tr>
            ) : chain.map((h, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-3 font-mono text-muted-foreground">{i + 1}</td>
                <td className="p-3 font-mono text-xs break-all">{h}</td>
                <td className="p-3"><CopyButton value={h} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        A hash chain is one-way: knowing iteration N can't reveal iteration N−1. This property powers S/Key one-time passwords and stretched key-derivation functions.
      </div>
    </ToolShell>
  );
}
