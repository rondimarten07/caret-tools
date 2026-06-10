import { useEffect, useState } from "react";
import figlet from "figlet";
// figlet fonts ship as importable strings
// @ts-ignore — no .d.ts for these subpaths
import standard from "figlet/importable-fonts/Standard.js";
// @ts-ignore
import slant from "figlet/importable-fonts/Slant.js";
// @ts-ignore
import small from "figlet/importable-fonts/Small.js";
// @ts-ignore
import big from "figlet/importable-fonts/Big.js";
// @ts-ignore
import block from "figlet/importable-fonts/Block.js";
// @ts-ignore
import banner from "figlet/importable-fonts/Banner.js";

import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const FONTS = {
  Standard: standard,
  Slant: slant,
  Small: small,
  Big: big,
  Block: block,
  Banner: banner,
} as const;
type FontName = keyof typeof FONTS;

let registered = false;
function ensureFonts() {
  if (registered) return;
  for (const [name, data] of Object.entries(FONTS)) {
    figlet.parseFont(name, data as string);
  }
  registered = true;
}

export default function AsciiArt() {
  const [text, setText] = useUrlState("text", "Tools Hub");
  const [font, setFont] = useState<FontName>("Standard");
  const [output, setOutput] = useState("");

  useEffect(() => {
    ensureFonts();
    try {
      const art = figlet.textSync(text, { font });
      setOutput(art);
    } catch (err) {
      setOutput("Error: " + (err as Error).message);
    }
  }, [text, font]);

  return (
    <ToolShell title="ASCII Art (Figlet)" description="Generate banner-style ASCII art from text." category={categoryMap.text}
      shareable>
      <Card className="space-y-3 p-3">
        <div>
          <Label className="mb-1 block text-xs">Text</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FONTS) as FontName[]).map((f) => (
            <Button key={f} size="sm" variant={font === f ? "default" : "outline"} onClick={() => setFont(f)}>
              {f}
            </Button>
          ))}
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Output</Label>
          <CopyButton value={output} />
        </div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-4 font-mono text-xs leading-tight">{output}</pre>
      </Card>
    </ToolShell>
  );
}
