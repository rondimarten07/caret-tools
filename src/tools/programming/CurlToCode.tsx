import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Lang = "fetch" | "axios" | "node" | "python";

/** Minimal cURL tokenizer: handles -X, -H, -d, --data, -u, and a URL. */
function parse(cmd: string) {
  // Strip line continuations
  const src = cmd.replace(/\\\n/g, " ").trim();
  const tokens: string[] = [];
  let cur = "";
  let inQuote: '"' | "'" | null = null;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (cur) tokens.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur) tokens.push(cur);
  if (tokens[0]?.toLowerCase() === "curl") tokens.shift();

  let url = "";
  let method = "GET";
  const headers: Record<string, string> = {};
  let body: string | null = null;
  let auth: string | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-X" || t === "--request") method = tokens[++i]?.toUpperCase() ?? "GET";
    else if (t === "-H" || t === "--header") {
      const h = tokens[++i] ?? "";
      const ci = h.indexOf(":");
      if (ci > 0) headers[h.slice(0, ci).trim()] = h.slice(ci + 1).trim();
    } else if (t === "-d" || t === "--data" || t === "--data-raw") {
      body = tokens[++i] ?? "";
      if (method === "GET") method = "POST";
    } else if (t === "-u" || t === "--user") {
      auth = tokens[++i] ?? "";
    } else if (!t.startsWith("-")) {
      if (!url) url = t;
    }
  }
  if (auth) headers["Authorization"] = "Basic " + btoa(auth);
  return { url, method, headers, body };
}

function toFetch(req: ReturnType<typeof parse>): string {
  const hasBody = req.body !== null;
  const opts: string[] = [];
  if (req.method !== "GET") opts.push(`  method: ${JSON.stringify(req.method)},`);
  if (Object.keys(req.headers).length)
    opts.push(`  headers: ${JSON.stringify(req.headers, null, 2).replace(/\n/g, "\n  ")},`);
  if (hasBody) opts.push(`  body: ${JSON.stringify(req.body)},`);
  return `const res = await fetch(${JSON.stringify(req.url)}${opts.length ? `, {\n${opts.join("\n")}\n}` : ""});
const data = await res.json();`;
}

function toAxios(req: ReturnType<typeof parse>): string {
  const cfg: Record<string, unknown> = { url: req.url, method: req.method.toLowerCase() };
  if (Object.keys(req.headers).length) cfg.headers = req.headers;
  if (req.body !== null) cfg.data = req.body;
  return `import axios from "axios";

const res = await axios(${JSON.stringify(cfg, null, 2)});
console.log(res.data);`;
}

function toNode(req: ReturnType<typeof parse>): string {
  return `// Node 18+ — fetch is global
${toFetch(req)}
console.log(data);`;
}

function toPython(req: ReturnType<typeof parse>): string {
  const lines = [`import requests`, ``];
  const args: string[] = [JSON.stringify(req.url)];
  if (Object.keys(req.headers).length)
    args.push(`headers=${JSON.stringify(req.headers, null, 4)}`);
  if (req.body !== null) args.push(`data=${JSON.stringify(req.body)}`);
  lines.push(`res = requests.${req.method.toLowerCase()}(${args.join(", ")})`);
  lines.push(`print(res.json())`);
  return lines.join("\n");
}

const SAMPLE = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer abc123" \\
  -d '{"name":"Alice","age":30}'`;

export default function CurlToCode() {
  const [src, setSrc] = useUrlState("curl", SAMPLE);
  const [lang, setLang] = useState<Lang>("fetch");

  const code = useMemo(() => {
    try {
      const req = parse(src);
      if (!req.url) return "// Could not parse URL from cURL command.";
      switch (lang) {
        case "fetch": return toFetch(req);
        case "axios": return toAxios(req);
        case "node": return toNode(req);
        case "python": return toPython(req);
      }
    } catch (err) {
      return `// ${(err as Error).message}`;
    }
  }, [src, lang]);

  return (
    <ToolShell title="cURL → Code" description="Convert a cURL command into fetch / axios / Node / Python code." category={categoryMap.programming}
      shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(["fetch", "axios", "node", "python"] as Lang[]).map((l) => (
          <Button key={l} size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>{l}</Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">cURL</Label>
          <Textarea value={src} onChange={(e) => setSrc(e.target.value)} className="min-h-[280px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Code</Label>
            <CopyButton value={code ?? ""} />
          </div>
          <pre className="min-h-[280px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{code}</pre>
        </Card>
      </div>
    </ToolShell>
  );
}
