import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const FLAGS = ["g", "i", "m", "s", "u", "y"] as const;

export default function RegexTester() {
  const [pattern, setPattern] = useUrlState("re", "\\b(\\w+)@(\\w+\\.\\w+)\\b");
  const [flags, setFlags] = useState<string>("g");
  const [text, setText] = useUrlState("text", "Contact alice@example.com or bob@test.org for details.");

  const result = useMemo(() => {
    if (!pattern) return { ok: true as const, matches: [], highlighted: text };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches: { match: string; index: number; groups: string[] }[] = [];
      let last = -1;
      for (const m of text.matchAll(re)) {
        if (m.index === last) break;
        last = m.index ?? -1;
        matches.push({
          match: m[0],
          index: m.index ?? 0,
          groups: m.slice(1).map((g) => g ?? ""),
        });
        if (m[0].length === 0) re.lastIndex++;
      }
      let highlighted = "";
      let cursor = 0;
      for (const m of matches) {
        highlighted += escapeHtml(text.slice(cursor, m.index));
        highlighted += `<mark class="bg-amber-200 dark:bg-amber-900/60 rounded px-0.5">${escapeHtml(m.match)}</mark>`;
        cursor = m.index + m.match.length;
      }
      highlighted += escapeHtml(text.slice(cursor));
      return { ok: true as const, matches, highlighted };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [pattern, flags, text]);

  function toggleFlag(f: string) {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f));
  }

  return (
    <ToolShell
      title="Regex Tester"
      description="Test JavaScript regular expressions live with match highlighting."
      category={categoryMap.programming}
      shareable
    >
      <Card className="space-y-3 p-3">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-md border bg-card px-2">
            <span className="font-mono text-muted-foreground">/</span>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="border-none p-0 shadow-none focus-visible:ring-0"
              spellCheck={false}
            />
            <span className="font-mono text-muted-foreground">/{flags}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {FLAGS.map((f) => (
              <Button key={f} size="sm" variant={flags.includes(f) ? "default" : "outline"} onClick={() => toggleFlag(f)}>
                {f}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Test text</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[260px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <Label className="mb-2 block">{result.ok ? "Matches" : "Error"}</Label>
          {result.ok ? (
            <>
              <pre
                className="mb-3 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/30 p-3 text-sm"
                dangerouslySetInnerHTML={{ __html: result.highlighted }}
              />
              <div className="text-xs text-muted-foreground">
                {result.matches.length} match{result.matches.length === 1 ? "" : "es"}
              </div>
              <ul className="mt-2 max-h-40 space-y-1 overflow-auto font-mono text-xs">
                {result.matches.map((m, i) => (
                  <li key={i} className="rounded border bg-card/50 p-2">
                    <div>
                      <span className="text-muted-foreground">#{i + 1} @ {m.index}: </span>
                      <span>{m.match}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-1 text-muted-foreground">
                        groups: [{m.groups.map((g) => JSON.stringify(g)).join(", ")}]
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
              {result.error}
            </div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
