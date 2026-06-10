import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

const SIZES = [16, 32, 64, 128, 256];

export default function FaviconGenerator() {
  const [text, setText] = useState("⚡");
  const [bg, setBg] = useState("#0f172a");
  const [fg, setFg] = useState("#ffffff");
  const [radius, setRadius] = useState(24);
  const canvases = useRef<Record<number, HTMLCanvasElement | null>>({});

  useEffect(() => {
    SIZES.forEach((s) => {
      const c = canvases.current[s];
      if (!c) return;
      c.width = s;
      c.height = s;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, s, s);
      const r = (radius / 100) * (s / 2);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(s - r, 0);
      ctx.quadraticCurveTo(s, 0, s, r);
      ctx.lineTo(s, s - r);
      ctx.quadraticCurveTo(s, s, s - r, s);
      ctx.lineTo(r, s);
      ctx.quadraticCurveTo(0, s, 0, s - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = `${Math.round(s * 0.62)}px ui-sans-serif, system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text || "?", s / 2, s / 2 + s * 0.04);
    });
  }, [text, bg, fg, radius]);

  const download = (size: number) => {
    const c = canvases.current[size];
    if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `favicon-${size}.png`;
    a.click();
  };

  return (
    <ToolShell title="Favicon Generator" description="Generate multi-size favicons from emoji or initials." category={categoryMap.design}>
      <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        <div>
          <Label className="text-xs">Symbol</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={3} />
        </div>
        <div>
          <Label className="text-xs">Background</Label>
          <Input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 p-1" />
        </div>
        <div>
          <Label className="text-xs">Foreground</Label>
          <Input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 p-1" />
        </div>
        <div>
          <Label className="text-xs">Corner radius (%)</Label>
          <Input type="number" min={0} max={50} value={radius} onChange={(e) => setRadius(Number(e.target.value) || 0)} />
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {SIZES.map((s) => (
          <Card key={s} className="flex flex-col items-center gap-2 p-3">
            <canvas
              ref={(el) => {
                canvases.current[s] = el;
              }}
              className="rounded border bg-white"
              style={{ width: 96, height: 96, imageRendering: "pixelated" }}
            />
            <span className="text-xs text-muted-foreground">{s}×{s}</span>
            <Button size="sm" variant="outline" onClick={() => download(s)}>
              <Download className="mr-1 h-3 w-3" /> PNG
            </Button>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
