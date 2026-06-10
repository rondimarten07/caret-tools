import { useMemo, useState } from "react";
import { marked } from "marked";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `# Hello Markdown\n\nThis is **bold**, _italic_ and \`code\`.\n\n- Item one\n- Item two\n\n> Block quote\n\n\`\`\`js\nconsole.log("hi");\n\`\`\``;

export default function MarkdownHtml() {
  const [md, setMd] = useUrlState("md", SAMPLE);
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);

  return (
    <ToolShell title="Markdown → HTML" description="Render Markdown to HTML with live preview." category={categoryMap.converter}
      shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-3 lg:col-span-1">
          <Label className="mb-2 block">Markdown</Label>
          <Textarea value={md} onChange={(e) => setMd(e.target.value)} className="min-h-[420px]" />
        </Card>
        <Card className="p-3 lg:col-span-1">
          <div className="mb-2 flex items-center justify-between">
            <Label>HTML</Label>
            <CopyButton value={html} />
          </div>
          <Textarea readOnly value={html} className="min-h-[420px] bg-muted/30" />
        </Card>
        <Card className="p-3 lg:col-span-1">
          <Label className="mb-2 block">Preview</Label>
          <div
            className="prose prose-sm max-w-none rounded-md border bg-background p-3 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Card>
      </div>
    </ToolShell>
  );
}
