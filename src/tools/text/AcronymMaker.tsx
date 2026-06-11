import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const STOPWORDS = new Set(["the", "of", "and", "or", "a", "an", "to", "in", "on", "at", "for", "with", "by"]);

type Style = "upper" | "lower" | "title";

export default function AcronymMaker() {
  const [phrase, setPhrase] = useUrlState("text", "Self-Contained Underwater Breathing Apparatus");
  const [excludeStop, setExcludeStop] = useState(true);
  const [style, setStyle] = useState<Style>("upper");
  const [sep, setSep] = useState("");
  const [minLen, setMinLen] = useState(1);

  const result = useMemo(() => {
    const words = phrase.split(/[\s-]+/).filter(Boolean);
    const filtered = words.filter((w) => w.length >= minLen && (!excludeStop || !STOPWORDS.has(w.toLowerCase())));
    const letters = filtered.map((w) => w[0]);
    let joined: string;
    switch (style) {
      case "upper": joined = letters.join(sep).toUpperCase(); break;
      case "lower": joined = letters.join(sep).toLowerCase(); break;
      case "title": joined = letters.map((l, i) => i === 0 ? l.toUpperCase() : l.toLowerCase()).join(sep); break;
    }
    return { acronym: joined, words: filtered };
  }, [phrase, excludeStop, style, sep, minLen]);

  return (
    <ToolShell title="Acronym Maker" description="Build an acronym from any phrase. Pick word filter and casing." category={categoryMap.text} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Phrase</Label>
        <Input value={phrase} onChange={(e) => setPhrase(e.target.value)} />
      </Card>
      <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-4">
        <div>
          <Label className="text-xs">Case</Label>
          <div className="mt-1 flex gap-1">
            {(["upper", "lower", "title"] as Style[]).map((s) => (
              <Button key={s} size="sm" variant={style === s ? "default" : "outline"} onClick={() => setStyle(s)}>{s}</Button>
            ))}
          </div>
        </div>
        <div><Label className="text-xs">Separator</Label><Input value={sep} onChange={(e) => setSep(e.target.value)} maxLength={3} className="font-mono" /></div>
        <div><Label className="text-xs">Min word length</Label><Input type="number" min={1} max={10} value={minLen} onChange={(e) => setMinLen(Number(e.target.value) || 1)} /></div>
        <Button size="sm" variant={excludeStop ? "default" : "outline"} onClick={() => setExcludeStop((v) => !v)} className="mt-5">Skip stopwords</Button>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-xs uppercase text-muted-foreground">Acronym</div>
        <div className="mt-2 flex items-center justify-center gap-2">
          <code className="font-mono text-4xl">{result.acronym || "—"}</code>
          {result.acronym && <CopyButton value={result.acronym} />}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">From: {result.words.join(", ")}</div>
      </Card>
    </ToolShell>
  );
}
