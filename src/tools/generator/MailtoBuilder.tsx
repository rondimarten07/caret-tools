import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function MailtoBuilder() {
  const [to, setTo] = useUrlState("t", "hello@example.com");
  const [cc, setCc] = useUrlState("cc", "");
  const [bcc, setBcc] = useUrlState("bcc", "");
  const [subject, setSubject] = useUrlState("s", "Quick question");
  const [body, setBody] = useUrlState("b", "Hi,\n\n…\n\nThanks,\nAlex");

  const url = useMemo(() => {
    const params: string[] = [];
    if (cc.trim()) params.push(`cc=${encodeURIComponent(cc.trim())}`);
    if (bcc.trim()) params.push(`bcc=${encodeURIComponent(bcc.trim())}`);
    if (subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
    if (body.trim()) params.push(`body=${encodeURIComponent(body)}`);
    return `mailto:${encodeURIComponent(to.trim())}${params.length ? "?" + params.join("&") : ""}`;
  }, [to, cc, bcc, subject, body]);

  return (
    <ToolShell title="mailto: Link Builder" description="Compose a mailto: URL with subject, body, cc and bcc." category={categoryMap.generator} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label>To</Label><Input value={to} onChange={(e) => setTo(e.target.value)} className="font-mono" /></div>
        <div><Label>Cc</Label><Input value={cc} onChange={(e) => setCc(e.target.value)} className="font-mono" /></div>
        <div><Label>Bcc</Label><Input value={bcc} onChange={(e) => setBcc(e.target.value)} className="font-mono" /></div>
        <div className="sm:col-span-2"><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} /></div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>URL</Label><CopyButton value={url} /></div>
        <code className="block break-all rounded-md bg-muted/30 p-3 text-xs">{url}</code>
        <a href={url} className="inline-block text-sm text-primary underline">Open in mail client</a>
      </Card>
    </ToolShell>
  );
}
