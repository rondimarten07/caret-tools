import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const STATUSES: { code: number; name: string; desc: string }[] = [
  { code: 100, name: "Continue", desc: "Indicates the request headers have been received and the client may continue." },
  { code: 101, name: "Switching Protocols", desc: "The server is switching protocols as requested." },
  { code: 200, name: "OK", desc: "Standard response for successful HTTP requests." },
  { code: 201, name: "Created", desc: "The request has been fulfilled and a new resource has been created." },
  { code: 202, name: "Accepted", desc: "The request has been accepted for processing." },
  { code: 204, name: "No Content", desc: "The server processed the request and is not returning any content." },
  { code: 206, name: "Partial Content", desc: "The server is delivering only part of the resource (range request)." },
  { code: 301, name: "Moved Permanently", desc: "The resource has been assigned a new permanent URI." },
  { code: 302, name: "Found", desc: "The resource resides temporarily under a different URI." },
  { code: 304, name: "Not Modified", desc: "Used for caching purposes; the resource has not been modified." },
  { code: 307, name: "Temporary Redirect", desc: "Repeat the request to another URI; the method must not change." },
  { code: 308, name: "Permanent Redirect", desc: "Permanent move; the method must not change." },
  { code: 400, name: "Bad Request", desc: "The server cannot or will not process due to client error." },
  { code: 401, name: "Unauthorized", desc: "Authentication is required and has failed or not been provided." },
  { code: 403, name: "Forbidden", desc: "The request was valid but the server refuses to authorize it." },
  { code: 404, name: "Not Found", desc: "The requested resource could not be found." },
  { code: 405, name: "Method Not Allowed", desc: "The method is not supported for this resource." },
  { code: 408, name: "Request Timeout", desc: "The server timed out waiting for the request." },
  { code: 409, name: "Conflict", desc: "The request conflicts with the current state of the resource." },
  { code: 410, name: "Gone", desc: "The resource is no longer available and will not be available again." },
  { code: 418, name: "I'm a Teapot", desc: "The server refuses to brew coffee because it is, permanently, a teapot." },
  { code: 422, name: "Unprocessable Entity", desc: "The request was well-formed but had semantic errors." },
  { code: 429, name: "Too Many Requests", desc: "The user has sent too many requests in a given amount of time." },
  { code: 500, name: "Internal Server Error", desc: "Generic server-side error." },
  { code: 501, name: "Not Implemented", desc: "The server does not support the functionality required." },
  { code: 502, name: "Bad Gateway", desc: "An invalid response was received from the upstream server." },
  { code: 503, name: "Service Unavailable", desc: "The server is currently unavailable (overload or maintenance)." },
  { code: 504, name: "Gateway Timeout", desc: "The upstream server did not respond in time." },
  { code: 505, name: "HTTP Version Not Supported", desc: "The HTTP version is not supported." },
];

function groupOf(code: number): { label: string; ring: string } {
  if (code < 200) return { label: "Informational", ring: "ring-sky-300 dark:ring-sky-800" };
  if (code < 300) return { label: "Success", ring: "ring-emerald-300 dark:ring-emerald-800" };
  if (code < 400) return { label: "Redirect", ring: "ring-amber-300 dark:ring-amber-800" };
  if (code < 500) return { label: "Client error", ring: "ring-rose-300 dark:ring-rose-800" };
  return { label: "Server error", ring: "ring-violet-300 dark:ring-violet-800" };
}

export default function HttpStatus() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return STATUSES;
    return STATUSES.filter(
      (st) =>
        String(st.code).includes(s) ||
        st.name.toLowerCase().includes(s) ||
        st.desc.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <ToolShell
      title="HTTP Status Codes"
      description="Searchable reference for HTTP response status codes."
      category={categoryMap.programming}
    >
      <Input placeholder="Search 404, redirect, teapot…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((st) => {
          const g = groupOf(st.code);
          return (
            <Card key={st.code} className={`p-4 ring-1 ${g.ring}`}>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold">{st.code}</span>
                <span className="text-xs text-muted-foreground">{g.label}</span>
              </div>
              <div className="mt-1 font-medium">{st.name}</div>
              <p className="mt-1 text-sm text-muted-foreground">{st.desc}</p>
            </Card>
          );
        })}
      </div>
    </ToolShell>
  );
}
