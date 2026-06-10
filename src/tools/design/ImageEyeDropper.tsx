import { useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function ImageEyeDropper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [pickedHex, setPickedHex] = useState<string | null>(null);
  const [pickedRgb, setPickedRgb] = useState<{ r: number; g: number; b: number } | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const onFile = (f: File) => {
    const url = URL.createObjectURL(f);
    setSrc(url);
    setPickedHex(null);
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      const c = canvasRef.current;
      const maxW = 720;
      const scale = Math.min(1, maxW / img.naturalWidth);
      c.width = img.naturalWidth * scale;
      c.height = img.naturalHeight * scale;
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
    };
    img.src = url;
  };

  const pickAt = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) * (c.width / rect.width));
    const y = Math.floor((clientY - rect.top) * (c.height / rect.height));
    const data = c.getContext("2d")?.getImageData(x, y, 1, 1).data;
    if (!data) return;
    const [r, g, b] = [data[0], data[1], data[2]];
    return { r, g, b, hex: "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase() };
  };

  return (
    <ToolShell title="Image Eye Dropper" description="Pick the exact color of any pixel from an uploaded image." category={categoryMap.design}>
      <Card className="p-3">
        <Label className="mb-2 block">Pick an image</Label>
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </Card>
      {src && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_280px]">
          <Card className="grid place-items-center bg-muted/20 p-3">
            <canvas
              ref={canvasRef}
              onMouseMove={(e) => {
                const pick = pickAt(e.clientX, e.clientY);
                if (pick) setHoverPos({ x: e.clientX, y: e.clientY });
                if (pick) {
                  setPickedHex(pick.hex);
                  setPickedRgb({ r: pick.r, g: pick.g, b: pick.b });
                }
              }}
              onClick={(e) => {
                const pick = pickAt(e.clientX, e.clientY);
                if (pick) {
                  setPickedHex(pick.hex);
                  setPickedRgb({ r: pick.r, g: pick.g, b: pick.b });
                }
              }}
              className="max-w-full cursor-crosshair rounded-md border"
            />
          </Card>
          <Card className="space-y-3 p-3">
            {pickedHex ? (
              <>
                <div className="h-24 rounded-md ring-1 ring-border" style={{ background: pickedHex }} />
                <div>
                  <Label className="text-xs">HEX</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 font-mono text-sm">{pickedHex}</code>
                    <CopyButton value={pickedHex} />
                  </div>
                </div>
                {pickedRgb && (
                  <div>
                    <Label className="text-xs">RGB</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 font-mono text-sm">rgb({pickedRgb.r}, {pickedRgb.g}, {pickedRgb.b})</code>
                      <CopyButton value={`rgb(${pickedRgb.r}, ${pickedRgb.g}, ${pickedRgb.b})`} />
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{hoverPos ? "Hover to preview, click to lock." : "Click any pixel to pick its color."}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Click any pixel on the image to pick a color.</p>
            )}
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
