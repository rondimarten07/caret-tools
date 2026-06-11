import { ToolShell } from "@/components/tool/ToolShell";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

function row(prefix: number) {
  const maskInt = prefix === 0 ? 0 : ((-1) << (32 - prefix)) >>> 0;
  const wildInt = ~maskInt >>> 0;
  const mask = [(maskInt >>> 24) & 255, (maskInt >>> 16) & 255, (maskInt >>> 8) & 255, maskInt & 255].join(".");
  const wild = [(wildInt >>> 24) & 255, (wildInt >>> 16) & 255, (wildInt >>> 8) & 255, wildInt & 255].join(".");
  const addresses = prefix === 0 ? 4294967296 : 2 ** (32 - prefix);
  const usable = prefix >= 31 ? addresses : addresses - 2;
  return { prefix, mask, wild, addresses, usable };
}

export default function SubnetMaskCheatsheet() {
  const rows = Array.from({ length: 33 }, (_, i) => row(i));

  return (
    <ToolShell title="Subnet Mask Cheatsheet" description="Full /0 to /32 reference — mask, wildcard, and usable host count." category={categoryMap.network}>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">CIDR</th>
              <th className="p-3">Subnet mask</th>
              <th className="p-3">Wildcard</th>
              <th className="p-3 text-right">Addresses</th>
              <th className="p-3 text-right">Usable hosts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.prefix} className="border-b last:border-0">
                <td className="p-3 font-mono">/{r.prefix}</td>
                <td className="p-3 font-mono">{r.mask}</td>
                <td className="p-3 font-mono text-muted-foreground">{r.wild}</td>
                <td className="p-3 text-right font-mono">{r.addresses.toLocaleString()}</td>
                <td className="p-3 text-right font-mono">{r.usable.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
        Usable hosts = addresses − 2 (network + broadcast). For /31 (point-to-point per RFC 3021) and /32 (single host) the full count is usable.
      </div>
    </ToolShell>
  );
}
