import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

export default function UrlParser() {
  const [input, setInput] = useUrlState("url", "https://example.com:8080/path/to/page?foo=bar&x=1#section");

  const parsed = useMemo(() => {
    try {
      const u = new URL(input);
      return {
        ok: true as const,
        href: u.href,
        protocol: u.protocol,
        username: u.username,
        password: u.password,
        host: u.host,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        params: Array.from(u.searchParams.entries()),
      };
    } catch (err) {
      return { ok: false as const, error: (err as Error).message };
    }
  }, [input]);

  return (
    <ToolShell title="URL Parser" description="Break a URL down into its parts and query params." category={categoryMap.network}
      shareable>
      <Card className="p-3">
        <Label className="mb-1 block">URL</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" spellCheck={false} />
      </Card>
      {parsed.ok ? (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              ["Protocol", parsed.protocol], ["Host", parsed.host], ["Hostname", parsed.hostname],
              ["Port", parsed.port], ["Pathname", parsed.pathname], ["Search", parsed.search],
              ["Hash", parsed.hash], ["Username", parsed.username], ["Password", parsed.password],
            ].map(([k, v]) => (
              <Card key={k} className="flex items-center justify-between gap-3 p-3">
                <span className="text-xs text-muted-foreground">{k}</span>
                <code className="flex-1 truncate text-right font-mono text-sm">{v || "—"}</code>
                {v && <CopyButton value={v} />}
              </Card>
            ))}
          </div>
          {parsed.params.length > 0 && (
            <Card className="p-3">
              <Label className="mb-2 block">Query parameters</Label>
              <table className="w-full text-sm">
                <tbody>
                  {parsed.params.map(([k, v], i) => (
                    <tr key={i} className="border-t">
                      <td className="py-1 font-mono text-muted-foreground">{k}</td>
                      <td className="py-1 font-mono">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      ) : (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 font-mono text-sm text-destructive">{parsed.error}</div>
      )}
    </ToolShell>
  );
}
