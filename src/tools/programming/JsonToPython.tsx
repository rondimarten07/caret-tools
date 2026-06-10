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
  return s.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join("") || "Item";
}

type Inferred = { types: Map<string, string> };

function pyType(v: unknown, name: string, out: Inferred): string {
  if (v === null) return "Optional[Any]";
  if (Array.isArray(v)) {
    if (v.length === 0) return "List[Any]";
    return `List[${pyType(v[0], `${name}Item`, out)}]`;
  }
  switch (typeof v) {
    case "string": return "str";
    case "number": return Number.isInteger(v) ? "int" : "float";
    case "boolean": return "bool";
    case "object": {
      const cls = pascal(name);
      const obj = v as Record<string, unknown>;
      const fields = Object.entries(obj).map(([k, val]) => `    ${k}: ${pyType(val, k, out)}`);
      const body = `@dataclass\nclass ${cls}:\n${fields.join("\n") || "    pass"}`;
      if (![...out.types.values()].includes(body)) out.types.set(cls, body);
      return cls;
    }
    default: return "Any";
  }
}

export default function JsonToPython() {
  const [json, setJson] = useUrlState("json", `{ "id": 1, "name": "Alice", "active": true, "tags": ["admin"] }`);
  const [rootName, setRootName] = useState("Root");

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      const out: Inferred = { types: new Map() };
      pyType(parsed, rootName, out);
      const header = `from dataclasses import dataclass\nfrom typing import Any, List, Optional`;
      return { ok: true as const, code: header + "\n\n\n" + Array.from(out.types.values()).reverse().join("\n\n\n") };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [json, rootName]);

  return (
    <ToolShell title="JSON → Python dataclass" description="Generate Python @dataclass definitions from JSON." category={categoryMap.programming} shareable>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_180px]">
        <div>
          <Label className="text-xs">JSON</Label>
          <Textarea value={json} onChange={(e) => setJson(e.target.value)} className="min-h-[320px] font-mono text-xs" />
        </div>
        <div>
          <Label className="text-xs">Root name</Label>
          <Input value={rootName} onChange={(e) => setRootName(e.target.value || "Root")} />
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>{result.ok ? "Python" : "Error"}</Label>
          {result.ok && <CopyButton value={result.code} />}
        </div>
        {result.ok ? (
          <pre className="min-h-[260px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-xs">{result.code}</pre>
        ) : (
          <div className="min-h-[260px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
        )}
      </Card>
    </ToolShell>
  );
}
