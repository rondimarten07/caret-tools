import { useEffect, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Plus, X } from "lucide-react";

export default function UrlQuery() {
  const [base, setBase] = useState("https://api.example.com/search");
  const [params, setParams] = useState<{ key: string; value: string }[]>([
    { key: "q", value: "caret tools" },
    { key: "page", value: "1" },
    { key: "lang", value: "id" },
  ]);

  const [pasteFull, setPasteFull] = useState("");
  useEffect(() => {
    if (!pasteFull) return;
    try {
      const u = new URL(pasteFull);
      const newBase = `${u.origin}${u.pathname}`;
      const newParams = Array.from(u.searchParams.entries()).map(([k, v]) => ({ key: k, value: v }));
      setBase(newBase);
      setParams(newParams.length ? newParams : [{ key: "", value: "" }]);
      setPasteFull("");
    } catch {
      /* ignore */
    }
  }, [pasteFull]);

  const update = (i: number, patch: Partial<{ key: string; value: string }>) =>
    setParams((p) => p.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const url = (() => {
    try {
      const u = new URL(base);
      u.search = "";
      for (const { key, value } of params) {
        if (key) u.searchParams.append(key, value);
      }
      return u.toString();
    } catch {
      const q = params
        .filter((p) => p.key)
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join("&");
      return base + (q ? `?${q}` : "");
    }
  })();

  return (
    <ToolShell title="URL Query Builder" description="Build URL query strings visually. Paste a full URL to decompose it." category={categoryMap.network}
      shareable>
      <Card className="space-y-3 p-3">
        <div>
          <Label className="text-xs">Base URL</Label>
          <Input value={base} onChange={(e) => setBase(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label className="text-xs">Or paste a full URL to decompose</Label>
          <Input value={pasteFull} onChange={(e) => setPasteFull(e.target.value)} placeholder="https://example.com/path?a=1&b=2" className="font-mono" />
        </div>
        <div>
          <Label className="text-xs">Parameters</Label>
          <div className="mt-2 space-y-2">
            {params.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={p.key} onChange={(e) => update(i, { key: e.target.value })} placeholder="key" className="flex-1 font-mono" />
                <span className="text-muted-foreground">=</span>
                <Input value={p.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="value" className="flex-1 font-mono" />
                <Button size="icon" variant="ghost" onClick={() => setParams((arr) => arr.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setParams((p) => [...p, { key: "", value: "" }])}><Plus className="mr-2 h-3 w-3" />Add</Button>
          </div>
        </div>
      </Card>
      <Card className="flex items-center gap-2 p-3">
        <code className="flex-1 break-all rounded-md bg-muted/30 p-3 font-mono text-xs">{url}</code>
        <CopyButton value={url} />
      </Card>
    </ToolShell>
  );
}
