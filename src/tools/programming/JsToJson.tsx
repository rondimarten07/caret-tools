import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `// JS object literal — unquoted keys, trailing commas, comments
{
  name: 'Alice',
  age: 30,
  active: true,
  tags: ['admin', 'ops'],  // dev roles
  address: {
    city: "Jakarta",
    zip: '12345',
  },
}`;

function jsToJson(input: string): string {
  // Use Function eval in a sandboxed try — input is from user, but only runs in their browser.
  // We strip line/block comments first to allow them.
  const stripped = input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  // eslint-disable-next-line no-new-func
  const value = Function(`"use strict"; return (${stripped});`)();
  return JSON.stringify(value, null, 2);
}

export default function JsToJson() {
  const [input, setInput] = useUrlState("code", SAMPLE);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      return { ok: true as const, output: jsToJson(input) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input]);

  return (
    <ToolShell title="JS Object → JSON" description="Convert a JS object literal (unquoted keys, single quotes, trailing commas, comments) to strict JSON." category={categoryMap.programming}
      shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">JS object literal</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px] font-mono text-xs" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "JSON" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[360px] bg-muted/30 font-mono text-xs" />
          ) : (
            <div className="min-h-[360px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
