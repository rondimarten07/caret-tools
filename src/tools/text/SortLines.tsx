import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "alpha" | "natural" | "length";

export default function SortLines() {
  const [text, setText] = useUrlState("text", "");
  const [mode, setMode] = useState<Mode>("alpha");
  const [reverse, setReverse] = useState(false);
  const [unique, setUnique] = useState(false);

  const output = useMemo(() => {
    let lines = text.split(/\r?\n/);
    if (unique) lines = Array.from(new Set(lines));
    const cmp =
      mode === "alpha"
        ? (a: string, b: string) => a.localeCompare(b)
        : mode === "natural"
        ? (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })
        : (a: string, b: string) => a.length - b.length;
    lines.sort(cmp);
    if (reverse) lines.reverse();
    return lines.join("\n");
  }, [text, mode, reverse, unique]);

  return (
    <ToolShell
      title="Sort Lines"
      description="Sort lines alphabetically, naturally or by length."
      category={categoryMap.text}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>}
    >
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Order</Label>
        {(["alpha", "natural", "length"] as Mode[]).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>{m}</Button>
        ))}
        <Button size="sm" variant={reverse ? "default" : "outline"} onClick={() => setReverse((v) => !v)}>↓ Reverse</Button>
        <Button size="sm" variant={unique ? "default" : "outline"} onClick={() => setUnique((v) => !v)}>Unique</Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[320px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Sorted</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[320px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
