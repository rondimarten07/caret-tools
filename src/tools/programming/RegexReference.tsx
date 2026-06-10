import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const REF: { group: string; items: { pat: string; meaning: string; example?: string }[] }[] = [
  {
    group: "Anchors",
    items: [
      { pat: "^", meaning: "Start of string / line" },
      { pat: "$", meaning: "End of string / line" },
      { pat: "\\b", meaning: "Word boundary" },
      { pat: "\\B", meaning: "Non-word boundary" },
    ],
  },
  {
    group: "Character classes",
    items: [
      { pat: ".", meaning: "Any character except newline" },
      { pat: "\\d", meaning: "Digit [0-9]" },
      { pat: "\\D", meaning: "Non-digit" },
      { pat: "\\w", meaning: "Word char [A-Za-z0-9_]" },
      { pat: "\\W", meaning: "Non-word char" },
      { pat: "\\s", meaning: "Whitespace" },
      { pat: "\\S", meaning: "Non-whitespace" },
      { pat: "[abc]", meaning: "Any of a, b, c" },
      { pat: "[^abc]", meaning: "Not a, b, c" },
      { pat: "[a-z]", meaning: "Range a to z" },
    ],
  },
  {
    group: "Quantifiers",
    items: [
      { pat: "*", meaning: "0 or more" },
      { pat: "+", meaning: "1 or more" },
      { pat: "?", meaning: "0 or 1" },
      { pat: "{n}", meaning: "Exactly n" },
      { pat: "{n,}", meaning: "n or more" },
      { pat: "{n,m}", meaning: "Between n and m" },
      { pat: "*?", meaning: "Lazy: as few as possible" },
    ],
  },
  {
    group: "Groups & references",
    items: [
      { pat: "(abc)", meaning: "Capturing group" },
      { pat: "(?:abc)", meaning: "Non-capturing group" },
      { pat: "(?<name>abc)", meaning: "Named group" },
      { pat: "\\1", meaning: "Back-reference to group 1" },
      { pat: "(?=abc)", meaning: "Positive lookahead" },
      { pat: "(?!abc)", meaning: "Negative lookahead" },
      { pat: "(?<=abc)", meaning: "Positive lookbehind" },
      { pat: "(?<!abc)", meaning: "Negative lookbehind" },
    ],
  },
  {
    group: "Flags",
    items: [
      { pat: "g", meaning: "Global — find all matches" },
      { pat: "i", meaning: "Case-insensitive" },
      { pat: "m", meaning: "Multi-line ^/$ per line" },
      { pat: "s", meaning: "Dotall — . matches newline" },
      { pat: "u", meaning: "Unicode" },
      { pat: "y", meaning: "Sticky — match at lastIndex" },
    ],
  },
  {
    group: "Common patterns",
    items: [
      { pat: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", meaning: "Email" },
      { pat: "https?:\\/\\/[^\\s]+", meaning: "URL" },
      { pat: "\\b\\d{1,3}(\\.\\d{1,3}){3}\\b", meaning: "IPv4" },
      { pat: "^[0-9a-fA-F-]{36}$", meaning: "UUID-shaped" },
      { pat: "^\\+?[0-9\\s()-]{7,}$", meaning: "Phone (loose)" },
    ],
  },
];

export default function RegexReference() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return REF;
    return REF
      .map((g) => ({ ...g, items: g.items.filter((it) => it.pat.toLowerCase().includes(s) || it.meaning.toLowerCase().includes(s)) }))
      .filter((g) => g.items.length > 0);
  }, [q]);

  return (
    <ToolShell title="Regex Cheatsheet" description="Quick reference of regex syntax with common patterns." category={categoryMap.programming}>
      <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.map((g) => (
        <Card key={g.group} className="p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</div>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {g.items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-1.5">
                <code className="w-32 shrink-0 font-mono text-xs">{it.pat}</code>
                <span className="flex-1 truncate text-sm">{it.meaning}</span>
                <CopyButton value={it.pat} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </ToolShell>
  );
}
