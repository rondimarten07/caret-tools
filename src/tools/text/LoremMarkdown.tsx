import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");

function rand(a: number, b: number) { return a + Math.floor(Math.random() * (b - a + 1)); }
function word() { return WORDS[rand(0, WORDS.length - 1)]; }
function sentence() {
  const n = rand(8, 14);
  const w = Array.from({ length: n }, word);
  w[0] = w[0][0].toUpperCase() + w[0].slice(1);
  return w.join(" ") + ".";
}
function para() {
  const n = rand(3, 6);
  return Array.from({ length: n }, sentence).join(" ");
}

function build(sections: number, opts: { code: boolean; lists: boolean; quotes: boolean; tables: boolean }) {
  const out: string[] = [];
  for (let i = 0; i < sections; i++) {
    out.push(`## ${sentence().slice(0, -1)}`);
    out.push("");
    out.push(para());
    out.push("");
    if (opts.lists && i % 2 === 0) {
      out.push(`- ${word()} ${word()} ${word()}`);
      out.push(`- ${word()} ${word()} ${word()} ${word()}`);
      out.push(`- ${word()} ${word()}`);
      out.push("");
    }
    if (opts.code && i % 3 === 0) {
      out.push("```js");
      out.push(`function ${word()}() {`);
      out.push(`  return "${word()}";`);
      out.push("}");
      out.push("```");
      out.push("");
    }
    if (opts.quotes && i % 4 === 1) {
      out.push(`> ${sentence()}`);
      out.push("");
    }
    if (opts.tables && i % 5 === 0) {
      out.push("| Col A | Col B | Col C |");
      out.push("|---|---|---|");
      out.push(`| ${word()} | ${word()} | ${word()} |`);
      out.push(`| ${word()} | ${word()} | ${word()} |`);
      out.push("");
    }
  }
  return out.join("\n").trim();
}

export default function LoremMarkdown() {
  const [sections, setSections] = useState(3);
  const [opts, setOpts] = useState({ code: true, lists: true, quotes: true, tables: false });
  const [seed, setSeed] = useState(0);

  const md = useMemo(() => { void seed; return build(sections, opts); }, [sections, opts, seed]);

  return (
    <ToolShell title="Lorem Markdown" description="Generate placeholder Markdown with headings, paragraphs, lists, code and quotes." category={categoryMap.text}
      actions={<><CopyButton value={md} /><Button size="sm" onClick={() => setSeed((s) => s + 1)}>Regenerate</Button></>}
    >
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[180px_1fr]">
        <div>
          <Label className="text-xs">Sections</Label>
          <Input type="number" min={1} max={20} value={sections} onChange={(e) => setSections(Number(e.target.value) || 3)} />
        </div>
        <div className="flex flex-wrap items-end gap-1.5">
          {(["code", "lists", "quotes", "tables"] as const).map((k) => (
            <Button key={k} size="sm" variant={opts[k] ? "default" : "outline"} onClick={() => setOpts((o) => ({ ...o, [k]: !o[k] }))}>
              {opts[k] ? "✓ " : ""}{k}
            </Button>
          ))}
        </div>
      </Card>
      <Card className="p-3">
        <Textarea readOnly value={md} className="min-h-[400px] bg-muted/30 font-mono text-xs" />
      </Card>
    </ToolShell>
  );
}
