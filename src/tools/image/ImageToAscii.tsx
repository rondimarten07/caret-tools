import { useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const RAMPS = {
  detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  blocks: "█▓▒░ ",
  simple: "@%#*+=-:. ",
} as const;
type Ramp = keyof typeof RAMPS;

export default function ImageToAscii() {
  const [ascii, setAscii] = useState("");
  const [width, setWidth] = useState(96);
  const [ramp, setRamp] = useState<Ramp>("simple");
  const [invert, setInvert] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const process = (img: HTMLImageElement) => {
    const w = Math.max(20, Math.min(240, width));
    // Char aspect ratio (height/width ~ 2)
    const h = Math.round((img.naturalHeight / img.naturalWidth) * w * 0.5);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    const ramps = invert ? Array.from(RAMPS[ramp]).reverse().join("") : RAMPS[ramp];
    let out = "";
    for (let y = 0; y < h; y++) {
      let row = "";
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
        const idx = Math.floor(lum * (ramps.length - 1));
        row += ramps[idx];
      }
      out += row + "\n";
    }
    setAscii(out);
  };

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => process(img);
    img.src = url;
  };

  return (
    <ToolShell title="Image → ASCII" description="Convert any image into ASCII art." category={categoryMap.image}>
      <Card className="space-y-3 p-3">
        <Input ref={fileRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label className="text-xs">Width (chars)</Label>
            <Input type="number" min={20} max={240} value={width} onChange={(e) => setWidth(Number(e.target.value) || 96)} />
          </div>
          <div>
            <Label className="text-xs">Character set</Label>
            <select value={ramp} onChange={(e) => setRamp(e.target.value as Ramp)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
              <option value="simple">Simple (10 chars)</option>
              <option value="detailed">Detailed (70 chars)</option>
              <option value="blocks">Blocks (Unicode)</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button size="sm" variant={invert ? "default" : "outline"} onClick={() => setInvert((v) => !v)} className="w-full">Invert</Button>
          </div>
        </div>
        <Button onClick={() => fileRef.current?.click()} variant="outline">Re-process current</Button>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>ASCII</Label>
          <CopyButton value={ascii} />
        </div>
        <pre className="max-h-[500px] overflow-auto rounded-md bg-muted/30 p-3 font-mono text-[8px] leading-[1.05]">{ascii || "Pick an image to start."}</pre>
      </Card>
    </ToolShell>
  );
}
