import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "");
  const v = m.length === 3
    ? m.split("").map((c) => c + c).join("")
    : m.padEnd(6, "0").slice(0, 6);
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : Math.round((d / max) * 100);
  const v = Math.round(max * 100);
  return { h, s, v };
}

function rgbToCmyk(r: number, g: number, b: number) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  const c = (1 - rr - k) / (1 - k);
  const m = (1 - gg - k) / (1 - k);
  const y = (1 - bb - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export default function ColorPicker() {
  const [hex, setHex] = useUrlState("hex", "#6366f1");

  const data = useMemo(() => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    return {
      rgb,
      hsl,
      hsv,
      cmyk,
      rgbStr: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hslStr: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsvStr: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmykStr: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    };
  }, [hex]);

  return (
    <ToolShell
      title="Color Picker"
      description="Pick a color and copy values in HEX, RGB, HSL, HSV or CMYK."
      category={categoryMap.design}
      shareable
    >
      <Card
        className="flex flex-col items-stretch gap-4 overflow-hidden p-0 md:flex-row"
        style={{ borderColor: "transparent" }}
      >
        <div
          className="flex min-h-[180px] flex-1 items-end p-6 text-white shadow-inner"
          style={{ backgroundColor: hex }}
        >
          <div className="rounded-md bg-black/30 px-3 py-1 font-mono text-sm backdrop-blur">
            {hex.toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4 md:w-72">
          <Label>Pick color</Label>
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="h-12 w-full cursor-pointer rounded-md border bg-transparent"
          />
          <Input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            spellCheck={false}
            className="font-mono"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[
          { label: "HEX", value: hex.toUpperCase() },
          { label: "RGB", value: data.rgbStr },
          { label: "HSL", value: data.hslStr },
          { label: "HSV", value: data.hsvStr },
          { label: "CMYK", value: data.cmykStr },
        ].map((f) => (
          <Card key={f.label} className="flex items-center gap-3 p-3">
            <span className="w-16 text-xs uppercase tracking-wide text-muted-foreground">
              {f.label}
            </span>
            <code className="flex-1 truncate font-mono text-sm">{f.value}</code>
            <CopyButton value={f.value} />
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
