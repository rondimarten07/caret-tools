import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

type Field = { name: string; sub: Field[]; selected: boolean };

const SCHEMA: Field = {
  name: "root", selected: true, sub: [
    {
      name: "user(id: ID!)", selected: false, sub: [
        { name: "id", selected: true, sub: [] },
        { name: "name", selected: true, sub: [] },
        { name: "email", selected: false, sub: [] },
        {
          name: "posts", selected: false, sub: [
            { name: "id", selected: true, sub: [] },
            { name: "title", selected: true, sub: [] },
            { name: "body", selected: false, sub: [] },
            { name: "publishedAt", selected: false, sub: [] },
          ],
        },
      ],
    },
    {
      name: "posts(first: Int)", selected: false, sub: [
        { name: "id", selected: true, sub: [] },
        { name: "title", selected: true, sub: [] },
        {
          name: "author", selected: false, sub: [
            { name: "id", selected: true, sub: [] },
            { name: "name", selected: true, sub: [] },
          ],
        },
      ],
    },
  ],
};

function clone(f: Field): Field {
  return { ...f, sub: f.sub.map(clone) };
}

function toggle(root: Field, path: number[]): Field {
  if (path.length === 0) { return { ...root, selected: !root.selected }; }
  const [head, ...rest] = path;
  const next = clone(root);
  next.sub[head] = toggle(next.sub[head], rest);
  return next;
}

function render(f: Field, indent = 0): string {
  if (!f.selected) return "";
  const pad = "  ".repeat(indent);
  const kids = f.sub.filter((s) => s.selected);
  if (kids.length === 0) return `${pad}${f.name}\n`;
  let out = `${pad}${f.name} {\n`;
  for (const k of kids) out += render(k, indent + 1);
  out += `${pad}}\n`;
  return out;
}

export default function GraphqlQueryBuilder() {
  const [tree, setTree] = useState<Field>(() => {
    const t = clone(SCHEMA);
    t.sub[0].selected = true;
    return t;
  });
  const [opName, setOpName] = useState("GetUser");

  const query = useMemo(() => {
    const body = tree.sub.filter((s) => s.selected).map((s) => render(s, 1)).join("");
    return `query ${opName} {\n${body}}`;
  }, [tree, opName]);

  function FieldNode({ f, path }: { f: Field; path: number[] }) {
    return (
      <li>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.selected} onChange={() => setTree((t) => toggle(t, path))} />
          <span className="font-mono">{f.name}</span>
        </label>
        {f.sub.length > 0 && (
          <ul className="ml-5 mt-1 space-y-1 border-l pl-3">
            {f.sub.map((c, i) => <FieldNode key={i} f={c} path={[...path, i]} />)}
          </ul>
        )}
      </li>
    );
  }

  return (
    <ToolShell title="GraphQL Query Builder" description="Toggle fields on a mock schema, get a clean query." category={categoryMap.programming}>
      <Card className="p-3">
        <Label>Operation name</Label>
        <Input value={opName} onChange={(e) => setOpName(e.target.value || "Query")} className="font-mono" />
      </Card>
      <Card className="p-4">
        <ul className="space-y-1">
          {tree.sub.map((c, i) => <FieldNode key={i} f={c} path={[i]} />)}
        </ul>
      </Card>
      <Card className="space-y-3 p-4">
        <div className="flex items-center justify-between"><Label>Query</Label><CopyButton value={query} /></div>
        <pre className="overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono">{query}</pre>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Uses a small mock schema (User, Post). Run the query against your real endpoint via Postman / curl. Field arguments are illustrative.
      </div>
    </ToolShell>
  );
}
