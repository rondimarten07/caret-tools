import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function CookieAttrs() {
  const [name, setName] = useState("session");
  const [value, setValue] = useState("abc123");
  const [domain, setDomain] = useState("");
  const [path, setPath] = useState("/");
  const [maxAge, setMaxAge] = useState("3600");
  const [secure, setSecure] = useState(true);
  const [httpOnly, setHttpOnly] = useState(true);
  const [sameSite, setSameSite] = useState<"Lax" | "Strict" | "None">("Lax");
  const [partitioned, setPartitioned] = useState(false);

  const header = useMemo(() => {
    const parts = [`${name}=${value}`];
    if (domain.trim()) parts.push(`Domain=${domain.trim()}`);
    if (path.trim()) parts.push(`Path=${path.trim()}`);
    if (maxAge.trim()) parts.push(`Max-Age=${maxAge.trim()}`);
    if (secure) parts.push("Secure");
    if (httpOnly) parts.push("HttpOnly");
    parts.push(`SameSite=${sameSite}`);
    if (partitioned) parts.push("Partitioned");
    return parts.join("; ");
  }, [name, value, domain, path, maxAge, secure, httpOnly, sameSite, partitioned]);

  const warnings: string[] = [];
  if (sameSite === "None" && !secure) warnings.push("SameSite=None requires Secure.");
  if (partitioned && !secure) warnings.push("Partitioned requires Secure.");
  if (partitioned && sameSite !== "None") warnings.push("Partitioned only makes sense with SameSite=None (cross-site).");

  return (
    <ToolShell title="Cookie Attributes" description="Compose a Set-Cookie header — with the modern flags." category={categoryMap.security}>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="font-mono" /></div>
        <div><Label>Value</Label><Input value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" /></div>
        <div><Label>Domain (optional)</Label><Input value={domain} onChange={(e) => setDomain(e.target.value)} className="font-mono" /></div>
        <div><Label>Path</Label><Input value={path} onChange={(e) => setPath(e.target.value)} className="font-mono" /></div>
        <div><Label>Max-Age (seconds)</Label><Input value={maxAge} onChange={(e) => setMaxAge(e.target.value)} type="number" /></div>
        <div>
          <Label>SameSite</Label>
          <select value={sameSite} onChange={(e) => setSameSite(e.target.value as "Lax" | "Strict" | "None")} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm">
            <option value="Lax">Lax (default)</option>
            <option value="Strict">Strict</option>
            <option value="None">None</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={secure} onChange={(e) => setSecure(e.target.checked)} />Secure (HTTPS only)</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={httpOnly} onChange={(e) => setHttpOnly(e.target.checked)} />HttpOnly (no JS access)</label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={partitioned} onChange={(e) => setPartitioned(e.target.checked)} />Partitioned (CHIPS — keyed by top-level site)</label>
      </Card>
      {warnings.length > 0 && (
        <Card className="bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          <ul className="space-y-1">{warnings.map((w) => <li key={w}>⚠ {w}</li>)}</ul>
        </Card>
      )}
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Header</Label><CopyButton value={`Set-Cookie: ${header}`} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">Set-Cookie: {header}</pre>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">SameSite quick reference</div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b"><td className="p-3 font-mono">Strict</td><td className="p-3">Cookie sent only on same-site requests. Hardest CSRF defense.</td></tr>
            <tr className="border-b"><td className="p-3 font-mono">Lax (default)</td><td className="p-3">Sent on top-level navigation (link click) but not iframes/fetch. Reasonable default.</td></tr>
            <tr><td className="p-3 font-mono">None</td><td className="p-3">Sent on all cross-site requests. Required for embedded contexts but needs Secure.</td></tr>
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
