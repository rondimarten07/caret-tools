import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function spacesToTabs(text: string, width: number): string {
  const re = new RegExp(`^( {${width}})+`, "gm");
  return text.replace(re, (m) => "\t".repeat(m.length / width));
}

function tabsToSpaces(text: string, width: number): string {
  return text.replace(/^\t+/gm, (m) => " ".repeat(m.length * width));
}

export default function IndentConverter() {
  const [text, setText] = useUrlState("t", "function hello() {\n\tconsole.log('hi');\n}");
  const [width, setWidth] = useState(2);
  const [dir, setDir] = useState<"t2s" | "s2t">("t2s");

  const out = useMemo(() => (dir === "t2s" ? tabsToSpaces(text, width) : spacesToTabs(text, width)), [text, width, dir]);

  return (
    <ToolShell title="Tabs ↔ Spaces" description="Convert indentation between tabs and N spaces." category={categoryMap.programming} shareable>
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div>
          <Label>Direction</Label>
          <div className="mt-1 flex gap-2">
            <button onClick={() => setDir("t2s")} className={`rounded-md border px-3 py-1.5 text-sm ${dir === "t2s" ? "bg-primary text-primary-foreground" : "bg-card"}`}>Tabs → Spaces</button>
            <button onClick={() => setDir("s2t")} className={`rounded-md border px-3 py-1.5 text-sm ${dir === "s2t" ? "bg-primary text-primary-foreground" : "bg-card"}`}>Spaces → Tabs</button>
          </div>
        </div>
        <div>
          <Label>Tab width</Label>
          <input type="number" min={1} max={8} value={width} onChange={(e) => setWidth(Math.max(1, Math.min(8, Number(e.target.value) || 1)))} className="mt-1 block w-20 rounded-md border bg-background px-3 py-1.5 text-sm" />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Output</Label><CopyButton value={out} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-sm font-mono">{out}</pre>
      </Card>
    </ToolShell>
  );
}
