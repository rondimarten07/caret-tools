import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function PangramCheck() {
  const [text, setText] = useUrlState("t", "The quick brown fox jumps over the lazy dog");

  const data = useMemo(() => {
    const lower = text.toLowerCase();
    const present = new Set<string>();
    for (const ch of lower) if (/[a-z]/.test(ch)) present.add(ch);
    const missing: string[] = [];
    for (let c = 97; c <= 122; c++) {
      const letter = String.fromCharCode(c);
      if (!present.has(letter)) missing.push(letter);
    }
    return { present: [...present].sort(), missing, ok: missing.length === 0 };
  }, [text]);

  return (
    <ToolShell title="Pangram Checker" description="Does your text contain every letter A–Z?" category={categoryMap.text} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      </Card>
      <Card className="p-4 text-center">
        {data.ok ? (
          <>
            <div className="text-4xl">✓</div>
            <div className="mt-1 text-lg font-semibold">Pangram</div>
            <div className="text-sm text-muted-foreground">All 26 letters present.</div>
          </>
        ) : (
          <>
            <div className="text-4xl text-muted-foreground">✗</div>
            <div className="mt-1 text-lg font-semibold">Not a pangram</div>
            <div className="mt-2 text-sm">
              Missing: <span className="font-mono">{data.missing.join(" ")}</span>
            </div>
          </>
        )}
      </Card>
      <Card className="p-4">
        <div className="text-xs uppercase text-muted-foreground">Alphabet coverage</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {"abcdefghijklmnopqrstuvwxyz".split("").map((c) => (
            <span key={c} className={`h-7 w-7 rounded text-center text-sm font-mono leading-7 ${data.present.includes(c) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{c}</span>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
