import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { cn } from "@/lib/utils";

const SAMPLE = `diff --git a/app.js b/app.js
index 1234567..abcdef0 100644
--- a/app.js
+++ b/app.js
@@ -1,5 +1,6 @@
 const express = require('express');
 const app = express();
-app.get('/', (req, res) => res.send('Hello'));
+app.get('/', (req, res) => res.send('Hello, World!'));
+app.get('/about', (req, res) => res.send('About'));
 app.listen(3000);`;

type Line = { type: "context" | "add" | "del" | "hunk" | "meta"; text: string };

function parse(diff: string): Line[] {
  return diff.split(/\r?\n/).map((line) => {
    if (line.startsWith("diff ") || line.startsWith("index ") || line.startsWith("--- ") || line.startsWith("+++ ")) {
      return { type: "meta", text: line };
    }
    if (line.startsWith("@@")) return { type: "hunk", text: line };
    if (line.startsWith("+")) return { type: "add", text: line };
    if (line.startsWith("-")) return { type: "del", text: line };
    return { type: "context", text: line };
  });
}

export default function DiffViewer() {
  const [input, setInput] = useUrlState("text", SAMPLE);
  const lines = useMemo(() => parse(input), [input]);

  const stats = useMemo(() => ({
    add: lines.filter((l) => l.type === "add").length,
    del: lines.filter((l) => l.type === "del").length,
  }), [lines]);

  return (
    <ToolShell title="Unified Diff Viewer" description="Paste a git-style unified diff to render it color-coded." category={categoryMap.programming} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Diff source</Label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[200px] font-mono text-xs" spellCheck={false} />
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between text-xs">
          <Label>Rendered diff</Label>
          <span className="text-muted-foreground">
            <span className="text-emerald-600 dark:text-emerald-400">+{stats.add}</span> · <span className="text-rose-600 dark:text-rose-400">−{stats.del}</span>
          </span>
        </div>
        <pre className="overflow-auto rounded-md bg-muted/20 p-3 font-mono text-xs leading-relaxed">
          {lines.map((l, i) => (
            <div key={i} className={cn(
              l.type === "add" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              l.type === "del" && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
              l.type === "hunk" && "bg-violet-500/10 text-violet-700 dark:text-violet-300",
              l.type === "meta" && "text-muted-foreground",
            )}>
              {l.text || " "}
            </div>
          ))}
        </pre>
      </Card>
    </ToolShell>
  );
}
