import { useMemo, useState } from "react";
import { marked } from "marked";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `# Markdown Live Preview

A split-pane Markdown editor with **live HTML preview**.

## Features

- GitHub-flavored Markdown
- _Italic_, **bold**, ~~strike~~
- \`inline code\`
- [Links](https://example.com)

\`\`\`js
function hello() {
  return "world";
}
\`\`\`

> Blockquote example.

| Col A | Col B |
|---|---|
| foo | bar |
| 1 | 2 |

- [ ] task one
- [x] task two
`;

export default function MarkdownPreview() {
  const [md, setMd] = useUrlState("md", SAMPLE);
  const html = useMemo(() => marked.parse(md, { async: false, gfm: true }) as string, [md]);

  return (
    <ToolShell title="Markdown Live Preview" description="Edit Markdown on the left, see the HTML rendered on the right." category={categoryMap.text}
      shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Markdown</Label>
          <Textarea value={md} onChange={(e) => setMd(e.target.value)} className="min-h-[520px] font-mono text-sm" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <Label className="mb-2 block">Preview</Label>
          <div
            className="prose prose-sm max-w-none rounded-md border bg-background p-4 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Card>
      </div>
    </ToolShell>
  );
}
