import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function sig(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "").split("").sort().join("");
}

function permute(s: string, max: number): string[] {
  if (s.length <= 1) return [s];
  const out = new Set<string>();
  function recurse(prefix: string, rest: string) {
    if (out.size >= max) return;
    if (rest.length === 0) { out.add(prefix); return; }
    const seen = new Set<string>();
    for (let i = 0; i < rest.length; i++) {
      if (seen.has(rest[i])) continue;
      seen.add(rest[i]);
      recurse(prefix + rest[i], rest.slice(0, i) + rest.slice(i + 1));
      if (out.size >= max) return;
    }
  }
  recurse("", s);
  return [...out];
}

export default function Anagram() {
  const [a, setA] = useUrlState("a", "listen");
  const [b, setB] = useUrlState("b", "silent");

  const isAnagram = useMemo(() => {
    const sa = sig(a);
    const sb = sig(b);
    return sa.length > 0 && sa === sb;
  }, [a, b]);

  const perms = useMemo(() => {
    const clean = a.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (clean.length === 0 || clean.length > 8) return null;
    return permute(clean, 500);
  }, [a]);

  return (
    <ToolShell title="Anagram Solver" description="Check anagrams or list all letter permutations of a word." category={categoryMap.text} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Word A</Label>
          <Input value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div>
          <Label>Word B</Label>
          <Input value={b} onChange={(e) => setB(e.target.value)} />
        </div>
      </Card>
      <Card className="p-4 text-sm">
        {isAnagram ? (
          <span className="text-emerald-600 dark:text-emerald-400">✓ "{a}" and "{b}" are anagrams.</span>
        ) : (
          <span className="text-muted-foreground">✗ Not anagrams (letter signatures differ).</span>
        )}
      </Card>
      {perms ? (
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <Label>All permutations of "{a}" ({perms.length}{perms.length >= 500 ? "+" : ""})</Label>
            <CopyButton value={perms.join("\n")} />
          </div>
          <div className="grid max-h-72 grid-cols-2 gap-1 overflow-auto rounded-md bg-muted/30 p-3 font-mono text-sm md:grid-cols-4">
            {perms.map((p) => <span key={p}>{p}</span>)}
          </div>
        </Card>
      ) : (
        <Card className="p-4 text-xs text-muted-foreground">Permutation list only generated for words up to 8 letters (capped at 500 results).</Card>
      )}
    </ToolShell>
  );
}
