import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Provider = "picsum" | "placehold" | "dummyimage";

export default function PlaceholderImage() {
  const [w, setW] = useState(640);
  const [h, setH] = useState(360);
  const [provider, setProvider] = useState<Provider>("picsum");
  const [grayscale, setGrayscale] = useState(false);
  const [blur, setBlur] = useState(0);
  const [text, setText] = useState("");
  const [bg, setBg] = useState("e2e8f0");
  const [fg, setFg] = useState("64748b");

  const url = useMemo(() => {
    if (provider === "picsum") {
      const params: string[] = [];
      if (grayscale) params.push("grayscale");
      if (blur > 0) params.push(`blur=${Math.min(10, blur)}`);
      return `https://picsum.photos/${w}/${h}${params.length ? "?" + params.join("&") : ""}`;
    }
    if (provider === "placehold") {
      const t = text ? `?text=${encodeURIComponent(text)}` : "";
      return `https://placehold.co/${w}x${h}/${bg}/${fg}${t}`;
    }
    const t = text ? `&text=${encodeURIComponent(text)}` : "";
    return `https://dummyimage.com/${w}x${h}/${bg}/${fg}${t}`;
  }, [w, h, provider, grayscale, blur, text, bg, fg]);

  return (
    <ToolShell title="Placeholder Image URL" description="Build picsum.photos / placehold.co / dummyimage URLs for mocks." category={categoryMap.generator}>
      <Card className="flex flex-wrap gap-2 p-3">
        {(["picsum", "placehold", "dummyimage"] as Provider[]).map((p) => (
          <button key={p} onClick={() => setProvider(p)} className={`rounded-md border px-3 py-1.5 text-sm ${provider === p ? "bg-primary text-primary-foreground" : "bg-card"}`}>{p}</button>
        ))}
      </Card>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div><Label>Width</Label><Input type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 1)} /></div>
        <div><Label>Height</Label><Input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 1)} /></div>
        {provider === "picsum" && (
          <>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} />Grayscale</label>
            <div><Label>Blur (0–10)</Label><Input type="number" value={blur} onChange={(e) => setBlur(Number(e.target.value) || 0)} min={0} max={10} /></div>
          </>
        )}
        {provider !== "picsum" && (
          <>
            <div><Label>Text</Label><Input value={text} onChange={(e) => setText(e.target.value)} /></div>
            <div><Label>Background (hex)</Label><Input value={bg} onChange={(e) => setBg(e.target.value.replace(/^#/, ""))} className="font-mono" /></div>
            <div><Label>Foreground (hex)</Label><Input value={fg} onChange={(e) => setFg(e.target.value.replace(/^#/, ""))} className="font-mono" /></div>
          </>
        )}
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>URL</Label><CopyButton value={url} /></div>
        <code className="block break-all rounded-md bg-muted/30 p-3 text-xs">{url}</code>
        <img src={url} alt="preview" className="mx-auto max-h-72 rounded-md" />
      </Card>
    </ToolShell>
  );
}
