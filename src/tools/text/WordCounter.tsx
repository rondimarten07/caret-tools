import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

export default function WordCounter() {
  const [text, setText] = useUrlState("text", "");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || 1 : 0;
    const paragraphs = text.trim() ? text.split(/\n{2,}/).filter((p) => p.trim()).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const minutes = Math.max(1, Math.round(words / 200));
    return { chars, charsNoSpace, words, sentences, paragraphs, lines, minutes };
  }, [text]);

  return (
    <ToolShell
      title="Word & Character Counter"
      description="Live statistics for any text input."
      category={categoryMap.text}
      shareable
    >
      <Card className="p-3">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type text here…" className="min-h-[320px] font-sans" />
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Characters", value: stats.chars },
          { label: "No spaces", value: stats.charsNoSpace },
          { label: "Words", value: stats.words },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Reading min", value: stats.minutes },
        ].map((s) => (
          <Card key={s.label} className="p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
