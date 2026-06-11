import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const TLS12: { step: string; from: string; payload: string }[] = [
  { step: "ClientHello", from: "Client → Server", payload: "TLS versions, cipher suites, random, SNI, ALPN, extensions." },
  { step: "ServerHello", from: "Server → Client", payload: "Selected version + suite, server random, certificate, key exchange (e.g. ECDHE), ServerHelloDone." },
  { step: "Client key exchange", from: "Client → Server", payload: "Client's public DH share, ChangeCipherSpec, Finished (encrypted)." },
  { step: "Server finish", from: "Server → Client", payload: "ChangeCipherSpec, Finished. App data flows after." },
];

const TLS13: { step: string; from: string; payload: string }[] = [
  { step: "ClientHello", from: "Client → Server", payload: "Versions, suites, key_share, signature_algorithms, SNI, ALPN, pre_shared_key (for resumption)." },
  { step: "ServerHello", from: "Server → Client", payload: "Chosen suite, server key_share. Everything after this is encrypted." },
  { step: "{EncryptedExtensions, Certificate, CertificateVerify, Finished}", from: "Server → Client", payload: "All encrypted under handshake key." },
  { step: "{Finished}", from: "Client → Server", payload: "Confirms key derivation. App data flows after — total: 1 RTT cold, 0 RTT with resumption + early_data." },
];

export default function TlsHandshake() {
  return (
    <ToolShell title="TLS Handshake" description="TLS 1.2 vs 1.3 — round-trips, encryption boundary, what each message carries." category={categoryMap.network}>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">TLS 1.2 (RFC 5246) — 2 RTT</div>
        <table className="w-full text-sm">
          <tbody>
            {TLS12.map((s) => (
              <tr key={s.step} className="border-b last:border-0">
                <td className="p-3 font-mono">{s.step}</td>
                <td className="p-3 text-xs text-muted-foreground">{s.from}</td>
                <td className="p-3">{s.payload}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">TLS 1.3 (RFC 8446) — 1 RTT (0-RTT for resumption)</div>
        <table className="w-full text-sm">
          <tbody>
            {TLS13.map((s) => (
              <tr key={s.step} className="border-b last:border-0">
                <td className="p-3 font-mono text-xs">{s.step}</td>
                <td className="p-3 text-xs text-muted-foreground">{s.from}</td>
                <td className="p-3">{s.payload}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-4">
        <div className="text-xs uppercase text-muted-foreground">Why 1.3 wins</div>
        <ul className="mt-2 space-y-1 text-sm">
          <li>• 50% fewer round-trips on cold connections.</li>
          <li>• 0-RTT with PSK lets <em>repeat</em> visitors send app data on the first packet (with replay caveats).</li>
          <li>• Removed all weak primitives — only AEAD ciphers (AES-GCM, ChaCha20-Poly1305) and (EC)DHE remain.</li>
          <li>• Certificates and handshake extensions are encrypted, not just app data.</li>
        </ul>
      </Card>
    </ToolShell>
  );
}
