import { useEffect, useState } from "react";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { RefreshCw } from "lucide-react";

const STRENGTHS = [128, 160, 192, 224, 256] as const;
type Strength = (typeof STRENGTHS)[number];

function bytesToHex(b: Uint8Array): string {
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

export default function Bip39Mnemonic() {
  const [strength, setStrength] = useState<Strength>(128);
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [seedHex, setSeedHex] = useState("");
  const [entropyHex, setEntropyHex] = useState("");
  const [valid, setValid] = useState(true);

  const regenerate = () => {
    const m = bip39.generateMnemonic(wordlist, strength);
    setMnemonic(m);
  };

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!mnemonic.trim()) {
          setValid(true);
          setSeedHex("");
          setEntropyHex("");
          return;
        }
        const ok = bip39.validateMnemonic(mnemonic, wordlist);
        setValid(ok);
        if (ok) {
          const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);
          const entropy = bip39.mnemonicToEntropy(mnemonic, wordlist);
          if (!cancelled) {
            setSeedHex(bytesToHex(seed));
            setEntropyHex(bytesToHex(entropy));
          }
        } else {
          setSeedHex("");
          setEntropyHex("");
        }
      } catch {
        setValid(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mnemonic, passphrase]);

  const words = mnemonic.split(/\s+/).filter(Boolean);

  return (
    <ToolShell
      title="BIP39 Mnemonic"
      description="Generate BIP39 seed phrases and the binary seed (PBKDF2 of mnemonic + passphrase)."
      category={categoryMap.security}
    >
      <Card className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Strength</Label>
          {STRENGTHS.map((s) => (
            <Button key={s} size="sm" variant={strength === s ? "default" : "outline"} onClick={() => setStrength(s)}>
              {s} bits ({s === 128 ? 12 : s === 160 ? 15 : s === 192 ? 18 : s === 224 ? 21 : 24} words)
            </Button>
          ))}
          <Button onClick={regenerate} variant="outline" size="icon" className="ml-auto" aria-label="Regenerate">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <Label className="mb-1 block text-xs">Mnemonic</Label>
          <textarea
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            className="min-h-[120px] w-full rounded-md border bg-background p-3 font-mono text-sm"
            spellCheck={false}
          />
          <div className="mt-1 text-xs">
            {valid ? (
              <span className="text-emerald-600 dark:text-emerald-400">✓ Valid · {words.length} words</span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">✗ Invalid checksum or unknown word</span>
            )}
          </div>
        </div>
        <div>
          <Label className="mb-1 block text-xs">Passphrase (optional, BIP39 "13th word")</Label>
          <Input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />
        </div>
      </Card>

      <Card className="space-y-3 p-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label className="text-xs">Entropy (hex)</Label>
            <CopyButton value={entropyHex} />
          </div>
          <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-xs">
            {entropyHex || <span className="text-muted-foreground">—</span>}
          </code>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label className="text-xs">Seed (hex, 64 bytes)</Label>
            <CopyButton value={seedHex} />
          </div>
          <code className="block break-all rounded-md bg-muted/30 p-3 font-mono text-xs">
            {seedHex || <span className="text-muted-foreground">—</span>}
          </code>
        </div>
      </Card>

      <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        ⚠ Generated phrases are random and never leave your browser. Do not use phrases generated on a device that may be compromised for real-world wallets.
      </div>
    </ToolShell>
  );
}
