import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.padEnd(6, "0").slice(0, 6);
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** Tint = mix with white, factor 0-1 */
function tint(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
}

/** Shade = mix with black */
function shade(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor));
}

const STEPS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

export default function TintShade() {
  const [base, setBase] = useUrlState("hex", "#4f46e5");

  const tints = useMemo(() => STEPS.map((f) => tint(base, f)).reverse(), [base]);
  const shades = useMemo(() => STEPS.map((f) => shade(base, f)), [base]);

  return (
    <ToolShell title="Tint & Shade" description="Generate tints (lighter) and shades (darker) of a color in 10% steps." category={categoryMap.design} shareable>
      <Card className="flex flex-wrap items-center gap-3 p-3">
        <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-9 w-12 cursor-pointer rounded border" />
        <Input value={base} onChange={(e) => setBase(e.target.value)} className="w-32 font-mono" />
        <span className="text-xs text-muted-foreground">Click any color to copy</span>
      </Card>

      <Card className="p-3">
        <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Tints (lighter)</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
          {tints.map((c) => (
            <ColorTile key={c} hex={c} />
          ))}
        </div>
      </Card>

      <Card className="p-3 ring-2 ring-primary/30">
        <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Base</Label>
        <ColorTile hex={base.toUpperCase()} big />
      </Card>

      <Card className="p-3">
        <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Shades (darker)</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
          {shades.map((c) => (
            <ColorTile key={c} hex={c} />
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}

function ColorTile({ hex, big = false }: { hex: string; big?: boolean }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className={big ? "h-20" : "h-12"} style={{ background: hex }} />
      <div className="flex items-center justify-between gap-1 p-1.5">
        <code className="font-mono text-[10px]">{hex.toUpperCase()}</code>
        <CopyButton value={hex.toUpperCase()} />
      </div>
    </div>
  );
}
