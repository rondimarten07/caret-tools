import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function randBytes(n: number): Uint8Array {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return a;
}

function toHex(b: Uint8Array): string {
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

function toB64Url(b: Uint8Array): string {
  let s = btoa(String.fromCharCode(...b));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const FORMATS = {
  "Stripe-style (sk_live_)": (b: Uint8Array) => `sk_live_${toB64Url(b).slice(0, 32)}`,
  "Stripe-test (sk_test_)": (b: Uint8Array) => `sk_test_${toB64Url(b).slice(0, 32)}`,
  "Publishable (pk_)": (b: Uint8Array) => `pk_live_${toB64Url(b).slice(0, 32)}`,
  "GitHub (ghp_)": (b: Uint8Array) => `ghp_${toB64Url(b).slice(0, 36)}`,
  "Bearer (random hex)": (b: Uint8Array) => toHex(b).slice(0, 40),
  "UUID v4": () => crypto.randomUUID(),
  "Base64 (URL-safe)": (b: Uint8Array) => toB64Url(b),
  "Hex (32 bytes)": (b: Uint8Array) => toHex(b),
} as const;

export default function ApiKeyFormat() {
  const [seed, setSeed] = useState(0);

  const samples = useMemo(() => {
    void seed;
    return Object.entries(FORMATS).map(([name, fn]) => ({ name, value: fn(randBytes(32)) }));
  }, [seed]);

  return (
    <ToolShell
      title="API Key Format"
      description="Cryptographically random API keys in common formats."
      category={categoryMap.generator}
      actions={<Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>Reroll all</Button>}
    >
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Format</th>
              <th className="p-3">Sample</th>
              <th className="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => (
              <tr key={s.name} className="border-b last:border-0">
                <td className="p-3">{s.name}</td>
                <td className="p-3 font-mono text-xs break-all">{s.value}</td>
                <td className="p-3"><CopyButton value={s.value} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        These are <em>random</em> values shaped to look like the named formats. They will not authenticate against any real service — generate via your provider's dashboard for production use.
      </div>
    </ToolShell>
  );
}
