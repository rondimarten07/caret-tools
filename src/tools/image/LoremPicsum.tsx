import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function LoremPicsum() {
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [seed, setSeed] = useState("");
  const [grayscale, setGrayscale] = useState(false);
  const [blur, setBlur] = useState(0);

  const url = useMemo(() => {
    const base = "https://picsum.photos";
    const path = seed ? `/seed/${encodeURIComponent(seed)}` : "";
    const params: string[] = [];
    if (grayscale) params.push("grayscale");
    if (blur > 0) params.push(`blur=${blur}`);
    return `${base}${path}/${w}/${h}${params.length ? "?" + params.join("&") : ""}`;
  }, [w, h, seed, grayscale, blur]);

  const html = `<img src="${url}" width="${w}" height="${h}" alt="placeholder" />`;
  const md = `![placeholder](${url})`;

  return (
    <ToolShell title="Lorem Picsum URL" description="Generate placeholder image URLs from Lorem Picsum (https://picsum.photos)." category={categoryMap.image}>
      <Card className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-4">
        <div>
          <Label className="text-xs">Width</Label>
          <Input type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Height</Label>
          <Input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Seed (optional)</Label>
          <Input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="any string" />
        </div>
        <div>
          <Label className="text-xs">Blur (0–10)</Label>
          <Input type="number" min={0} max={10} value={blur} onChange={(e) => setBlur(Math.max(0, Math.min(10, Number(e.target.value) || 0)))} />
        </div>
        <div className="sm:col-span-4">
          <Button size="sm" variant={grayscale ? "default" : "outline"} onClick={() => setGrayscale((v) => !v)}>
            Grayscale
          </Button>
        </div>
      </Card>
      <Card className="grid place-items-center p-3">
        <img src={url} alt="" className="max-h-72 rounded-md border" />
      </Card>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <Card className="flex items-center gap-2 p-3">
          <code className="flex-1 truncate font-mono text-xs">{url}</code>
          <CopyButton value={url} />
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <code className="flex-1 truncate font-mono text-xs">{html}</code>
          <CopyButton value={html} />
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <code className="flex-1 truncate font-mono text-xs">{md}</code>
          <CopyButton value={md} />
        </Card>
      </div>
    </ToolShell>
  );
}
