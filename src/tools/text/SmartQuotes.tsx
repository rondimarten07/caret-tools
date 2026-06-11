import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function toSmart(s: string): string {
  return s
    .replace(/(^|[\s(\[{])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s(\[{])'/g, "$1‘")
    .replace(/'/g, "’")
    .replace(/---/g, "—")
    .replace(/--/g, "–")
    .replace(/\.\.\./g, "…");
}

function toStraight(s: string): string {
  return s
    .replace(/[“”„]/g, '"')
    .replace(/[‘’‚′]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...");
}

export default function SmartQuotes() {
  const [text, setText] = useUrlState("t", `He said "hello" -- it's a 'test'... maybe.`);
  const [mode, setMode] = useState<"smart" | "straight">("smart");

  const out = useMemo(() => (mode === "smart" ? toSmart(text) : toStraight(text)), [text, mode]);

  return (
    <ToolShell title="Smart Quotes Normalizer" description="Convert between straight quotes/dashes/ellipses and their curly Unicode counterparts." category={categoryMap.text} shareable>
      <Card className="flex gap-2 p-3">
        {(["smart", "straight"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-md border px-3 py-1.5 text-sm ${mode === m ? "bg-primary text-primary-foreground" : "bg-card"}`}>{m === "smart" ? "Straight → Smart" : "Smart → Straight"}</button>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Output</Label><CopyButton value={out} /></div>
        <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm">{out}</pre>
      </Card>
    </ToolShell>
  );
}
