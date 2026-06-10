import { useMemo, useState } from "react";
import yaml from "js-yaml";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Format = "env" | "json" | "yaml";

function parseEnv(src: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function toEnv(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(([k, v]) => {
      const s = typeof v === "string" ? v : JSON.stringify(v);
      const needsQuotes = /[\s#'"]/.test(s);
      return `${k}=${needsQuotes ? `"${s.replace(/"/g, '\\"')}"` : s}`;
    })
    .join("\n");
}

const SAMPLE_ENV = `# Caret sample
APP_NAME="My App"
DEBUG=true
PORT=3000
API_URL=https://api.example.com`;

export default function EnvConverter() {
  const [from, setFrom] = useState<Format>("env");
  const [to, setTo] = useState<Format>("json");
  const [input, setInput] = useUrlState("text", SAMPLE_ENV);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      let data: Record<string, unknown>;
      switch (from) {
        case "env":
          data = parseEnv(input);
          break;
        case "json":
          data = JSON.parse(input);
          break;
        case "yaml":
          data = (yaml.load(input) ?? {}) as Record<string, unknown>;
          break;
      }
      let out = "";
      switch (to) {
        case "env":
          out = toEnv(data);
          break;
        case "json":
          out = JSON.stringify(data, null, 2);
          break;
        case "yaml":
          out = yaml.dump(data);
          break;
      }
      return { ok: true as const, output: out };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [from, to, input]);

  return (
    <ToolShell
      title=".env ↔ JSON / YAML"
      description="Convert between .env, JSON and YAML config formats. Strips comments, keeps quoting safe."
      category={categoryMap.programming}
      shareable
    >
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">From</Label>
        {(["env", "json", "yaml"] as Format[]).map((f) => (
          <Button key={f} size="sm" variant={from === f ? "default" : "outline"} onClick={() => setFrom(f)}>
            {f === "env" ? ".env" : f.toUpperCase()}
          </Button>
        ))}
        <span className="text-muted-foreground">→</span>
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">To</Label>
        {(["env", "json", "yaml"] as Format[]).map((f) => (
          <Button key={f} size="sm" variant={to === f ? "default" : "outline"} onClick={() => setTo(f)}>
            {f === "env" ? ".env" : f.toUpperCase()}
          </Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[320px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Output" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[320px] bg-muted/30" spellCheck={false} />
          ) : (
            <div className="min-h-[320px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
