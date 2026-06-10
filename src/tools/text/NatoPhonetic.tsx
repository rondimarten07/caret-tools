import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const NATO: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
  G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
  M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
  S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray",
  Y: "Yankee", Z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
};

const REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(NATO).map(([k, v]) => [v.toLowerCase(), k])
);

type Mode = "encode" | "decode";

export default function NatoPhonetic() {
  const [mode, setMode] = useState<Mode>("encode");
  const [text, setText] = useUrlState("text", "Caret");

  const output = useMemo(() => {
    if (mode === "encode") {
      return Array.from(text.toUpperCase())
        .map((ch) => NATO[ch] ?? (ch === " " ? "(space)" : ch))
        .join(" ");
    }
    return text
      .split(/[\s,]+/)
      .map((w) => REVERSE[w.toLowerCase()] ?? "")
      .join("");
  }, [mode, text]);

  return (
    <ToolShell title="NATO Phonetic Alphabet" description="Translate text to and from the NATO phonetic alphabet." category={categoryMap.text} shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>Text → NATO</Button>
        <Button size="sm" variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>NATO → Text</Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[160px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Output</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[160px] bg-muted/30 font-mono" />
        </Card>
      </div>
      <Card className="p-3">
        <Label className="mb-2 block text-xs">Reference</Label>
        <div className="grid grid-cols-3 gap-1 text-xs sm:grid-cols-6">
          {Object.entries(NATO).map(([k, v]) => (
            <div key={k} className="flex justify-between rounded bg-muted/30 px-2 py-1">
              <span className="font-mono font-medium">{k}</span>
              <span className="text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
