import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

async function hmac(algo: Algo, key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: algo },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HmacGenerator() {
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!key || !message) {
        setOutput("");
        return;
      }
      try {
        const v = await hmac(algo, key, message);
        if (!cancelled) setOutput(v);
      } catch (err) {
        if (!cancelled) setOutput((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [algo, key, message]);

  return (
    <ToolShell
      title="HMAC Generator"
      description="Compute keyed-hash message authentication codes (HMAC)."
      category={categoryMap.programming}
      actions={<Button variant="ghost" size="sm" onClick={() => { setKey(""); setMessage(""); }}>Clear</Button>}
    >
      <Card className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Algorithm</Label>
          {ALGOS.map((a) => (
            <Button key={a} size="sm" variant={algo === a ? "default" : "outline"} onClick={() => setAlgo(a)}>
              {a}
            </Button>
          ))}
        </div>
        <div>
          <Label className="mb-1 block">Secret key</Label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="my-secret" />
        </div>
        <div>
          <Label className="mb-1 block">Message</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[140px]" />
        </div>
      </Card>

      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>HMAC</Label>
          <CopyButton value={output} label="HMAC copied" />
        </div>
        <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-xs">
          {output || <span className="text-muted-foreground">—</span>}
        </code>
      </Card>
    </ToolShell>
  );
}
