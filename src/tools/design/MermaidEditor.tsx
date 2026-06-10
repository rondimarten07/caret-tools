import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

const EXAMPLES = {
  flowchart: `flowchart LR
  A[Start] --> B{Decision}
  B -- yes --> C[Action]
  B -- no --> D[End]
  C --> D`,
  sequence: `sequenceDiagram
  Alice->>Bob: Hello
  Bob-->>Alice: Hi there!
  Alice->>Bob: How are you?`,
  gantt: `gantt
  title Project schedule
  section Design
  Wireframes :a1, 2026-06-10, 3d
  section Build
  Implement :after a1, 5d`,
  pie: `pie title Tools by category
  "Programming" : 28
  "Designer" : 15
  "Text" : 12
  "Other" : 47`,
} as const;

export default function MermaidEditor() {
  const [code, setCode] = useState<string>(EXAMPLES.flowchart);
  const [svg, setSvg] = useState("");
  const [err, setErr] = useState("");
  const idRef = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
    });
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = `mmd-${++idRef.current}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(svg);
          setErr("");
        }
      } catch (e) {
        if (!cancelled) setErr((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, theme]);

  const downloadSvg = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="Mermaid Editor"
      description="Live editor for Mermaid diagrams — flowchart, sequence, gantt, pie."
      category={categoryMap.design}
      shareable
      actions={
        <Button size="sm" variant="outline" onClick={downloadSvg} disabled={!svg}>
          <Download className="mr-2 h-3.5 w-3.5" /> SVG
        </Button>
      }
    >
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(Object.keys(EXAMPLES) as (keyof typeof EXAMPLES)[]).map((k) => (
          <Button key={k} size="sm" variant="outline" onClick={() => setCode(EXAMPLES[k])}>
            {k}
          </Button>
        ))}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Source</Label>
            <CopyButton value={code} />
          </div>
          <Textarea value={code} onChange={(e) => setCode(e.target.value)} className="min-h-[420px] font-mono text-xs" />
        </Card>
        <Card className="grid place-items-center bg-muted/20 p-3">
          {err ? (
            <pre className="self-start rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-xs text-destructive">
              {err}
            </pre>
          ) : (
            <div className="max-h-[420px] max-w-full overflow-auto" dangerouslySetInnerHTML={{ __html: svg }} />
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
