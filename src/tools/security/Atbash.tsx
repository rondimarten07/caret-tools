import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base));
  });
}

export default function Atbash() {
  const [text, setText] = useUrlState("t", "Hello, World!");
  const out = useMemo(() => atbash(text), [text]);

  return (
    <ToolShell title="Atbash Cipher" description="Reverse-alphabet substitution (A↔Z, B↔Y...). It is its own inverse." category={categoryMap.security} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Encoded</Label>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all font-mono">{out}</p>
          <CopyButton value={out} />
        </div>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Atbash is symmetric — applying it twice returns the original text. Originally used for the Hebrew alphabet (אתבש: aleph↔tav, bet↔shin).
      </div>
    </ToolShell>
  );
}
