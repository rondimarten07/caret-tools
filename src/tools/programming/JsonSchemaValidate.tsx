import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Schema = Record<string, unknown>;
type Issue = { path: string; msg: string };

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (Number.isInteger(v)) return "integer";
  return typeof v;
}

function validate(data: unknown, schema: Schema, path = "$", out: Issue[] = []): Issue[] {
  const t = schema.type as string | string[] | undefined;
  if (t) {
    const actual = typeOf(data);
    const allowed = Array.isArray(t) ? t : [t];
    // integer is also valid as number
    if (allowed.includes("number") && actual === "integer") {
      // ok
    } else if (!allowed.includes(actual)) {
      out.push({ path, msg: `expected type ${allowed.join("|")} but got ${actual}` });
      return out;
    }
  }
  if (schema.enum && Array.isArray(schema.enum)) {
    if (!(schema.enum as unknown[]).some((v) => JSON.stringify(v) === JSON.stringify(data))) {
      out.push({ path, msg: `value not in enum [${(schema.enum as unknown[]).map((v) => JSON.stringify(v)).join(", ")}]` });
    }
  }
  if (typeof data === "string") {
    if (typeof schema.minLength === "number" && data.length < schema.minLength) out.push({ path, msg: `string shorter than minLength ${schema.minLength}` });
    if (typeof schema.maxLength === "number" && data.length > schema.maxLength) out.push({ path, msg: `string longer than maxLength ${schema.maxLength}` });
    if (typeof schema.pattern === "string" && !new RegExp(schema.pattern).test(data)) out.push({ path, msg: `does not match pattern ${schema.pattern}` });
  }
  if (typeof data === "number") {
    if (typeof schema.minimum === "number" && data < schema.minimum) out.push({ path, msg: `less than minimum ${schema.minimum}` });
    if (typeof schema.maximum === "number" && data > schema.maximum) out.push({ path, msg: `greater than maximum ${schema.maximum}` });
  }
  if (Array.isArray(data)) {
    if (typeof schema.minItems === "number" && data.length < schema.minItems) out.push({ path, msg: `fewer than ${schema.minItems} items` });
    if (typeof schema.maxItems === "number" && data.length > schema.maxItems) out.push({ path, msg: `more than ${schema.maxItems} items` });
    if (schema.items) {
      data.forEach((item, i) => validate(item, schema.items as Schema, `${path}[${i}]`, out));
    }
  }
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const props = (schema.properties as Record<string, Schema> | undefined) ?? {};
    const required = (schema.required as string[] | undefined) ?? [];
    for (const r of required) {
      if (!(r in (data as object))) out.push({ path: `${path}.${r}`, msg: "required property missing" });
    }
    for (const [k, sub] of Object.entries(props)) {
      if (k in (data as object)) validate((data as Record<string, unknown>)[k], sub, `${path}.${k}`, out);
    }
  }
  return out;
}

export default function JsonSchemaValidate() {
  const [schemaInput, setSchemaInput] = useUrlState("schema", `{
  "type": "object",
  "properties": {
    "id": { "type": "integer", "minimum": 1 },
    "name": { "type": "string", "minLength": 1 }
  },
  "required": ["id", "name"]
}`);
  const [dataInput, setDataInput] = useUrlState("data", `{ "id": 1, "name": "Alice" }`);

  const result = useMemo(() => {
    try {
      const schema = JSON.parse(schemaInput);
      const data = JSON.parse(dataInput);
      const issues = validate(data, schema);
      return { ok: true as const, issues };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [schemaInput, dataInput]);

  return (
    <ToolShell title="JSON Schema Validator" description="Validate JSON data against a JSON Schema (subset). Lists all issues found." category={categoryMap.programming} shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">JSON Schema</Label>
          <Textarea value={schemaInput} onChange={(e) => setSchemaInput(e.target.value)} className="min-h-[260px] font-mono text-xs" />
        </Card>
        <Card className="p-3">
          <Label className="mb-2 block">Data</Label>
          <Textarea value={dataInput} onChange={(e) => setDataInput(e.target.value)} className="min-h-[260px] font-mono text-xs" />
        </Card>
      </div>
      <Card className="p-3">
        {result.ok ? (
          result.issues.length === 0 ? (
            <div className="rounded-md bg-emerald-500/10 p-4 text-center">
              <div className="text-xs uppercase text-muted-foreground">Status</div>
              <div className="mt-1 text-2xl font-semibold text-emerald-600">✓ Valid</div>
            </div>
          ) : (
            <>
              <Label className="mb-2 block">{result.issues.length} issue{result.issues.length === 1 ? "" : "s"}</Label>
              <ul className="space-y-1 font-mono text-xs">
                {result.issues.map((i, idx) => (
                  <li key={idx} className="flex items-start gap-2 rounded-md bg-rose-500/10 px-3 py-1.5 text-rose-700 dark:text-rose-300">
                    <span className="font-bold">{i.path}</span>
                    <span>—</span>
                    <span>{i.msg}</span>
                  </li>
                ))}
              </ul>
            </>
          )
        ) : (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">Parse error: {result.error}</div>
        )}
      </Card>
    </ToolShell>
  );
}
