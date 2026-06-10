import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { useToolHistory } from "@/hooks/useToolHistory";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { CopyAs } from "@/components/tool/CopyAs";
import { ToolExamples, type Example } from "@/components/tool/ToolExamples";
import { HistoryPanel } from "@/components/tool/HistoryPanel";
import { SendOutputTo } from "@/components/tool/SendOutputTo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { detectFormat } from "@/lib/detect";

const EXAMPLES: Example[] = [
  {
    label: "Minified object",
    description: "Single-line JSON object with mixed types",
    value: `{"name":"Tools Hub","tools":102,"categories":["programming","design"],"featured":true,"createdAt":"2026-06-10"}`,
  },
  {
    label: "Nested object",
    description: "Deep structure with arrays of objects",
    value: `{"users":[{"id":1,"name":"Alice","tags":["admin","ops"],"address":{"city":"Jakarta","zip":"12345"}},{"id":2,"name":"Bob","tags":["dev"],"address":{"city":"Tokyo","zip":"100-0001"}}]}`,
  },
  {
    label: "API response (Github user)",
    description: "Realistic API payload shape",
    value: `{"login":"octocat","id":1,"name":"The Octocat","public_repos":8,"company":"@github","location":"San Francisco"}`,
  },
  {
    label: "Invalid JSON (test error)",
    description: "Trailing comma — used to test error UI",
    value: `{"a":1,"b":2,}`,
  },
];

export default function JsonFormatter() {
  const [input, setInput] = useUrlState("json", "");
  const [indent, setIndent] = useState(2);
  const history = useToolHistory("json-formatter", input, setInput);

  const detected = useMemo(() => detectFormat(input), [input]);
  const showDetectionHint = input.trim() && detected !== "json" && detected !== "unknown";

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      const parsed = JSON.parse(input);
      return {
        ok: true as const,
        output: JSON.stringify(parsed, null, indent),
        parsed,
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input, indent]);

  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, validate, indent and minify JSON. Auto-detects pasted content."
      category={categoryMap.programming}
      shareable
      actions={
        <>
          <ToolExamples examples={EXAMPLES} onSelect={setInput} />
          <HistoryPanel
            entries={history.entries}
            onRestore={history.restore}
            onClear={history.clear}
          />
          <Button variant="ghost" size="sm" onClick={() => setInput("")}>
            Clear
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/40 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Indent
        </Label>
        {[0, 2, 4].map((n) => (
          <Button
            key={n}
            size="sm"
            variant={indent === n ? "default" : "outline"}
            onClick={() => setIndent(n)}
          >
            {n === 0 ? "Minify" : `${n} spaces`}
          </Button>
        ))}
        {showDetectionHint && (
          <span className="ml-auto rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300">
            Detected: <b>{detected.toUpperCase()}</b> — try the {detected} tool?
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Input</Label>
            <span className="text-xs text-muted-foreground">
              {input.length} chars
            </span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here, e.g. {"hello":"world"}'
            className="min-h-[420px]"
            spellCheck={false}
          />
        </Card>

        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Output" : "Error"}</Label>
            {result.ok && result.output && (
              <div className="flex flex-wrap gap-2">
                <SendOutputTo
                  output={result.output}
                  targets={[
                    { slug: "json-tree-viewer", urlKey: "json", label: "JSON Tree Viewer" },
                    { slug: "json-to-typescript", urlKey: "json", label: "JSON → TypeScript" },
                    { slug: "json-schema", urlKey: "json", label: "JSON Schema Generator" },
                    { slug: "jsonpath-tester", urlKey: "json", label: "JSONPath Tester" },
                    { slug: "json-diff", urlKey: "json", label: "JSON Diff (as A)" },
                    { slug: "json-to-excel", urlKey: "json", label: "JSON → Excel" },
                  ]}
                />
                <CopyAs
                  variants={[
                    { label: "Pretty JSON", value: result.output, hint: "Indented" },
                    {
                      label: "Minified",
                      value: () => JSON.stringify(result.parsed),
                      hint: "Single line, no whitespace",
                    },
                    {
                      label: "Escaped string",
                      value: () => JSON.stringify(JSON.stringify(result.parsed)),
                      hint: "Embeddable inside another string",
                    },
                    {
                      label: "URL-encoded",
                      value: () => encodeURIComponent(JSON.stringify(result.parsed)),
                      hint: "Safe for query params",
                    },
                  ]}
                />
                <CopyButton value={result.output} label="JSON copied" />
              </div>
            )}
          </div>
          {result.ok ? (
            <Textarea
              readOnly
              value={result.output}
              placeholder="Formatted JSON will appear here…"
              className="min-h-[420px] bg-muted/30"
              spellCheck={false}
            />
          ) : (
            <div className="min-h-[420px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
              {result.error}
            </div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
