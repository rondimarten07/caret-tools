import { useMemo, useState } from "react";
import { JSONPath } from "jsonpath-plus";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `{
  "store": {
    "books": [
      { "title": "Sapiens", "author": "Y. Harari", "price": 18 },
      { "title": "Atomic Habits", "author": "J. Clear", "price": 14 },
      { "title": "Deep Work", "author": "C. Newport", "price": 12 }
    ],
    "bicycle": { "color": "red", "price": 199 }
  }
}`;

export default function JsonPathTester() {
  const [json, setJson] = useUrlState("json", SAMPLE);
  const [path, setPath] = useState("$.store.books[*].title");

  const result = useMemo(() => {
    try {
      const data = JSON.parse(json);
      const out = JSONPath({ path, json: data });
      return { ok: true as const, output: JSON.stringify(out, null, 2) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [json, path]);

  return (
    <ToolShell
      title="JSONPath Tester"
      description="Query any JSON document using JSONPath expressions."
      category={categoryMap.programming}
      shareable
      actions={
        <Button variant="outline" size="sm" onClick={() => setJson(SAMPLE)}>
          Load sample
        </Button>
      }
    >
      <Card className="p-3">
        <Label className="mb-1 block">JSONPath</Label>
        <Input value={path} onChange={(e) => setPath(e.target.value)} className="font-mono" />
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {[
            "$.store.books[*].title",
            "$..price",
            "$.store.books[?(@.price < 15)]",
            "$.store.books[0,1]",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setPath(q)}
              className="rounded-md border bg-card px-2 py-1 font-mono text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">JSON</Label>
          <Textarea value={json} onChange={(e) => setJson(e.target.value)} className="min-h-[320px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Result" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[320px] bg-muted/30" />
          ) : (
            <div className="min-h-[320px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
