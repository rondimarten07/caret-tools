import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Entry = { ch: string; cp: number; hex: string; name: string; suspicious: boolean };

// Zero-width / invisible / direction control codepoints — common stego carriers
const SUSPICIOUS = new Set([
  0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0xfeff, 0x202a, 0x202b, 0x202c, 0x202d,
  0x202e, 0x2066, 0x2067, 0x2068, 0x2069,
]);

function nameOf(cp: number): string {
  if (cp === 0x20) return "SPACE";
  if (cp === 0x09) return "TAB";
  if (cp === 0x0a) return "LF";
  if (cp === 0x0d) return "CR";
  if (cp === 0x200b) return "ZERO WIDTH SPACE";
  if (cp === 0x200c) return "ZERO WIDTH NON-JOINER";
  if (cp === 0x200d) return "ZERO WIDTH JOINER";
  if (cp === 0xfeff) return "ZERO WIDTH NO-BREAK SPACE (BOM)";
  if (cp >= 0x30 && cp <= 0x39) return "DIGIT " + String.fromCodePoint(cp);
  if (cp >= 0x41 && cp <= 0x5a) return "LATIN CAPITAL LETTER " + String.fromCodePoint(cp);
  if (cp >= 0x61 && cp <= 0x7a) return "LATIN SMALL LETTER " + String.fromCodePoint(cp).toUpperCase();
  if (cp >= 0x1f300 && cp <= 0x1f9ff) return "EMOJI";
  if (cp < 0x20) return "CONTROL CHARACTER";
  return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
}

export default function UnicodeInspector() {
  const [text, setText] = useUrlState("text", "Hello 👋 world​");

  const entries = useMemo<Entry[]>(() => {
    return Array.from(text).map((ch) => {
      const cp = ch.codePointAt(0) ?? 0;
      return {
        ch,
        cp,
        hex: "U+" + cp.toString(16).toUpperCase().padStart(4, "0"),
        name: nameOf(cp),
        suspicious: SUSPICIOUS.has(cp),
      };
    });
  }, [text]);

  const suspiciousCount = entries.filter((e) => e.suspicious).length;

  return (
    <ToolShell title="Unicode Inspector" description="Break a string into codepoints. Flags zero-width & directional characters." category={categoryMap.text}
      shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[120px] font-mono" />
        {suspiciousCount > 0 && (
          <p className="mt-2 rounded-md bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-300">
            ⚠ Contains {suspiciousCount} invisible / direction control character{suspiciousCount === 1 ? "" : "s"}.
          </p>
        )}
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">#</th>
              <th className="p-3">Char</th>
              <th className="p-3">Hex</th>
              <th className="p-3">Dec</th>
              <th className="p-3">Name</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i} className={`border-b last:border-0 ${e.suspicious ? "bg-amber-500/10" : ""}`}>
                <td className="p-3 text-muted-foreground">{i}</td>
                <td className="p-3 text-lg">{e.ch === " " ? "␣" : e.ch}</td>
                <td className="p-3 font-mono text-xs">{e.hex}</td>
                <td className="p-3 font-mono text-xs">{e.cp}</td>
                <td className="p-3 text-xs">{e.name}</td>
                <td className="p-3"><CopyButton value={e.ch} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
