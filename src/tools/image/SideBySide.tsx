import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryMap } from "@/data/categories";

type Img = { url: string; name: string; w: number; h: number };

function load(file: File): Promise<Img> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const i = new Image();
    i.onload = () => resolve({ url, name: file.name, w: i.naturalWidth, h: i.naturalHeight });
    i.src = url;
  });
}

export default function SideBySide() {
  const [a, setA] = useState<Img | null>(null);
  const [b, setB] = useState<Img | null>(null);
  const [layout, setLayout] = useState<"horizontal" | "vertical" | "overlay">("horizontal");

  async function pick(which: "a" | "b", file?: File) {
    if (!file) return;
    const img = await load(file);
    (which === "a" ? setA : setB)(img);
  }

  return (
    <ToolShell title="Image Compare" description="Drop two images side by side, stacked or overlaid for visual diffing." category={categoryMap.image}>
      <Card className="flex flex-wrap gap-2 p-3">
        {(["horizontal", "vertical", "overlay"] as const).map((l) => (
          <Button key={l} variant={layout === l ? "default" : "outline"} size="sm" onClick={() => setLayout(l)}>{l}</Button>
        ))}
      </Card>
      <div className={layout === "horizontal" ? "grid gap-3 md:grid-cols-2" : "grid gap-3"}>
        {(["a", "b"] as const).map((id) => {
          const img = id === "a" ? a : b;
          return (
            <Card key={id}
              className="flex min-h-[200px] items-center justify-center border-2 border-dashed p-3 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); pick(id, e.dataTransfer.files[0]); }}
            >
              {img ? (
                <div className="w-full">
                  <img src={img.url} alt={img.name} className="mx-auto max-h-72 object-contain" />
                  <p className="mt-2 truncate text-xs text-muted-foreground">{img.name} — {img.w}×{img.h}</p>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <span className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">Pick image {id.toUpperCase()}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => pick(id, e.target.files?.[0])} />
                </label>
              )}
            </Card>
          );
        })}
      </div>
      {layout === "overlay" && a && b && (
        <Card className="p-3">
          <div className="relative mx-auto max-w-full">
            <img src={a.url} alt="A" className="block max-h-96 object-contain" />
            <img src={b.url} alt="B" className="absolute inset-0 block max-h-96 object-contain mix-blend-difference" />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Overlay uses `mix-blend-mode: difference` — identical pixels appear black.</p>
        </Card>
      )}
    </ToolShell>
  );
}
