import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCopy } from "@/hooks/useCopy";
import { categoryMap } from "@/data/categories";

// Subset of CSS named colors — 80 most useful
const COLORS: { name: string; hex: string }[] = [
  { name: "aliceblue", hex: "#f0f8ff" }, { name: "antiquewhite", hex: "#faebd7" }, { name: "aqua", hex: "#00ffff" },
  { name: "aquamarine", hex: "#7fffd4" }, { name: "azure", hex: "#f0ffff" }, { name: "beige", hex: "#f5f5dc" },
  { name: "bisque", hex: "#ffe4c4" }, { name: "black", hex: "#000000" }, { name: "blanchedalmond", hex: "#ffebcd" },
  { name: "blue", hex: "#0000ff" }, { name: "blueviolet", hex: "#8a2be2" }, { name: "brown", hex: "#a52a2a" },
  { name: "burlywood", hex: "#deb887" }, { name: "cadetblue", hex: "#5f9ea0" }, { name: "chartreuse", hex: "#7fff00" },
  { name: "chocolate", hex: "#d2691e" }, { name: "coral", hex: "#ff7f50" }, { name: "cornflowerblue", hex: "#6495ed" },
  { name: "crimson", hex: "#dc143c" }, { name: "cyan", hex: "#00ffff" }, { name: "darkblue", hex: "#00008b" },
  { name: "darkcyan", hex: "#008b8b" }, { name: "darkgoldenrod", hex: "#b8860b" }, { name: "darkgray", hex: "#a9a9a9" },
  { name: "darkgreen", hex: "#006400" }, { name: "darkkhaki", hex: "#bdb76b" }, { name: "darkmagenta", hex: "#8b008b" },
  { name: "darkolivegreen", hex: "#556b2f" }, { name: "darkorange", hex: "#ff8c00" }, { name: "darkorchid", hex: "#9932cc" },
  { name: "darkred", hex: "#8b0000" }, { name: "darksalmon", hex: "#e9967a" }, { name: "darkseagreen", hex: "#8fbc8f" },
  { name: "darkslateblue", hex: "#483d8b" }, { name: "darkslategray", hex: "#2f4f4f" }, { name: "darkturquoise", hex: "#00ced1" },
  { name: "darkviolet", hex: "#9400d3" }, { name: "deeppink", hex: "#ff1493" }, { name: "deepskyblue", hex: "#00bfff" },
  { name: "dodgerblue", hex: "#1e90ff" }, { name: "firebrick", hex: "#b22222" }, { name: "forestgreen", hex: "#228b22" },
  { name: "fuchsia", hex: "#ff00ff" }, { name: "gold", hex: "#ffd700" }, { name: "goldenrod", hex: "#daa520" },
  { name: "gray", hex: "#808080" }, { name: "green", hex: "#008000" }, { name: "greenyellow", hex: "#adff2f" },
  { name: "hotpink", hex: "#ff69b4" }, { name: "indianred", hex: "#cd5c5c" }, { name: "indigo", hex: "#4b0082" },
  { name: "ivory", hex: "#fffff0" }, { name: "khaki", hex: "#f0e68c" }, { name: "lavender", hex: "#e6e6fa" },
  { name: "lightblue", hex: "#add8e6" }, { name: "lightcoral", hex: "#f08080" }, { name: "lightgreen", hex: "#90ee90" },
  { name: "lightpink", hex: "#ffb6c1" }, { name: "lightsalmon", hex: "#ffa07a" }, { name: "lightseagreen", hex: "#20b2aa" },
  { name: "lime", hex: "#00ff00" }, { name: "limegreen", hex: "#32cd32" }, { name: "magenta", hex: "#ff00ff" },
  { name: "maroon", hex: "#800000" }, { name: "mediumaquamarine", hex: "#66cdaa" }, { name: "mediumblue", hex: "#0000cd" },
  { name: "mediumorchid", hex: "#ba55d3" }, { name: "mediumpurple", hex: "#9370db" }, { name: "mediumseagreen", hex: "#3cb371" },
  { name: "mediumslateblue", hex: "#7b68ee" }, { name: "midnightblue", hex: "#191970" }, { name: "navy", hex: "#000080" },
  { name: "olive", hex: "#808000" }, { name: "orange", hex: "#ffa500" }, { name: "orangered", hex: "#ff4500" },
  { name: "orchid", hex: "#da70d6" }, { name: "palegreen", hex: "#98fb98" }, { name: "peru", hex: "#cd853f" },
  { name: "pink", hex: "#ffc0cb" }, { name: "plum", hex: "#dda0dd" }, { name: "purple", hex: "#800080" },
  { name: "rebeccapurple", hex: "#663399" }, { name: "red", hex: "#ff0000" }, { name: "rosybrown", hex: "#bc8f8f" },
  { name: "royalblue", hex: "#4169e1" }, { name: "saddlebrown", hex: "#8b4513" }, { name: "salmon", hex: "#fa8072" },
  { name: "sandybrown", hex: "#f4a460" }, { name: "seagreen", hex: "#2e8b57" }, { name: "sienna", hex: "#a0522d" },
  { name: "silver", hex: "#c0c0c0" }, { name: "skyblue", hex: "#87ceeb" }, { name: "slateblue", hex: "#6a5acd" },
  { name: "slategray", hex: "#708090" }, { name: "springgreen", hex: "#00ff7f" }, { name: "steelblue", hex: "#4682b4" },
  { name: "tan", hex: "#d2b48c" }, { name: "teal", hex: "#008080" }, { name: "thistle", hex: "#d8bfd8" },
  { name: "tomato", hex: "#ff6347" }, { name: "turquoise", hex: "#40e0d0" }, { name: "violet", hex: "#ee82ee" },
  { name: "wheat", hex: "#f5deb3" }, { name: "white", hex: "#ffffff" }, { name: "yellow", hex: "#ffff00" },
  { name: "yellowgreen", hex: "#9acd32" },
];

export default function ColorName() {
  const [q, setQ] = useState("");
  const { copy } = useCopy();
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COLORS;
    return COLORS.filter((c) => c.name.includes(s) || c.hex.includes(s));
  }, [q]);

  return (
    <ToolShell title="Named CSS Colors" description="Browse and search named CSS colors. Click to copy the name or hex." category={categoryMap.design}>
      <Input placeholder="Search name or hex (e.g. blue, ff0)…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((c) => (
          <Card key={c.name} className="overflow-hidden p-0">
            <button onClick={() => copy(c.hex, `${c.hex} copied`)} className="block w-full">
              <div className="h-16" style={{ background: c.hex }} />
            </button>
            <div className="space-y-0.5 p-2">
              <button onClick={() => copy(c.name, `${c.name} copied`)} className="block w-full text-left text-xs font-medium hover:text-primary">{c.name}</button>
              <button onClick={() => copy(c.hex, `${c.hex} copied`)} className="block w-full text-left font-mono text-[10px] text-muted-foreground hover:text-foreground">{c.hex.toUpperCase()}</button>
            </div>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
