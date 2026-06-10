import { useMemo, useState } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

const SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

function terbilang(n: number): string {
  if (n < 0) return "minus " + terbilang(-n);
  if (n < 12) return SATUAN[n];
  if (n < 20) return SATUAN[n - 10] + " belas";
  if (n < 100) {
    const t = Math.floor(n / 10);
    const r = n % 10;
    return SATUAN[t] + " puluh" + (r ? " " + SATUAN[r] : "");
  }
  if (n < 200) return "seratus" + (n - 100 ? " " + terbilang(n - 100) : "");
  if (n < 1000) {
    const t = Math.floor(n / 100);
    const r = n % 100;
    return SATUAN[t] + " ratus" + (r ? " " + terbilang(r) : "");
  }
  if (n < 2000) return "seribu" + (n - 1000 ? " " + terbilang(n - 1000) : "");
  if (n < 1_000_000) {
    const t = Math.floor(n / 1000);
    const r = n % 1000;
    return terbilang(t) + " ribu" + (r ? " " + terbilang(r) : "");
  }
  if (n < 1_000_000_000) {
    const t = Math.floor(n / 1_000_000);
    const r = n % 1_000_000;
    return terbilang(t) + " juta" + (r ? " " + terbilang(r) : "");
  }
  if (n < 1_000_000_000_000) {
    const t = Math.floor(n / 1_000_000_000);
    const r = n % 1_000_000_000;
    return terbilang(t) + " miliar" + (r ? " " + terbilang(r) : "");
  }
  const t = Math.floor(n / 1_000_000_000_000);
  const r = n % 1_000_000_000_000;
  return terbilang(t) + " triliun" + (r ? " " + terbilang(r) : "");
}

function fmtIdr(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function RupiahWords() {
  const [val, setVal] = useUrlState("n", "125000");

  const { number, words, full } = useMemo(() => {
    const n = Math.floor(Math.abs(Number(val.replace(/[^\d-]/g, ""))));
    if (!Number.isFinite(n) || n === 0) return { number: 0, words: "nol", full: "nol rupiah" };
    if (n > 999_999_999_999_999) return { number: n, words: "Too large", full: "Too large" };
    const w = terbilang(n);
    return { number: n, words: w, full: w + " rupiah" };
  }, [val]);

  return (
    <ToolShell title="Number → Rupiah Words" description="Convert a number to its Indonesian rupiah spelling ('terbilang')." category={categoryMap.converter}
      shareable>
      <Card className="p-3">
        <Label className="mb-1 block">Number</Label>
        <Input value={val} onChange={(e) => setVal(e.target.value)} className="font-mono text-lg" />
        <div className="mt-2 text-sm text-muted-foreground">{fmtIdr(number)}</div>
      </Card>
      <Card className="space-y-3 p-4">
        <div>
          <Label className="text-xs uppercase text-muted-foreground">Terbilang</Label>
          <div className="mt-1 flex items-start gap-2">
            <p className="flex-1 text-lg capitalize">{words}</p>
            <CopyButton value={words} />
          </div>
        </div>
        <div>
          <Label className="text-xs uppercase text-muted-foreground">Lengkap</Label>
          <div className="mt-1 flex items-start gap-2">
            <p className="flex-1 text-lg capitalize">{full}</p>
            <CopyButton value={full} />
          </div>
        </div>
      </Card>
    </ToolShell>
  );
}
