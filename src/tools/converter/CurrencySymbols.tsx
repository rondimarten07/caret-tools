import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { categoryMap } from "@/data/categories";

const CURRENCIES: { code: string; symbol: string; name: string; country: string }[] = [
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "€", name: "Euro", country: "Eurozone" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan" },
  { code: "GBP", symbol: "£", name: "Pound Sterling", country: "United Kingdom" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", country: "Switzerland" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", country: "Vietnam" },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar", country: "Taiwan" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso", country: "Mexico" },
  { code: "ARS", symbol: "$", name: "Argentine Peso", country: "Argentina" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", country: "Chile" },
  { code: "COP", symbol: "$", name: "Colombian Peso", country: "Colombia" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol", country: "Peru" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", country: "Nigeria" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound", country: "Egypt" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", country: "Russia" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", country: "Ukraine" },
  { code: "PLN", symbol: "zł", name: "Polish Złoty", country: "Poland" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", country: "Czech Republic" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", country: "Hungary" },
  { code: "RON", symbol: "lei", name: "Romanian Leu", country: "Romania" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel", country: "Israel" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "UAE" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", country: "Saudi Arabia" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", country: "Qatar" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", country: "Kuwait" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee", country: "Sri Lanka" },
];

export default function CurrencySymbols() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CURRENCIES;
    return CURRENCIES.filter((c) => c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s) || c.country.toLowerCase().includes(s) || c.symbol.includes(s));
  }, [q]);

  return (
    <ToolShell title="Currency Symbols" description="Searchable ISO 4217 reference — codes, symbols, and country." category={categoryMap.converter}>
      <Card className="p-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code / name / country..." />
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Code</th>
              <th className="p-3">Symbol</th>
              <th className="p-3">Name</th>
              <th className="p-3">Country</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.code} className="border-b last:border-0">
                <td className="p-3 font-mono">{c.code}</td>
                <td className="p-3 font-mono text-lg">{c.symbol}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.country}</td>
                <td className="p-3"><CopyButton value={c.symbol} /></td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">No match.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </ToolShell>
  );
}
