import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function strip(md: string): string {
  let s = md;
  // Code blocks
  s = s.replace(/```[\s\S]*?```/g, "");
  // Inline code
  s = s.replace(/`([^`]+)`/g, "$1");
  // Images: ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  // Links: [text](url) → text
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  // Heading markers
  s = s.replace(/^#{1,6}\s+/gm, "");
  // Blockquote markers
  s = s.replace(/^>\s?/gm, "");
  // List markers
  s = s.replace(/^[\s-]*[-*+]\s+/gm, "");
  s = s.replace(/^\s*\d+\.\s+/gm, "");
  // Bold / italic / strike
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/_([^_]+)_/g, "$1");
  s = s.replace(/~~([^~]+)~~/g, "$1");
  // Horizontal rules
  s = s.replace(/^[-*_]{3,}$/gm, "");
  // HTML tags
  s = s.replace(/<[^>]+>/g, "");
  // Collapse blank lines
  s = s.replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

export default function StripMarkdown() {
  const [md, setMd] = useUrlState("m", `# Hello\n\nThis is **bold** and *italic*. A [link](https://example.com) and \`code\`.\n\n- One\n- Two\n\n> Quoted`);
  const out = useMemo(() => strip(md), [md]);

  return (
    <ToolShell title="Strip Markdown" description="Remove all Markdown syntax to plain text." category={categoryMap.text} shareable>
      <Card className="space-y-3 p-4">
        <Label>Markdown</Label>
        <Textarea value={md} onChange={(e) => setMd(e.target.value)} rows={8} className="font-mono" spellCheck={false} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Plain text</Label><CopyButton value={out} /></div>
        <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm">{out}</pre>
      </Card>
    </ToolShell>
  );
}
