import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function neighbours(word: string): { swap: string[]; insert: string[]; delete: string[] } {
  const w = word.toLowerCase();
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const swap: string[] = [];
  const insert: string[] = [];
  const del: string[] = [];
  for (let i = 0; i < w.length; i++) {
    for (const c of alpha) {
      if (c !== w[i]) swap.push(w.slice(0, i) + c + w.slice(i + 1));
    }
    del.push(w.slice(0, i) + w.slice(i + 1));
  }
  for (let i = 0; i <= w.length; i++) {
    for (const c of alpha) {
      insert.push(w.slice(0, i) + c + w.slice(i));
    }
  }
  return { swap, insert, delete: del };
}

export default function WordLadder() {
  const [word, setWord] = useUrlState("w", "cat");

  const data = useMemo(() => {
    const w = word.trim().toLowerCase();
    if (!/^[a-z]+$/.test(w) || w.length > 10) return null;
    return neighbours(w);
  }, [word]);

  return (
    <ToolShell title="Word Ladder Helper" description="Find every one-edit neighbour of a word — same length, +1, −1." category={categoryMap.text} shareable>
      <Card className="space-y-3 p-4">
        <Label>Word (≤ 10 letters)</Label>
        <Input value={word} onChange={(e) => setWord(e.target.value)} className="font-mono" />
      </Card>
      {data ? (
        <div className="grid gap-3 md:grid-cols-3">
          <NeighbourCard title={`Same length (${data.swap.length})`} items={data.swap} />
          <NeighbourCard title={`Insert one (${data.insert.length})`} items={data.insert} />
          <NeighbourCard title={`Delete one (${data.delete.length})`} items={data.delete} />
        </div>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">Enter a single word (letters only, max 10).</Card>
      )}
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Generates every candidate string. Cross-check against a dictionary (or use the word-frequency tool) to keep only real words.
      </div>
    </ToolShell>
  );
}

function NeighbourCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-4">
      <div className="mb-2 text-xs uppercase text-muted-foreground">{title}</div>
      <div className="max-h-72 overflow-auto text-xs font-mono">
        {items.map((w) => <div key={w}>{w}</div>)}
      </div>
    </Card>
  );
}
