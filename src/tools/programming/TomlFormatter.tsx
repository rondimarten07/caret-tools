import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

// Minimal TOML parser — handles strings, numbers, booleans, arrays, [table] and [table.subtable].
// Not full TOML 1.0 spec (no datetimes, no inline tables in value position, no arrays of tables).
function parseToml(input: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let current: Record<string, unknown> = root;
  for (const rawLine of input.split(/\r?\n/)) {
    const line = rawLine.replace(/^\s*#.*$/, "").trim();
    if (!line) continue;
    const tableMatch = line.match(/^\[([^\]]+)\]$/);
    if (tableMatch) {
      const parts = tableMatch[1].split(".").map((p) => p.trim());
      let node: Record<string, unknown> = root;
      for (const p of parts) {
        if (typeof node[p] !== "object" || node[p] === null) node[p] = {};
        node = node[p] as Record<string, unknown>;
      }
      current = node;
      continue;
    }
    const kv = line.match(/^([\w.-]+)\s*=\s*(.+)$/);
    if (!kv) throw new Error("Cannot parse: " + rawLine);
    const [, key, valRaw] = kv;
    current[key] = parseValue(valRaw.replace(/\s*#.*$/, "").trim());
  }
  return root;
}

function parseValue(v: string): unknown {
  if (v.startsWith('"') && v.endsWith('"')) return JSON.parse(v);
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
  if (v === "true") return true;
  if (v === "false") return false;
  if (v.startsWith("[") && v.endsWith("]")) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    const parts: string[] = [];
    let depth = 0, buf = "", inStr: false | '"' | "'" = false;
    for (const ch of inner) {
      if (inStr) { buf += ch; if (ch === inStr) inStr = false; continue; }
      if (ch === '"' || ch === "'") { inStr = ch; buf += ch; continue; }
      if (ch === "[") depth++;
      if (ch === "]") depth--;
      if (ch === "," && depth === 0) { parts.push(buf.trim()); buf = ""; continue; }
      buf += ch;
    }
    if (buf.trim()) parts.push(buf.trim());
    return parts.map(parseValue);
  }
  const n = Number(v);
  if (Number.isFinite(n) && /^-?\d+(\.\d+)?$/.test(v.replace(/_/g, ""))) return n;
  return v;
}

function stringify(obj: Record<string, unknown>, prefix = ""): string {
  let out = "";
  const subTables: [string, Record<string, unknown>][] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      subTables.push([k, v as Record<string, unknown>]);
    } else {
      out += `${k} = ${fmtVal(v)}\n`;
    }
  }
  for (const [k, v] of subTables) {
    const name = prefix ? `${prefix}.${k}` : k;
    out += `\n[${name}]\n${stringify(v, name)}`;
  }
  return out;
}

function fmtVal(v: unknown): string {
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(fmtVal).join(", ") + "]";
  return String(v);
}

export default function TomlFormatter() {
  const [input, setInput] = useUrlState("t", `title = "TOML demo"\n\n[server]\nhost = "0.0.0.0"\nport = 8080\nenabled = true\n\n[server.tls]\ncert = "cert.pem"`);

  const result = useMemo(() => {
    try {
      const parsed = parseToml(input);
      return { ok: true as const, formatted: stringify(parsed).trim() + "\n", json: JSON.stringify(parsed, null, 2) };
    } catch (e) {
      return { ok: false as const, error: String((e as Error).message) };
    }
  }, [input]);

  return (
    <ToolShell title="TOML Formatter" description="Format and validate TOML. Round-trip via JSON for inspection." category={categoryMap.programming} shareable>
      <Card className="space-y-3 p-4">
        <Label>Input TOML</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono" spellCheck={false} />
      </Card>
      {result.ok ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between"><Label>Formatted</Label><CopyButton value={result.formatted} /></div>
            <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{result.formatted}</pre>
          </Card>
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between"><Label>JSON</Label><CopyButton value={result.json} /></div>
            <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{result.json}</pre>
          </Card>
        </div>
      ) : (
        <Card className="p-4 text-sm text-destructive">{result.error}</Card>
      )}
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Supports strings, numbers, booleans, arrays and nested tables. Does not handle datetime literals or arrays-of-tables (<code className="font-mono">[[items]]</code>).
      </div>
    </ToolShell>
  );
}
