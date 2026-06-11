import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const DIRECTIVES = [
  "default-src", "script-src", "style-src", "img-src", "font-src", "connect-src", "media-src", "frame-src", "worker-src", "manifest-src", "form-action", "frame-ancestors", "object-src", "base-uri",
];

const PRESETS = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "https:", "data:", "blob:"];

export default function CspBuilder() {
  const [vals, setVals] = useState<Record<string, string>>({
    "default-src": "'self'",
    "script-src": "'self'",
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data: https:",
    "font-src": "'self' data:",
    "connect-src": "'self'",
    "object-src": "'none'",
    "base-uri": "'self'",
    "frame-ancestors": "'none'",
  });
  const [upgradeInsecure, setUpgradeInsecure] = useState(true);

  const header = useMemo(() => {
    const parts = Object.entries(vals)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k} ${v.trim()}`);
    if (upgradeInsecure) parts.push("upgrade-insecure-requests");
    return parts.join("; ");
  }, [vals, upgradeInsecure]);

  return (
    <ToolShell title="CSP Header Builder" description="Compose a Content-Security-Policy header — one directive at a time." category={categoryMap.security}>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        {DIRECTIVES.map((d) => (
          <div key={d}>
            <Label className="font-mono text-xs">{d}</Label>
            <Input value={vals[d] || ""} onChange={(e) => setVals({ ...vals, [d]: e.target.value })} className="font-mono" />
            <div className="mt-1 flex flex-wrap gap-1">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => setVals({ ...vals, [d]: ((vals[d] || "") + " " + p).trim() })} className="rounded-md border bg-card px-1.5 py-0.5 text-xs font-mono hover:bg-muted">{p}</button>
              ))}
            </div>
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={upgradeInsecure} onChange={(e) => setUpgradeInsecure(e.target.checked)} />
          <code className="font-mono text-xs">upgrade-insecure-requests</code> (rewrite http:// → https://)
        </label>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Header</Label><CopyButton value={`Content-Security-Policy: ${header}`} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">Content-Security-Policy: {header}</pre>
      </Card>
      <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        ⚠ Test in <strong>report-only</strong> mode first (<code className="font-mono">Content-Security-Policy-Report-Only</code>) before enforcing — a too-strict CSP will break your site in production with no warning.
      </div>
    </ToolShell>
  );
}
