import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

function shellQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

export default function CurlBuilder() {
  const [url, setUrl] = useUrlState("u", "https://api.example.com/users");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useUrlState("h", "Content-Type: application/json\nAccept: application/json");
  const [body, setBody] = useUrlState("b", `{\n  "name": "Alex"\n}`);
  const [bearer, setBearer] = useUrlState("a", "");

  const cmd = useMemo(() => {
    const parts: string[] = ["curl"];
    if (method !== "GET") parts.push("-X", method);
    parts.push(shellQuote(url));
    headers.split("\n").map((l) => l.trim()).filter(Boolean).forEach((h) => parts.push("-H", shellQuote(h)));
    if (bearer.trim()) parts.push("-H", shellQuote(`Authorization: Bearer ${bearer.trim()}`));
    if (body.trim() && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      parts.push("--data-raw", shellQuote(body));
    }
    return parts.join(" ").replace(/'(\S+)' /g, "$1 ");
  }, [url, method, headers, body, bearer]);

  const fetchCode = useMemo(() => {
    const h: Record<string, string> = {};
    headers.split("\n").forEach((l) => {
      const i = l.indexOf(":");
      if (i > 0) h[l.slice(0, i).trim()] = l.slice(i + 1).trim();
    });
    if (bearer.trim()) h["Authorization"] = `Bearer ${bearer.trim()}`;
    const opts: Record<string, unknown> = { method };
    if (Object.keys(h).length) opts.headers = h;
    if (body.trim() && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) opts.body = body;
    return `await fetch(${JSON.stringify(url)}, ${JSON.stringify(opts, null, 2)});`;
  }, [url, method, headers, body, bearer]);

  return (
    <ToolShell title="cURL Builder" description="Compose cURL commands visually — and get the matching fetch() snippet." category={categoryMap.programming} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-[140px_1fr]">
        <div>
          <Label>Method</Label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm">
            {METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <Label>URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" />
        </div>
        <div className="sm:col-span-2">
          <Label>Headers (one per line)</Label>
          <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} rows={3} className="font-mono" spellCheck={false} />
        </div>
        <div className="sm:col-span-2">
          <Label>Bearer token (optional)</Label>
          <Input value={bearer} onChange={(e) => setBearer(e.target.value)} placeholder="paste raw token" className="font-mono" />
        </div>
        <div className="sm:col-span-2">
          <Label>Body</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="font-mono" spellCheck={false} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>cURL</Label><CopyButton value={cmd} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{cmd}</pre>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>fetch()</Label><CopyButton value={fetchCode} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{fetchCode}</pre>
      </Card>
    </ToolShell>
  );
}
