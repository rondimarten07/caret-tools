import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

// Small offline subset of well-known OUIs. For comprehensive lookup,
// download the IEEE OUI list. ~50 popular vendors here.
const OUI: Record<string, string> = {
  "001A11": "Google", "001CB3": "Apple", "001CFC": "Cisco",
  "002500": "Apple", "00256C": "Apple", "002608": "Apple",
  "00264A": "Apple", "0050E4": "Apple", "0080C8": "Microsoft",
  "001124": "Apple", "0017F2": "Apple", "001B63": "Apple",
  "B827EB": "Raspberry Pi Foundation", "DCA632": "Raspberry Pi (Trading)",
  "E45F01": "Raspberry Pi (Trading)", "001E06": "Microsoft",
  "0017FA": "Microsoft", "0050F2": "Microsoft", "B4AE6E": "Microsoft",
  "60A44C": "ASUSTek", "001C5F": "Sony", "001F3F": "Sony",
  "000C29": "VMware", "005056": "VMware", "001C42": "Parallels",
  "080027": "VirtualBox", "525400": "QEMU / KVM",
  "F8FFC2": "Apple", "FCFBFB": "Cisco", "E8B7CF": "Apple",
  "E0CB1D": "Asus", "001E58": "WistronNeWeb", "F0DEF1": "Wistron",
  "001A4B": "HP", "001E0B": "HP", "002564": "HP", "F4CE46": "HP",
  "001A8C": "Brother", "0021CC": "Brother", "8C0F6F": "Samsung",
  "000DC5": "Samsung", "0007AB": "Samsung", "F0728C": "Samsung",
  "001461": "Hitachi", "00146C": "Netgear", "002722": "Netgear",
  "001D7E": "Cisco-Linksys", "C8334B": "Apple", "001F5B": "Apple",
  "001FF3": "Apple", "00204A": "Apple", "002241": "Apple",
};

function normalize(mac: string): string {
  return mac.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
}

export default function OuiLookup() {
  const [input, setInput] = useState("B8:27:EB:12:34:56");

  const result = useMemo(() => {
    const n = normalize(input);
    if (n.length < 6) return null;
    const prefix = n.slice(0, 6);
    const vendor = OUI[prefix] ?? null;
    return { prefix, vendor };
  }, [input]);

  return (
    <ToolShell title="MAC OUI Lookup" description="Identify the vendor from a MAC address prefix (first 3 bytes / OUI). Built-in list of common vendors." category={categoryMap.network}>
      <Card className="p-3">
        <Label className="mb-1 block">MAC address</Label>
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono text-lg" />
      </Card>
      {result && (
        <Card className="p-6 text-center">
          <div className="text-xs uppercase text-muted-foreground">OUI prefix</div>
          <div className="mt-1 font-mono text-xl">{result.prefix.match(/.{2}/g)?.join(":")}</div>
          <div className="mt-4 text-xs uppercase text-muted-foreground">Vendor</div>
          {result.vendor ? (
            <div className="mt-1 text-3xl font-semibold text-emerald-600">{result.vendor}</div>
          ) : (
            <div className="mt-1 text-muted-foreground">Not in built-in list. Try the full IEEE database.</div>
          )}
        </Card>
      )}
    </ToolShell>
  );
}
