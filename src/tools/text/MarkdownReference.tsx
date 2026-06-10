import { useMemo, useState } from "react";
import { marked } from "marked";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const REF: { group: string; items: { syntax: string; name: string }[] }[] = [
  {
    group: "Headings",
    items: [
      { name: "H1", syntax: "# Heading 1" },
      { name: "H2", syntax: "## Heading 2" },
      { name: "H3", syntax: "### Heading 3" },
    ],
  },
  {
    group: "Inline",
    items: [
      { name: "Bold", syntax: "**bold text**" },
      { name: "Italic", syntax: "_italic text_" },
      { name: "Strikethrough", syntax: "~~strike~~" },
      { name: "Inline code", syntax: "`inline code`" },
      { name: "Link", syntax: "[Caret](https://caret.app)" },
      { name: "Image", syntax: "![alt](image.png)" },
    ],
  },
  {
    group: "Blocks",
    items: [
      { name: "Blockquote", syntax: "> A quote." },
      { name: "Code block", syntax: "```js\nconst x = 1;\n```" },
      { name: "Horizontal rule", syntax: "---" },
    ],
  },
  {
    group: "Lists",
    items: [
      { name: "Unordered", syntax: "- one\n- two\n- three" },
      { name: "Ordered", syntax: "1. one\n2. two\n3. three" },
      { name: "Task list", syntax: "- [ ] todo\n- [x] done" },
    ],
  },
  {
    group: "Table",
    items: [
      { name: "Simple", syntax: "| A | B |\n|---|---|\n| 1 | 2 |" },
      { name: "Aligned", syntax: "| Left | Center | Right |\n|:---|:---:|---:|\n| a | b | c |" },
    ],
  },
];

export default function MarkdownReference() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return REF;
    return REF
      .map((g) => ({ ...g, items: g.items.filter((it) => it.name.toLowerCase().includes(s) || it.syntax.toLowerCase().includes(s)) }))
      .filter((g) => g.items.length > 0);
  }, [q]);

  return (
    <ToolShell title="Markdown Cheatsheet" description="Quick reference of Markdown syntax with live previews." category={categoryMap.text}>
      <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
      {filtered.map((g) => (
        <Card key={g.group} className="p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {g.items.map((it, i) => {
              const html = marked.parse(it.syntax, { async: false, gfm: true }) as string;
              return (
                <div key={i} className="grid grid-cols-2 gap-2 rounded-md border bg-card p-2">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-muted-foreground">{it.name}</div>
                    <pre className="overflow-auto rounded bg-muted/30 p-2 font-mono text-[11px]">{it.syntax}</pre>
                    <CopyButton value={it.syntax} />
                  </div>
                  <div
                    className="prose prose-sm max-w-none rounded bg-background p-2 dark:prose-invert text-xs"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </ToolShell>
  );
}
