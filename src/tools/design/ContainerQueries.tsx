import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const EXAMPLE = `.card {\n  container-type: inline-size;\n  container-name: card;\n}\n\n@container card (min-width: 400px) {\n  .card__body { display: grid; grid-template-columns: 1fr 1fr; }\n}\n\n.card__title { font-size: 1.2cqw; }`;

const UNITS: { unit: string; meaning: string }[] = [
  { unit: "cqw", meaning: "1% of the container's inline (width) size." },
  { unit: "cqh", meaning: "1% of the container's block (height) size." },
  { unit: "cqi", meaning: "1% of inline size — same as cqw for horizontal writing modes." },
  { unit: "cqb", meaning: "1% of block size — same as cqh." },
  { unit: "cqmin", meaning: "1% of the smaller of cqi / cqb." },
  { unit: "cqmax", meaning: "1% of the larger of cqi / cqb." },
];

const TYPES: { type: string; what: string }[] = [
  { type: "container-type: normal", what: "Default — no querying allowed; element is not a container." },
  { type: "container-type: inline-size", what: "Most common. Lets descendants query width. Keeps element's height intrinsic." },
  { type: "container-type: size", what: "Lets descendants query both axes. Element loses its intrinsic sizing." },
];

export default function ContainerQueries() {
  return (
    <ToolShell title="Container Queries" description="Style based on a parent's size, not the viewport. The successor to media queries for components." category={categoryMap.design}>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><div className="text-xs uppercase text-muted-foreground">Example</div><CopyButton value={EXAMPLE} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{EXAMPLE}</pre>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">container-type</div>
        <table className="w-full text-sm">
          <tbody>
            {TYPES.map((t) => (
              <tr key={t.type} className="border-b last:border-0">
                <td className="p-3 font-mono">{t.type}</td>
                <td className="p-3 text-muted-foreground">{t.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Container units</div>
        <table className="w-full text-sm">
          <tbody>
            {UNITS.map((u) => (
              <tr key={u.unit} className="border-b last:border-0">
                <td className="p-3 font-mono">{u.unit}</td>
                <td className="p-3 text-muted-foreground">{u.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Browser support: Chrome 105+, Safari 16+, Firefox 110+. Safe to use without polyfills in 2024+.
      </div>
    </ToolShell>
  );
}
