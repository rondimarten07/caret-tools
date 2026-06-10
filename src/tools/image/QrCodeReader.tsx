import { useState } from "react";
import jsQR from "jsqr";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function QrCodeReader() {
  const [src, setSrc] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const onFile = (f: File) => {
    setErr("");
    setText("");
    const url = URL.createObjectURL(f);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        setErr("Could not read image.");
        return;
      }
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height);
      if (code) {
        setText(code.data);
      } else {
        setErr("No QR code detected. Try a clearer / higher contrast image.");
      }
    };
    img.src = url;
  };

  const onPaste = async (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((it) => it.type.startsWith("image/"));
    if (!item) return;
    const f = item.getAsFile();
    if (f) onFile(f);
  };

  return (
    <ToolShell title="QR Code Reader" description="Decode QR codes from any image. Drop, pick, or paste a screenshot." category={categoryMap.image}>
      <Card className="space-y-3 p-3" onPaste={onPaste}>
        <Label>Drop an image or paste a screenshot (Ctrl+V)</Label>
        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </Card>
      {src && (
        <Card className="grid place-items-center p-3">
          <img src={src} alt="" className="max-h-72 rounded-md border" />
        </Card>
      )}
      {(text || err) && (
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{err ? "Error" : "Decoded"}</Label>
            {!err && <CopyButton value={text} />}
          </div>
          {err ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{err}</div>
          ) : (
            <Textarea readOnly value={text} className="min-h-[120px] bg-muted/30" />
          )}
        </Card>
      )}
    </ToolShell>
  );
}
