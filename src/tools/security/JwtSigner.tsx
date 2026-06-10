import { useEffect, useState } from "react";
import { SignJWT } from "jose";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categoryMap } from "@/data/categories";

type Algo = "HS256" | "HS384" | "HS512";

export default function JwtSigner() {
  const [payload, setPayload] = useState(JSON.stringify({ sub: "1234567890", name: "Jane Doe", iat: Math.floor(Date.now() / 1000) }, null, 2));
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [algo, setAlgo] = useState<Algo>("HS256");
  const [jwt, setJwt] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      setErr("");
      try {
        const body = JSON.parse(payload);
        const key = new TextEncoder().encode(secret);
        const token = await new SignJWT(body).setProtectedHeader({ alg: algo, typ: "JWT" }).sign(key);
        if (!cancel) setJwt(token);
      } catch (e) {
        if (!cancel) {
          setJwt("");
          setErr((e as Error).message);
        }
      }
    })();
    return () => {
      cancel = true;
    };
  }, [payload, secret, algo]);

  return (
    <ToolShell title="JWT Signer" description="Build and sign a JWT with HS256 / HS384 / HS512." category={categoryMap.security}
      shareable>
      <Card className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Algorithm</Label>
          {(["HS256", "HS384", "HS512"] as Algo[]).map((a) => (
            <Button key={a} size="sm" variant={algo === a ? "default" : "outline"} onClick={() => setAlgo(a)}>{a}</Button>
          ))}
        </div>
        <div>
          <Label className="text-xs">Secret</Label>
          <Input value={secret} onChange={(e) => setSecret(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label className="text-xs">Payload (JSON)</Label>
          <Textarea value={payload} onChange={(e) => setPayload(e.target.value)} className="min-h-[200px] font-mono text-xs" spellCheck={false} />
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>{err ? "Error" : "Signed JWT"}</Label>
          {!err && <CopyButton value={jwt} />}
        </div>
        {err ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{err}</div>
        ) : (
          <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{jwt || <span className="text-muted-foreground">—</span>}</code>
        )}
      </Card>
    </ToolShell>
  );
}
