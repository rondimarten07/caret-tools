import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Schema = Record<string, unknown>;

function infer(v: unknown): Schema {
  if (v === null) return { type: "null" };
  if (Array.isArray(v)) {
    const items = v.length === 0 ? {} : infer(v[0]);
    return { type: "array", items };
  }
  switch (typeof v) {
    case "string":
      return { type: "string" };
    case "number":
      return { type: Number.isInteger(v) ? "integer" : "number" };
    case "boolean":
      return { type: "boolean" };
    case "object": {
      const obj = v as Record<string, unknown>;
      const properties: Schema = {};
      const required: string[] = [];
      for (const [k, val] of Object.entries(obj)) {
        properties[k] = infer(val);
        required.push(k);
      }
      return { type: "object", properties, required };
    }
    default:
      return {};
  }
}

export default function JsonSchema() {
  const [json, setJson] = useUrlState("json", `{ "id": 1, "name": "Alice", "active": true, "tags": ["admin"] }`);

  const result = useMemo(() => {
    try {
      const data = JSON.parse(json);
      const schema = {
        $schema: "https://json-schema.org/draft-07/schema#",
        ...infer(data),
      };
      return { ok: true as const, output: JSON.stringify(schema, null, 2) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [json]);

  return (
    <ToolShell title="JSON Schema Generator" description="Infer a JSON Schema (Draft 7) from a sample document." category={categoryMap.programming} shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">JSON sample</Label>
          <Textarea value={json} onChange={(e) => setJson(e.target.value)} className="min-h-[360px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Schema" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[360px] bg-muted/30" />
          ) : (
            <div className="min-h-[360px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
