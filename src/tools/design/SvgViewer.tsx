import { useEffect, useRef, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Download } from "lucide-react";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#6366f1"/><path d="M22 32l8 8 16-16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export default function SvgViewer() {
  const [svg, setSvg] = useUrlState("svg", SAMPLE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = svg;
  }, [svg]);

  const downloadPng = async () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 512;
      canvas.height = img.naturalHeight || 512;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "image.png";
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <ToolShell
      title="SVG Viewer"
      description="Render any SVG snippet and download it as PNG."
      category={categoryMap.design}
      shareable
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setSvg(SAMPLE)}>Sample</Button>
          <Button size="sm" onClick={downloadPng}>
            <Download className="mr-2 h-4 w-4" /> PNG
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>SVG source</Label>
            <CopyButton value={svg} />
          </div>
          <Textarea value={svg} onChange={(e) => setSvg(e.target.value)} className="min-h-[360px]" spellCheck={false} />
        </Card>
        <Card className="grid min-h-[360px] place-items-center bg-muted/20 p-3">
          <div ref={ref} className="max-h-full max-w-full" />
        </Card>
      </div>
    </ToolShell>
  );
}
