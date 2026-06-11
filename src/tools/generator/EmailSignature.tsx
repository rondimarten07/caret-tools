import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function EmailSignature() {
  const [name, setName] = useState("Alex Tan");
  const [role, setRole] = useState("Senior Designer");
  const [company, setCompany] = useState("Acme Co.");
  const [phone, setPhone] = useState("+62 21 555 0123");
  const [email, setEmail] = useState("alex@acme.co");
  const [url, setUrl] = useState("acme.co");
  const [color, setColor] = useState("#4f46e5");

  const html = useMemo(() => `<table cellpadding="0" cellspacing="0" style="font-family:-apple-system,Segoe UI,Inter,sans-serif;font-size:13px;color:#0f172a;line-height:1.45">
  <tr>
    <td style="padding-right:14px;border-right:3px solid ${color}">
      <div style="font-size:15px;font-weight:600;color:#0f172a">${name}</div>
      <div style="color:#475569">${role}${company ? ` · <span style="color:${color};font-weight:500">${company}</span>` : ""}</div>
    </td>
    <td style="padding-left:14px;color:#475569">
      ${phone ? `<div>📞 ${phone}</div>` : ""}
      ${email ? `<div>✉️ <a href="mailto:${email}" style="color:${color};text-decoration:none">${email}</a></div>` : ""}
      ${url ? `<div>🌐 <a href="https://${url}" style="color:${color};text-decoration:none">${url}</a></div>` : ""}
    </td>
  </tr>
</table>`, [name, role, company, phone, email, url, color]);

  return (
    <ToolShell title="Email Signature Builder" description="Clean HTML signature — copy-paste into Gmail / Outlook." category={categoryMap.generator}>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} /></div>
        <div><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} /></div>
        <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div>
        <div><Label>Website (no https://)</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Accent color</Label><Input value={color} onChange={(e) => setColor(e.target.value)} type="color" className="h-10 w-24" /></div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Preview</Label>
        <div className="rounded-md border bg-white p-4 text-black" dangerouslySetInnerHTML={{ __html: html }} />
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>HTML source</Label><CopyButton value={html} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{html}</pre>
      </Card>
    </ToolShell>
  );
}
