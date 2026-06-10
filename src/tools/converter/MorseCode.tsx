import { useMemo, useRef, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { Play } from "lucide-react";

const TABLE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};

const REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(TABLE).map(([k, v]) => [v, k])
);

function encode(text: string): string {
  return text
    .toUpperCase()
    .split(/(\s+)/)
    .map((word) =>
      /\s/.test(word)
        ? "/"
        : Array.from(word).map((ch) => TABLE[ch] ?? "").filter(Boolean).join(" ")
    )
    .join(" ");
}

function decode(morse: string): string {
  return morse
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .split(/\s+/)
        .map((code) => REVERSE[code] ?? "")
        .join("")
    )
    .join(" ")
    .trim();
}

type Mode = "encode" | "decode";

export default function MorseCode() {
  const [mode, setMode] = useState<Mode>("encode");
  const [text, setText] = useUrlState("text", "hello world");
  const ctxRef = useRef<AudioContext | null>(null);

  const output = useMemo(() => (mode === "encode" ? encode(text) : decode(text)), [mode, text]);

  const play = async () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    const morse = mode === "encode" ? output : text;
    const dot = 0.07;
    let t = ctx.currentTime;
    for (const ch of morse) {
      if (ch === ".") {
        beep(ctx, t, dot);
        t += dot * 2;
      } else if (ch === "-") {
        beep(ctx, t, dot * 3);
        t += dot * 4;
      } else if (ch === " ") {
        t += dot * 2;
      } else if (ch === "/") {
        t += dot * 4;
      }
    }
  };

  return (
    <ToolShell title="Morse Code" description="Encode and decode Morse code, with audio playback." category={categoryMap.converter}
      shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Button size="sm" variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>Text → Morse</Button>
        <Button size="sm" variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>Morse → Text</Button>
        <Button size="sm" variant="outline" className="ml-auto" onClick={play}>
          <Play className="mr-1 h-3.5 w-3.5" /> Play sound
        </Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">{mode === "encode" ? "Text" : "Morse"}</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[220px] font-mono" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{mode === "encode" ? "Morse" : "Text"}</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[220px] bg-muted/30 font-mono" />
        </Card>
      </div>
    </ToolShell>
  );
}

function beep(ctx: AudioContext, start: number, duration: number) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 600;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(0.3, start + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}
