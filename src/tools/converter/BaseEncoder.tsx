import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const B85 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~";

function bytesFromString(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function stringFromBytes(b: Uint8Array): string {
  return new TextDecoder().decode(b);
}

/* ---------- Base32 (RFC 4648) ---------- */
function encB32(buf: Uint8Array): string {
  let bits = 0, val = 0, out = "";
  for (const b of buf) {
    val = (val << 8) | b;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += B32[(val >> bits) & 31];
    }
  }
  if (bits) out += B32[(val << (5 - bits)) & 31];
  while (out.length % 8) out += "=";
  return out;
}

function decB32(s: string): Uint8Array {
  s = s.replace(/=+$/g, "").toUpperCase();
  let bits = 0, val = 0;
  const out: number[] = [];
  for (const ch of s) {
    const idx = B32.indexOf(ch);
    if (idx < 0) throw new Error("Invalid Base32 character: " + ch);
    val = (val << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((val >> bits) & 0xff);
    }
  }
  return new Uint8Array(out);
}

/* ---------- Base58 (Bitcoin) ---------- */
function encB58(buf: Uint8Array): string {
  let zeros = 0;
  while (zeros < buf.length && buf[zeros] === 0) zeros++;
  let n = 0n;
  for (const b of buf) n = (n << 8n) | BigInt(b);
  let out = "";
  while (n > 0n) {
    out = B58[Number(n % 58n)] + out;
    n /= 58n;
  }
  return "1".repeat(zeros) + out;
}

function decB58(s: string): Uint8Array {
  let zeros = 0;
  while (zeros < s.length && s[zeros] === "1") zeros++;
  let n = 0n;
  for (const ch of s) {
    const idx = B58.indexOf(ch);
    if (idx < 0) throw new Error("Invalid Base58 character: " + ch);
    n = n * 58n + BigInt(idx);
  }
  const out: number[] = [];
  while (n > 0n) {
    out.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  return new Uint8Array([...new Array(zeros).fill(0), ...out]);
}

/* ---------- Base85 (z85 variant) ---------- */
function encB85(buf: Uint8Array): string {
  const padded = new Uint8Array(Math.ceil(buf.length / 4) * 4);
  padded.set(buf);
  let out = "";
  for (let i = 0; i < padded.length; i += 4) {
    let v =
      (padded[i] << 24) +
      (padded[i + 1] << 16) +
      (padded[i + 2] << 8) +
      padded[i + 3];
    v = v >>> 0;
    let chunk = "";
    for (let j = 0; j < 5; j++) {
      chunk = B85[v % 85] + chunk;
      v = Math.floor(v / 85);
    }
    out += chunk;
  }
  const pad = padded.length - buf.length;
  return pad ? out.slice(0, out.length - pad) : out;
}

function decB85(s: string): Uint8Array {
  const pad = (5 - (s.length % 5)) % 5;
  const padded = s + B85[84].repeat(pad);
  const out: number[] = [];
  for (let i = 0; i < padded.length; i += 5) {
    let v = 0;
    for (let j = 0; j < 5; j++) {
      const idx = B85.indexOf(padded[i + j]);
      if (idx < 0) throw new Error("Invalid Base85 character: " + padded[i + j]);
      v = v * 85 + idx;
    }
    out.push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
  }
  return new Uint8Array(out.slice(0, out.length - pad));
}

type Base = "32" | "58" | "85";

export default function BaseEncoder() {
  const [base, setBase] = useState<Base>("32");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useUrlState("text", "Hello, world!");

  const result = useMemo(() => {
    if (!input) return { ok: true as const, output: "" };
    try {
      if (mode === "encode") {
        const buf = bytesFromString(input);
        const out = base === "32" ? encB32(buf) : base === "58" ? encB58(buf) : encB85(buf);
        return { ok: true as const, output: out };
      }
      const buf = base === "32" ? decB32(input) : base === "58" ? decB58(input) : decB85(input);
      return { ok: true as const, output: stringFromBytes(buf) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [base, mode, input]);

  return (
    <ToolShell title="Base32 / 58 / 85" description="Encode and decode Base32 (RFC 4648), Base58 (Bitcoin) and Base85." category={categoryMap.converter}
      shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(["32", "58", "85"] as Base[]).map((b) => (
          <Button key={b} size="sm" variant={base === b ? "default" : "outline"} onClick={() => setBase(b)}>Base{b}</Button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")}>Encode</Button>
          <Button size="sm" variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")}>Decode</Button>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[240px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Output" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[240px] bg-muted/30" spellCheck={false} />
          ) : (
            <div className="min-h-[240px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{result.error}</div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
