import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function sentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.replace(/(^|[.!?]\s+|\n)(\w)/g, (_, sep, ch) => sep + ch.toUpperCase())
    .replace(/(\bi\b)/g, "I");
}

export default function SentenceCase() {
  const [text, setText] = useUrlState("t", "this IS some MESSY text. it needs CAPS fixed! what about questions? sure.");
  const out = useMemo(() => sentenceCase(text), [text]);

  return (
    <ToolShell title="Sentence Case" description="Force proper sentence capitalization on any text." category={categoryMap.text} shareable>
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
