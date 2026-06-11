import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const OPCODES: { code: number; name: string; desc: string }[] = [
  { code: 0x0, name: "Continuation", desc: "Continues a previously-fragmented message." },
  { code: 0x1, name: "Text", desc: "UTF-8 text payload." },
  { code: 0x2, name: "Binary", desc: "Arbitrary binary payload." },
  { code: 0x8, name: "Close", desc: "Connection close — payload is optional 2-byte code + UTF-8 reason." },
  { code: 0x9, name: "Ping", desc: "Server or client liveness check. Must be echoed as Pong." },
  { code: 0xa, name: "Pong", desc: "Reply to Ping. May also be sent unsolicited as a heartbeat." },
];

const HEADER = [
  { field: "FIN", bits: 1, desc: "1 = final fragment of a message." },
  { field: "RSV1/2/3", bits: 3, desc: "Reserved for extensions (e.g. permessage-deflate)." },
  { field: "Opcode", bits: 4, desc: "Frame type — see table above." },
  { field: "MASK", bits: 1, desc: "1 = payload XOR-masked with a 4-byte key (always 1 for client→server)." },
  { field: "Payload len", bits: 7, desc: "0–125 = direct, 126 = next 16 bits, 127 = next 64 bits." },
  { field: "Extended length", bits: "0/16/64", desc: "Larger payload size in network byte order." },
  { field: "Masking-key", bits: "0/32", desc: "Present iff MASK = 1." },
  { field: "Payload", bits: "n", desc: "Application data, possibly masked." },
];

export default function WebSocketFrames() {
  return (
    <ToolShell title="WebSocket Frame Reference" description="RFC 6455 framing — opcodes, header layout and masking." category={categoryMap.network}>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Opcodes</div>
        <table className="w-full text-sm">
          <tbody>
            {OPCODES.map((o) => (
              <tr key={o.code} className="border-b last:border-0">
                <td className="p-3 font-mono">0x{o.code.toString(16)}</td>
                <td className="p-3 font-medium">{o.name}</td>
                <td className="p-3 text-muted-foreground">{o.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Frame header (RFC 6455 §5.2)</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="p-3">Field</th>
              <th className="p-3">Bits</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {HEADER.map((h) => (
              <tr key={h.field} className="border-b last:border-0">
                <td className="p-3 font-mono">{h.field}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{h.bits}</td>
                <td className="p-3">{h.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Browser clients <strong>must</strong> mask payloads to defend against cache-poisoning of intermediaries. Servers must <strong>not</strong> mask.
      </div>
    </ToolShell>
  );
}
