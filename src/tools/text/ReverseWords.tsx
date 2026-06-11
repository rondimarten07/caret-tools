import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function ReverseWords() {
  const [text, setText] = useUrlState("t", "Hello world\nThe quick brown fox");
  const [scope, setScope] = useState<"line" | "whole">("line");

  const out = useMemo(() => {
    if (scope === "whole") return text.trim().split(/\s+/).reverse().join(" ");
    return text.split("\n").map((line) => line.trim().split(/\s+/).reverse().join(" ")).join("\n");
  }, [text, scope]);

  return (
    <ToolShell title="Reverse Word Order" description="Reverse word order per line or across the whole text." category={categoryMap.text} shareable>
      <Card className="flex gap-2 p-3">
        {(["line", "whole"] as const).map((s) => (
          <button key={s} onClick={() => setScope(s)} className={`rounded-md border px-3 py-1.5 text-sm ${scope === s ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s === "line" ? "Per line" : "Whole text"}</button>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Output</Label><CopyButton value={out} /></div>
        <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm">{out}</pre>
      </Card>
    </ToolShell>
  );
}
