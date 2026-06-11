import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const TYPES: { name: string; signature: string; example: string; desc: string }[] = [
  { name: "Partial<T>", signature: "type Partial<T> = { [P in keyof T]?: T[P] }", desc: "Makes every property optional.", example: `type UserPatch = Partial<User>;\n// { id?: string; name?: string }` },
  { name: "Required<T>", signature: "type Required<T> = { [P in keyof T]-?: T[P] }", desc: "Makes every property required.", example: `type Strict = Required<Partial<User>>;` },
  { name: "Readonly<T>", signature: "type Readonly<T> = { readonly [P in keyof T]: T[P] }", desc: "Marks every property readonly.", example: `const u: Readonly<User> = ...;\n// u.name = "x"; // ❌` },
  { name: "Pick<T, K>", signature: "type Pick<T, K extends keyof T> = { [P in K]: T[P] }", desc: "Keeps only the listed keys.", example: `type IdOnly = Pick<User, "id">;` },
  { name: "Omit<T, K>", signature: 'type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>', desc: "Removes the listed keys.", example: `type NoEmail = Omit<User, "email">;` },
  { name: "Record<K, T>", signature: "type Record<K extends keyof any, T> = { [P in K]: T }", desc: "Builds a map from a key union to a value type.", example: `type Roles = Record<"admin" | "user", boolean>;` },
  { name: "Exclude<T, U>", signature: "type Exclude<T, U> = T extends U ? never : T", desc: "Drops U from union T.", example: `type T = Exclude<"a" | "b" | "c", "b">;\n// "a" | "c"` },
  { name: "Extract<T, U>", signature: "type Extract<T, U> = T extends U ? T : never", desc: "Keeps only members of T assignable to U.", example: `type T = Extract<"a" | "b", "a" | "x">;\n// "a"` },
  { name: "NonNullable<T>", signature: "type NonNullable<T> = T extends null | undefined ? never : T", desc: "Removes null and undefined.", example: `type S = NonNullable<string | null>;\n// string` },
  { name: "ReturnType<T>", signature: 'type ReturnType<T> = T extends (...args: any) => infer R ? R : any', desc: "The return type of a function.", example: `function f() { return 42; }\ntype R = ReturnType<typeof f>; // number` },
  { name: "Parameters<T>", signature: 'type Parameters<T> = T extends (...args: infer P) => any ? P : never', desc: "Tuple of a function's parameter types.", example: `function f(a: string, b: number) {}\ntype P = Parameters<typeof f>; // [string, number]` },
  { name: "Awaited<T>", signature: "Unwraps Promise<T> recursively (TS 4.5+).", desc: "The resolved type of a promise.", example: `type R = Awaited<Promise<Promise<string>>>;\n// string` },
];

export default function TsUtilTypes() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TYPES;
    return TYPES.filter((t) => t.name.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s));
  }, [q]);

  return (
    <ToolShell title="TS Utility Types" description="Built-in TypeScript utility types — signature, example and when to reach for each." category={categoryMap.programming}>
      <Card className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or description..." />
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((t) => (
          <Card key={t.name} className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-semibold">{t.name}</h3>
              <CopyButton value={t.example} />
            </div>
            <p className="text-xs text-muted-foreground">{t.desc}</p>
            <pre className="overflow-auto rounded-md bg-muted/30 p-2 text-xs font-mono">{t.signature}</pre>
            <pre className="overflow-auto rounded-md bg-muted/30 p-2 text-xs font-mono">{t.example}</pre>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
