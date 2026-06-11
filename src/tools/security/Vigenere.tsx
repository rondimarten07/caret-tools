import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function vigenere(text: string, key: string, decrypt = false): string {
  const k = key.replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (!k) return text;
  let out = "";
  let ki = 0;
  for (const ch of text) {
    if (/[a-zA-Z]/.test(ch)) {
      const base = ch >= "a" ? 97 : 65;
      const shift = k.charCodeAt(ki % k.length) - 97;
      const s = decrypt ? -shift : shift;
      out += String.fromCharCode(((ch.charCodeAt(0) - base + s + 26) % 26) + base);
      ki++;
    } else {
      out += ch;
    }
  }
  return out;
}

export default function Vigenere() {
  const [text, setText] = useUrlState("t", "Attack at dawn");
  const [key, setKey] = useUrlState("k", "lemon");

  const encrypted = useMemo(() => vigenere(text, key, false), [text, key]);
  const decrypted = useMemo(() => vigenere(text, key, true), [text, key]);

  return (
    <ToolShell title="Vigenère Cipher" description="Encrypt and decrypt text with a repeating-key alphabetic cipher." category={categoryMap.security} shareable>
      <Card className="space-y-3 p-4">
        <div>
          <Label>Key</Label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label>Text</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <Label>Encrypted</Label>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all font-mono">{encrypted}</p>
          <CopyButton value={encrypted} />
        </div>
        <Label>Decrypted (assuming input was ciphertext)</Label>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-3">
          <p className="break-all font-mono">{decrypted}</p>
          <CopyButton value={decrypted} />
        </div>
      </Card>
    </ToolShell>
  );
}
