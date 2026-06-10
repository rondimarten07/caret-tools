import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Cipher = "caesar" | "rot13" | "vigenere" | "atbash";

function shift(ch: string, by: number): string {
  const c = ch.charCodeAt(0);
  if (c >= 65 && c <= 90) return String.fromCharCode(((c - 65 + by + 26 * 100) % 26) + 65);
  if (c >= 97 && c <= 122) return String.fromCharCode(((c - 97 + by + 26 * 100) % 26) + 97);
  return ch;
}

function caesar(text: string, key: number, decode: boolean): string {
  const k = decode ? -key : key;
  return Array.from(text).map((ch) => shift(ch, k)).join("");
}

function vigenere(text: string, key: string, decode: boolean): string {
  if (!key) return text;
  const ks = key.replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (!ks) return text;
  let i = 0;
  return Array.from(text)
    .map((ch) => {
      if (!/[a-zA-Z]/.test(ch)) return ch;
      const by = ks.charCodeAt(i % ks.length) - 97;
      i++;
      return shift(ch, decode ? -by : by);
    })
    .join("");
}

function atbash(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const c = ch.charCodeAt(0);
      if (c >= 65 && c <= 90) return String.fromCharCode(90 - (c - 65));
      if (c >= 97 && c <= 122) return String.fromCharCode(122 - (c - 97));
      return ch;
    })
    .join("");
}

export default function ClassicalCiphers() {
  const [cipher, setCipher] = useState<Cipher>("caesar");
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [text, setText] = useUrlState("text", "Hello world");
  const [shiftKey, setShiftKey] = useState(3);
  const [vigKey, setVigKey] = useState("secret");

  const output = useMemo(() => {
    switch (cipher) {
      case "caesar": return caesar(text, shiftKey, mode === "dec");
      case "rot13": return caesar(text, 13, false);
      case "vigenere": return vigenere(text, vigKey, mode === "dec");
      case "atbash": return atbash(text);
    }
  }, [cipher, mode, text, shiftKey, vigKey]);

  return (
    <ToolShell title="Classical Ciphers" description="Caesar, ROT13, Vigenère and Atbash encrypt + decrypt." category={categoryMap.security}
      shareable>
      <Card className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {(["caesar", "rot13", "vigenere", "atbash"] as Cipher[]).map((c) => (
            <Button key={c} size="sm" variant={cipher === c ? "default" : "outline"} onClick={() => setCipher(c)}>{c}</Button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {cipher !== "rot13" && cipher !== "atbash" && (
              <>
                <Button size="sm" variant={mode === "enc" ? "default" : "outline"} onClick={() => setMode("enc")}>Encrypt</Button>
                <Button size="sm" variant={mode === "dec" ? "default" : "outline"} onClick={() => setMode("dec")}>Decrypt</Button>
              </>
            )}
          </div>
        </div>
        {cipher === "caesar" && (
          <div>
            <Label className="text-xs">Shift</Label>
            <Input type="number" value={shiftKey} onChange={(e) => setShiftKey(Number(e.target.value) || 0)} className="w-24" />
          </div>
        )}
        {cipher === "vigenere" && (
          <div>
            <Label className="text-xs">Key</Label>
            <Input value={vigKey} onChange={(e) => setVigKey(e.target.value)} />
          </div>
        )}
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[260px]" />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Output</Label>
            <CopyButton value={output} />
          </div>
          <Textarea readOnly value={output} className="min-h-[260px] bg-muted/30" />
        </Card>
      </div>
    </ToolShell>
  );
}
