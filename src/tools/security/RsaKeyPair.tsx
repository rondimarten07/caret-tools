import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function pemEncode(label: string, b64: string) {
  const lines = b64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

async function generate(bits: 2048 | 3072 | 4096) {
  const pair = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  );
  const pub = await crypto.subtle.exportKey("spki", pair.publicKey);
  const priv = await crypto.subtle.exportKey("pkcs8", pair.privateKey);
  const toB64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  return {
    publicPem: pemEncode("PUBLIC KEY", toB64(pub)),
    privatePem: pemEncode("PRIVATE KEY", toB64(priv)),
  };
}

export default function RsaKeyPair() {
  const [bits, setBits] = useState<2048 | 3072 | 4096>(2048);
  const [busy, setBusy] = useState(false);
  const [pub, setPub] = useState("");
  const [priv, setPriv] = useState("");

  const run = async () => {
    setBusy(true);
    try {
      const { publicPem, privatePem } = await generate(bits);
      setPub(publicPem);
      setPriv(privatePem);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="RSA Key Pair" description="Generate an RSA public / private key pair locally." category={categoryMap.security}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {([2048, 3072, 4096] as const).map((b) => (
          <Button key={b} size="sm" variant={bits === b ? "default" : "outline"} onClick={() => setBits(b)}>{b}-bit</Button>
        ))}
        <Button onClick={run} disabled={busy} className="ml-auto">{busy ? "Generating…" : "Generate"}</Button>
      </Card>
      {(pub || priv) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between"><Label>Public key</Label><CopyButton value={pub} /></div>
            <Textarea readOnly value={pub} className="min-h-[260px] bg-muted/30 text-xs" />
          </Card>
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between"><Label>Private key</Label><CopyButton value={priv} /></div>
            <Textarea readOnly value={priv} className="min-h-[260px] bg-muted/30 text-xs" />
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
