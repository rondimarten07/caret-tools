import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const FLAGS: { flag: string; bit: string; meaning: string }[] = [
  { flag: "URG", bit: "0x20", meaning: "Urgent pointer field is significant — rare in practice." },
  { flag: "ACK", bit: "0x10", meaning: "Acknowledgement number is valid. Set on every segment after the initial SYN." },
  { flag: "PSH", bit: "0x08", meaning: "Push — receiver should pass data to the application immediately." },
  { flag: "RST", bit: "0x04", meaning: "Reset — abort the connection. No fin-handshake." },
  { flag: "SYN", bit: "0x02", meaning: "Synchronize sequence numbers — opens a connection." },
  { flag: "FIN", bit: "0x01", meaning: "No more data from sender. Half-close." },
  { flag: "ECE", bit: "0x40", meaning: "ECN-Echo — receiver saw congestion notification." },
  { flag: "CWR", bit: "0x80", meaning: "Congestion Window Reduced — sender lowered its window in response to ECN." },
];

const STATES: { state: string; how: string }[] = [
  { state: "CLOSED", how: "Initial / final state." },
  { state: "LISTEN", how: "Server waiting for a SYN." },
  { state: "SYN-SENT", how: "Sent a SYN, waiting for SYN+ACK." },
  { state: "SYN-RECEIVED", how: "Got a SYN, sent SYN+ACK, waiting for ACK." },
  { state: "ESTABLISHED", how: "Three-way handshake complete; data can flow." },
  { state: "FIN-WAIT-1 / 2", how: "Sent a FIN, waiting for the peer's FIN." },
  { state: "CLOSE-WAIT", how: "Got peer's FIN, app hasn't called close() yet." },
  { state: "LAST-ACK", how: "Sent our FIN after CLOSE-WAIT, awaiting peer ACK." },
  { state: "TIME-WAIT", how: "Both sides closed; waiting 2×MSL before fully closing." },
];

export default function TcpFlags() {
  return (
    <ToolShell title="TCP Flags Reference" description="Control bits in the TCP header — and where they appear in the state machine." category={categoryMap.network}>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Flag bits</div>
        <table className="w-full text-sm">
          <tbody>
            {FLAGS.map((f) => (
              <tr key={f.flag} className="border-b last:border-0">
                <td className="p-3 font-mono font-medium">{f.flag}</td>
                <td className="p-3 font-mono text-muted-foreground">{f.bit}</td>
                <td className="p-3">{f.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Connection states</div>
        <table className="w-full text-sm">
          <tbody>
            {STATES.map((s) => (
              <tr key={s.state} className="border-b last:border-0">
                <td className="p-3 font-mono font-medium">{s.state}</td>
                <td className="p-3 text-muted-foreground">{s.how}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
