import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

async function deriveKey(password: string, salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 150000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function b64(buf: ArrayBuffer | Uint8Array): string {
  const view = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...view));
}

function unb64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

export default function AesEncrypt() {
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const encrypt = async () => {
    setErr("");
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(password, salt);
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
      const payload = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
      payload.set(salt, 0);
      payload.set(iv, salt.length);
      payload.set(new Uint8Array(ciphertext), salt.length + iv.length);
      setOut(b64(payload));
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const decrypt = async () => {
    setErr("");
    try {
      const all = unb64(text);
      const salt = all.slice(0, 16);
      const iv = all.slice(16, 28);
      const ct = all.slice(28);
      const key = await deriveKey(password, salt);
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
      setOut(new TextDecoder().decode(plain));
    } catch (e) {
      setErr("Decryption failed — check password / input.");
    }
  };

  return (
    <ToolShell title="AES Encrypt / Decrypt" description="AES-GCM 256-bit with PBKDF2 key derivation." category={categoryMap.security}>
      <Card className="space-y-3 p-3">
        <div>
          <Label className="mb-1 block">Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">Text / ciphertext</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[140px]" />
        </div>
        <div className="flex gap-2">
          <Button onClick={encrypt} disabled={!password}>Encrypt</Button>
          <Button variant="outline" onClick={decrypt} disabled={!password}>Decrypt</Button>
        </div>
      </Card>
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label>Output</Label>
          {!err && <CopyButton value={out} />}
        </div>
        {err ? <p className="text-sm text-destructive">{err}</p> : <Textarea readOnly value={out} className="min-h-[140px] bg-muted/30" />}
      </Card>
    </ToolShell>
  );
}
