import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const STOPWORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","are","was","were","be","been",
  "being","have","has","had","do","does","did","this","that","it","its","as","i","you","he","she","we","they","them","their"
]);

export default function WordFrequency() {
  const [text, setText] = useUrlState("text", "");
  const [excludeStop, setExcludeStop] = useState(true);
  const [minLen, setMinLen] = useState(1);

  const ranked = useMemo(() => {
    const words = text.toLowerCase().match(/\b[a-z'-]+\b/g) ?? [];
    const counts = new Map<string, number>();
    for (const w of words) {
      if (w.length < minLen) continue;
      if (excludeStop && STOPWORDS.has(w)) continue;
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [text, excludeStop, minLen]);

  const top50 = ranked.slice(0, 50);
  const max = top50[0]?.[1] ?? 1;

  return (
    <ToolShell title="Word Frequency" description="Count and rank the most-used words in any text." category={categoryMap.text} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[200px]" placeholder="Paste text to analyze…" />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button size="sm" variant={excludeStop ? "default" : "outline"} onClick={() => setExcludeStop((v) => !v)}>Exclude common words</Button>
          <Label className="text-xs">Min length:</Label>
          <input type="number" min={1} max={10} value={minLen} onChange={(e) => setMinLen(Math.max(1, Number(e.target.value) || 1))} className="h-8 w-16 rounded border bg-background px-2 text-sm" />
          <span className="ml-auto text-xs text-muted-foreground">{ranked.length} unique words</span>
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Top {top50.length}</Label>
          <CopyButton value={top50.map(([w, n]) => `${w}\t${n}`).join("\n")} label="TSV copied" />
        </div>
        {top50.length === 0 ? (
          <p className="text-sm text-muted-foreground">Type some text above.</p>
        ) : (
          <ul className="space-y-1">
            {top50.map(([w, n]) => (
              <li key={w} className="flex items-center gap-3 text-sm">
                <span className="w-24 truncate font-mono">{w}</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${(n / max) * 100}%` }} />
                </div>
                <span className="w-8 text-right font-mono text-xs text-muted-foreground">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </ToolShell>
  );
}
