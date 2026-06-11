import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const ENTITIES: { name: string; char: string; code: string; note: string }[] = [
  { name: "&amp;", char: "&", code: "&#38;", note: "Ampersand" },
  { name: "&lt;", char: "<", code: "&#60;", note: "Less-than" },
  { name: "&gt;", char: ">", code: "&#62;", note: "Greater-than" },
  { name: "&quot;", char: '"', code: "&#34;", note: "Double quote" },
  { name: "&apos;", char: "'", code: "&#39;", note: "Apostrophe" },
  { name: "&nbsp;", char: " ", code: "&#160;", note: "Non-breaking space" },
  { name: "&shy;", char: "­", code: "&#173;", note: "Soft hyphen" },
  { name: "&zwnj;", char: "‌", code: "&#8204;", note: "Zero-width non-joiner" },
  { name: "&zwj;", char: "‍", code: "&#8205;", note: "Zero-width joiner" },
  { name: "&ndash;", char: "–", code: "&#8211;", note: "En dash" },
  { name: "&mdash;", char: "—", code: "&#8212;", note: "Em dash" },
  { name: "&hellip;", char: "…", code: "&#8230;", note: "Horizontal ellipsis" },
  { name: "&lsquo;", char: "‘", code: "&#8216;", note: "Left single quote" },
  { name: "&rsquo;", char: "’", code: "&#8217;", note: "Right single quote / apostrophe" },
  { name: "&ldquo;", char: "“", code: "&#8220;", note: "Left double quote" },
  { name: "&rdquo;", char: "”", code: "&#8221;", note: "Right double quote" },
  { name: "&laquo;", char: "«", code: "&#171;", note: "Left guillemet" },
  { name: "&raquo;", char: "»", code: "&#187;", note: "Right guillemet" },
  { name: "&copy;", char: "©", code: "&#169;", note: "Copyright" },
  { name: "&reg;", char: "®", code: "&#174;", note: "Registered trademark" },
  { name: "&trade;", char: "™", code: "&#8482;", note: "Trademark" },
  { name: "&sect;", char: "§", code: "&#167;", note: "Section sign" },
  { name: "&para;", char: "¶", code: "&#182;", note: "Pilcrow / paragraph" },
  { name: "&deg;", char: "°", code: "&#176;", note: "Degree" },
  { name: "&plusmn;", char: "±", code: "&#177;", note: "Plus-minus" },
  { name: "&times;", char: "×", code: "&#215;", note: "Multiplication" },
  { name: "&divide;", char: "÷", code: "&#247;", note: "Division" },
  { name: "&micro;", char: "µ", code: "&#181;", note: "Micro" },
  { name: "&euro;", char: "€", code: "&#8364;", note: "Euro sign" },
  { name: "&pound;", char: "£", code: "&#163;", note: "Pound sterling" },
  { name: "&yen;", char: "¥", code: "&#165;", note: "Yen / Yuan" },
  { name: "&cent;", char: "¢", code: "&#162;", note: "Cent" },
  { name: "&infin;", char: "∞", code: "&#8734;", note: "Infinity" },
  { name: "&ne;", char: "≠", code: "&#8800;", note: "Not equal" },
  { name: "&le;", char: "≤", code: "&#8804;", note: "Less than or equal" },
  { name: "&ge;", char: "≥", code: "&#8805;", note: "Greater than or equal" },
  { name: "&larr;", char: "←", code: "&#8592;", note: "Leftwards arrow" },
  { name: "&rarr;", char: "→", code: "&#8594;", note: "Rightwards arrow" },
  { name: "&uarr;", char: "↑", code: "&#8593;", note: "Upwards arrow" },
  { name: "&darr;", char: "↓", code: "&#8595;", note: "Downwards arrow" },
  { name: "&check;", char: "✓", code: "&#10003;", note: "Check mark" },
  { name: "&cross;", char: "✗", code: "&#10007;", note: "Ballot X" },
];

export default function HtmlEntityRef() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ENTITIES;
    return ENTITIES.filter((e) => e.name.toLowerCase().includes(s) || e.note.toLowerCase().includes(s) || e.char === s);
  }, [q]);

  return (
    <ToolShell title="HTML Entities" description="Common named entities and their numeric codepoints." category={categoryMap.programming}>
      <Card className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, character or description..." />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Char</th>
              <th className="p-3">Named</th>
              <th className="p-3">Numeric</th>
              <th className="p-3">Note</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.name} className="border-b last:border-0">
                <td className="p-3 text-xl">{e.char}</td>
                <td className="p-3 font-mono">{e.name}</td>
                <td className="p-3 font-mono text-muted-foreground">{e.code}</td>
                <td className="p-3 text-muted-foreground">{e.note}</td>
                <td className="p-3"><CopyButton value={e.name} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
