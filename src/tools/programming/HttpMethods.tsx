import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const METHODS: { method: string; idempotent: boolean; safe: boolean; hasBody: string; cacheable: string; use: string }[] = [
  { method: "GET", idempotent: true, safe: true, hasBody: "no", cacheable: "yes", use: "Read a resource. Repeating leaves no side effect." },
  { method: "HEAD", idempotent: true, safe: true, hasBody: "no", cacheable: "yes", use: "Same as GET but returns only headers." },
  { method: "OPTIONS", idempotent: true, safe: true, hasBody: "no", cacheable: "no", use: "Discover allowed methods; CORS preflight." },
  { method: "POST", idempotent: false, safe: false, hasBody: "yes", cacheable: "rarely", use: "Create or trigger an action; not idempotent." },
  { method: "PUT", idempotent: true, safe: false, hasBody: "yes", cacheable: "no", use: "Replace a resource at a known URL." },
  { method: "PATCH", idempotent: false, safe: false, hasBody: "yes", cacheable: "no", use: "Partial update — typically JSON-Patch or merge." },
  { method: "DELETE", idempotent: true, safe: false, hasBody: "optional", cacheable: "no", use: "Remove a resource." },
  { method: "CONNECT", idempotent: false, safe: false, hasBody: "no", cacheable: "no", use: "Open a tunnel (used by HTTPS proxies)." },
  { method: "TRACE", idempotent: true, safe: true, hasBody: "no", cacheable: "no", use: "Loopback test — often disabled in production." },
];

export default function HttpMethods() {
  return (
    <ToolShell title="HTTP Methods" description="Quick reference: safety, idempotency, body, cacheability and when to use each." category={categoryMap.programming}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Method</th>
              <th className="p-3">Safe</th>
              <th className="p-3">Idempotent</th>
              <th className="p-3">Body</th>
              <th className="p-3">Cacheable</th>
              <th className="p-3">When to use</th>
            </tr>
          </thead>
          <tbody>
            {METHODS.map((m) => (
              <tr key={m.method} className="border-b last:border-0">
                <td className="p-3 font-mono font-medium">{m.method}</td>
                <td className="p-3">{m.safe ? "✓" : ""}</td>
                <td className="p-3">{m.idempotent ? "✓" : ""}</td>
                <td className="p-3 text-xs">{m.hasBody}</td>
                <td className="p-3 text-xs">{m.cacheable}</td>
                <td className="p-3 text-muted-foreground">{m.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">Safe</div>
          <p className="mt-1 text-sm">A safe method must not modify server state. GET, HEAD, OPTIONS, TRACE are safe by spec.</p>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">Idempotent</div>
          <p className="mt-1 text-sm">Calling N times has the same effect as calling once. PUT and DELETE qualify; POST and PATCH generally do not.</p>
        </Card>
      </div>
    </ToolShell>
  );
}
