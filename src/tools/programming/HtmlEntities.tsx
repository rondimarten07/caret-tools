import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Mode = "encode" | "decode";

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function encode(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decode(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_, ent: string) => {
    if (ent[0] === "#") {
      const n = ent[1] === "x" || ent[1] === "X"
        ? parseInt(ent.slice(2), 16)
        : parseInt(ent.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : _;
    }
    return NAMED[ent.toLowerCase()] ?? _;
  });
}

export default function HtmlEntities() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useUrlState("text", "");
  const output = useMemo(() => (mode === "encode" ? encode(input) : decode(input)), [mode, input]);

  return (
    <ToolShell
      title="HTML Entities"
      description="Encode and decode HTML entities."
      category={categoryMap.programming}
      shareable
      actions={<Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>}
    >
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card/40 p-3">
        <Button size="sm" variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>Encode</Button>
        <Button size="sm" variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[260px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Output</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[260px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
