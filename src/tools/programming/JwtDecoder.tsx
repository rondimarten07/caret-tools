import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function base64UrlDecode(seg: string): string {
  let s = seg.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  return new TextDecoder().decode(
    Uint8Array.from(bin, (c) => c.charCodeAt(0))
  );
}

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtDecoder() {
  const [token, setToken] = useUrlState("jwt", "");

  const parsed = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "Token must have 3 dot-separated parts." };
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2] ?? "";
      const expired =
        typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
      return { header, payload, signature, expired };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }, [token]);

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode a JSON Web Token to inspect its header & payload. Verification is not performed."
      category={categoryMap.programming}
      shareable
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setToken(SAMPLE)}>
            Load sample
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setToken("")}>
            Clear
          </Button>
        </>
      }
    >
      <Card className="p-3">
        <Label className="mb-2 block">Token</Label>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT here…"
          className="min-h-[120px]"
          spellCheck={false}
        />
      </Card>

      {parsed && "error" in parsed && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
          {parsed.error}
        </div>
      )}

      {parsed && !("error" in parsed) && (
        <>
          {parsed.expired && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
              ⚠️ Token has expired (<code>exp</code> is in the past).
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label>Header</Label>
                <CopyButton value={JSON.stringify(parsed.header, null, 2)} />
              </div>
              <pre className="min-h-[200px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">
                {JSON.stringify(parsed.header, null, 2)}
              </pre>
            </Card>
            <Card className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label>Payload</Label>
                <CopyButton value={JSON.stringify(parsed.payload, null, 2)} />
              </div>
              <pre className="min-h-[200px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">
                {JSON.stringify(parsed.payload, null, 2)}
              </pre>
            </Card>
          </div>
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label>Signature (opaque)</Label>
              <CopyButton value={parsed.signature} />
            </div>
            <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-xs">
              {parsed.signature || "(empty)"}
            </code>
          </Card>
        </>
      )}
    </ToolShell>
  );
}
