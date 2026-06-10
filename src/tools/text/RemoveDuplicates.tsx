import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function RemoveDuplicates() {
  const [text, setText] = useUrlState("text", "");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trim, setTrim] = useState(true);

  const { output, removed } = useMemo(() => {
    const lines = text.split(/\r?\n/);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of lines) {
      const key = (trim ? raw.trim() : raw);
      const norm = caseSensitive ? key : key.toLowerCase();
      if (seen.has(norm)) continue;
      seen.add(norm);
      out.push(raw);
    }
    return { output: out.join("\n"), removed: lines.length - out.length };
  }, [text, caseSensitive, trim]);

  return (
    <ToolShell
      title="Remove Duplicate Lines"
      description="Strip duplicate lines from any text."
      category={categoryMap.text}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>}
    >
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant={caseSensitive ? "default" : "outline"} onClick={() => setCaseSensitive((v) => !v)}>Aa Case</Button>
        <Button size="sm" variant={trim ? "default" : "outline"} onClick={() => setTrim((v) => !v)}>Trim spaces</Button>
        <span className="ml-auto text-xs text-muted-foreground">{removed} duplicate{removed === 1 ? "" : "s"} removed</span>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[320px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Unique</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[320px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
