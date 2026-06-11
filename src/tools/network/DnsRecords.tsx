import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const RECORDS: { type: string; desc: string; example: string }[] = [
  { type: "A", desc: "Maps a hostname to an IPv4 address.", example: "example.com.  300  IN  A      93.184.216.34" },
  { type: "AAAA", desc: "Maps a hostname to an IPv6 address.", example: "example.com.  300  IN  AAAA   2606:2800:220:1::1" },
  { type: "CNAME", desc: "Alias of one name to another canonical name. Cannot coexist with other records at the same name.", example: "www.example.com. 300 IN CNAME example.com." },
  { type: "MX", desc: "Mail exchange. Priority + target mail server hostname.", example: "example.com.  300  IN  MX     10 mail.example.com." },
  { type: "TXT", desc: "Free-form text. Used for SPF, DKIM, domain verification.", example: 'example.com.  300  IN  TXT    "v=spf1 -all"' },
  { type: "NS", desc: "Authoritative name servers for the zone.", example: "example.com.  300  IN  NS     ns1.example.com." },
  { type: "SOA", desc: "Start of authority — zone serial, refresh/retry intervals, contact.", example: "example.com. 300 IN SOA ns1.example.com. admin.example.com. 2024010101 ..." },
  { type: "PTR", desc: "Reverse DNS — maps IP back to a hostname.", example: "34.216.184.93.in-addr.arpa.  IN  PTR  example.com." },
  { type: "SRV", desc: "Service location — priority, weight, port, target. Used by XMPP, Minecraft, ...", example: "_sip._tcp.example.com. 300 IN SRV 10 5 5060 sip.example.com." },
  { type: "CAA", desc: "Certificate Authority Authorization — which CAs may issue certs for the domain.", example: 'example.com.  300  IN  CAA    0 issue "letsencrypt.org"' },
  { type: "DNSKEY / DS / RRSIG / NSEC", desc: "DNSSEC records — public keys and signatures for authenticated DNS.", example: "(see RFC 4034)" },
  { type: "ALIAS / ANAME", desc: "Vendor-specific flat CNAME at apex (Cloudflare, Route 53, DNSimple).", example: "example.com.  ALIAS  origin.cdn.example.net." },
  { type: "HTTPS / SVCB", desc: "Service binding — advertise HTTPS endpoints, ALPN and HTTP/3 hints.", example: "example.com.  HTTPS  1 . alpn=\"h2,h3\"" },
];

export default function DnsRecords() {
  return (
    <ToolShell title="DNS Record Types" description="A, AAAA, CNAME, MX, TXT, SRV, CAA — what each record does." category={categoryMap.network}>
      <div className="grid gap-3 md:grid-cols-2">
        {RECORDS.map((r) => (
          <Card key={r.type} className="space-y-2 p-4">
            <h3 className="font-mono text-sm font-semibold">{r.type}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
            <pre className="overflow-auto rounded-md bg-muted/30 p-2 text-xs font-mono">{r.example}</pre>
          </Card>
        ))}
      </div>
    </ToolShell>
  );
}
