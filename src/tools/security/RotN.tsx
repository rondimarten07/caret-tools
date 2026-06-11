import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function rot(text: string, n: number, printable: boolean): string {
  if (printable) {
    return text.replace(/[\x21-\x7e]/g, (ch) => {
      const code = ch.charCodeAt(0) - 33;
      return String.fromCharCode(33 + ((code + n + 94) % 94));
    });
  }
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + n + 26) % 26) + base);
  });
}

export default function RotN() {
  const [text, setText] = useUrlState("t", "Hello, World!");
  const [mode, setMode] = useState<"rot13" | "rot47" | "rotn">("rot13");
  const [n, setN] = useUrlState("n", "13");

  const out = useMemo(() => {
    if (mode === "rot13") return rot(text, 13, false);
    if (mode === "rot47") return rot(text, 47, true);
    return rot(text, Number(n) || 0, false);
  }, [text, mode, n]);

  return (
    <ToolShell title="ROT13 / ROT47 / ROTn" description="Apply a fixed-shift rotation cipher." category={categoryMap.security} shareable>
      <Card className="flex flex-wrap gap-2 p-3">
        {(["rot13", "rot47", "rotn"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-md border px-3 py-1.5 text-sm ${mode === m ? "bg-primary text-primary-foreground" : "bg-card"}`}>{m.toUpperCase()}</button>
        ))}
        {mode === "rotn" && (
          <div className="ml-2 flex items-center gap-2">
            <Label className="text-sm">Shift:</Label>
            <Input value={n} onChange={(e) => setN(e.target.value)} className="w-20" type="number" min={1} max={25} />
          </div>
        )}
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
        <Label>Output</Label>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all font-mono">{out}</p>
          <CopyButton value={out} />
        </div>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        ROT13 (letters only) and ROT47 (printable ASCII) are both self-inverse — encode twice = original.
      </div>
    </ToolShell>
  );
}
