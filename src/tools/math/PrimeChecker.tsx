import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function isPrime(n: bigint): boolean {
  if (n < 2n) return false;
  if (n < 4n) return true;
  if (n % 2n === 0n) return false;
  if (n % 3n === 0n) return false;
  for (let i = 5n; i * i <= n; i += 6n) {
    if (n % i === 0n || n % (i + 2n) === 0n) return false;
  }
  return true;
}

function nextPrime(n: bigint): bigint {
  let i = n + 1n;
  while (!isPrime(i)) i++;
  return i;
}

function prevPrime(n: bigint): bigint | null {
  let i = n - 1n;
  while (i >= 2n) {
    if (isPrime(i)) return i;
    i--;
  }
  return null;
}

export default function PrimeChecker() {
  const [n, setN] = useUrlState("n", "97");

  const data = useMemo(() => {
    try {
      const v = BigInt(n.trim());
      if (v < 0n || v > 10n ** 18n) return { error: "Enter 0 ≤ n ≤ 10¹⁸." };
      const prime = isPrime(v);
      return { v, prime, next: nextPrime(v), prev: prevPrime(v) };
    } catch {
      return { error: "Enter a non-negative integer." };
    }
  }, [n]);

  return (
    <ToolShell title="Prime Checker" description="Is N prime? Plus next and previous primes (trial division up to √N)." category={categoryMap.math} shareable>
      <Card className="space-y-3 p-4">
        <Label>n</Label>
        <Input value={n} onChange={(e) => setN(e.target.value)} className="font-mono" />
      </Card>
      {"error" in data && data.error ? (
        <Card className="p-4 text-sm text-destructive">{data.error}</Card>
      ) : (
        <Card className="p-4">
          <div className={`text-center text-3xl ${data.prime ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
            {data.prime ? `✓ ${data.v} is prime` : `✗ ${data.v} is not prime`}
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <div>
                <dt className="text-xs text-muted-foreground">Previous prime</dt>
                <dd className="font-mono">{data.prev === null ? "—" : String(data.prev)}</dd>
              </div>
              {data.prev !== null && <CopyButton value={String(data.prev)} />}
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
              <div>
                <dt className="text-xs text-muted-foreground">Next prime</dt>
                <dd className="font-mono">{String(data.next)}</dd>
              </div>
              <CopyButton value={String(data.next)} />
            </div>
          </dl>
        </Card>
      )}
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Uses 6k±1 trial division — fast up to ~10¹². Larger numbers stay correct but get slow.
      </div>
    </ToolShell>
  );
}
