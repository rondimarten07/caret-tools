import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function poolSize(p: string): number {
  let pool = 0;
  if (/[a-z]/.test(p)) pool += 26;
  if (/[A-Z]/.test(p)) pool += 26;
  if (/\d/.test(p)) pool += 10;
  if (/[^\w\s]/.test(p)) pool += 33;
  if (/\s/.test(p)) pool += 1;
  return pool || 1;
}

function fmtTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "∞";
  const units: [number, string][] = [
    [60, "seconds"],
    [60, "minutes"],
    [24, "hours"],
    [365, "days"],
    [100, "years"],
    [10, "centuries"],
    [10, "millennia"],
  ];
  let val = seconds;
  let label = "seconds";
  for (const [div, name] of units) {
    if (val < div) break;
    val /= div;
    label = name;
  }
  if (val > 1e9) return `${val.toExponential(2)} ${label}`;
  return `${val.toFixed(val < 10 ? 2 : 0)} ${label}`;
}

export default function PasswordEntropy() {
  const [pw, setPw] = useUrlState("p", "Tr0ub4dor&3");

  const data = useMemo(() => {
    const pool = poolSize(pw);
    const bits = pw.length === 0 ? 0 : pw.length * Math.log2(pool);
    const guessesPerSec = 1e10; // online attacker w/ hashing — adjust mentally
    const seconds = (Math.pow(2, bits) / 2) / guessesPerSec;
    let strength: string;
    if (bits < 28) strength = "Very weak";
    else if (bits < 36) strength = "Weak";
    else if (bits < 60) strength = "Reasonable";
    else if (bits < 128) strength = "Strong";
    else strength = "Very strong";
    return { pool, bits, seconds, strength };
  }, [pw]);

  return (
    <ToolShell title="Password Entropy" description="Estimate password entropy (bits) and crack time at 10 billion guesses/sec." category={categoryMap.security} shareable>
      <Card className="space-y-3 p-4">
        <Label>Password</Label>
        <Input value={pw} onChange={(e) => setPw(e.target.value)} className="font-mono" autoComplete="off" />
        <p className="text-xs text-muted-foreground">{pw.length} characters · {data.pool}-character pool</p>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="p-4 text-center">
          <div className="text-xs uppercase text-muted-foreground">Entropy</div>
          <div className="mt-1 text-3xl font-mono">{data.bits.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">bits</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xs uppercase text-muted-foreground">Strength</div>
          <div className="mt-1 text-2xl">{data.strength}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xs uppercase text-muted-foreground">Crack time*</div>
          <div className="mt-1 text-lg">{fmtTime(data.seconds)}</div>
          <div className="text-xs text-muted-foreground">at 10¹⁰ guesses/sec</div>
        </Card>
      </div>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        * Brute-force estimate assuming random characters from the detected pool. <strong>Real attackers use dictionaries</strong> — "Tr0ub4dor&amp;3" would fall in seconds despite ~30 bits of formal entropy. Prefer 4+ random words (diceware) or a password manager.
      </div>
    </ToolShell>
  );
}
