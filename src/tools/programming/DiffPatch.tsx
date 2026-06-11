import { useMemo } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function applyPatch(source: string, patch: string): { ok: true; value: string } | { ok: false; error: string } {
  const srcLines = source.split("\n");
  const patchLines = patch.split("\n");
  const out: string[] = [];
  let srcIdx = 0;
  let i = 0;

  // Skip the file headers (---, +++)
  while (i < patchLines.length && !patchLines[i].startsWith("@@")) i++;

  while (i < patchLines.length) {
    const hunk = patchLines[i++];
    const m = hunk.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (!m) return { ok: false, error: `Expected hunk header, got: ${hunk}` };
    const oldStart = Number(m[1]) - 1;

    // Copy untouched lines up to the hunk
    while (srcIdx < oldStart) out.push(srcLines[srcIdx++]);

    while (i < patchLines.length && !patchLines[i].startsWith("@@")) {
      const line = patchLines[i++];
      if (line.startsWith(" ")) { out.push(line.slice(1)); srcIdx++; }
      else if (line.startsWith("-")) { srcIdx++; }
      else if (line.startsWith("+")) { out.push(line.slice(1)); }
      else if (line === "" || line.startsWith("\\")) { /* skip blank / "\ No newline" */ }
      else return { ok: false, error: `Unexpected line: ${line}` };
    }
  }

  while (srcIdx < srcLines.length) out.push(srcLines[srcIdx++]);
  return { ok: true, value: out.join("\n") };
}

export default function DiffPatch() {
  const [source, setSource] = useUrlState("s", `line one\nline two\nline three\nline four`);
  const [patch, setPatch] = useUrlState("p", `--- a/file\n+++ b/file\n@@ -1,4 +1,4 @@\n line one\n-line two\n+line TWO\n line three\n line four`);

  const result = useMemo(() => applyPatch(source, patch), [source, patch]);

  return (
    <ToolShell title="Apply Unified Diff" description="Apply a unified-diff patch to a source string." category={categoryMap.programming} shareable>
      <Card className="grid gap-3 p-4 md:grid-cols-2">
        <div>
          <Label>Source</Label>
          <Textarea value={source} onChange={(e) => setSource(e.target.value)} rows={10} className="font-mono" spellCheck={false} />
        </div>
        <div>
          <Label>Patch (unified diff)</Label>
          <Textarea value={patch} onChange={(e) => setPatch(e.target.value)} rows={10} className="font-mono" spellCheck={false} />
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        {result.ok ? (
          <>
            <div className="flex items-center justify-between"><Label>Result</Label><CopyButton value={result.value} /></div>
            <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{result.value}</pre>
          </>
        ) : (
          <p className="text-sm text-destructive">{result.error}</p>
        )}
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Supports standard unified-diff hunks (<code className="font-mono">@@ -a,b +c,d @@</code>). Doesn't fuzz-match — context lines must match the source exactly.
      </div>
    </ToolShell>
  );
}
