import { useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const CARDS: { brand: string; number: string; cvv: string; expiry: string; behavior: string; source: string }[] = [
  { brand: "Visa", number: "4242 4242 4242 4242", cvv: "any 3", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "Visa (debit)", number: "4000 0566 5566 5556", cvv: "any 3", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "Mastercard", number: "5555 5555 5555 4444", cvv: "any 3", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "Mastercard (debit)", number: "5200 8282 8282 8210", cvv: "any 3", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "Mastercard (prepaid)", number: "5105 1051 0510 5100", cvv: "any 3", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "American Express", number: "3782 822463 10005", cvv: "any 4", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "Discover", number: "6011 1111 1111 1117", cvv: "any 3", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "JCB", number: "3566 0020 2036 0505", cvv: "any 3", expiry: "future", behavior: "✓ Always succeeds", source: "Stripe" },
  { brand: "Visa", number: "4000 0000 0000 0002", cvv: "any 3", expiry: "future", behavior: "✗ Card declined", source: "Stripe" },
  { brand: "Visa", number: "4000 0000 0000 0069", cvv: "any 3", expiry: "future", behavior: "✗ Expired card", source: "Stripe" },
  { brand: "Visa", number: "4000 0000 0000 0127", cvv: "any 3", expiry: "future", behavior: "✗ Incorrect CVC", source: "Stripe" },
  { brand: "Visa", number: "4000 0000 0000 0119", cvv: "any 3", expiry: "future", behavior: "✗ Processing error", source: "Stripe" },
  { brand: "Visa (3DS req)", number: "4000 0027 6000 3184", cvv: "any 3", expiry: "future", behavior: "🔒 Requires 3D Secure", source: "Stripe" },
];

export default function TestCardNumbers() {
  const [filter, setFilter] = useState<"all" | "ok" | "fail" | "3ds">("all");
  const list = CARDS.filter((c) => filter === "all" || (filter === "ok" && c.behavior.startsWith("✓")) || (filter === "fail" && c.behavior.startsWith("✗")) || (filter === "3ds" && c.behavior.startsWith("🔒")));

  return (
    <ToolShell title="Test Card Numbers" description="Reference of valid test card numbers for Stripe / sandbox payment testing. Do NOT use real cards." category={categoryMap.security}>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {(["all", "ok", "fail", "3ds"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-md border px-3 py-1.5 text-sm ${filter === f ? "bg-primary text-primary-foreground" : "bg-card"}`}>{f}</button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{list.length} cards</span>
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Brand</th>
              <th className="p-3">Number</th>
              <th className="p-3">CVV</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Behavior</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-3">{c.brand}</td>
                <td className="p-3 font-mono">{c.number}</td>
                <td className="p-3 font-mono text-muted-foreground">{c.cvv}</td>
                <td className="p-3 text-muted-foreground">{c.expiry}</td>
                <td className="p-3 text-xs">{c.behavior}</td>
                <td className="p-3"><CopyButton value={c.number.replace(/\s/g, "")} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        ⚠ These pass Luhn but are SAFE/INVALID in production. Most payment processors (Stripe, Adyen, Braintree) accept these in sandbox/test mode only.
      </div>
    </ToolShell>
  );
}
