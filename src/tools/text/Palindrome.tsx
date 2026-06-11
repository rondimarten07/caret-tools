import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function isPal(text: string, mode: "strict" | "loose"): { ok: boolean; normalized: string } {
  let s = text;
  if (mode === "loose") s = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return { ok: s === [...s].reverse().join(""), normalized: s };
}

export default function Palindrome() {
  const [text, setText] = useUrlState("t", "A man, a plan, a canal: Panama");
  const [mode, setMode] = useState<"strict" | "loose">("loose");

  const data = useMemo(() => isPal(text, mode), [text, mode]);

  return (
    <ToolShell title="Palindrome Checker" description="Test text for palindromicity. Loose mode ignores case and non-alphanumerics." category={categoryMap.text} shareable>
      <Card className="flex gap-2 p-3">
        {(["loose", "strict"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-md border px-3 py-1.5 text-sm ${mode === m ? "bg-primary text-primary-foreground" : "bg-card"}`}>{m}</button>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
      </Card>
      <Card className="p-4 text-center">
        {data.normalized.length === 0 ? (
          <p className="text-sm text-muted-foreground">Type some text above.</p>
        ) : data.ok ? (
          <div>
            <div className="text-3xl">✓ Palindrome</div>
            <div className="mt-2 break-all font-mono text-xs text-muted-foreground">{data.normalized}</div>
          </div>
        ) : (
          <div>
            <div className="text-3xl text-muted-foreground">✗ Not a palindrome</div>
            <div className="mt-2 break-all font-mono text-xs text-muted-foreground">{data.normalized}</div>
          </div>
        )}
      </Card>
    </ToolShell>
  );
}
