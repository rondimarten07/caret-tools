import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Visibility = "public" | "private" | "none";

export default function HttpCache() {
  const [vis, setVis] = useState<Visibility>("public");
  const [maxAge, setMaxAge] = useState("3600");
  const [sMaxAge, setSMaxAge] = useState("");
  const [immutable, setImmutable] = useState(false);
  const [noStore, setNoStore] = useState(false);
  const [noCache, setNoCache] = useState(false);
  const [mustRevalidate, setMustRevalidate] = useState(false);
  const [staleWhileRevalidate, setStaleWhileRevalidate] = useState("");

  const header = useMemo(() => {
    if (noStore) return "no-store";
    const parts: string[] = [];
    if (vis !== "none") parts.push(vis);
    if (noCache) parts.push("no-cache");
    if (maxAge && Number(maxAge) >= 0) parts.push(`max-age=${maxAge}`);
    if (sMaxAge && Number(sMaxAge) >= 0) parts.push(`s-maxage=${sMaxAge}`);
    if (immutable) parts.push("immutable");
    if (mustRevalidate) parts.push("must-revalidate");
    if (staleWhileRevalidate && Number(staleWhileRevalidate) > 0) parts.push(`stale-while-revalidate=${staleWhileRevalidate}`);
    return parts.join(", ");
  }, [vis, maxAge, sMaxAge, immutable, noStore, noCache, mustRevalidate, staleWhileRevalidate]);

  const explanation = useMemo(() => {
    if (noStore) return "Never cached — sensitive responses (auth, banking).";
    const bits: string[] = [];
    if (vis === "public") bits.push("Any cache may store (CDN, browser).");
    if (vis === "private") bits.push("Only the end-user's browser may cache.");
    if (noCache) bits.push("Cache may store but must revalidate every request.");
    if (maxAge) bits.push(`Browser keeps fresh for ${maxAge}s.`);
    if (sMaxAge) bits.push(`Shared (CDN) caches keep fresh for ${sMaxAge}s.`);
    if (immutable) bits.push("Browser won't revalidate even on reload (use with hashed URLs).");
    if (mustRevalidate) bits.push("Stale responses must not be served without revalidation.");
    if (staleWhileRevalidate) bits.push(`Stale up to ${staleWhileRevalidate}s while revalidating in background.`);
    return bits.join(" ");
  }, [vis, maxAge, sMaxAge, immutable, noStore, noCache, mustRevalidate, staleWhileRevalidate]);

  return (
    <ToolShell title="HTTP Cache Header Builder" description="Compose a Cache-Control header without guessing the directives." category={categoryMap.network}>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Visibility</Label>
          <select value={vis} onChange={(e) => setVis(e.target.value as Visibility)} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm">
            <option value="public">public</option>
            <option value="private">private</option>
            <option value="none">(omit)</option>
          </select>
        </div>
        <div>
          <Label>max-age (seconds)</Label>
          <Input value={maxAge} onChange={(e) => setMaxAge(e.target.value)} type="number" />
        </div>
        <div>
          <Label>s-maxage (CDN, seconds)</Label>
          <Input value={sMaxAge} onChange={(e) => setSMaxAge(e.target.value)} type="number" placeholder="optional" />
        </div>
        <div>
          <Label>stale-while-revalidate (seconds)</Label>
          <Input value={staleWhileRevalidate} onChange={(e) => setStaleWhileRevalidate(e.target.value)} type="number" placeholder="optional" />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={immutable} onChange={(e) => setImmutable(e.target.checked)} />immutable</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={mustRevalidate} onChange={(e) => setMustRevalidate(e.target.checked)} />must-revalidate</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noCache} onChange={(e) => setNoCache(e.target.checked)} />no-cache</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noStore} onChange={(e) => setNoStore(e.target.checked)} />no-store (overrides all)</label>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Header</Label>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <code className="break-all font-mono text-sm">Cache-Control: {header || "—"}</code>
          <CopyButton value={`Cache-Control: ${header}`} />
        </div>
        <p className="text-xs text-muted-foreground">{explanation}</p>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Recipe</div><div className="mt-1 text-sm font-medium">Hashed static assets</div><code className="mt-2 block break-all font-mono text-xs text-muted-foreground">public, max-age=31536000, immutable</code></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Recipe</div><div className="mt-1 text-sm font-medium">HTML pages</div><code className="mt-2 block break-all font-mono text-xs text-muted-foreground">public, max-age=0, must-revalidate</code></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Recipe</div><div className="mt-1 text-sm font-medium">Authenticated API</div><code className="mt-2 block break-all font-mono text-xs text-muted-foreground">no-store</code></Card>
      </div>
    </ToolShell>
  );
}
