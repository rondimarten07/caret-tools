import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function pigWord(w: string): string {
  if (!w) return w;
  const m = w.match(/^([a-zA-Z]+)(.*)$/);
  if (!m) return w;
  const [, alpha, rest] = m;
  const isCap = /[A-Z]/.test(alpha[0]);
  const lower = alpha.toLowerCase();
  let result: string;
  if (/^[aeiou]/.test(lower)) {
    result = lower + "way";
  } else {
    const i = lower.search(/[aeiou]/);
    if (i === -1) result = lower + "ay";
    else result = lower.slice(i) + lower.slice(0, i) + "ay";
  }
  if (isCap) result = result[0].toUpperCase() + result.slice(1);
  return result + rest;
}

function fromPigWord(w: string): string {
  const m = w.match(/^([a-zA-Z]+)(.*)$/);
  if (!m) return w;
  const [, alpha, rest] = m;
  const isCap = /[A-Z]/.test(alpha[0]);
  const lower = alpha.toLowerCase();
  let core = lower;
  let result = lower;
  if (lower.endsWith("way")) {
    result = lower.slice(0, -3);
  } else if (lower.endsWith("ay")) {
    core = lower.slice(0, -2);
    // last consonant cluster is at the end of `core` — move it to the front
    const idx = core.search(/[aeiou]/);
    if (idx > 0) {
      const cluster = core.slice(-1);
      // Best-effort: assume single consonant moved (common case)
      result = cluster + core.slice(0, -1);
    } else {
      result = core;
    }
  }
  if (isCap && result) result = result[0].toUpperCase() + result.slice(1);
  return result + rest;
}

export default function PigLatin() {
  const [text, setText] = useUrlState("t", "Hello World, this is Pig Latin!");
  const [pig, setPig] = useUrlState("p", "");

  const piggified = useMemo(() => text.split(/(\s+)/).map((w) => /\s+/.test(w) ? w : pigWord(w)).join(""), [text]);
  const restored = useMemo(() => pig.split(/(\s+)/).map((w) => /\s+/.test(w) ? w : fromPigWord(w)).join(""), [pig]);

  return (
    <ToolShell title="Pig Latin" description="Translate English to Pig Latin. (Reverse direction is best-effort for single-consonant onsets.)" category={categoryMap.text} shareable>
      <Card className="space-y-3 p-4">
        <Label>English → Pig Latin</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all">{piggified}</p>
          <CopyButton value={piggified} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Pig Latin → English</Label>
        <Textarea value={pig} onChange={(e) => setPig(e.target.value)} rows={3} placeholder="Elloh-hay" />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all">{restored}</p>
          <CopyButton value={restored} />
        </div>
      </Card>
    </ToolShell>
  );
}
