import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const CHANGES: { topic: string; h2: string; h3: string }[] = [
  { topic: "Transport", h2: "TCP + TLS (separate handshakes)", h3: "QUIC over UDP (combined handshake)" },
  { topic: "Connection setup (cold)", h2: "TCP (1-RTT) + TLS 1.3 (1-RTT) = 2 RTT", h3: "QUIC = 1 RTT (or 0-RTT for resumption)" },
  { topic: "Head-of-line blocking", h2: "TCP-level HoLB: one lost packet stalls all streams", h3: "Streams are independent — no HoLB across streams" },
  { topic: "Connection migration", h2: "Tied to (IP, port) — Wi-Fi → cellular drops it", h3: "Connection ID is independent of IP — survives network change" },
  { topic: "Encryption", h2: "TLS protects payload only", h3: "QUIC encrypts headers + payload — even ACKs" },
  { topic: "Multiplexing", h2: "HPACK + binary frames over single TCP stream", h3: "QPACK + streams that are independent at transport layer" },
  { topic: "Discovery", h2: "via ALPN in TLS handshake", h3: "Alt-Svc header (HTTP/2) or DNS HTTPS record" },
];

export default function Http3() {
  return (
    <ToolShell title="HTTP/3 Reference" description="What HTTP/3 changes from HTTP/2 — at a quick glance." category={categoryMap.network}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Topic</th>
              <th className="p-3">HTTP/2</th>
              <th className="p-3">HTTP/3</th>
            </tr>
          </thead>
          <tbody>
            {CHANGES.map((c) => (
              <tr key={c.topic} className="border-b last:border-0">
                <td className="p-3 font-medium">{c.topic}</td>
                <td className="p-3 text-muted-foreground">{c.h2}</td>
                <td className="p-3">{c.h3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-4">
        <div className="text-xs uppercase text-muted-foreground">Quick facts</div>
        <ul className="mt-2 space-y-2 text-sm">
          <li>• HTTP/3 is HTTP semantics over <strong>QUIC</strong> (RFC 9114). QUIC is RFC 9000.</li>
          <li>• QUIC always runs over UDP (typically port 443). Firewalls that allow only TCP/443 block it.</li>
          <li>• TLS 1.3 is mandatory — there is no plaintext HTTP/3.</li>
          <li>• Discovery: a server advertises <code className="font-mono">Alt-Svc: h3=":443"</code> over HTTP/2; clients try HTTP/3 next time.</li>
          <li>• 0-RTT is opt-in and replay-prone — avoid using it for non-idempotent requests.</li>
        </ul>
      </Card>
    </ToolShell>
  );
}
