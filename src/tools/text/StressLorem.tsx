import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n";

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function StressLorem() {
  const [target, setTarget] = useState(100);
  const [unit, setUnit] = useState<"KB" | "MB">("KB");

  const text = useMemo(() => {
    const bytes = target * (unit === "MB" ? 1024 * 1024 : 1024);
    const reps = Math.ceil(bytes / LOREM.length);
    const full = LOREM.repeat(reps);
    return full.slice(0, bytes);
  }, [target, unit]);

  return (
    <ToolShell title="Big Lorem" description="Generate huge lorem ipsum — useful for stress-testing UI scroll, paste handlers, parsers." category={categoryMap.text}>
      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div>
          <Label>Size</Label>
          <input type="number" value={target} min={1} max={50} onChange={(e) => setTarget(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} className="mt-1 block w-24 rounded-md border bg-background px-3 py-1.5 text-sm" />
        </div>
        <div>
          <Label>Unit</Label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "KB" | "MB")} className="mt-1 block rounded-md border bg-background px-3 py-1.5 text-sm">
            <option value="KB">KB</option>
            <option value="MB">MB</option>
          </select>
        </div>
        <div className="text-xs text-muted-foreground">{fmtBytes(text.length)} · {text.length.toLocaleString()} chars</div>
        <div className="ml-auto"><CopyButton value={text} /></div>
      </Card>
      <Card className="p-4">
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-xs">{text.slice(0, 2000)}{text.length > 2000 ? "\n... (truncated for preview)" : ""}</pre>
      </Card>
      <div className="rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        ⚠ The Copy button writes the <em>full</em> text to your clipboard. Pasting 10 MB into a small editor can hang the browser tab — use deliberately.
      </div>
    </ToolShell>
  );
}
