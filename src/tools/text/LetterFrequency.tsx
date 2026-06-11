import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function LetterFrequency() {
  const [text, setText] = useUrlState("t", "The quick brown fox jumps over the lazy dog");

  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    for (const ch of text.toLowerCase()) {
      if (/[a-z]/.test(ch)) {
        counts[ch] = (counts[ch] || 0) + 1;
        total++;
      }
    }
    const all: { letter: string; count: number; pct: number }[] = [];
    for (let c = "a".charCodeAt(0); c <= "z".charCodeAt(0); c++) {
      const letter = String.fromCharCode(c);
      const count = counts[letter] || 0;
      all.push({ letter, count, pct: total ? (count * 100) / total : 0 });
    }
    return { all, total };
  }, [text]);

  const max = Math.max(...data.all.map((x) => x.pct), 1);

  return (
    <ToolShell title="Letter Frequency" description="Histogram of letter frequencies in your text." category={categoryMap.text} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        <div className="text-xs text-muted-foreground">{data.total} letters</div>
      </Card>
      <Card className="p-4">
        <div className="space-y-1">
          {data.all.map((r) => (
            <div key={r.letter} className="flex items-center gap-2 text-sm">
              <span className="w-6 font-mono uppercase">{r.letter}</span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-muted/40">
                <div className="h-full bg-primary" style={{ width: `${(r.pct / max) * 100}%` }} />
              </div>
              <span className="w-12 text-right font-mono text-xs">{r.count}</span>
              <span className="w-14 text-right font-mono text-xs text-muted-foreground">{r.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
