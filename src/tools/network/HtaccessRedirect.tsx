import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Plus, X } from "lucide-react";

type Rule = {
  from: string;
  to: string;
  code: "301" | "302" | "307" | "308";
};

export default function HtaccessRedirect() {
  const [rules, setRules] = useState<Rule[]>([
    { from: "/old-page", to: "/new-page", code: "301" },
  ]);

  const output = useMemo(() => {
    const lines = ["RewriteEngine On", ""];
    for (const r of rules) {
      if (!r.from || !r.to) continue;
      lines.push(`Redirect ${r.code} ${r.from} ${r.to}`);
    }
    return lines.join("\n");
  }, [rules]);

  const update = (i: number, patch: Partial<Rule>) =>
    setRules((r) => r.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <ToolShell title=".htaccess Redirect" description="Generate Apache mod_rewrite redirect rules." category={categoryMap.network}
      shareable>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="space-y-2 p-3">
          {rules.map((r, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-md border bg-card p-2">
              <Input value={r.from} onChange={(e) => update(i, { from: e.target.value })} placeholder="/old-page" className="flex-1 font-mono" />
              <span className="text-muted-foreground">→</span>
              <Input value={r.to} onChange={(e) => update(i, { to: e.target.value })} placeholder="/new-page" className="flex-1 font-mono" />
              <select value={r.code} onChange={(e) => update(i, { code: e.target.value as Rule["code"] })} className="h-9 rounded-md border bg-background px-2 text-sm">
                <option value="301">301 Permanent</option>
                <option value="302">302 Temporary</option>
                <option value="307">307 Temp Strict</option>
                <option value="308">308 Perm Strict</option>
              </select>
              <Button size="icon" variant="ghost" onClick={() => setRules((rs) => rs.filter((_, idx) => idx !== i))} disabled={rules.length === 1}><X className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => setRules((rs) => [...rs, { from: "", to: "", code: "301" }])}>
            <Plus className="mr-2 h-4 w-4" />Add redirect
          </Button>
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>.htaccess</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[320px] bg-muted/30 font-mono text-xs" />
        </Card>
      </div>
    </ToolShell>
  );
}
