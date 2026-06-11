import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const STYLES = [
  "adventurer", "avataaars", "big-ears", "big-smile", "bottts", "croodles",
  "fun-emoji", "identicon", "initials", "lorelei", "micah", "miniavs",
  "notionists", "open-peeps", "personas", "pixel-art", "shapes", "thumbs",
];

export default function Avatar() {
  const [seed, setSeed] = useState("caret");
  const [style, setStyle] = useState("avataaars");
  const [size, setSize] = useState(128);

  const url = useMemo(() => `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`, [style, seed, size]);

  function reroll() {
    setSeed(Math.random().toString(36).slice(2, 10));
  }

  return (
    <ToolShell title="Avatar URL Builder" description="Generate avatar URLs using the free DiceBear service." category={categoryMap.generator}>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Style</Label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm">
            {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label>Seed</Label>
          <div className="mt-1 flex gap-2">
            <Input value={seed} onChange={(e) => setSeed(e.target.value)} />
            <button onClick={reroll} className="rounded-md border bg-card px-3 py-1.5 text-sm">Reroll</button>
          </div>
        </div>
        <div>
          <Label>Size (px)</Label>
          <Input type="number" value={size} onChange={(e) => setSize(Math.max(16, Math.min(512, Number(e.target.value) || 128)))} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>URL</Label><CopyButton value={url} /></div>
        <code className="block break-all rounded-md bg-muted/30 p-3 text-xs">{url}</code>
        <div className="flex justify-center">
          <img src={url} alt="avatar" width={size} height={size} className="rounded-md bg-muted/30" />
        </div>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        DiceBear is open-source and free for commercial use. URLs are deterministic per seed — same seed → same avatar.
      </div>
    </ToolShell>
  );
}
