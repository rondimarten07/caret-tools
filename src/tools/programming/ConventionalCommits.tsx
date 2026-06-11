import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const TYPES = [
  { id: "feat", desc: "A new feature (semver MINOR)" },
  { id: "fix", desc: "A bug fix (semver PATCH)" },
  { id: "docs", desc: "Documentation only" },
  { id: "style", desc: "Code style / whitespace (no logic change)" },
  { id: "refactor", desc: "Code change that's neither feat nor fix" },
  { id: "perf", desc: "Performance improvement" },
  { id: "test", desc: "Adding or correcting tests" },
  { id: "build", desc: "Build system / dependencies" },
  { id: "ci", desc: "CI configuration" },
  { id: "chore", desc: "Routine task, no production code change" },
  { id: "revert", desc: "Reverts a previous commit" },
];

export default function ConventionalCommits() {
  const [type, setType] = useState("feat");
  const [scope, setScope] = useUrlState("s", "auth");
  const [breaking, setBreaking] = useState(false);
  const [subject, setSubject] = useUrlState("j", "support GitHub OAuth login");
  const [body, setBody] = useUrlState("b", "");
  const [footers, setFooters] = useUrlState("f", "");

  const message = useMemo(() => {
    const header = `${type}${scope ? `(${scope})` : ""}${breaking ? "!" : ""}: ${subject}`;
    return [header, body.trim() && `\n${body.trim()}`, footers.trim() && `\n${footers.trim()}`].filter(Boolean).join("\n");
  }, [type, scope, breaking, subject, body, footers]);

  return (
    <ToolShell title="Conventional Commits" description="Build a Conventional Commit message (type, scope, body, footers)." category={categoryMap.programming} shareable>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <Label>Type</Label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-1.5 text-sm">
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.desc}</option>)}
          </select>
        </div>
        <div>
          <Label>Scope (optional)</Label>
          <Input value={scope} onChange={(e) => setScope(e.target.value)} placeholder="auth, ui, api…" />
        </div>
        <div className="sm:col-span-2">
          <Label>Subject (lowercase, no period)</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Body (optional)</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
        </div>
        <div className="sm:col-span-2">
          <Label>Footers (optional — one per line)</Label>
          <Textarea value={footers} onChange={(e) => setFooters(e.target.value)} rows={3} placeholder={`Refs: #123\nReviewed-by: Alex\nBREAKING CHANGE: renamed /api/login to /auth/login`} />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} />Breaking change (adds ! to header)</label>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Message</Label><CopyButton value={message} /></div>
        <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm font-mono">{message}</pre>
      </Card>
    </ToolShell>
  );
}
