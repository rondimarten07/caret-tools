import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function shift(text: string, n: number): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + n + 26) % 26) + base);
  });
}

export default function CaesarBrute() {
  const [text, setText] = useUrlState("t", "Khoor, Zruog!");

  const variants = useMemo(() => {
    const out: { n: number; text: string }[] = [];
    for (let i = 1; i < 26; i++) out.push({ n: i, text: shift(text, i) });
    return out;
  }, [text]);

  return (
    <ToolShell title="Caesar Brute Force" description="Try all 25 Caesar cipher shifts at once — spot the readable line." category={categoryMap.security} shareable>
      <Card className="p-3">
        <Label>Ciphertext</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-2 min-h-[80px] font-mono" spellCheck={false} />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="w-16 p-3">Shift</th>
              <th className="p-3">Decoded</th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.n} className="border-b last:border-0">
                <td className="p-3 font-mono text-muted-foreground">-{v.n}</td>
                <td className="p-3 font-mono">{v.text}</td>
                <td className="p-3"><CopyButton value={v.text} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
