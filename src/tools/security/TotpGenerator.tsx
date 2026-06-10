import { useEffect, useRef, useState } from "react";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { ToolShell } from "@/components/tool/ToolShell";
import { CopyButton } from "@/components/tool/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categoryMap } from "@/data/categories";

function randomBase32(len = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const buf = crypto.getRandomValues(new Uint32Array(len));
  return Array.from(buf, (n) => chars[n % chars.length]).join("");
}

export default function TotpGenerator() {
  const [secret, setSecret] = useState(randomBase32());
  const [issuer, setIssuer] = useState("Tools Hub");
  const [account, setAccount] = useState("you@example.com");
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const tick = () => {
      try {
        const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(secret), digits: 6, period: 30 });
        setCode(totp.generate());
        setRemaining(30 - (Math.floor(Date.now() / 1000) % 30));
      } catch {
        setCode("");
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [secret]);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      const totp = new OTPAuth.TOTP({ issuer, label: account, secret: OTPAuth.Secret.fromBase32(secret) });
      QRCode.toCanvas(canvasRef.current, totp.toString(), { width: 240, margin: 1 });
    } catch {
      /* ignore */
    }
  }, [secret, issuer, account]);

  return (
    <ToolShell title="TOTP Generator" description="Generate RFC 6238 time-based one-time passwords + provisioning QR." category={categoryMap.security}>
      <Card className="space-y-3 p-3">
        <div>
          <Label className="mb-1 block text-xs">Secret (Base32)</Label>
          <div className="flex gap-2">
            <Input value={secret} onChange={(e) => setSecret(e.target.value.toUpperCase())} className="font-mono" />
            <Button variant="outline" onClick={() => setSecret(randomBase32())}>New</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Issuer</Label>
            <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Account</Label>
            <Input value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_280px]">
        <Card className="p-6 text-center">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Current code</Label>
          <div className="my-2 font-mono text-5xl tabular-nums tracking-widest">
            {code || "------"}
          </div>
          <div className="mx-auto h-1.5 max-w-[200px] overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${(remaining / 30) * 100}%` }} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Refreshes in {remaining}s</div>
          <div className="mt-3"><CopyButton value={code} /></div>
        </Card>
        <Card className="grid place-items-center p-3">
          <canvas ref={canvasRef} className="rounded-md border bg-white" />
          <p className="mt-2 text-xs text-muted-foreground">Scan with Authy / Google Authenticator</p>
        </Card>
      </div>
    </ToolShell>
  );
}
