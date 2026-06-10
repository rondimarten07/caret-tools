import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE = "The quick brown fox jumps over the lazy dog. A clear sentence helps everyone read more quickly. Use short words, short sentences, and an active voice.";

function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const v = w.replace(/(?:[^aeiouy]es|ed|[^aeiouy]e)$/, "").replace(/^y/, "");
  const m = v.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

function gradeLabel(grade: number): string {
  if (grade < 6) return "Easy — 5th grader can read";
  if (grade < 8) return "Fairly easy — early teens";
  if (grade < 10) return "Plain — high school";
  if (grade < 13) return "Fairly hard — late high school";
  if (grade < 16) return "Difficult — college";
  return "Very difficult — postgraduate";
}

function easeLabel(score: number): string {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Plain English";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

export default function Readability() {
  const [text, setText] = useUrlState("text", SAMPLE);

  const stats = useMemo(() => {
    const sentences = text.match(/[.!?]+/g)?.length || (text.trim() ? 1 : 0);
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const totalSyl = words.reduce((s, w) => s + syllables(w), 0);
    const polysyllables = words.filter((w) => syllables(w) >= 3).length;

    if (sentences === 0 || words.length === 0) {
      return { sentences: 0, words: 0, polysyllables: 0, flesch: 0, kincaid: 0, smog: 0 };
    }

    const flesch = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (totalSyl / words.length);
    const kincaid = 0.39 * (words.length / sentences) + 11.8 * (totalSyl / words.length) - 15.59;
    const smog = 1.043 * Math.sqrt(polysyllables * (30 / sentences)) + 3.1291;

    return { sentences, words: words.length, polysyllables, flesch, kincaid, smog };
  }, [text]);

  return (
    <ToolShell title="Readability Score" description="Flesch Reading Ease, Flesch-Kincaid Grade, and SMOG index." category={categoryMap.text} shareable>
      <Card className="p-3">
        <Label className="mb-2 block">Text</Label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[200px]" />
      </Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">Flesch Reading Ease</div>
          <div className="mt-1 text-3xl font-semibold">{stats.flesch.toFixed(1)}</div>
          <div className="mt-1 text-xs text-muted-foreground">{easeLabel(stats.flesch)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">Flesch-Kincaid Grade</div>
          <div className="mt-1 text-3xl font-semibold">{stats.kincaid.toFixed(1)}</div>
          <div className="mt-1 text-xs text-muted-foreground">{gradeLabel(stats.kincaid)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">SMOG Index</div>
          <div className="mt-1 text-3xl font-semibold">{stats.smog.toFixed(1)}</div>
          <div className="mt-1 text-xs text-muted-foreground">Years of education needed</div>
        </Card>
      </div>
      <Card className="grid grid-cols-3 gap-3 p-3 text-center">
        <div><div className="text-xs text-muted-foreground">Sentences</div><div className="font-mono text-lg">{stats.sentences}</div></div>
        <div><div className="text-xs text-muted-foreground">Words</div><div className="font-mono text-lg">{stats.words}</div></div>
        <div><div className="text-xs text-muted-foreground">Polysyllables</div><div className="font-mono text-lg">{stats.polysyllables}</div></div>
      </Card>
    </ToolShell>
  );
}
