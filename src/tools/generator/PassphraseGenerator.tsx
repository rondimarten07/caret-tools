import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";
import { RefreshCw } from "lucide-react";

const WORDS = "able acid alert amber angel apple arrow aspen atlas autumn baker basic beach berry blade blank brave bread brick broom canal candy cargo cedar charm chess clay coast cobra coral cosmic crisp daisy delta donut dream early ember falcon fern fiber flame fog forest fox glade glow grand grove guide harbor harvest haze hero ivory jade jolly jungle keen knight koala lake lemon lily linen lotus mango marble mint moon nest nimble noble nova ocean olive opal orchid pale panda peach pearl pebble pine plain plum quartz quest quiet rapid raven ridge river robin rose rust sage sand silk silver smoke snow solar spark stone storm sugar sunny swift tide tiger topaz torch trail tulip valley velvet vivid willow zenith".split(" ");

function pick() {
  return WORDS[crypto.getRandomValues(new Uint32Array(1))[0] % WORDS.length];
}

export default function PassphraseGenerator() {
  const [count, setCount] = useState(4);
  const [sep, setSep] = useState("-");
  const [capitalize, setCapitalize] = useState(true);
  const [appendNum, setAppendNum] = useState(true);
  const [phrase, setPhrase] = useState("");

  const regen = () => {
    const words = Array.from({ length: count }, pick).map((w) =>
      capitalize ? w[0].toUpperCase() + w.slice(1) : w
    );
    const out = words.join(sep) + (appendNum ? sep + (crypto.getRandomValues(new Uint16Array(1))[0] % 100) : "");
    setPhrase(out);
  };

  useEffect(() => {
    regen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, sep, capitalize, appendNum]);

  return (
    <ToolShell title="Passphrase Generator" description="Memorable diceware-style passphrases." category={categoryMap.generator}>
      <Card className="space-y-3 p-3">
        <div className="flex items-center gap-2">
          <Input value={phrase} readOnly className="font-mono text-lg" />
          <Button onClick={regen} variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
          <CopyButton value={phrase} />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div>
            <Label className="text-xs">Words</Label>
            <Input type="number" min={2} max={12} value={count} onChange={(e) => setCount(Number(e.target.value) || 4)} />
          </div>
          <div>
            <Label className="text-xs">Separator</Label>
            <Input value={sep} onChange={(e) => setSep(e.target.value || "-")} maxLength={2} />
          </div>
          <Button size="sm" variant={capitalize ? "default" : "outline"} onClick={() => setCapitalize((v) => !v)} className="mt-5">Capitalize</Button>
          <Button size="sm" variant={appendNum ? "default" : "outline"} onClick={() => setAppendNum((v) => !v)} className="mt-5">Add number</Button>
        </div>
      </Card>
    </ToolShell>
  );
}
