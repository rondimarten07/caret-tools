import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const HEADERS: { name: string; what: string; example: string }[] = [
  { name: "Received", what: "Trace of mail-server hops, added in reverse order (latest at top).", example: "Received: from mta.example.com by mx.gmail.com with ESMTPS id ABC123;" },
  { name: "Return-Path", what: "Bounce address — where delivery failures get sent.", example: "Return-Path: <bounce+abc@example.com>" },
  { name: "From / Reply-To", what: "Sender shown to the recipient. Reply-To overrides where replies go.", example: "From: Alice <alice@example.com>" },
  { name: "Message-ID", what: "Globally unique identifier for the message.", example: "Message-ID: <20260611.abc@example.com>" },
  { name: "Date", what: "Local time the message was composed, RFC 2822 format.", example: "Date: Wed, 11 Jun 2026 12:34:56 +0700" },
  { name: "MIME-Version", what: "Indicates the email follows MIME extensions (always 1.0).", example: "MIME-Version: 1.0" },
  { name: "Content-Type", what: "Body MIME type (often multipart/alternative).", example: "Content-Type: multipart/alternative; boundary=\"abc\"" },
  { name: "DKIM-Signature", what: "Domain-Keys signature proving the sender controls the domain.", example: "DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=mail; ..." },
  { name: "Authentication-Results", what: "Receiving server's SPF / DKIM / DMARC verdict.", example: "Authentication-Results: mx.google.com; spf=pass dkim=pass dmarc=pass" },
  { name: "Received-SPF", what: "Sender Policy Framework check result.", example: "Received-SPF: pass (mx.google.com: domain of alice@example.com designates 1.2.3.4 as permitted)" },
  { name: "ARC-*", what: "Authenticated Received Chain — preserves auth status across forwards.", example: "ARC-Seal: ... ARC-Message-Signature: ..." },
  { name: "List-Unsubscribe", what: "Email or URL to unsubscribe. Gmail/Apple Mail show a one-click button.", example: "List-Unsubscribe: <mailto:unsub@list.com>, <https://list.com/unsub>" },
  { name: "X-Mailer", what: "Software that composed the message (informational).", example: "X-Mailer: Postmark" },
  { name: "X-Spam-Status", what: "Receiving server's spam-filter verdict (SpamAssassin style).", example: "X-Spam-Status: No, score=0.5" },
];

export default function EmailHeaders() {
  return (
    <ToolShell title="Email Header Reference" description="Common SMTP headers — what each tells you when debugging deliverability." category={categoryMap.network}>
      <div className="grid gap-3 md:grid-cols-2">
        {HEADERS.map((h) => (
          <Card key={h.name} className="space-y-2 p-4">
            <h3 className="font-mono text-sm font-semibold">{h.name}</h3>
            <p className="text-sm text-muted-foreground">{h.what}</p>
            <pre className="overflow-auto rounded-md bg-muted/30 p-2 text-xs font-mono">{h.example}</pre>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
