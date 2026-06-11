import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function decodeBase64Url(s: string): string {
  let str = s.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return new TextDecoder().decode(Uint8Array.from(atob(str), (c) => c.charCodeAt(0)));
}

const STANDARD_CLAIMS: Record<string, { name: string; desc: string }> = {
  iss: { name: "Issuer", desc: "Who issued this token" },
  sub: { name: "Subject", desc: "Who the token is about (user ID)" },
  aud: { name: "Audience", desc: "Who the token is for" },
  exp: { name: "Expiration time", desc: "When the token stops being valid (Unix seconds)" },
  nbf: { name: "Not before", desc: "Token isn't valid before this time" },
  iat: { name: "Issued at", desc: "When the token was issued" },
  jti: { name: "JWT ID", desc: "Unique identifier for this token" },
};

function fmtTime(seconds: number): string {
  const d = new Date(seconds * 1000);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function JwtDebugger() {
  const [token, setToken] = useUrlState("jwt", "");

  const result = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "Token must have 3 dot-separated parts." };
    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>;
      const now = Math.floor(Date.now() / 1000);
      const exp = typeof payload.exp === "number" ? payload.exp : null;
      const nbf = typeof payload.nbf === "number" ? payload.nbf : null;
      const iat = typeof payload.iat === "number" ? payload.iat : null;
      const expired = exp !== null && exp < now;
      const notYet = nbf !== null && nbf > now;
      const ttl = exp !== null ? exp - now : null;
      return { header, payload, exp, nbf, iat, expired, notYet, ttl, now };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }, [token]);

  return (
    <ToolShell title="JWT Debugger" description="Rich JWT analysis — claims, expiry status, time skew, full payload." category={categoryMap.security} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Token</Label>
        <Textarea value={token} onChange={(e) => setToken(e.target.value)} className="min-h-[100px] font-mono text-xs" spellCheck={false} placeholder="Paste your JWT…" />
      </Card>

      {result && "error" in result && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
      )}

      {result && !("error" in result) && (
        <>
          {result.expired && (
            <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
              ⏰ Token expired {Math.abs(result.ttl ?? 0)}s ago
            </div>
          )}
          {result.notYet && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
              ⌛ Token not valid yet (nbf is in the future)
            </div>
          )}
          {result.exp !== null && !result.expired && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
              ✓ Valid for {Math.floor((result.ttl ?? 0) / 60)}m {(result.ttl ?? 0) % 60}s more
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="p-3">
              <Label>Header</Label>
              <pre className="mt-2 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{JSON.stringify(result.header, null, 2)}</pre>
            </Card>
            <Card className="p-3">
              <Label>Payload</Label>
              <pre className="mt-2 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{JSON.stringify(result.payload, null, 2)}</pre>
            </Card>
          </div>

          <Card className="p-3">
            <Label className="mb-2 block">Standard claims</Label>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(STANDARD_CLAIMS).map(([k, meta]) => {
                  const v = result.payload[k];
                  if (v === undefined) return null;
                  return (
                    <tr key={k} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-mono font-medium">{k}</td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">{meta.name}</td>
                      <td className="py-2 pr-3 font-mono text-xs">{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {["exp", "nbf", "iat"].includes(k) && typeof v === "number" && fmtTime(v)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </ToolShell>
  );
}
