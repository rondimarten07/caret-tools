import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

// Grade 1 Unified English Braille (basic letter + digit map).
const LETTER_TO_BRAILLE: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵",
  ".": "⠲", ",": "⠂", "?": "⠦", "!": "⠖", "'": "⠄", "-": "⠤", " ": " ",
};

const DIGIT_TO_BRAILLE: Record<string, string> = {
  "1": "⠁", "2": "⠃", "3": "⠉", "4": "⠙", "5": "⠑",
  "6": "⠋", "7": "⠛", "8": "⠓", "9": "⠊", "0": "⠚",
};

const NUMBER_INDICATOR = "⠼";
const CAPITAL_INDICATOR = "⠠";

function toBraille(text: string): string {
  let out = "";
  let inNumber = false;
  for (const ch of text) {
    if (/\d/.test(ch)) {
      if (!inNumber) { out += NUMBER_INDICATOR; inNumber = true; }
      out += DIGIT_TO_BRAILLE[ch];
    } else {
      inNumber = false;
      if (/[A-Z]/.test(ch)) {
        out += CAPITAL_INDICATOR + (LETTER_TO_BRAILLE[ch.toLowerCase()] || "");
      } else {
        out += LETTER_TO_BRAILLE[ch] ?? ch;
      }
    }
  }
  return out;
}

const REVERSE = Object.fromEntries(
  Object.entries(LETTER_TO_BRAILLE).map(([k, v]) => [v, k])
);

function fromBraille(text: string): string {
  let out = "";
  let i = 0;
  let numberMode = false;
  let capitalNext = false;
  while (i < text.length) {
    const ch = text[i];
    if (ch === NUMBER_INDICATOR) { numberMode = true; i++; continue; }
    if (ch === CAPITAL_INDICATOR) { capitalNext = true; i++; continue; }
    if (ch === " ") { out += " "; numberMode = false; i++; continue; }
    if (numberMode) {
      const dig = Object.entries(DIGIT_TO_BRAILLE).find(([, b]) => b === ch);
      if (dig) { out += dig[0]; i++; continue; }
      numberMode = false;
    }
    const letter = REVERSE[ch];
    if (letter) {
      out += capitalNext ? letter.toUpperCase() : letter;
      capitalNext = false;
    } else {
      out += ch;
    }
    i++;
  }
  return out;
}

export default function Braille() {
  const [text, setText] = useUrlState("t", "Hello World");
  const [braille, setBraille] = useUrlState("b", "");

  const brailleOut = useMemo(() => toBraille(text), [text]);
  const textOut = useMemo(() => fromBraille(braille), [braille]);

  return (
    <ToolShell title="Braille Translator" description="Translate text to and from Grade 1 Unified English Braille." category={categoryMap.converter} shareable>
      <Card className="space-y-3 p-4">
        <Label>Text → Braille</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all text-xl">{brailleOut || <span className="text-sm text-muted-foreground">—</span>}</p>
          <CopyButton value={brailleOut} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Braille → Text</Label>
        <Textarea value={braille} onChange={(e) => setBraille(e.target.value)} rows={2} placeholder="⠠⠓⠑⠇⠇⠕" className="text-xl" />
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all">{textOut || <span className="text-sm text-muted-foreground">—</span>}</p>
          <CopyButton value={textOut} />
        </div>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Supports letters, digits, basic punctuation, capital + number indicators. Full UEB contractions are not implemented.
      </div>
    </ToolShell>
  );
}
