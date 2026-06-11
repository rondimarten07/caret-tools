import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const RIRS: { rir: string; region: string; site: string }[] = [
  { rir: "ARIN", region: "Canada, USA, parts of the Caribbean", site: "arin.net" },
  { rir: "RIPE NCC", region: "Europe, Middle East, parts of Central Asia", site: "ripe.net" },
  { rir: "APNIC", region: "Asia-Pacific", site: "apnic.net" },
  { rir: "LACNIC", region: "Latin America and parts of the Caribbean", site: "lacnic.net" },
  { rir: "AFRINIC", region: "Africa", site: "afrinic.net" },
];

const FACTS: { topic: string; what: string }[] = [
  { topic: "What's an ASN?", what: "Autonomous System Number — a globally unique ID for a network under one administrative routing policy. Example: AS15169 = Google." },
  { topic: "16-bit vs 32-bit", what: "Original ASNs were 16-bit (1–65535). 32-bit ASNs (RFC 4893) were standardized in 2007 — same format, just larger range." },
  { topic: "Private range", what: "64512–65534 (16-bit) and 4200000000–4294967294 (32-bit) — for internal use, never announced on the public internet." },
  { topic: "Reserved", what: "AS0 is reserved (RFC 7607). AS23456 is the \"AS_TRANS\" sentinel used for 16-bit/32-bit interop." },
  { topic: "Allocated by", what: "The five Regional Internet Registries (RIRs) below, under IANA." },
  { topic: "BGP", what: "Border Gateway Protocol — how ASes announce which prefixes they originate or transit." },
];

export default function AsnReference() {
  return (
    <ToolShell title="ASN & RIR Reference" description="Autonomous Systems, the five RIRs, and BGP basics." category={categoryMap.network}>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Regional Internet Registries</div>
        <table className="w-full text-sm">
          <tbody>
            {RIRS.map((r) => (
              <tr key={r.rir} className="border-b last:border-0">
                <td className="p-3 font-mono font-medium">{r.rir}</td>
                <td className="p-3">{r.region}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{r.site}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b p-3 text-xs uppercase text-muted-foreground">Quick facts</div>
        <table className="w-full text-sm">
          <tbody>
            {FACTS.map((f) => (
              <tr key={f.topic} className="border-b last:border-0">
                <td className="p-3 font-medium">{f.topic}</td>
                <td className="p-3 text-muted-foreground">{f.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
