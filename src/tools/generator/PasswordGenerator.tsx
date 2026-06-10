import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { RefreshCw } from "lucide-react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT = "0123456789";
const SYMBOL = "!@#$%^&*()_+-=[]{};:,.<>/?~";

function pickRandom(chars: string) {
  const idx = crypto.getRandomValues(new Uint32Array(1))[0] % chars.length;
  return chars[idx];
}

function generate(opts: {
  length: number;
  lower: boolean;
  upper: boolean;
  digit: boolean;
  symbol: boolean;
}) {
  const pools: string[] = [];
  if (opts.lower) pools.push(LOWER);
  if (opts.upper) pools.push(UPPER);
  if (opts.digit) pools.push(DIGIT);
  if (opts.symbol) pools.push(SYMBOL);
  if (pools.length === 0) return "";

  // guarantee at least one of each selected pool
  const required = pools.map(pickRandom);
  const all = pools.join("");
  const rest = Array.from({ length: opts.length - required.length }, () =>
    pickRandom(all)
  );
  const arr = [...required, ...rest];
  // Fisher–Yates shuffle with crypto-random
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function strengthOf(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong", "Excellent"];
  return {
    score,
    label: labels[Math.min(score, labels.length - 1)],
    pct: Math.min(100, (score / 6) * 100),
  };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digit, setDigit] = useState(true);
  const [symbol, setSymbol] = useState(true);
  const [password, setPassword] = useState("");

  const regen = () =>
    setPassword(generate({ length, lower, upper, digit, symbol }));

  useEffect(() => {
    regen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, lower, upper, digit, symbol]);

  const strength = useMemo(() => strengthOf(password), [password]);

  return (
    <ToolShell
      title="Password Generator"
      description="Generate cryptographically random passwords with custom rules."
      category={categoryMap.generator}
    >
      <Card className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Input
            value={password}
            readOnly
            className="font-mono text-lg"
          />
          <Button onClick={regen} variant="outline" size="icon" aria-label="Regenerate">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <CopyButton value={password} label="Password copied" />
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Strength</span>
            <span>{strength.label}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${strength.pct}%`,
                background:
                  strength.score < 3
                    ? "hsl(0 84% 60%)"
                    : strength.score < 5
                    ? "hsl(38 92% 50%)"
                    : "hsl(142 71% 45%)",
              }}
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Length</Label>
            <span className="font-mono text-sm">{length}</span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            { label: "a-z lowercase", value: lower, setter: setLower },
            { label: "A-Z uppercase", value: upper, setter: setUpper },
            { label: "0-9 digits", value: digit, setter: setDigit },
            { label: "!@#$ symbols", value: symbol, setter: setSymbol },
          ].map((o) => (
            <label
              key={o.label}
              className="flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={o.value}
                onChange={(e) => o.setter(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              {o.label}
            </label>
          ))}
        </div>
      </Card>
    </ToolShell>
  );
}
