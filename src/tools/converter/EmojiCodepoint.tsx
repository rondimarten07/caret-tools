import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function EmojiCodepoint() {
  const [text, setText] = useUrlState("t", "😀🎉");

  const points = useMemo(() => {
    const out: { char: string; hex: string; dec: number; html: string; jsEscape: string }[] = [];
    for (const ch of [...text]) {
      const cp = ch.codePointAt(0)!;
      out.push({
        char: ch,
        hex: "U+" + cp.toString(16).toUpperCase().padStart(4, "0"),
        dec: cp,
        html: `&#${cp};`,
        jsEscape: cp > 0xffff ? `\\u{${cp.toString(16)}}` : `\\u${cp.toString(16).padStart(4, "0")}`,
      });
    }
    return out;
  }, [text]);

  return (
    <ToolShell title="Emoji Codepoint Inspector" description="See Unicode codepoints, HTML entities and JS escape sequences for any emoji or character." category={categoryMap.converter} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text or emoji</Label>
        <Input value={text} onChange={(e) => setText(e.target.value)} className="text-xl" />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Char</th>
              <th className="p-3">Codepoint</th>
              <th className="p-3">Decimal</th>
              <th className="p-3">HTML</th>
              <th className="p-3">JS escape</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-3 text-xl">{p.char}</td>
                <td className="p-3 font-mono">{p.hex}</td>
                <td className="p-3 font-mono text-muted-foreground">{p.dec}</td>
                <td className="p-3 font-mono">{p.html}</td>
                <td className="p-3 font-mono">{p.jsEscape}</td>
                <td className="p-3"><CopyButton value={p.hex} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
