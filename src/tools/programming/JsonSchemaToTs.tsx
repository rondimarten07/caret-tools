import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Schema = Record<string, unknown>;

const SAMPLE = `{
  "type": "object",
  "properties": {
    "id":   { "type": "integer" },
    "name": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } },
    "address": {
      "type": "object",
      "properties": {
        "city": { "type": "string" },
        "zip":  { "type": "string" }
      },
      "required": ["city"]
    }
  },
  "required": ["id", "name"]
}`;

function pascal(s: string): string {
  return s.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join("") || "Item";
}

type Out = { types: Map<string, string> };

function tsType(s: Schema, name: string, out: Out): string {
  const t = s.type as string | undefined;
  if (s.enum && Array.isArray(s.enum)) {
    return (s.enum as unknown[]).map((v) => typeof v === "string" ? JSON.stringify(v) : String(v)).join(" | ");
  }
  if (Array.isArray(t)) return t.map((x) => tsType({ type: x }, name, out)).join(" | ");
  switch (t) {
    case "string": return "string";
    case "number": case "integer": return "number";
    case "boolean": return "boolean";
    case "null": return "null";
    case "array": {
      const items = s.items as Schema | undefined;
      return items ? `${tsType(items, `${name}Item`, out)}[]` : "unknown[]";
    }
    case "object": {
      const props = s.properties as Record<string, Schema> | undefined;
      const required = new Set((s.required as string[] | undefined) ?? []);
      const iface = pascal(name);
      const lines = Object.entries(props ?? {}).map(([k, v]) => {
        const opt = required.has(k) ? "" : "?";
        return `  ${k}${opt}: ${tsType(v, k, out)};`;
      });
      const body = `export interface ${iface} {\n${lines.join("\n")}\n}`;
      if (![...out.types.values()].includes(body)) out.types.set(iface, body);
      return iface;
    }
    default: return "unknown";
  }
}

export default function JsonSchemaToTs() {
  const [input, setInput] = useUrlState("text", SAMPLE);
  const [rootName, setRootName] = useState("Root");

  const result = useMemo(() => {
    try {
      const schema = JSON.parse(input);
      const out: Out = { types: new Map() };
      tsType(schema, rootName, out);
      return { ok: true as const, code: Array.from(out.types.values()).reverse().join("\n\n") };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input, rootName]);

  return (
    <ToolShell title="JSON Schema → TypeScript" description="Generate TypeScript types from a JSON Schema (subset support — basic types, enum, required)." category={categoryMap.programming} shareable>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">JSON Schema</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px] font-mono text-xs" />
        </div>
        <div>
          <Label className="text-xs">Root name</Label>
          <Input value={rootName} onChange={(e) => setRootName(e.target.value || "Root")} />
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>{result.ok ? "TypeScript" : "Error"}</Label>
          {result.ok && <CopyButton value={result.code} />}
        </div>
        {result.ok ? (
          <pre className="min-h-[240px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{result.code}</pre>
        ) : (
          <div className="min-h-[240px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
        )}
      </Card>
    </ToolShell>
  );
}
