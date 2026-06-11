import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

type Port = { port: number; proto: string; service: string; desc: string };

const PORTS: Port[] = [
  { port: 20, proto: "TCP", service: "FTP-DATA", desc: "File Transfer Protocol data" },
  { port: 21, proto: "TCP", service: "FTP", desc: "File Transfer Protocol control" },
  { port: 22, proto: "TCP", service: "SSH", desc: "Secure Shell, SFTP" },
  { port: 23, proto: "TCP", service: "Telnet", desc: "Unencrypted remote login" },
  { port: 25, proto: "TCP", service: "SMTP", desc: "Mail relay (server-to-server)" },
  { port: 53, proto: "TCP/UDP", service: "DNS", desc: "Domain Name System" },
  { port: 67, proto: "UDP", service: "DHCP", desc: "Dynamic Host Configuration (server)" },
  { port: 68, proto: "UDP", service: "DHCP", desc: "Dynamic Host Configuration (client)" },
  { port: 69, proto: "UDP", service: "TFTP", desc: "Trivial File Transfer" },
  { port: 80, proto: "TCP", service: "HTTP", desc: "HyperText Transfer Protocol" },
  { port: 88, proto: "TCP/UDP", service: "Kerberos", desc: "Kerberos authentication" },
  { port: 110, proto: "TCP", service: "POP3", desc: "Post Office Protocol (email retrieval)" },
  { port: 119, proto: "TCP", service: "NNTP", desc: "Network News Transfer (Usenet)" },
  { port: 123, proto: "UDP", service: "NTP", desc: "Network Time Protocol" },
  { port: 135, proto: "TCP", service: "MS-RPC", desc: "Microsoft RPC endpoint mapper" },
  { port: 137, proto: "UDP", service: "NetBIOS", desc: "NetBIOS Name Service" },
  { port: 139, proto: "TCP", service: "NetBIOS", desc: "NetBIOS Session Service" },
  { port: 143, proto: "TCP", service: "IMAP", desc: "Internet Message Access Protocol" },
  { port: 161, proto: "UDP", service: "SNMP", desc: "Simple Network Management Protocol" },
  { port: 162, proto: "UDP", service: "SNMP-TRAP", desc: "SNMP traps" },
  { port: 179, proto: "TCP", service: "BGP", desc: "Border Gateway Protocol" },
  { port: 194, proto: "TCP", service: "IRC", desc: "Internet Relay Chat" },
  { port: 389, proto: "TCP", service: "LDAP", desc: "Lightweight Directory Access" },
  { port: 443, proto: "TCP", service: "HTTPS", desc: "HTTP over TLS" },
  { port: 445, proto: "TCP", service: "SMB", desc: "Microsoft Server Message Block" },
  { port: 465, proto: "TCP", service: "SMTPS", desc: "SMTP over TLS (legacy)" },
  { port: 514, proto: "UDP", service: "Syslog", desc: "System logging" },
  { port: 587, proto: "TCP", service: "Submission", desc: "Mail submission (client-to-server)" },
  { port: 636, proto: "TCP", service: "LDAPS", desc: "LDAP over TLS" },
  { port: 853, proto: "TCP", service: "DoT", desc: "DNS over TLS" },
  { port: 873, proto: "TCP", service: "rsync", desc: "rsync daemon" },
  { port: 989, proto: "TCP", service: "FTPS-DATA", desc: "FTPS data over TLS" },
  { port: 990, proto: "TCP", service: "FTPS", desc: "FTPS control over TLS" },
  { port: 993, proto: "TCP", service: "IMAPS", desc: "IMAP over TLS" },
  { port: 995, proto: "TCP", service: "POP3S", desc: "POP3 over TLS" },
  { port: 1080, proto: "TCP", service: "SOCKS", desc: "SOCKS proxy" },
  { port: 1194, proto: "UDP", service: "OpenVPN", desc: "OpenVPN default" },
  { port: 1433, proto: "TCP", service: "MSSQL", desc: "Microsoft SQL Server" },
  { port: 1521, proto: "TCP", service: "Oracle", desc: "Oracle database" },
  { port: 1723, proto: "TCP", service: "PPTP", desc: "Point-to-Point Tunneling" },
  { port: 3000, proto: "TCP", service: "Dev", desc: "Common dev server (Node, Rails)" },
  { port: 3306, proto: "TCP", service: "MySQL", desc: "MySQL / MariaDB" },
  { port: 3389, proto: "TCP", service: "RDP", desc: "Remote Desktop Protocol" },
  { port: 5000, proto: "TCP", service: "Dev", desc: "Common dev server (Flask)" },
  { port: 5432, proto: "TCP", service: "PostgreSQL", desc: "PostgreSQL" },
  { port: 5672, proto: "TCP", service: "AMQP", desc: "RabbitMQ / AMQP" },
  { port: 5900, proto: "TCP", service: "VNC", desc: "Virtual Network Computing" },
  { port: 5984, proto: "TCP", service: "CouchDB", desc: "Apache CouchDB" },
  { port: 6379, proto: "TCP", service: "Redis", desc: "Redis in-memory store" },
  { port: 8000, proto: "TCP", service: "Dev", desc: "Common dev server (Django, http.server)" },
  { port: 8080, proto: "TCP", service: "HTTP-alt", desc: "HTTP alternate (proxy, Tomcat)" },
  { port: 8443, proto: "TCP", service: "HTTPS-alt", desc: "HTTPS alternate" },
  { port: 8888, proto: "TCP", service: "Jupyter", desc: "Jupyter Notebook" },
  { port: 9000, proto: "TCP", service: "PHP-FPM", desc: "PHP FastCGI Process Manager" },
  { port: 9092, proto: "TCP", service: "Kafka", desc: "Apache Kafka broker" },
  { port: 9200, proto: "TCP", service: "Elasticsearch", desc: "Elasticsearch HTTP API" },
  { port: 9418, proto: "TCP", service: "Git", desc: "Git protocol" },
  { port: 11211, proto: "TCP", service: "Memcached", desc: "Memcached" },
  { port: 27017, proto: "TCP", service: "MongoDB", desc: "MongoDB" },
];

export default function PortReference() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PORTS;
    return PORTS.filter((p) => p.service.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s) || String(p.port).includes(s));
  }, [q]);

  return (
    <ToolShell title="Common Ports" description="Well-known TCP/UDP ports — searchable reference." category={categoryMap.network}>
      <Card className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by port, service or description..." />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Port</th>
              <th className="p-3">Proto</th>
              <th className="p-3">Service</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={`${p.port}-${p.proto}-${p.service}`} className="border-b last:border-0">
                <td className="p-3 font-mono">{p.port}</td>
                <td className="p-3 text-xs text-muted-foreground">{p.proto}</td>
                <td className="p-3 font-medium">{p.service}</td>
                <td className="p-3 text-muted-foreground">{p.desc}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No match.</td></tr>}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
