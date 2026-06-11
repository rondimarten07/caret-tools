import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function tos(name: string, url: string, email: string, country: string, date: string) {
  return `# Terms of Service for ${name}

_Last updated: ${date}_

## 1. Acceptance

By accessing ${url}, you agree to be bound by these Terms. If you disagree, do not use the service.

## 2. Use of service

You are responsible for any activity under your account. You agree not to misuse the service, attempt to disrupt it, or access it through unauthorized means.

## 3. Accounts

You must provide accurate information when registering. You're responsible for safeguarding your password.

## 4. Intellectual property

All content, trademarks and data on this site are the property of ${name} unless otherwise stated. You retain rights to content you submit.

## 5. Termination

We may suspend or terminate access at any time for breach of these Terms.

## 6. Disclaimer

The service is provided "as is" without warranties of any kind. We are not liable for indirect damages.

## 7. Governing law

These Terms are governed by the laws of ${country}.

## 8. Contact

Questions about these Terms: ${email}.
`;
}

function privacy(name: string, url: string, email: string, date: string) {
  return `# Privacy Policy for ${name}

_Last updated: ${date}_

## 1. What we collect

- **Account data** — email and username when you sign up.
- **Usage data** — pages visited, features used, device type. Used to improve the product.
- **Cookies** — first-party cookies for session management. No third-party tracking.

## 2. How we use it

To provide and improve the service, communicate updates, and ensure security.

## 3. Sharing

We do not sell personal data. We share only with processors needed to run the service (e.g. hosting) under strict agreements.

## 4. Your rights

You may request access, correction, or deletion of your data at any time by emailing ${email}.

## 5. Data retention

We keep account data while your account is active; usage logs are kept for up to 12 months.

## 6. Children

The service is not directed to children under 13. We do not knowingly collect data from children.

## 7. Changes

We will post any changes to this policy on ${url} and update the date above.

## 8. Contact

${email}
`;
}

export default function TermsTemplate() {
  const today = new Date().toISOString().slice(0, 10);
  const [kind, setKind] = useState<"tos" | "privacy">("tos");
  const [name, setName] = useUrlState("n", "Acme Co.");
  const [url, setUrl] = useUrlState("u", "https://acme.example");
  const [email, setEmail] = useUrlState("e", "privacy@acme.example");
  const [country, setCountry] = useUrlState("c", "Indonesia");

  const md = useMemo(() => (kind === "tos" ? tos(name, url, email, country, today) : privacy(name, url, email, today)), [kind, name, url, email, country, today]);

  return (
    <ToolShell title="ToS / Privacy Generator" description="Boilerplate Terms of Service / Privacy Policy — use as a starting point only." category={categoryMap.generator}>
      <Card className="flex gap-2 p-3">
        {(["tos", "privacy"] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={`rounded-md border px-3 py-1.5 text-sm ${kind === k ? "bg-primary text-primary-foreground" : "bg-card"}`}>{k === "tos" ? "Terms of Service" : "Privacy Policy"}</button>
        ))}
      </Card>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Company / app name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>Site URL</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" /></div>
        <div><Label>Contact email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} className="font-mono" /></div>
        <div><Label>Governing-law country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} /></div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Markdown</Label><CopyButton value={md} /></div>
        <pre className="max-h-96 overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{md}</pre>
      </Card>
      <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        ⚠ This is generic boilerplate, <strong>not legal advice</strong>. Have a lawyer review your final document — especially for GDPR, CCPA, or industry-specific compliance.
      </div>
    </ToolShell>
  );
}
