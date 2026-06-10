import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Sim = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

/** Brettel/Vienot daltonization matrices (approximate sRGB) */
const MATRICES: Record<Sim, number[]> = {
  normal: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

const LABELS: Record<Sim, string> = {
  normal: "Normal vision",
  protanopia: "Protanopia (red-blind, ~1% males)",
  deuteranopia: "Deuteranopia (green-blind, ~1% males)",
  tritanopia: "Tritanopia (blue-blind, very rare)",
  achromatopsia: "Achromatopsia (no color)",
};

export default function ColorBlindness() {
  const [src, setSrc] = useState<string | null>(null);
  const refs = useRef<Record<Sim, HTMLCanvasElement | null>>({} as Record<Sim, HTMLCanvasElement | null>);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      drawAll();
    };
    img.src = src;
  }, [src]);

  const drawAll = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const maxW = 360;
    const scale = Math.min(1, maxW / img.naturalWidth);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    for (const sim of Object.keys(MATRICES) as Sim[]) {
      const c = refs.current[sim];
      if (!c) continue;
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) continue;
      ctx.drawImage(img, 0, 0, w, h);
      const m = MATRICES[sim];
      const data = ctx.getImageData(0, 0, w, h);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        px[i] = Math.min(255, m[0] * r + m[1] * g + m[2] * b);
        px[i + 1] = Math.min(255, m[3] * r + m[4] * g + m[5] * b);
        px[i + 2] = Math.min(255, m[6] * r + m[7] * g + m[8] * b);
      }
      ctx.putImageData(data, 0, 0);
    }
  };

  const onFile = (f: File) => {
    setSrc(URL.createObjectURL(f));
  };

  return (
    <ToolShell title="Color Blindness Simulator" description="Preview an image as seen by people with color vision deficiency." category={categoryMap.design}>
      <Card className="p-3">
        <Label className="mb-1 block">Pick an image</Label>
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </Card>
      {src && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(MATRICES) as Sim[]).map((sim) => (
            <Card key={sim} className="p-3">
              <Label className="mb-2 block text-xs">{LABELS[sim]}</Label>
              <canvas
                ref={(el) => {
                  refs.current[sim] = el;
                }}
                className="block max-w-full rounded-md border"
              />
            </Card>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
