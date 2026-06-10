import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE_IMG = "https://picsum.photos/seed/caret/600/400";

export default function CssFilter() {
  const [src, setSrc] = useState<string>(SAMPLE_IMG);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);

  const filterValue = useMemo(() => {
    const parts: string[] = [];
    if (blur) parts.push(`blur(${blur}px)`);
    if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
    if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
    if (saturate !== 100) parts.push(`saturate(${saturate}%)`);
    if (hueRotate) parts.push(`hue-rotate(${hueRotate}deg)`);
    if (invert) parts.push(`invert(${invert}%)`);
    if (sepia) parts.push(`sepia(${sepia}%)`);
    if (grayscale) parts.push(`grayscale(${grayscale}%)`);
    return parts.join(" ") || "none";
  }, [blur, brightness, contrast, saturate, hueRotate, invert, sepia, grayscale]);

  const css = `filter: ${filterValue};`;

  const onFile = (f: File) => setSrc(URL.createObjectURL(f));

  return (
    <ToolShell title="CSS Filter Playground" description="Live-tweak blur, contrast, saturate, hue-rotate and more — copy the CSS." category={categoryMap.design}>
      <Card className="space-y-3 p-3">
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {[
          { label: "blur (px)", val: blur, set: setBlur, min: 0, max: 20, step: 0.5 },
          { label: "brightness (%)", val: brightness, set: setBrightness, min: 0, max: 200, step: 1 },
          { label: "contrast (%)", val: contrast, set: setContrast, min: 0, max: 200, step: 1 },
          { label: "saturate (%)", val: saturate, set: setSaturate, min: 0, max: 300, step: 1 },
          { label: "hue-rotate (deg)", val: hueRotate, set: setHueRotate, min: 0, max: 360, step: 1 },
          { label: "invert (%)", val: invert, set: setInvert, min: 0, max: 100, step: 1 },
          { label: "sepia (%)", val: sepia, set: setSepia, min: 0, max: 100, step: 1 },
          { label: "grayscale (%)", val: grayscale, set: setGrayscale, min: 0, max: 100, step: 1 },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <Label className="w-36 text-xs">{r.label}</Label>
            <input type="range" min={r.min} max={r.max} step={r.step} value={r.val} onChange={(e) => r.set(Number(e.target.value))} className="flex-1 accent-primary" />
            <code className="w-14 text-right font-mono text-xs">{r.val}</code>
          </div>
        ))}
      </Card>
      <Card className="grid place-items-center bg-muted/20 p-3">
        <img src={src} alt="" className="max-h-80 rounded-md border" style={{ filter: filterValue }} />
      </Card>
      <Card className="flex items-center gap-2 p-3">
        <code className="flex-1 break-all font-mono text-sm">{css}</code>
        <CopyButton value={css} />
      </Card>
    </ToolShell>
  );
}
