import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { RefreshCw } from "lucide-react";

const TEMPLATES = {
  desktop: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{v} Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.{m} Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:{f}) Gecko/20100101 Firefox/{f}",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:{f}) Gecko/20100101 Firefox/{f}",
  ],
  mobile: [
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{v} Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.{m} Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{v} Mobile Safari/537.36",
  ],
  bot: [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/{v} Safari/537.36",
  ],
} as const;
type Cat = keyof typeof TEMPLATES;

function pick<T>(arr: readonly T[]): T {
  return arr[crypto.getRandomValues(new Uint32Array(1))[0] % arr.length];
}

function gen(cat: Cat): string {
  const chromeV = `${120 + (crypto.getRandomValues(new Uint8Array(1))[0] % 10)}.0.0.0`;
  const ffV = `${120 + (crypto.getRandomValues(new Uint8Array(1))[0] % 10)}.0`;
  const safariM = `${1 + (crypto.getRandomValues(new Uint8Array(1))[0] % 5)}`;
  return pick(TEMPLATES[cat]).replace("{v}", chromeV).replace("{f}", ffV).replace("{m}", safariM);
}

export default function UaGenerator() {
  const [cat, setCat] = useState<Cat>("desktop");
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    setList(Array.from({ length: 8 }, () => gen(cat)));
  }, [cat]);

  return (
    <ToolShell title="Random User-Agent" description="Generate random realistic User-Agent strings for testing." category={categoryMap.network}
      actions={<Button size="sm" onClick={() => setList(Array.from({ length: 8 }, () => gen(cat)))}><RefreshCw className="mr-2 h-3.5 w-3.5" />Regenerate</Button>}
    >
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Category</Label>
        {(["desktop", "mobile", "bot"] as Cat[]).map((c) => (
          <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
        ))}
      </Card>
      <div className="space-y-2">
        {list.map((ua, i) => (
          <Card key={i} className="flex items-center gap-2 p-3">
            <code className="flex-1 break-all font-mono text-xs">{ua}</code>
            <CopyButton value={ua} />
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
