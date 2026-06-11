import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const FRAMES: { type: number; name: string; desc: string }[] = [
  { type: 0x0, name: "DATA", desc: "Carries arbitrary application data (request/response body)." },
  { type: 0x1, name: "HEADERS", desc: "Opens a stream and conveys HPACK-encoded headers." },
  { type: 0x2, name: "PRIORITY", desc: "Hints relative priority/weight of a stream. (Deprecated in RFC 9113.)" },
  { type: 0x3, name: "RST_STREAM", desc: "Aborts a stream — sender includes an error code." },
  { type: 0x4, name: "SETTINGS", desc: "Connection-level config (header table size, max streams, frame size, window size)." },
  { type: 0x5, name: "PUSH_PROMISE", desc: "Server-initiated push of a future response. (Disabled by default in many browsers.)" },
  { type: 0x6, name: "PING", desc: "Round-trip keep-alive / RTT measurement. Reply with PING (ACK)." },
  { type: 0x7, name: "GOAWAY", desc: "Initiates graceful shutdown of the connection. Names last stream ID + reason." },
  { type: 0x8, name: "WINDOW_UPDATE", desc: "Per-stream and connection-level flow-control credit." },
  { type: 0x9, name: "CONTINUATION", desc: "Continues a HEADERS / PUSH_PROMISE that was too big for one frame." },
];

export default function Http2Frames() {
  return (
    <ToolShell title="HTTP/2 Frame Types" description="The 10 frame types defined by RFC 9113 — what each does at a glance." category={categoryMap.network}>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Code</th>
              <th className="p-3">Frame</th>
              <th className="p-3">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {FRAMES.map((f) => (
              <tr key={f.type} className="border-b last:border-0">
                <td className="p-3 font-mono">0x{f.type.toString(16)}</td>
                <td className="p-3 font-medium">{f.name}</td>
                <td className="p-3 text-muted-foreground">{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Every HTTP/2 frame starts with a 9-byte header: length (24b), type (8b), flags (8b), R + stream ID (32b). Max payload is negotiated via SETTINGS_MAX_FRAME_SIZE (default 16,384 bytes).
      </div>
    </ToolShell>
  );
}
