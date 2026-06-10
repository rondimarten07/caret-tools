import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "request" | "response";

const SAMPLE_REQ = "sessionId=abc123; theme=dark; lang=en-US; csrf=xyz789";
const SAMPLE_RES = `session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
theme=dark; Path=/; Max-Age=2592000`;

function parseRequest(header: string): { name: string; value: string }[] {
  return header
    .split(/;\s*/)
    .filter((p) => p.includes("="))
    .map((p) => {
      const idx = p.indexOf("=");
      return { name: p.slice(0, idx).trim(), value: p.slice(idx + 1) };
    });
}

function parseSetCookie(header: string): Record<string, string>[] {
  return header
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/;\s*/);
      const [name, value = ""] = parts[0].split("=");
      const out: Record<string, string> = { name: name.trim(), value };
      for (const p of parts.slice(1)) {
        const [k, v] = p.split("=");
        out[k.trim()] = v ?? "true";
      }
      return out;
    });
}

export default function CookieParser() {
  const [mode, setMode] = useState<Mode>("request");
  const [input, setInput] = useUrlState("text", SAMPLE_REQ);

  const data = useMemo(() => {
    return mode === "request" ? parseRequest(input) : parseSetCookie(input);
  }, [mode, input]);

  return (
    <ToolShell title="HTTP Cookie Parser" description="Parse Cookie or Set-Cookie HTTP headers." category={categoryMap.network}
      shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <button onClick={() => { setMode("request"); setInput(SAMPLE_REQ); }} className={`rounded-md border px-3 py-1.5 text-sm ${mode === "request" ? "bg-primary text-primary-foreground" : "bg-card"}`}>Cookie (request)</button>
        <button onClick={() => { setMode("response"); setInput(SAMPLE_RES); }} className={`rounded-md border px-3 py-1.5 text-sm ${mode === "response" ? "bg-primary text-primary-foreground" : "bg-card"}`}>Set-Cookie (response)</button>
      </Card>
      <Card className="p-3">
        <Label className="mb-2 block">{mode === "request" ? "Cookie header" : "Set-Cookie (one per line)"}</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[160px] font-mono text-xs" />
      </Card>
      {mode === "request" ? (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground"><th className="p-3">Name</th><th className="p-3">Value</th><th className="p-3 w-12"></th></tr></thead>
            <tbody>
              {data.map((c, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-3 font-mono">{(c as { name: string }).name}</td>
                  <td className="p-3 font-mono break-all">{(c as { value: string }).value}</td>
                  <td className="p-3"><CopyButton value={(c as { value: string }).value} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="space-y-2">
          {(data as Record<string, string>[]).map((c, i) => (
            <Card key={i} className="p-3">
              <div className="font-mono text-sm font-medium">{c.name} = {c.value}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(c).filter(([k]) => !["name", "value"].includes(k)).map(([k, v]) => (
                  <span key={k} className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px]">{k}{v === "true" ? "" : `=${v}`}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
