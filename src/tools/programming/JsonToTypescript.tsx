import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function pascal(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join("");
}

type Out = { lines: string[]; types: Map<string, string> };

function inferType(v: unknown, name: string, out: Out): string {
  if (v === null) return "null";
  if (Array.isArray(v)) {
    if (v.length === 0) return "unknown[]";
    const items = v.map((item, i) => inferType(item, `${name}Item${i || ""}`, out));
    const unique = Array.from(new Set(items));
    const joined = unique.length === 1 ? unique[0] : unique.join(" | ");
    return joined.includes(" | ") ? `(${joined})[]` : `${joined}[]`;
  }
  switch (typeof v) {
    case "string":
      return "string";
    case "number":
      return Number.isInteger(v) ? "number" : "number";
    case "boolean":
      return "boolean";
    case "object": {
      const ifaceName = pascal(name) || "Item";
      const obj = v as Record<string, unknown>;
      const props = Object.entries(obj).map(
        ([k, val]) => `  ${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${inferType(val, k, out)};`
      );
      const body = `export interface ${ifaceName} {\n${props.join("\n")}\n}`;
      // dedupe by content
      if (![...out.types.values()].includes(body)) {
        out.types.set(ifaceName, body);
      }
      return ifaceName;
    }
    default:
      return "unknown";
  }
}

export default function JsonToTypescript() {
  const [json, setJson] = useUrlState("json", `{ "id": 1, "name": "Alice", "active": true, "tags": ["admin", "ops"] }`);
  const [rootName, setRootName] = useState("Root");

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      const out: Out = { lines: [], types: new Map() };
      inferType(parsed, rootName, out);
      const code = Array.from(out.types.values()).reverse().join("\n\n");
      return { ok: true as const, code };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [json, rootName]);

  return (
    <ToolShell
      title="JSON → TypeScript"
      description="Generate TypeScript interfaces from a JSON sample."
      category={categoryMap.programming}
      shareable
    >
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">JSON</Label>
          <Textarea value={json} onChange={(e) => setJson(e.target.value)} className="min-h-[320px]" spellCheck={false} />
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
          <pre className="min-h-[260px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">
            {result.code}
          </pre>
        ) : (
          <div className="min-h-[260px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
        )}
      </Card>
    </ToolShell>
  );
}
