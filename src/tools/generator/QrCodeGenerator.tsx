import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

type Level = "L" | "M" | "Q" | "H";

export default function QrCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://github.com");
  const [size, setSize] = useState(320);
  const [level, setLevel] = useState<Level>("M");
  const [margin, setMargin] = useState(2);
  const [dark, setDark] = useState("#0f172a");
  const [light, setLight] = useState("#ffffff");

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }
    QRCode.toCanvas(
      canvasRef.current,
      text,
      {
        width: size,
        margin,
        errorCorrectionLevel: level,
        color: { dark, light },
      },
      () => {}
    );
  }, [text, size, level, margin, dark, light]);

  const download = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <ToolShell
      title="QR Code Generator"
      description="Create a downloadable QR code from any text or URL."
      category={categoryMap.generator}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="p-4">
          <Label className="mb-2 block">Content</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[140px]"
            placeholder="URL, text, vCard, Wi-Fi string…"
            spellCheck={false}
          />

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <Label className="text-xs">Size (px)</Label>
              <Input
                type="number"
                min={128}
                max={1024}
                step={32}
                value={size}
                onChange={(e) => setSize(Number(e.target.value) || 256)}
              />
            </div>
            <div>
              <Label className="text-xs">Margin</Label>
              <Input
                type="number"
                min={0}
                max={10}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label className="text-xs">Dark</Label>
              <Input
                type="color"
                value={dark}
                onChange={(e) => setDark(e.target.value)}
                className="h-9 p-1"
              />
            </div>
            <div>
              <Label className="text-xs">Light</Label>
              <Input
                type="color"
                value={light}
                onChange={(e) => setLight(e.target.value)}
                className="h-9 p-1"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs">Error correction</Label>
            <div className="mt-1 flex gap-2">
              {(["L", "M", "Q", "H"] as Level[]).map((l) => (
                <Button
                  key={l}
                  size="sm"
                  variant={level === l ? "default" : "outline"}
                  onClick={() => setLevel(l)}
                >
                  {l}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="rounded-lg border bg-white p-3 dark:bg-zinc-950">
            <canvas ref={canvasRef} className="block max-w-full" />
          </div>
          <Button onClick={download} disabled={!text}>
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </Card>
      </div>
    </ToolShell>
  );
}
