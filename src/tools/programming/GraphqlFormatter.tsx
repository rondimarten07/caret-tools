import { useMemo, useState } from "react";
import { parse, print, buildSchema, printSchema } from "graphql";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SAMPLE_QUERY = `query GetUser($id:ID!){user(id:$id){id name email posts{id title comments{id author{name}}}}}`;
const SAMPLE_SDL = `type Query{ user(id:ID!):User! posts(limit:Int=10):[Post!]! } type User{ id:ID! name:String! email:String! posts:[Post!]! } type Post{ id:ID! title:String! body:String! author:User! }`;

type Mode = "query" | "sdl";

export default function GraphqlFormatter() {
  const [mode, setMode] = useState<Mode>("query");
  const [input, setInput] = useUrlState("text", SAMPLE_QUERY);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: "" };
    try {
      if (mode === "query") {
        return { ok: true as const, output: print(parse(input)) };
      }
      return { ok: true as const, output: printSchema(buildSchema(input)) };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input, mode]);

  return (
    <ToolShell title="GraphQL Formatter" description="Pretty-print GraphQL queries and SDL schemas. Validates as it formats." category={categoryMap.programming}
      shareable>
      <Card className="flex flex-wrap items-center gap-2 p-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Mode</Label>
        <Button size="sm" variant={mode === "query" ? "default" : "outline"} onClick={() => { setMode("query"); setInput(SAMPLE_QUERY); }}>
          Query
        </Button>
        <Button size="sm" variant={mode === "sdl" ? "default" : "outline"} onClick={() => { setMode("sdl"); setInput(SAMPLE_SDL); }}>
          SDL Schema
        </Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-3">
          <Label className="mb-2 block">Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[360px]" spellCheck={false} />
        </Card>
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>{result.ok ? "Formatted" : "Error"}</Label>
            {result.ok && <CopyButton value={result.output} />}
          </div>
          {result.ok ? (
            <Textarea readOnly value={result.output} className="min-h-[360px] bg-muted/30" spellCheck={false} />
          ) : (
            <div className="min-h-[360px] rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">
              {result.error}
            </div>
          )}
        </Card>
      </div>
    </ToolShell>
  );
}
