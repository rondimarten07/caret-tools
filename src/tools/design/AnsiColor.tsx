import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const FG = [
  { code: 30, name: "Black", hex: "#1a1a1a" },
  { code: 31, name: "Red", hex: "#cc0000" },
  { code: 32, name: "Green", hex: "#4e9a06" },
  { code: 33, name: "Yellow", hex: "#c4a000" },
  { code: 34, name: "Blue", hex: "#3465a4" },
  { code: 35, name: "Magenta", hex: "#75507b" },
  { code: 36, name: "Cyan", hex: "#06989a" },
  { code: 37, name: "White", hex: "#d3d7cf" },
  { code: 90, name: "Bright Black", hex: "#555753" },
  { code: 91, name: "Bright Red", hex: "#ef2929" },
  { code: 92, name: "Bright Green", hex: "#8ae234" },
  { code: 93, name: "Bright Yellow", hex: "#fce94f" },
  { code: 94, name: "Bright Blue", hex: "#729fcf" },
  { code: 95, name: "Bright Magenta", hex: "#ad7fa8" },
  { code: 96, name: "Bright Cyan", hex: "#34e2e2" },
  { code: 97, name: "Bright White", hex: "#eeeeec" },
];

const STYLES = [
  { code: 1, name: "Bold" },
  { code: 2, name: "Dim" },
  { code: 3, name: "Italic" },
  { code: 4, name: "Underline" },
  { code: 7, name: "Reverse" },
  { code: 9, name: "Strike" },
];

export default function AnsiColor() {
  const [text, setText] = useUrlState("text", "Hello Caret.");
  const [fg, setFg] = useState<number>(32);
  const [bg, setBg] = useState<number | null>(null);
  const [styles, setStyles] = useState<number[]>([]);

  const codes = useMemo(() => {
    const parts: number[] = [];
    parts.push(...styles);
    if (fg) parts.push(fg);
    if (bg) parts.push(bg + 10);
    return parts;
  }, [fg, bg, styles]);

  const escape = `\\x1b[${codes.join(";")}m${text}\\x1b[0m`;
  const bash = `echo -e "${escape}"`;
  const node = `console.log("${escape}")`;
  const python = `print("\\033[${codes.join(";")}m${text}\\033[0m")`;

  return (
    <ToolShell title="ANSI Color Picker" description="Compose ANSI escape sequences for terminal output." category={categoryMap.design}
      shareable>
      <Card className="space-y-3 p-3">
        <div>
          <Label className="mb-1 block">Text</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">Styles</Label>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map((s) => (
              <Button
                key={s.code}
                size="sm"
                variant={styles.includes(s.code) ? "default" : "outline"}
                onClick={() =>
                  setStyles((p) => (p.includes(s.code) ? p.filter((x) => x !== s.code) : [...p, s.code]))
                }
              >
                {s.name}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label className="mb-1 block">Foreground</Label>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            {FG.map((c) => (
              <button
                key={c.code}
                onClick={() => setFg(c.code)}
                title={c.name}
                style={{ background: c.hex }}
                className={`h-8 rounded ring-1 ring-black/10 ${fg === c.code ? "outline outline-2 outline-primary" : ""}`}
              />
            ))}
          </div>
        </div>
        <div>
          <Label className="mb-1 block">Background</Label>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            <button
              onClick={() => setBg(null)}
              className={`h-8 rounded border ${bg === null ? "outline outline-2 outline-primary" : ""}`}
            >
              None
            </button>
            {FG.map((c) => (
              <button
                key={c.code}
                onClick={() => setBg(c.code)}
                title={c.name}
                style={{ background: c.hex }}
                className={`h-8 rounded ring-1 ring-black/10 ${bg === c.code ? "outline outline-2 outline-primary" : ""}`}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 text-center bg-zinc-950">
        <pre className="font-mono text-lg">
          <span
            style={{
              color: FG.find((c) => c.code === fg)?.hex,
              background: bg ? FG.find((c) => c.code === bg)?.hex : undefined,
              fontWeight: styles.includes(1) ? 700 : undefined,
              opacity: styles.includes(2) ? 0.6 : 1,
              fontStyle: styles.includes(3) ? "italic" : undefined,
              textDecoration: styles.includes(4) ? "underline" : styles.includes(9) ? "line-through" : undefined,
            }}
          >
            {text}
          </span>
        </pre>
      </Card>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <Card className="p-3">
          <Label className="text-xs">Bash</Label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 break-all rounded bg-muted/30 p-2 font-mono text-xs">{bash}</code>
            <CopyButton value={bash} />
          </div>
        </Card>
        <Card className="p-3">
          <Label className="text-xs">Node</Label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 break-all rounded bg-muted/30 p-2 font-mono text-xs">{node}</code>
            <CopyButton value={node} />
          </div>
        </Card>
        <Card className="p-3">
          <Label className="text-xs">Python</Label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 break-all rounded bg-muted/30 p-2 font-mono text-xs">{python}</code>
            <CopyButton value={python} />
          </div>
        </Card>
      </div>
    </ToolShell>
  );
}
