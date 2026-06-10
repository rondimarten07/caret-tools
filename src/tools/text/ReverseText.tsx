import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "chars" | "words" | "lines";

export default function ReverseText() {
  const [text, setText] = useUrlState("text", "");
  const [mode, setMode] = useState<Mode>("chars");

  const output = useMemo(() => {
    if (mode === "chars") return Array.from(text).reverse().join("");
    if (mode === "words") return text.split(/(\s+)/).reverse().join("");
    return text.split(/\r?\n/).reverse().join("\n");
  }, [text, mode]);

  return (
    <ToolShell
      title="Reverse Text"
      description="Reverse the order of characters, words or lines."
      category={categoryMap.text}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>}
    >
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Mode</Label>
        {(["chars", "words", "lines"] as Mode[]).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)}>{m}</Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[260px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Reversed</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[260px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
