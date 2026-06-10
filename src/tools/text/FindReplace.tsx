import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function FindReplace() {
  const [text, setText] = useUrlState("text", "");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const result = useMemo(() => {
    if (!find) return { ok: true as const, output: text, count: 0 };
    try {
      const flags = (useRegex ? "g" : "g") + (caseSensitive ? "" : "i");
      const re = useRegex
        ? new RegExp(find, flags)
        : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      let count = 0;
      const output = text.replace(re, () => {
        count++;
        return replace;
      });
      return { ok: true as const, output, count };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [text, find, replace, useRegex, caseSensitive]);

  return (
    <ToolShell
      title="Find & Replace"
      description="Find and replace text with optional regex and case sensitivity."
      category={categoryMap.text}
      shareable
    >
      <Card className="space-y-3 p-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <Label className="mb-1 block">Find</Label>
            <Input value={find} onChange={(e) => setFind(e.target.value)} className="font-mono" />
          </div>
          <div>
            <Label className="mb-1 block">Replace with</Label>
            <Input value={replace} onChange={(e) => setReplace(e.target.value)} className="font-mono" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={useRegex ? "default" : "outline"} onClick={() => setUseRegex((v) => !v)}>
            .* Regex
          </Button>
          <Button size="sm" variant={caseSensitive ? "default" : "outline"} onClick={() => setCaseSensitive((v) => !v)}>
            Aa Case
          </Button>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Source</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[300px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? `Result · ${result.count} replacement${result.count === 1 ? "" : "s"}` : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[300px] bg-muted/30" />
          ) : (
            <div className="min-h-[300px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
