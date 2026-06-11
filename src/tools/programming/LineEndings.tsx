import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Ending = "LF" | "CRLF" | "CR";

const MAP: Record<Ending, string> = { LF: "\n", CRLF: "\r\n", CR: "\r" };

function normalize(text: string, target: Ending): string {
  return text.replace(/\r\n|\r|\n/g, MAP[target]);
}

function detect(text: string): { crlf: number; lf: number; cr: number } {
  const crlf = (text.match(/\r\n/g) || []).length;
  const lfOnly = (text.match(/(?<!\r)\n/g) || []).length;
  const crOnly = (text.match(/\r(?!\n)/g) || []).length;
  return { crlf, lf: lfOnly, cr: crOnly };
}

export default function LineEndings() {
  const [text, setText] = useUrlState("t", "line one\nline two\nline three");
  const [target, setTarget] = useState<Ending>("LF");

  const counts = useMemo(() => detect(text), [text]);
  const out = useMemo(() => normalize(text, target), [text, target]);

  return (
    <ToolShell title="Line Endings" description="Convert between CRLF (Windows), LF (Unix) and CR (old Mac) line endings." category={categoryMap.programming} shareable>
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div>
          <Label>Convert to</Label>
          <div className="mt-1 flex gap-2">
            {(["LF", "CRLF", "CR"] as Ending[]).map((e) => (
              <button key={e} onClick={() => setTarget(e)} className={`rounded-md border px-3 py-1.5 text-sm ${target === e ? "bg-primary text-primary-foreground" : "bg-card"}`}>{e}</button>
            ))}
          </div>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          detected: CRLF×{counts.crlf}, LF×{counts.lf}, CR×{counts.cr}
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Input</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Label>Output ({target})</Label>
          <CopyButton value={out} />
        </div>
        <div className="text-xs text-muted-foreground">{out.length} chars · {out.split(MAP[target]).length} lines</div>
      </Card>
    </ToolShell>
  );
}
