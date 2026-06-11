import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const HEADERS: { name: string; type: "req" | "res" | "both"; desc: string; example: string }[] = [
  { name: "Accept", type: "req", desc: "Media types the client can process.", example: "Accept: application/json" },
  { name: "Accept-Encoding", type: "req", desc: "Compression algorithms the client supports.", example: "Accept-Encoding: gzip, br" },
  { name: "Accept-Language", type: "req", desc: "Preferred natural languages.", example: "Accept-Language: en-US,en;q=0.9" },
  { name: "Authorization", type: "req", desc: "Authentication credentials.", example: "Authorization: Bearer eyJ..." },
  { name: "Cache-Control", type: "both", desc: "Caching directives.", example: "Cache-Control: max-age=3600, public" },
  { name: "Content-Type", type: "both", desc: "Media type of the body.", example: "Content-Type: application/json; charset=utf-8" },
  { name: "Content-Length", type: "both", desc: "Body size in octets.", example: "Content-Length: 348" },
  { name: "Cookie", type: "req", desc: "Stored cookies for this origin.", example: "Cookie: sid=abc; lang=en" },
  { name: "Host", type: "req", desc: "Target host (required in HTTP/1.1).", example: "Host: caret.app" },
  { name: "If-None-Match", type: "req", desc: "Conditional request — return 304 if ETag matches.", example: 'If-None-Match: "abc123"' },
  { name: "Origin", type: "req", desc: "Origin of the request (CORS).", example: "Origin: https://example.com" },
  { name: "Referer", type: "req", desc: "URL of the previous page.", example: "Referer: https://google.com/" },
  { name: "User-Agent", type: "req", desc: "Client app identifier.", example: "User-Agent: Mozilla/5.0…" },
  { name: "X-Forwarded-For", type: "req", desc: "Original client IP through a proxy.", example: "X-Forwarded-For: 203.0.113.5" },
  { name: "Access-Control-Allow-Origin", type: "res", desc: "Which origins may use this resource (CORS).", example: "Access-Control-Allow-Origin: *" },
  { name: "Access-Control-Allow-Methods", type: "res", desc: "Methods allowed on this endpoint.", example: "Access-Control-Allow-Methods: GET, POST" },
  { name: "Content-Security-Policy", type: "res", desc: "Restrict where resources can load from.", example: "Content-Security-Policy: default-src 'self'" },
  { name: "ETag", type: "res", desc: "Identifier for a specific resource version.", example: 'ETag: "abc123"' },
  { name: "Last-Modified", type: "res", desc: "When the resource last changed.", example: "Last-Modified: Tue, 10 Jun 2026 12:00:00 GMT" },
  { name: "Location", type: "res", desc: "Redirect target.", example: "Location: /login" },
  { name: "Set-Cookie", type: "res", desc: "Server sets a cookie.", example: "Set-Cookie: sid=abc; HttpOnly; Path=/" },
  { name: "Strict-Transport-Security", type: "res", desc: "Force HTTPS for future requests.", example: "Strict-Transport-Security: max-age=31536000" },
  { name: "WWW-Authenticate", type: "res", desc: "Auth scheme required (401 responses).", example: "WWW-Authenticate: Bearer" },
  { name: "X-Content-Type-Options", type: "res", desc: "Prevent MIME-type sniffing.", example: "X-Content-Type-Options: nosniff" },
  { name: "X-Frame-Options", type: "res", desc: "Allow embedding in <iframe>?", example: "X-Frame-Options: DENY" },
];

export default function HttpHeaders() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return HEADERS;
    return HEADERS.filter((h) => h.name.toLowerCase().includes(s) || h.desc.toLowerCase().includes(s));
  }, [q]);

  return (
    <ToolShell title="HTTP Headers Reference" description="Common HTTP request and response headers with examples." category={categoryMap.network}>
      <Input placeholder="Search header name or description…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {filtered.map((h) => (
          <Card key={h.name} className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <code className="font-mono text-sm font-semibold">{h.name}</code>
                <span className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">{h.type === "both" ? "req/res" : h.type}</span>
              </div>
              <CopyButton value={h.example} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{h.desc}</p>
            <code className="mt-2 block break-all rounded bg-muted/30 p-2 font-mono text-[11px]">{h.example}</code>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
