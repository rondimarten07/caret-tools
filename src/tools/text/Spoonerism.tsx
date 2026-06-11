import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function onset(word: string): { onset: string; rest: string } {
  const m = word.match(/^([^aeiouAEIOU]*)([a-zA-Z]*)$/);
  if (!m) return { onset: "", rest: word };
  return { onset: m[1], rest: m[2] };
}

function spoonerize(text: string): string {
  return text.replace(/(\b[a-zA-Z]+)(\s+)([a-zA-Z]+\b)/g, (_full, a, sp, b) => {
    const A = onset(a);
    const B = onset(b);
    if (!A.onset && !B.onset) return `${a}${sp}${b}`;
    const aNew = (B.onset || "") + A.rest;
    const bNew = (A.onset || "") + B.rest;
    const matchCase = (w: string, orig: string) => /^[A-Z]/.test(orig) ? w.charAt(0).toUpperCase() + w.slice(1) : w;
    return `${matchCase(aNew, a)}${sp}${matchCase(bNew, b)}`;
  });
}

export default function Spoonerism() {
  const [text, setText] = useUrlState("t", "Butterfly Lighthouse Crushing Blow");
  const out = useMemo(() => spoonerize(text), [text]);

  return (
    <ToolShell title="Spoonerism Generator" description="Swap the initial consonant clusters of adjacent words." category={categoryMap.text} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Spoonerized</Label><CopyButton value={out} /></div>
        <p className="rounded-md bg-muted/30 p-3 text-lg">{out}</p>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Named after Reverend William Archibald Spooner. Classic examples: "tons of soil" → "sons of toil", "well-oiled bicycle" → "well-boiled icicle".
      </div>
    </ToolShell>
  );
}
