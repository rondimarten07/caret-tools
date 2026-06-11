import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function bionic(text: string, frac: number): { jsx: string[][]; html: string } {
  const tokens = text.split(/(\s+)/);
  const jsx: string[][] = [];
  let html = "";
  for (const tok of tokens) {
    if (/^\s+$/.test(tok)) {
      jsx.push(["", tok]);
      html += tok;
      continue;
    }
    const m = tok.match(/^([a-zA-Z]+)(.*)$/);
    if (!m) { jsx.push(["", tok]); html += tok; continue; }
    const [, word, tail] = m;
    const cut = Math.max(1, Math.ceil(word.length * frac));
    const bold = word.slice(0, cut);
    const rest = word.slice(cut) + tail;
    jsx.push([bold, rest]);
    html += `<b>${bold}</b>${rest}`;
  }
  return { jsx, html };
}

export default function Bionic() {
  const [text, setText] = useUrlState("t", "Bionic reading bolds the first half of each word to help your eyes anchor and read faster.");
  const [frac, setFrac] = useState(0.5);
  const data = useMemo(() => bionic(text, frac), [text, frac]);

  return (
    <ToolShell title="Bionic Reading" description="Bold the leading letters of every word to anchor your eyes." category={categoryMap.text} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        <div className="flex items-center gap-3">
          <Label className="text-sm">Bold fraction:</Label>
          <input type="range" min={0.2} max={0.7} step={0.05} value={frac} onChange={(e) => setFrac(Number(e.target.value))} className="flex-1" />
          <span className="w-12 text-right font-mono text-sm">{Math.round(frac * 100)}%</span>
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Preview</Label><CopyButton value={data.html} /></div>
        <p className="text-lg leading-relaxed">
          {data.jsx.map(([bold, rest], i) => (
            <span key={i}><strong>{bold}</strong>{rest}</span>
          ))}
        </p>
      </Card>
    </ToolShell>
  );
}
