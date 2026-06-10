import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { RefreshCw } from "lucide-react";

type Encoding = "hex" | "base64url" | "base64";

function bytesToHex(b: Uint8Array) {
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function bytesToB64(b: Uint8Array, url = false) {
  const s = btoa(String.fromCharCode(...b));
  return url ? s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : s;
}

export default function SecureToken() {
  const [bytes, setBytes] = useState(32);
  const [encoding, setEncoding] = useState<Encoding>("hex");
  const [token, setToken] = useState("");

  const regen = () => {
    const buf = crypto.getRandomValues(new Uint8Array(Math.max(1, Math.min(128, bytes))));
    setToken(
      encoding === "hex"
        ? bytesToHex(buf)
        : encoding === "base64url"
        ? bytesToB64(buf, true)
        : bytesToB64(buf)
    );
  };

  useEffect(() => {
    regen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bytes, encoding]);

  return (
    <ToolShell title="Secure Token" description="Cryptographically secure random tokens for CSRF, sessions, etc." category={categoryMap.security}>
      <Card className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-xs">Bytes</Label>
          <Input type="number" min={1} max={128} value={bytes} onChange={(e) => setBytes(Number(e.target.value) || 1)} className="w-24" />
          {(["hex", "base64url", "base64"] as Encoding[]).map((e) => (
            <Button key={e} size="sm" variant={encoding === e ? "default" : "outline"} onClick={() => setEncoding(e)}>{e}</Button>
          ))}
          <Button onClick={regen} variant="outline" size="icon" className="ml-auto"><RefreshCw className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-sm">{token}</code>
          <CopyButton value={token} />
        </div>
      </Card>
    </ToolShell>
  );
}
