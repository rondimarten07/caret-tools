import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = `# Status update

Here's what's **done** this week:
- _Caret_ now has **198 tools**
- New ~~beta~~ features pushed

Check the [repo](https://github.com/x/y) and the \`README.md\`.

> A quote from the team`;

function toSlack(md: string): string {
  let out = md;
  // Headings: Slack doesn't have h1/h2 — use bold instead
  out = out.replace(/^(#{1,6})\s+(.+)$/gm, (_, _h, text) => `*${text}*`);
  // Bold **x** → *x* (Slack uses single asterisk for bold)
  out = out.replace(/\*\*([^*]+)\*\*/g, "*$1*");
  // Italic _x_ → _x_ (already same)
  // Strikethrough ~~x~~ → ~x~
  out = out.replace(/~~([^~]+)~~/g, "~$1~");
  // Inline code stays as `x`
  // Links [text](url) → <url|text>
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<$2|$1>");
  // Unordered list - → •
  out = out.replace(/^- /gm, "• ");
  // Ordered list — keep as is
  // Blockquotes > → > (same)
  return out;
}

export default function MarkdownToSlack() {
  const [md, setMd] = useUrlState("md", SAMPLE);
  const slack = useMemo(() => toSlack(md), [md]);

  return (
    <ToolShell title="Markdown → Slack" description="Convert Markdown to Slack's mrkdwn formatting." category={categoryMap.text} shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Markdown</Label>
          <Textarea value={md} onChange={(e) => setMd(e.target.value)} className="min-h-[360px] font-mono text-xs" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Slack mrkdwn</Label>
            <CopyButton value={slack} />
          </div>
          <Textarea readOnly value={slack} className="min-h-[360px] bg-muted/30 font-mono text-sm" />
        </Card>
      </div>
    </ToolShell>
  );
}
